// jsPixelFilter Library
// Copyright (C) 2020 Kitsune Gadget
//
// Reference: xBRz filter by Zenju (see https://sourceforge.net/projects/xbrz/)
// Also, 2dImageFilter (see https://code.google.com/archive/p/2dimagefilter/)
import PixelData from './pixelData'

interface Kernel4x4 {
  a: number, b: number, c: number, d: number, // eslint-disable-line
  e: number, f: number, g: number, h: number, // eslint-disable-line
  i: number, j: number, k: number, l: number, // eslint-disable-line
  m: number, n: number, o: number, p: number // eslint-disable-line
}

enum BlendType {
  BlendNone = 0, // ブレンドしない（ピクセル補完しない）
  BlendNormal = 1, // 通常のブレンド
  BlendDominant = 2 // 強めのブレンド
}

interface BlendResult {
  f: BlendType
  g: BlendType
  j: BlendType
  k: BlendType
}

class BlendInfo {
  static GetTopL(b: number): BlendType {
    return b & 0x3
  }

  static GetTopR(b: number): BlendType {
    return (b >> 2) & 0x3
  }

  static GetBottomR(b: number): BlendType {
    return (b >> 4) & 0x3
  }

  static GetBottomL(b: number): BlendType {
    return (b >> 6) & 0x3
  }

  static SetTopL(b: number, bt: BlendType): number {
    return b | bt
  }

  static SetTopR(b: number, bt: BlendType): number {
    return b | (bt << 2)
  }

  static SetBottomR(b: number, bt: BlendType): number {
    return b | (bt << 4)
  }

  static SetBottomL(b: number, bt: BlendType): number {
    return b | (bt << 6)
  }

  static Rotate(b: number, rotDeg: RotationDegree) {
    const l = rotDeg << 1
    const r = 8 - l
    return ((b << l) | (b >> r)) & 0xff // eslint-disable-line
  }
}

enum RotationDegree {
  Rot0 = 0,
  Rot90 = 1,
  Rot180 = 2,
  Rot270 = 3
}

class Rot {
  // 回転後の位置にアクセスするために4つの回転それぞれで遷移する先を定義しておく
  static readonly _ = new Uint32Array(9 * 4)

  static Rot() {
    const a = 0
    const b = 1
    const c = 2
    const d = 3
    const e = 4
    const f = 5
    const g = 6
    const h = 7
    const i = 8

    // eslint-disable-next-line prettier/prettier
    const deg0 = [
      a, b, c,
      d, e, f,
      g, h, i
    ]
    // eslint-disable-next-line prettier/prettier
    const deg90 = [
      g, d, a,
      h, e, b,
      i, f, c
    ]
    // eslint-disable-next-line prettier/prettier
    const deg180 = [
      i, h, g,
      f, e, d,
      c, b, a
    ]
    // eslint-disable-next-line prettier/prettier
    const deg270 = [
      c, f, i,
      b, e, h,
      a, d, g
    ]
    // eslint-disable-next-line prettier/prettier
    const rotation = [
      deg0, deg90, deg180, deg270
    ]

    for (let rotDeg = 0; rotDeg < 4; rotDeg++) {
      for (let x = 0; x < 9; x++) {
        this._[(x << 2) + rotDeg] = rotation[rotDeg][x]
      }
    }
  }
}

function MatrixRotation(rotDeg: RotationDegree, I: number, J: number, N: number) {
  const struct = {
    I_old: 0,
    J_old: 0
  }

  if (rotDeg === RotationDegree.Rot0) {
    struct.I_old = I
    struct.J_old = J
  } else {
    const old = MatrixRotation(rotDeg - 1, I, J, N)
    struct.I_old = N - 1 - old.J_old
    struct.J_old = old.I_old
  }

  return struct
}

class OutputSystem {
  private _p: PixelData
  private _scaleN: number
  private _outWidth: number

  private _rotDeg: number = 0
  private _targetIndex: number = 0

  constructor(p: PixelData, scale: number, outWidth: number) {
    this._p = p
    this._scaleN = scale
    this._outWidth = outWidth
  }

  TargetMove(rotDeg: number, trgi: number) {
    this._rotDeg = rotDeg
    this._targetIndex = trgi
  }

  Reference(i: number, j: number) {
    const rot = MatrixRotation(this._rotDeg, i, j, this._scaleN)
    return this._targetIndex + rot.J_old + rot.I_old * this._outWidth
  }

  getDstPixel(trgi: number) {
    return this._p.getDistPoint(trgi)
  }

  SetDstPixel(trgi: number, BlendedCol: number) {
    this._p.setDistPoint(trgi, 0, 0, BlendedCol)
  }

  outImage() {
    return this._p.outImageData()
  }
}

export default class XBRz {
  private static readonly luminanceWeight = 1
  private static equalColorTolerance = 30
  private static readonly centerDirectionBias = 4
  private static readonly dominantDirectionThreshold = 3.6
  private static steepDirectionThreshold = 2.2

  static XBRZ(imageData: ImageData, scale: number) {
    const p = new PixelData(imageData)
    p.setDistSize(scale)

    Rot.Rot() // init static Rot class

    let scaler: IScaler = new Scale2x()
    if (scale === 3) {
      scaler = new Scale3x()
    } else if (scale === 4) {
      scaler = new Scale4x()
    } else if (scale === 5) {
      scaler = new Scale5x()
    } else if (scale === 6) {
      scaler = new Scale6x()
    }

    const trgWidth = p.width * scale
    const preProcBuffer = new Uint8Array(p.width)
    const outputSystem = new OutputSystem(p, scale, trgWidth)
    // initialize preprocessing buffer for first row:
    // detect upper left and right corner blending
    // this cannot be optimized for adjacent processing
    // stripes; we must not allow for a memory race condition!
    for (let i = 0; i < p.width; i++) {
      const l = 0 * p.width + i
      // center is f
      // a  b  c  d
      // e  f  g  h
      // i  j  k  l
      // m  n  o  p
      const ker4: Kernel4x4 = {
        a: p.getSourcePoint(l, -1, -1),
        b: p.getSourcePoint(l, -1, 0),
        c: p.getSourcePoint(l, -1, 1),
        d: p.getSourcePoint(l, -1, 2),
        e: p.getSourcePoint(l, 0, -1),
        f: p.getSourcePoint(l, 0, 0),
        g: p.getSourcePoint(l, 0, 1),
        h: p.getSourcePoint(l, 0, 2),
        i: p.getSourcePoint(l, 1, -1),
        j: p.getSourcePoint(l, 1, 0),
        k: p.getSourcePoint(l, 1, 1),
        l: p.getSourcePoint(l, 1, 2),
        m: p.getSourcePoint(l, 2, -1),
        n: p.getSourcePoint(l, 2, 0),
        o: p.getSourcePoint(l, 2, 1),
        p: p.getSourcePoint(l, 2, 2)
      }

      const blendResult: BlendResult = {
        f: 0,
        g: 0,
        j: 0,
        k: 0
      }

      this._preProcessCorners(ker4, blendResult)
      /*
      preprocessing blend result:
      ---------
      | F | G | //evalute corner between F, G, J, K
      ----|---| //input pixel is at position F
      | J | K |
      ---------
      */
      preProcBuffer[i] = BlendInfo.SetTopR(preProcBuffer[i], blendResult.j)

      if (i + 1 < p.width) {
        // eslint-disable-next-line prettier/prettier
        preProcBuffer[i + 1] = BlendInfo.SetTopL(preProcBuffer[i + 1], blendResult.k)
      }
    }

    for (let j = 0; j < p.height; j++) {
      let trgi = scale * j * trgWidth // target Y index
      let blendXy1 = 0

      for (let i = 0; i < p.width; i++, trgi += scale) {
        const l = j * p.width + i
        let blendXy = 0

        const ker4: Kernel4x4 = {
          a: p.getSourcePoint(l, -1, -1),
          b: p.getSourcePoint(l, -1, 0),
          c: p.getSourcePoint(l, -1, 1),
          d: p.getSourcePoint(l, -1, 2),
          e: p.getSourcePoint(l, 0, -1),
          f: p.getSourcePoint(l, 0, 0),
          g: p.getSourcePoint(l, 0, 1),
          h: p.getSourcePoint(l, 0, 2),
          i: p.getSourcePoint(l, 1, -1),
          j: p.getSourcePoint(l, 1, 0),
          k: p.getSourcePoint(l, 1, 1),
          l: p.getSourcePoint(l, 1, 2),
          m: p.getSourcePoint(l, 2, -1),
          n: p.getSourcePoint(l, 2, 0),
          o: p.getSourcePoint(l, 2, 1),
          p: p.getSourcePoint(l, 2, 2)
        }

        const blendResult: BlendResult = {
          f: 0,
          g: 0,
          j: 0,
          k: 0
        }

        this._preProcessCorners(ker4, blendResult)
        /*
        preprocessing blend result:
        ---------
        | F | G | //evalute corner between F, G, J, K
        ----|---| //input pixel is at position F
        | J | K |
        ---------
        */

        // all four corners of (x, y) have been determined at
        // this point due to processing sequence!
        blendXy = BlendInfo.SetBottomR(preProcBuffer[i], blendResult.f)

        // set 2nd known corner for (x, y + 1)
        blendXy1 = BlendInfo.SetTopR(blendXy1, blendResult.j)
        // store on current buffer position for use on next row
        preProcBuffer[i] = blendXy1

        // set 1st known corner for (x + 1, y + 1) and
        // buffer for use on next column
        blendXy1 = BlendInfo.SetTopL(0, blendResult.k)

        if (i + 1 < p.width) {
          preProcBuffer[i + 1] = BlendInfo.SetBottomL(preProcBuffer[i + 1], blendResult.g)
        }

        // 現在処理ピクセルからのアウトプット範囲を f に初期化
        this._FillBlock(outputSystem, trgi, trgWidth, ker4.f, scale)

        if (blendXy === 0) continue

        const ker3 = new Uint32Array(9)
        ker3[0] = ker4.a
        ker3[1] = ker4.b
        ker3[2] = ker4.c

        ker3[3] = ker4.e
        ker3[4] = ker4.f
        ker3[5] = ker4.g

        ker3[6] = ker4.i
        ker3[7] = ker4.j
        ker3[8] = ker4.k

        this._BlendPixel(scaler, RotationDegree.Rot0, ker3, outputSystem, trgi, blendXy)
        this._BlendPixel(scaler, RotationDegree.Rot90, ker3, outputSystem, trgi, blendXy)
        this._BlendPixel(scaler, RotationDegree.Rot180, ker3, outputSystem, trgi, blendXy)
        this._BlendPixel(scaler, RotationDegree.Rot270, ker3, outputSystem, trgi, blendXy)
      } // end x for
    } // end y for
    return outputSystem.outImage()
  }

  private static _BlendPixel(
    scaler: IScaler,
    rotDeg: number,
    ker: Uint32Array,
    outputSystem: OutputSystem,
    trgi: number,
    blendInfo: number
  ) {
    const b = ker[Rot._[(1 << 2) + rotDeg]]
    const c = ker[Rot._[(2 << 2) + rotDeg]]
    const d = ker[Rot._[(3 << 2) + rotDeg]]
    const e = ker[Rot._[(4 << 2) + rotDeg]]
    const f = ker[Rot._[(5 << 2) + rotDeg]]
    const g = ker[Rot._[(6 << 2) + rotDeg]]
    const h = ker[Rot._[(7 << 2) + rotDeg]]
    const i = ker[Rot._[(8 << 2) + rotDeg]]

    const blend = BlendInfo.Rotate(blendInfo, rotDeg)

    if (BlendInfo.GetBottomR(blend) === BlendType.BlendNone) {
      return
    }

    const eq = (pix1: number, pix2: number) => {
      return this._ColorDist(pix1, pix2) < this.equalColorTolerance
    }
    const dist = (pix1: number, pix2: number) => {
      return this._ColorDist(pix1, pix2)
    }
    let doLineBlend: boolean

    if (BlendInfo.GetBottomR(blend) >= BlendType.BlendDominant) {
      doLineBlend = true

      // make sure there is no second blending in an adjacent
      // rotation for this pixel: handles insular pixels, mario eyes
      // but support double-blending for 90? corners
    } else if (BlendInfo.GetTopR(blend) !== BlendType.BlendNone && !eq(e, g)) {
      doLineBlend = false
    } else if (BlendInfo.GetBottomL(blend) !== BlendType.BlendNone && !eq(e, c)) {
      doLineBlend = false

      // no full blending for L-shapes; blend corner only (handles "mario mushroom eyes")
    } else if (!eq(e, i) && eq(g, h) && eq(h, i) && eq(i, f) && eq(f, c)) {
      doLineBlend = false
    } else {
      doLineBlend = true
    }

    // 一番近い色を選ぶ
    const px = dist(e, f) <= dist(e, h) ? f : h

    outputSystem.TargetMove(rotDeg, trgi) // 出力ポイントの移動

    if (doLineBlend) {
      const fg = dist(f, g)
      const hc = dist(h, c)

      const haveShallowLine = this.steepDirectionThreshold * fg <= hc && e !== g && d !== g
      const haveSteepLine = this.steepDirectionThreshold * hc <= fg && e !== c && b !== c

      if (haveShallowLine) {
        if (haveSteepLine) {
          // eslint-disable-next-line prettier/prettier
          scaler.BlendLineSteepAndShallow(px, outputSystem)
        } else {
          // eslint-disable-next-line prettier/prettier
          scaler.BlendLineShallow(px, outputSystem)
        }
      } else if (haveSteepLine) {
        scaler.BlendLineSteep(px, outputSystem)
      } else {
        scaler.BlendLineDiagonal(px, outputSystem)
      }
    } else {
      scaler.BlendCorner(px, outputSystem)
    }
  }

  private static _FillBlock(
    out: OutputSystem,
    trgi: number,
    pitch: number,
    col: number,
    blocksize: number
  ) {
    for (let y = 0; y < blocksize; ++y, trgi += pitch) {
      for (let x = 0; x < blocksize; ++x) {
        out.SetDstPixel(trgi + x, col)
      }
    }
  }

  private static _Square(x: any) {
    return x * x
  }

  private static _DistYCbCr(pix1: number, pix2: number): number {
    const rDiff = PixelData.getR(pix1) - PixelData.getR(pix2)
    const gDiff = PixelData.getG(pix1) - PixelData.getG(pix2)
    const bDiff = PixelData.getB(pix1) - PixelData.getB(pix2)

    // const kB = 0.0722 // ITU-R BT.709
    // const kR = 0.2126
    const kB = 0.0593 // ITU-R BT.2020
    const kR = 0.2627 //
    const kG = 1 - kB - kR

    const scaleB = 0.5 / (1 - kB)
    const scaleR = 0.5 / (1 - kR)

    const y = kR * rDiff + kG * gDiff + kB * bDiff
    const cB = scaleB * (bDiff - y)
    const cR = scaleR * (rDiff - y)

    return Math.sqrt(this._Square(this.luminanceWeight * y) + this._Square(cB) + this._Square(cR))
    // return this._Square(this.luminanceWeight * y) + this._Square(cB) + this._Square(cR)
  }

  private static _ColorDist(pix1: number, pix2: number) {
    return pix1 === pix2 ? 0 : this._DistYCbCr(pix1, pix2)
  }

  private static _preProcessCorners(ker: Kernel4x4, blendResult: BlendResult) {
    if ((ker.f === ker.g && ker.j === ker.k) || (ker.f === ker.j && ker.g === ker.k)) {
      blendResult.f = BlendType.BlendNone
      blendResult.g = BlendType.BlendNone
      blendResult.j = BlendType.BlendNone
      blendResult.k = BlendType.BlendNone
      return
    }

    // const dist = this._ColorDist
    const jg =
      this._ColorDist(ker.i, ker.f) +
      this._ColorDist(ker.f, ker.c) +
      this._ColorDist(ker.n, ker.k) +
      this._ColorDist(ker.k, ker.h) +
      this.centerDirectionBias * this._ColorDist(ker.j, ker.g)
    const fk =
      this._ColorDist(ker.e, ker.j) +
      this._ColorDist(ker.j, ker.o) +
      this._ColorDist(ker.b, ker.g) +
      this._ColorDist(ker.g, ker.l) +
      this.centerDirectionBias * this._ColorDist(ker.f, ker.k)

    if (jg < fk) {
      const dominantGradient = this.dominantDirectionThreshold * jg < fk
      if (ker.f !== ker.g && ker.f !== ker.j) {
        blendResult.f = dominantGradient ? BlendType.BlendDominant : BlendType.BlendNormal
      }
      if (ker.k !== ker.j && ker.k !== ker.g) {
        blendResult.k = dominantGradient ? BlendType.BlendDominant : BlendType.BlendNormal
      }
    } else if (fk < jg) {
      const dominantGradient = this.dominantDirectionThreshold * fk < jg
      if (ker.j !== ker.f && ker.j !== ker.k) {
        blendResult.j = dominantGradient ? BlendType.BlendDominant : BlendType.BlendNormal
      }
      if (ker.g !== ker.f && ker.g !== ker.k) {
        blendResult.g = dominantGradient ? BlendType.BlendDominant : BlendType.BlendNormal
      }
    }
  }
}

/// /////////////////////
// BLENDING
/// /////////////////////
function _AlphaBlend(n: number, m: number, target: number, out: OutputSystem, color: number) {
  const ip = PixelData.InterpolateFiltered2(color, out.getDstPixel(target), n, m - n)
  out.SetDstPixel(target, ip)
}

interface IScaler {
  Scale(): number
  BlendLineShallow(color: number, out: OutputSystem): void
  BlendLineSteep(color: number, out: OutputSystem): void
  BlendLineSteepAndShallow(color: number, out: OutputSystem): void
  BlendLineDiagonal(color: number, out: OutputSystem): void
  BlendCorner(color: number, out: OutputSystem): void
}

class Scale2x implements IScaler {
  private _SCALE = 2

  Scale() {
    return this._SCALE
  }

  BlendLineShallow(color: number, out: OutputSystem): void {
    _AlphaBlend(1, 4, out.Reference(this._SCALE - 1, 0), out, color)
    _AlphaBlend(3, 4, out.Reference(this._SCALE - 1, 1), out, color)
  }

  BlendLineSteep(color: number, out: OutputSystem): void {
    _AlphaBlend(1, 4, out.Reference(0, this._SCALE - 1), out, color)
    _AlphaBlend(3, 4, out.Reference(1, this._SCALE - 1), out, color)
  }

  BlendLineSteepAndShallow(color: number, out: OutputSystem) {
    _AlphaBlend(1, 4, out.Reference(1, 0), out, color)
    _AlphaBlend(1, 4, out.Reference(0, 1), out, color)
    _AlphaBlend(5, 6, out.Reference(1, 1), out, color)
  }

  BlendLineDiagonal(color: number, out: OutputSystem): void {
    _AlphaBlend(1, 2, out.Reference(1, 1), out, color)
  }

  BlendCorner(color: number, out: OutputSystem): void {
    // 角の丸み
    _AlphaBlend(21, 100, out.Reference(1, 1), out, color) // exact: 1 - pi/4 = 0.2146018366
  }
}

class Scale3x implements IScaler {
  private _SCALE = 3

  Scale() {
    return this._SCALE
  }

  BlendLineShallow(color: number, out: OutputSystem): void {
    _AlphaBlend(1, 4, out.Reference(this._SCALE - 1, 0), out, color)
    _AlphaBlend(1, 4, out.Reference(this._SCALE - 2, 2), out, color)
    _AlphaBlend(3, 4, out.Reference(this._SCALE - 1, 1), out, color)
    out.SetDstPixel(out.Reference(this._SCALE - 1, 2), color)
  }

  BlendLineSteep(color: number, out: OutputSystem): void {
    _AlphaBlend(1, 4, out.Reference(0, this._SCALE - 1), out, color)
    _AlphaBlend(1, 4, out.Reference(2, this._SCALE - 2), out, color)
    _AlphaBlend(3, 4, out.Reference(1, this._SCALE - 1), out, color)
    out.SetDstPixel(out.Reference(2, this._SCALE - 1), color)
  }

  BlendLineSteepAndShallow(color: number, out: OutputSystem) {
    _AlphaBlend(1, 4, out.Reference(2, 0), out, color)
    _AlphaBlend(1, 4, out.Reference(0, 2), out, color)
    _AlphaBlend(3, 4, out.Reference(2, 1), out, color)
    _AlphaBlend(3, 4, out.Reference(1, 2), out, color)
    out.SetDstPixel(out.Reference(2, 2), color)
  }

  BlendLineDiagonal(color: number, out: OutputSystem): void {
    _AlphaBlend(1, 8, out.Reference(1, 2), out, color)
    _AlphaBlend(1, 8, out.Reference(2, 1), out, color)
    _AlphaBlend(7, 8, out.Reference(2, 2), out, color)
  }

  BlendCorner(color: number, out: OutputSystem): void {
    // 角の丸み
    _AlphaBlend(45, 100, out.Reference(2, 2), out, color) // exact: 0.4545939598
    // alphaBlend(14, 1000, out.ref(2, 1), col); //0.01413008627 -> negligable
    // alphaBlend(14, 1000, out.ref(1, 2), col); //0.01413008627
  }
}

class Scale4x implements IScaler {
  private _SCALE = 4

  Scale() {
    return this._SCALE
  }

  BlendLineShallow(color: number, out: OutputSystem): void {
    _AlphaBlend(1, 4, out.Reference(this._SCALE - 1, 0), out, color)
    _AlphaBlend(1, 4, out.Reference(this._SCALE - 2, 2), out, color)
    _AlphaBlend(3, 4, out.Reference(this._SCALE - 1, 1), out, color)
    _AlphaBlend(3, 4, out.Reference(this._SCALE - 2, 3), out, color)
    out.SetDstPixel(out.Reference(this._SCALE - 1, 2), color)
    out.SetDstPixel(out.Reference(this._SCALE - 1, 3), color)
  }

  BlendLineSteep(color: number, out: OutputSystem): void {
    _AlphaBlend(1, 4, out.Reference(0, this._SCALE - 1), out, color)
    _AlphaBlend(1, 4, out.Reference(2, this._SCALE - 2), out, color)
    _AlphaBlend(3, 4, out.Reference(1, this._SCALE - 1), out, color)
    _AlphaBlend(3, 4, out.Reference(3, this._SCALE - 2), out, color)
    out.SetDstPixel(out.Reference(2, this._SCALE - 1), color)
    out.SetDstPixel(out.Reference(3, this._SCALE - 1), color)
  }

  BlendLineSteepAndShallow(color: number, out: OutputSystem) {
    _AlphaBlend(3, 4, out.Reference(3, 1), out, color)
    _AlphaBlend(3, 4, out.Reference(1, 3), out, color)
    _AlphaBlend(1, 4, out.Reference(3, 0), out, color)
    _AlphaBlend(1, 4, out.Reference(0, 3), out, color)
    _AlphaBlend(1, 3, out.Reference(2, 2), out, color)
    out.SetDstPixel(out.Reference(3, 3), color)
    out.SetDstPixel(out.Reference(3, 2), color)
    out.SetDstPixel(out.Reference(2, 3), color)
  }

  BlendLineDiagonal(color: number, out: OutputSystem): void {
    // number型が小数になると値が不安定になるため、小数点以下は切り捨てる
    _AlphaBlend(1, 2, out.Reference(this._SCALE - 1, Math.floor(this._SCALE / 2)), out, color)
    _AlphaBlend(1, 2, out.Reference(this._SCALE - 2, Math.floor(this._SCALE / 2) + 1), out, color)
    out.SetDstPixel(out.Reference(this._SCALE - 1, this._SCALE - 1), color)
  }

  BlendCorner(color: number, out: OutputSystem): void {
    // 角の丸み
    _AlphaBlend(68, 100, out.Reference(3, 3), out, color) // exact: 0.6848532563
    _AlphaBlend(9, 100, out.Reference(3, 2), out, color) // 0.08677704501
    _AlphaBlend(9, 100, out.Reference(2, 3), out, color) // 0.08677704501
  }
}

class Scale5x implements IScaler {
  private _SCALE = 5

  Scale() {
    return this._SCALE
  }

  BlendLineShallow(color: number, out: OutputSystem): void {
    _AlphaBlend(1, 4, out.Reference(this._SCALE - 1, 0), out, color)
    _AlphaBlend(1, 4, out.Reference(this._SCALE - 2, 2), out, color)
    _AlphaBlend(1, 4, out.Reference(this._SCALE - 3, 4), out, color)

    _AlphaBlend(3, 4, out.Reference(this._SCALE - 1, 1), out, color)
    _AlphaBlend(3, 4, out.Reference(this._SCALE - 2, 3), out, color)

    out.SetDstPixel(out.Reference(this._SCALE - 1, 2), color)
    out.SetDstPixel(out.Reference(this._SCALE - 1, 3), color)
    out.SetDstPixel(out.Reference(this._SCALE - 1, 4), color)
    out.SetDstPixel(out.Reference(this._SCALE - 2, 4), color)
  }

  BlendLineSteep(color: number, out: OutputSystem): void {
    _AlphaBlend(1, 4, out.Reference(0, this._SCALE - 1), out, color)
    _AlphaBlend(1, 4, out.Reference(2, this._SCALE - 2), out, color)
    _AlphaBlend(1, 4, out.Reference(4, this._SCALE - 3), out, color)

    _AlphaBlend(3, 4, out.Reference(1, this._SCALE - 1), out, color)
    _AlphaBlend(3, 4, out.Reference(3, this._SCALE - 2), out, color)

    out.SetDstPixel(out.Reference(2, this._SCALE - 1), color)
    out.SetDstPixel(out.Reference(3, this._SCALE - 1), color)
    out.SetDstPixel(out.Reference(4, this._SCALE - 1), color)
    out.SetDstPixel(out.Reference(4, this._SCALE - 2), color)
  }

  BlendLineSteepAndShallow(color: number, out: OutputSystem) {
    _AlphaBlend(1, 4, out.Reference(0, this._SCALE - 1), out, color)
    _AlphaBlend(1, 4, out.Reference(2, this._SCALE - 2), out, color)
    _AlphaBlend(3, 4, out.Reference(1, this._SCALE - 1), out, color)

    _AlphaBlend(1, 4, out.Reference(this._SCALE - 1, 0), out, color)
    _AlphaBlend(1, 4, out.Reference(this._SCALE - 2, 2), out, color)
    _AlphaBlend(3, 4, out.Reference(this._SCALE - 1, 1), out, color)

    _AlphaBlend(2, 3, out.Reference(3, 3), out, color)

    out.SetDstPixel(out.Reference(2, this._SCALE - 1), color)
    out.SetDstPixel(out.Reference(3, this._SCALE - 1), color)
    out.SetDstPixel(out.Reference(4, this._SCALE - 1), color)

    out.SetDstPixel(out.Reference(this._SCALE - 1, 2), color)
    out.SetDstPixel(out.Reference(this._SCALE - 1, 3), color)
  }

  BlendLineDiagonal(color: number, out: OutputSystem): void {
    // number型が小数になると値が不安定になるため、小数点以下は切り捨てる
    _AlphaBlend(1, 8, out.Reference(this._SCALE - 1, Math.floor(this._SCALE / 2)), out, color)
    _AlphaBlend(1, 8, out.Reference(this._SCALE - 2, Math.floor(this._SCALE / 2) + 1), out, color)
    _AlphaBlend(1, 8, out.Reference(this._SCALE - 3, Math.floor(this._SCALE / 2) + 2), out, color)

    _AlphaBlend(7, 8, out.Reference(4, 3), out, color)
    _AlphaBlend(7, 8, out.Reference(3, 4), out, color)

    out.SetDstPixel(out.Reference(4, 4), color)
  }

  BlendCorner(color: number, out: OutputSystem): void {
    // 角の丸み
    _AlphaBlend(86, 100, out.Reference(4, 4), out, color) // exact: 0.8631434088
    _AlphaBlend(23, 100, out.Reference(4, 3), out, color) // 0.2306749731
    _AlphaBlend(23, 100, out.Reference(3, 4), out, color) // 0.2306749731
    // _AlphaBlend(1, 64, out.Reference(4, 2), out, color) // 0.01676812367 -> negligable
    // _AlphaBlend(1, 64, out.Reference(2, 4), out, color) // 0.01676812367
  }
}

class Scale6x implements IScaler {
  private _SCALE = 6

  Scale() {
    return this._SCALE
  }

  BlendLineShallow(color: number, out: OutputSystem): void {
    _AlphaBlend(1, 4, out.Reference(this._SCALE - 1, 0), out, color)
    _AlphaBlend(1, 4, out.Reference(this._SCALE - 2, 2), out, color)
    _AlphaBlend(1, 4, out.Reference(this._SCALE - 3, 4), out, color)
    _AlphaBlend(3, 4, out.Reference(this._SCALE - 1, 1), out, color)
    _AlphaBlend(3, 4, out.Reference(this._SCALE - 2, 3), out, color)
    _AlphaBlend(3, 4, out.Reference(this._SCALE - 3, 5), out, color)

    out.SetDstPixel(out.Reference(this._SCALE - 1, 2), color)
    out.SetDstPixel(out.Reference(this._SCALE - 1, 3), color)
    out.SetDstPixel(out.Reference(this._SCALE - 1, 4), color)
    out.SetDstPixel(out.Reference(this._SCALE - 1, 5), color)

    out.SetDstPixel(out.Reference(this._SCALE - 2, 4), color)
    out.SetDstPixel(out.Reference(this._SCALE - 2, 5), color)
  }

  BlendLineSteep(color: number, out: OutputSystem): void {
    _AlphaBlend(1, 4, out.Reference(0, this._SCALE - 1), out, color)
    _AlphaBlend(1, 4, out.Reference(2, this._SCALE - 2), out, color)
    _AlphaBlend(1, 4, out.Reference(4, this._SCALE - 3), out, color)
    _AlphaBlend(3, 4, out.Reference(1, this._SCALE - 1), out, color)
    _AlphaBlend(3, 4, out.Reference(3, this._SCALE - 2), out, color)
    _AlphaBlend(3, 4, out.Reference(5, this._SCALE - 3), out, color)

    out.SetDstPixel(out.Reference(2, this._SCALE - 1), color)
    out.SetDstPixel(out.Reference(3, this._SCALE - 1), color)
    out.SetDstPixel(out.Reference(4, this._SCALE - 1), color)
    out.SetDstPixel(out.Reference(5, this._SCALE - 1), color)

    out.SetDstPixel(out.Reference(4, this._SCALE - 2), color)
    out.SetDstPixel(out.Reference(5, this._SCALE - 2), color)
  }

  BlendLineSteepAndShallow(color: number, out: OutputSystem) {
    _AlphaBlend(1, 4, out.Reference(0, this._SCALE - 1), out, color)
    _AlphaBlend(1, 4, out.Reference(2, this._SCALE - 2), out, color)
    _AlphaBlend(3, 4, out.Reference(1, this._SCALE - 1), out, color)
    _AlphaBlend(3, 4, out.Reference(3, this._SCALE - 2), out, color)

    _AlphaBlend(1, 4, out.Reference(this._SCALE - 1, 0), out, color)
    _AlphaBlend(1, 4, out.Reference(this._SCALE - 2, 2), out, color)
    _AlphaBlend(3, 4, out.Reference(this._SCALE - 1, 1), out, color)
    _AlphaBlend(3, 4, out.Reference(this._SCALE - 2, 3), out, color)

    out.SetDstPixel(out.Reference(2, this._SCALE - 1), color)
    out.SetDstPixel(out.Reference(3, this._SCALE - 1), color)
    out.SetDstPixel(out.Reference(4, this._SCALE - 1), color)
    out.SetDstPixel(out.Reference(5, this._SCALE - 1), color)

    out.SetDstPixel(out.Reference(4, this._SCALE - 2), color)
    out.SetDstPixel(out.Reference(5, this._SCALE - 2), color)

    out.SetDstPixel(out.Reference(this._SCALE - 1, 2), color)
    out.SetDstPixel(out.Reference(this._SCALE - 1, 3), color)
  }

  BlendLineDiagonal(color: number, out: OutputSystem): void {
    // number型が小数になると値が不安定になるため、小数点以下は切り捨てる
    _AlphaBlend(1, 2, out.Reference(this._SCALE - 1, Math.floor(this._SCALE / 2)), out, color)
    _AlphaBlend(1, 2, out.Reference(this._SCALE - 2, Math.floor(this._SCALE / 2) + 1), out, color)
    _AlphaBlend(1, 2, out.Reference(this._SCALE - 3, Math.floor(this._SCALE / 2) + 2), out, color)
    out.SetDstPixel(out.Reference(this._SCALE - 2, this._SCALE - 1), color)
    out.SetDstPixel(out.Reference(this._SCALE - 1, this._SCALE - 1), color)
    out.SetDstPixel(out.Reference(this._SCALE - 1, this._SCALE - 2), color)
  }

  BlendCorner(color: number, out: OutputSystem): void {
    // 角の丸み
    _AlphaBlend(97, 100, out.Reference(5, 5), out, color) // exact: 0.9711013910
    _AlphaBlend(42, 100, out.Reference(4, 5), out, color) // 0.4236372243
    _AlphaBlend(42, 100, out.Reference(5, 4), out, color) // 0.4236372243
    _AlphaBlend(6, 100, out.Reference(5, 3), out, color) // 0.05652034508
    _AlphaBlend(6, 100, out.Reference(3, 5), out, color) // 0.05652034508
  }
}

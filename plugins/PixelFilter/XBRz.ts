// jsPixelFilter Library
// Copyright (C) 2020 Kitsune Gadget
//
// Reference: xBRz filter by Zenju (see https://sourceforge.net/projects/xbrz/)
// Also, this code refer to 2dImageFilter (see https://code.google.com/archive/p/2dimagefilter/)
import PixelData from './pixelData'

interface Kernel3x3 {
  a: any, b: any, c: any, // eslint-disable-line
  d: any, e: any, f: any, // eslint-disable-line
  g: any, h: any, i: any // eslint-disable-line
}

interface Kernel4x4 {
  a: any, b: any, c: any, d: any, // eslint-disable-line
  e: any, f: any, g: any, h: any, // eslint-disable-line
  i: any, j: any, k: any, l: any, // eslint-disable-line
  m: any, n: any, o: any, p: any // eslint-disable-line
}

enum BlendType {
  BlendNone = 0, // do not blend
  BlendNormal = 1, // a normal indication to blend
  BlendDominant = 2 // a strong indication to blend
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
    return (b << l) | (b >> r)
  }
}

enum RotationDegree {
  Rot0 = 0,
  Rot90 = 1,
  Rot180 = 2,
  Rot270 = 3
}

class Rot {
  // Cache the 4 rotations of the 9 positions, a to i.
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

    const deg0 = [
      a, b, c,
      d, e, f,
      g, h, i
    ]

    const deg90 = [
      g, d, a,
      h, e, b,
      i, f, c
    ]

    const deg180 = [
      i, h, g,
      f, e, d,
      c, b, a
    ]

    const deg270 = [
      c, f, i,
      b, e, h,
      a, d, g
    ]

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

// const _MAX_ROTS = 4
// const _MAX_SCALE = 5
// const _MAX_SCALE_SQUARED = _MAX_SCALE * _MAX_SCALE
function MatrixRotation(rotDeg: RotationDegree, I: number, J: number, N: number) {
  const struct = {
    I_old: 0,
    J_old: 0
  }

  if (rotDeg === RotationDegree.Rot0) {
    struct.J_old = I
    struct.I_old = J
  } else {
    const old = MatrixRotation(rotDeg - 1, I, J, N)
    struct.I_old = N - 1 - old.J_old
    struct.J_old = old.I_old
  }

  return struct
}
class OutputMatrix {
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

  static XBRz(imageData: ImageData, scale: number) {
    const p = new PixelData(imageData)
    p.setDistSize(scale)

    let scaler: IScaler = new Scale2x()
    if (scale === 3) {
      // scaler = new Scale2x()
    }

    const trgWidth = p.width * scale
    const preProcBuffer = new Uint8Array(p.width)
    const outputMatrix = new OutputMatrix(p, scale, trgWidth)
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
        b: p.getSourcePoint(l, 0, -1),
        c: p.getSourcePoint(l, 1, -1),
        d: p.getSourcePoint(l, 2, -1),
        e: p.getSourcePoint(l, -1, 0),
        f: p.getSourcePoint(l, 0, 0),
        g: p.getSourcePoint(l, 1, 0),
        h: p.getSourcePoint(l, 2, 0),
        i: p.getSourcePoint(l, -1, 1),
        j: p.getSourcePoint(l, 0, 1),
        k: p.getSourcePoint(l, 1, 1),
        l: p.getSourcePoint(l, 2, 1),
        m: p.getSourcePoint(l, -1, 2),
        n: p.getSourcePoint(l, 0, 2),
        o: p.getSourcePoint(l, 1, 2),
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
      let trgi = scale * j * trgWidth // target index
      let blendXy1 = 0

      for (let i = 0; i < p.width; i++, trgi += scale) {
        const l = j * p.width + i
        let blendXy = 0

        const ker4: Kernel4x4 = {
          a: p.getSourcePoint(l, -1, -1),
          b: p.getSourcePoint(l, 0, -1),
          c: p.getSourcePoint(l, 1, -1),
          d: p.getSourcePoint(l, 2, -1),
          e: p.getSourcePoint(l, -1, 0),
          f: p.getSourcePoint(l, 0, 0),
          g: p.getSourcePoint(l, 1, 0),
          h: p.getSourcePoint(l, 2, 0),
          i: p.getSourcePoint(l, -1, 1),
          j: p.getSourcePoint(l, 0, 1),
          k: p.getSourcePoint(l, 1, 1),
          l: p.getSourcePoint(l, 2, 1),
          m: p.getSourcePoint(l, -1, 2),
          n: p.getSourcePoint(l, 0, 2),
          o: p.getSourcePoint(l, 1, 2),
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
          // eslint-disable-next-line prettier/prettier
          preProcBuffer[i + 1] = BlendInfo.SetBottomL(preProcBuffer[i + 1], blendResult.g)
        }

        // fill block of size scale * scale with the given color
        //  // place *after* preprocessing step, to not overwrite the
        //  // results while processing the the last pixel!
        this._FillBlock(p, trgi, trgWidth, ker4.f, scale)

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

        this._BlendPixel(scaler, RotationDegree.Rot0, ker3, outputMatrix, trgi, blendXy)
        this._BlendPixel(scaler, RotationDegree.Rot90, ker3, outputMatrix, trgi, blendXy)
        this._BlendPixel(scaler, RotationDegree.Rot180, ker3, outputMatrix, trgi, blendXy)
        this._BlendPixel(scaler, RotationDegree.Rot270, ker3, outputMatrix, trgi, blendXy)
      } // end x for
    } // end y for
    return outputMatrix.outImage()
  }

  private static _BlendPixel(
    scaler: IScaler,
    rotDeg: number,
    ker: Uint32Array,
    outputMatrix: OutputMatrix,
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
    } else if (BlendInfo.GetBottomR(blend) !== BlendType.BlendNone && !eq(e, c)) {
      doLineBlend = false

      // no full blending for L-shapes; blend corner only (handles "mario mushroom eyes")
    } else if (!eq(e, i) && eq(g, h) && eq(h, i) && eq(i, f) && eq(f, c)) {
      doLineBlend = false
    } else {
      doLineBlend = true
    }

    // choose most similar color
    const px = dist(e, f) <= dist(e, h) ? f : h

    outputMatrix.TargetMove(rotDeg, trgi) // move output target point

    if (doLineBlend) {
      const fg = dist(f, g)
      const hc = dist(h, c)

      const haveShallowLine = this.steepDirectionThreshold * fg <= hc && e !== g && d !== g
      const haveSteepLine = this.steepDirectionThreshold * hc <= fg && e !== c && b !== c

      if (haveShallowLine) {
        if (haveSteepLine) {
          // eslint-disable-next-line prettier/prettier
          scaler.BlendLineSteepAndShallow(px, outputMatrix)
        } else {
          // eslint-disable-next-line prettier/prettier
          scaler.BlendLineShallow(px, outputMatrix)
        }
      } else if (haveSteepLine) {
        scaler.BlendLineSteep(px, outputMatrix)
      } else {
        scaler.BlendLineDiagonal(px, outputMatrix)
      }
    } else {
      scaler.BlendCorner(px, outputMatrix)
    }
  }

  private static _FillBlock(
    p: PixelData,
    trgi: number,
    pitch: number,
    col: number,
    blocksize: number
  ) {
    for (let y = 0; y < blocksize; ++y, trgi += pitch) {
      for (let x = 0; x < blocksize; ++x) {
        p.setDistPoint(trgi + x, 0, 0, col)
      }
    }
  }

  private static _Square(x: any) {
    return x * x
  }

  private static _DistYCbCr(pix1: number, pix2: number) {
    const rDiff = PixelData.getR(pix1) - PixelData.getR(pix2)
    const gDiff = PixelData.getG(pix1) - PixelData.getG(pix2)
    const bDiff = PixelData.getB(pix1) - PixelData.getB(pix2)

    // const kB = 0.0722 // ITU-R BT.709
    // const kR = 0.2126
    const kB = 0.0593 // ITU-R BT.2020 conversion
    const kR = 0.2627
    const kG = 1 - kB - kR

    const scaleB = 0.5 / (1 - kB)
    const scaleR = 0.5 / (1 - kR)

    const y = kR * rDiff + kG * gDiff + kB * bDiff
    const cB = scaleB * (bDiff - y)
    const cR = scaleR * (rDiff - y)

    return Math.sqrt(this._Square(this.luminanceWeight * y) + this._Square(cB) + this._Square(cR))
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

    const dist = this._ColorDist
    const jg =
      dist(ker.i, ker.f) +
      dist(ker.f, ker.c) +
      dist(ker.n, ker.k) +
      dist(ker.k, ker.h) +
      this.centerDirectionBias * dist(ker.j, ker.g)
    const fk =
      dist(ker.e, ker.j) +
      dist(ker.j, ker.o) +
      dist(ker.b, ker.g) +
      dist(ker.g, ker.l) +
      this.centerDirectionBias * dist(ker.f, ker.k)

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

// blending
// eslint-disable-next-line prettier/prettier
function _AlphaBlend(n: number, m: number, target: number, out: OutputMatrix, color: number) {
  // eslint-disable-next-line prettier/prettier
  const ip = PixelData.InterpolateFiltered2(color, out.getDstPixel(target), n, m - n)
  out.SetDstPixel(target, ip)
}

interface IScaler {
  Scale(): number
  BlendLineShallow(color: number, out: OutputMatrix): void
  BlendLineSteep(color: number, out: OutputMatrix): void
  BlendLineSteepAndShallow(color: number, out: OutputMatrix): void
  BlendLineDiagonal(color: number, out: OutputMatrix): void
  BlendCorner(color: number, out: OutputMatrix): void
}

class Scale2x implements IScaler {
  private _SCALE = 2

  Scale() {
    return this._SCALE
  }

  BlendLineShallow(color: number, out: OutputMatrix): void {
    _AlphaBlend(1, 4, out.Reference(this._SCALE - 1, 0), out, color)
    _AlphaBlend(3, 4, out.Reference(this._SCALE - 1, 1), out, color)
  }

  BlendLineSteep(color: number, out: OutputMatrix): void {
    _AlphaBlend(1, 4, out.Reference(0, this._SCALE - 1), out, color)
    _AlphaBlend(3, 4, out.Reference(1, this._SCALE - 1), out, color)
  }

  BlendLineSteepAndShallow(color: number, out: OutputMatrix) {
    _AlphaBlend(1, 4, out.Reference(1, 0), out, color)
    _AlphaBlend(1, 4, out.Reference(0, 1), out, color)
    _AlphaBlend(5, 6, out.Reference(1, 1), out, color)
  }

  BlendLineDiagonal(color: number, out: OutputMatrix): void {
    _AlphaBlend(1, 2, out.Reference(1, 1), out, color)
  }

  BlendCorner(color: number, out: OutputMatrix): void {
    // model a round corner
    _AlphaBlend(21, 100, out.Reference(1, 1), out, color) // exact: 1 - pi/4 = 0.2146018366
  }
}

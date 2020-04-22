// jsPixelFilter Library
// Copyright (C) 2020 Kitsune Gadget
//
// Reference: 2dImageFilter (http://hawkynt.github.io/2dimagefilter/)

import PixelData from './pixelData'

// original xbr algolithm by Hyllian
// xbr-lv3 shader (see https://github.com/libreto/common-shaders)
export default class XBR {
  private static readonly XBR_Y_WEIGHT = 48
  private static readonly XBR_U_WEIGHT = 7
  private static readonly XBR_V_WEIGHT = 6

  private static readonly yuv = [
    [0.299, 0.587, 0.114],
    [-0.169, -0.331, 0.499],
    [0.499, -0.418, -0.0813]
  ]

  private readonly delta = [0.4, 0.4, 0.4, 0.4]

  // YUV convert function
  private static _RGBtoY(x: number) {
    // eslint-disable-next-line prettier/prettier
    const t =
      (PixelData.getR(x) * 299 +
        PixelData.getG(x) * 587 +
        PixelData.getB(x) * 114) /
      1000
    return t > 255 ? 255 : t
  }

  private static _RGBtoU(x: number) {
    const t =
      (127500000 +
        PixelData.getR(x) * 500000 -
        PixelData.getG(x) * 418688 -
        PixelData.getB(x) * 81312) /
      1000000
    return t > 255 ? 255 : t < 0 ? 0 : t
  }

  private static _RGBtoV(x: number) {
    const t =
      (127500000 -
        PixelData.getR(x) * 168736 -
        PixelData.getG(x) * 331264 +
        PixelData.getB(x) * 500000) /
      1000000
    return t > 255 ? 255 : t < 0 ? 0 : t
  }

  private static _YuvDifference(a: number, b: number) {
    return (
      this.XBR_Y_WEIGHT * Math.abs(this._RGBtoY(a) - this._RGBtoY(b)) +
      this.XBR_V_WEIGHT * Math.abs(this._RGBtoV(a) - this._RGBtoV(b)) +
      this.XBR_U_WEIGHT * Math.abs(this._RGBtoU(a) - this._RGBtoU(b))
    )
  }

  // blend function
  private static _AlphaBlend32W(dst: number, src: number, blend: boolean) {
    return blend ? PixelData.InterpolateWeighted2(dst, src, 7, 1) : src
  }

  private static _AlphaBlend64W(dst: number, src: number, blend: boolean) {
    return blend ? PixelData.InterpolateWeighted2(dst, src, 3, 1) : src
  }

  private static _AlphaBlend128W(dst: number, src: number, blend: boolean) {
    return blend ? PixelData.Interpolate(dst, src) : src
  }

  private static _AlphaBlend192W(dst: number, src: number, blend: boolean) {
    return blend ? PixelData.InterpolateWeighted2(dst, src, 1, 3) : src
  }

  private static _AlphaBlend224W(dst: number, src: number, blend: boolean) {
    return blend ? PixelData.InterpolateWeighted2(dst, src, 1, 7) : src
  }

  // 2x
  // eslint-disable-next-line camelcase
  private static _Left2_2x(n3: number, n2: number, pixel: number, blend: boolean) {
    // eslint-disable-next-line prettier/prettier
    return [
      this._AlphaBlend192W(n3, pixel, blend), 
      this._AlphaBlend64W(n2, pixel, blend)
    ]
  }

  // eslint-disable-next-line camelcase
  private static _Up2_2x(n3: number, n1: number, pixel: number, blend: boolean) {
    // eslint-disable-next-line prettier/prettier
    return [
      this._AlphaBlend192W(n3, pixel, blend),
      this._AlphaBlend64W(n1, pixel, blend)
    ]
  }

  // eslint-disable-next-line camelcase
  private static _Dia_2x(n3: number, pixel: number, blend: boolean) {
    return this._AlphaBlend128W(n3, pixel, blend)
  }

  // kernel 2x function
  private static _Kernel2x(
    e: number,
    i: number,
    h: number,
    f: number,
    g: number,
    c: number,
    d: number,
    b: number,
    f4: number,
    i4: number,
    h5: number,
    i5: number,
    n1: number,
    n2: number,
    n3: number,
    blend: boolean,
    c1: number, // eslint-disable-line @typescript-eslint/no-unused-vars
    g0: number // eslint-disable-line @typescript-eslint/no-unused-vars
  ) {
    const ex = e !== h && e !== f
    if (!ex) return [n1, n2, n3]

    const ee =
      this._YuvDifference(e, c) +
      this._YuvDifference(e, g) +
      this._YuvDifference(i, h5) +
      this._YuvDifference(i, f4) +
      (this._YuvDifference(h, f) << 2)
    const ii =
      this._YuvDifference(h, d) +
      this._YuvDifference(h, i5) +
      this._YuvDifference(f, i4) +
      this._YuvDifference(f, b) +
      (this._YuvDifference(e, i) << 2)
    const px = this._YuvDifference(e, f) <= this._YuvDifference(e, h) ? f : h

    // corner D
    // if (
    //   ee < ii &&
    //   ((f !== b && h !== d) || (e === i && f !== i4 && h !== i5) || e === g || e === c) &&
    //   ((f !== f4 && f !== i) ||
    //     (h !== h5 && h !== i) ||
    //     h !== g ||
    //     f !== c ||
    //     (b === c1 && d === g0))
    // ) {
    // corner C: none of defined corner
    if (
      ee < ii &&
      ((f !== b && f !== c) ||
        (h !== d && h !== g) ||
        (e === i && ((f !== f4 && f !== i4) || (h !== h5 && h !== i5))) ||
        e === g ||
        e === c)
    ) {
      const ke = this._YuvDifference(f, g)
      const ki = this._YuvDifference(h, c)
      const ex2 = e !== c && b !== c
      const ex3 = e !== g && d !== g

      if ((ke << 1 <= ki && ex3) || (ke >= ki << 1 && ex2)) {
        if (ke << 1 <= ki && ex3) {
          const n3n2 = this._Left2_2x(n3, n2, px, blend)
          n3 = n3n2[0]
          n2 = n3n2[1]
        }
        if (ke >= ki << 1 && ex2) {
          const n3n1 = this._Up2_2x(n3, n1, px, blend)
          n3 = n3n1[0]
          n1 = n3n1[1]
        }
      } else {
        n3 = this._Dia_2x(n3, px, blend)
      }
    } else if (ee <= ii) {
      n3 = this._AlphaBlend64W(n3, px, blend)
    }

    return [n1, n2, n3]
  }

  // 3x
  // eslint-disable-next-line camelcase
  private static _LeftUp2_3x(
    n7: number,
    n5: any, // eslint-disable-line
    n6: number,
    n2: any, // eslint-disable-line
    n8: any, // eslint-disable-line
    pixel: number,
    blend: boolean
  ) {
    const m7 = this._AlphaBlend192W(n7, pixel, blend)
    const m6 = this._AlphaBlend64W(n6, pixel, blend)
    const m5 = m7
    const m2 = m6
    const m8 = pixel
    return [m7, m5, m6, m2, m8]
  }

  // eslint-disable-next-line camelcase
  private static _Left2_3x(
    n7: number,
    n5: number,
    n6: number,
    n8: any, // eslint-disable-line
    pixel: number,
    blend: boolean
  ) {
    const m7 = this._AlphaBlend192W(n7, pixel, blend)
    const m5 = this._AlphaBlend64W(n5, pixel, blend)
    const m6 = this._AlphaBlend64W(n6, pixel, blend)
    const m8 = pixel
    return [m7, m5, m6, m8]
  }

  // eslint-disable-next-line camelcase
  private static _Up2_3x(
    n5: number,
    n7: number,
    n2: number,
    n8: any, // eslint-disable-line
    pixel: number,
    blend: boolean
  ) {
    const m5 = this._AlphaBlend192W(n5, pixel, blend)
    const m7 = this._AlphaBlend64W(n7, pixel, blend)
    const m2 = this._AlphaBlend64W(n2, pixel, blend)
    const m8 = pixel
    return [m5, m7, m2, m8]
  }

  // eslint-disable-next-line camelcase
  private static _Dia_3x(n8: number, n5: number, n7: number, pixel: number, blend: boolean) {
    const m8 = this._AlphaBlend224W(n8, pixel, blend)
    const m5 = this._AlphaBlend32W(n5, pixel, blend)
    const m7 = this._AlphaBlend32W(n7, pixel, blend)
    return [m8, m5, m7]
  }

  // kernel 3x function
  private static _Kernel3x(
    e: number,
    i: number,
    h: number,
    f: number,
    g: number,
    c: number,
    d: number,
    b: number,
    f4: number,
    i4: number,
    h5: number,
    i5: number,
    n2: number,
    n5: number,
    n6: number,
    n7: number,
    n8: number,
    blend: boolean
  ) {
    const ex = e !== h && e !== f
    if (!ex) return [n2, n5, n6, n7, n8]

    const ee =
      this._YuvDifference(e, c) +
      this._YuvDifference(e, g) +
      this._YuvDifference(i, h5) +
      this._YuvDifference(i, f4) +
      (this._YuvDifference(h, f) << 2)
    const ii =
      this._YuvDifference(h, d) +
      this._YuvDifference(h, i5) +
      this._YuvDifference(f, i4) +
      this._YuvDifference(f, b) +
      (this._YuvDifference(e, i) << 2)

    if (
      ee < ii &&
      ((f !== b && f !== c) ||
        (h !== d && h !== g) ||
        (e === i && ((f !== f4 && f !== i4) || (h !== h5 && h !== i5))) ||
        e === g ||
        e === c)
    ) {
      const ke = this._YuvDifference(f, g)
      const ki = this._YuvDifference(h, c)
      const ex2 = e !== c && b !== c
      const ex3 = e !== g && d !== g
      const px = this._YuvDifference(e, f) <= this._YuvDifference(e, h) ? f : h

      if (ke << 1 <= ki && ex3 && ke >= ki << 1 && ex2) {
        const n75628 = this._LeftUp2_3x(n7, n5, n6, n2, n8, px, blend)
        n7 = n75628[0]
        n5 = n75628[1]
        n6 = n75628[2]
        n2 = n75628[3]
        n8 = n75628[4]
      } else if (ke << 1 <= ki && ex3) {
        const n7568 = this._Left2_3x(n7, n5, n6, n8, px, blend)
        n7 = n7568[0]
        n5 = n7568[1]
        n6 = n7568[2]
        n8 = n7568[3]
      } else if (ke >= ki << 1 && ex2) {
        const n5728 = this._Up2_3x(n5, n7, n2, n8, px, blend)
        n5 = n5728[0]
        n7 = n5728[1]
        n2 = n5728[2]
        n8 = n5728[3]
      } else {
        const n857 = this._Dia_3x(n8, n5, n7, px, blend)
        n8 = n857[0]
        n5 = n857[1]
        n7 = n857[2]
      }
    } else if (ee <= ii) {
      n8 = this._AlphaBlend128W(
        n8,
        this._YuvDifference(e, f) <= this._YuvDifference(e, h) ? f : h,
        blend
      )
    }

    return [n2, n5, n6, n7, n8]
  }

  // 4x
  private static _LeftUp2(
    nf: number, // eslint-disable-line
    ne: number, // eslint-disable-line
    nb: number, // eslint-disable-line
    nd: number,
    nc: number,
    na: number, // eslint-disable-line
    n7: number, // eslint-disable-line
    n3: number, // eslint-disable-line
    pixel: number,
    blend: boolean
  ) {
    const md = this._AlphaBlend192W(nd, pixel, blend)
    const mc = this._AlphaBlend64W(nc, pixel, blend)
    const mf = pixel
    const me = pixel
    const mb = pixel
    const ma = nc
    const m3 = nc
    const m7 = nd
    return [mf, me, mb, md, mc, ma, m7, m3]
  }

  private static _Left2(
    nf: number, // eslint-disable-line
    ne: number, // eslint-disable-line
    nb: number,
    nd: number,
    nc: number,
    na: number,
    pixel: number,
    blend: boolean
  ) {
    const mb = this._AlphaBlend192W(nb, pixel, blend)
    const md = this._AlphaBlend192W(nd, pixel, blend)
    const ma = this._AlphaBlend64W(na, pixel, blend)
    const mc = this._AlphaBlend64W(nc, pixel, blend)
    const me = pixel
    const mf = pixel
    return [mf, me, mb, md, mc, ma]
  }

  private static _Up2(
    nf: number, // eslint-disable-line
    ne: number, // eslint-disable-line
    nb: number, // eslint-disable-line
    n3: number,
    n7: number,
    na: number,
    pixel: number,
    blend: boolean
  ) {
    const me = this._AlphaBlend192W(ne, pixel, blend)
    const m7 = this._AlphaBlend192W(n7, pixel, blend)
    const ma = this._AlphaBlend64W(na, pixel, blend)
    const m3 = this._AlphaBlend64W(n3, pixel, blend)
    const mb = pixel
    const mf = pixel
    return [mf, me, mb, m3, m7, ma]
  }

  private static _Dia(
    nf: number, // eslint-disable-line
    ne: number,
    nb: number,
    pixel: number,
    blend: boolean
  ) {
    const mb = this._AlphaBlend128W(nb, pixel, blend)
    const me = this._AlphaBlend128W(ne, pixel, blend)
    const mf = pixel
    return [mf, me, mb]
  }

  // kernel 4x function
  private static _Kernel4x(
    e: number,
    i: number,
    h: number,
    f: number,
    g: number,
    c: number,
    d: number,
    b: number,
    f4: number,
    i4: number,
    h5: number,
    i5: number,
    nf: number,
    ne: number,
    nb: number,
    n3: number,
    n7: number,
    na: number,
    nd: number,
    nc: number,
    blend: boolean
  ) {
    const ex = e !== h && e !== f
    if (!ex) return [nf, ne, nb, n3, n7, na, nd, nc]

    const ee =
      this._YuvDifference(e, c) +
      this._YuvDifference(e, g) +
      this._YuvDifference(i, h5) +
      this._YuvDifference(i, f4) +
      (this._YuvDifference(h, f) << 2)
    const ii =
      this._YuvDifference(h, d) +
      this._YuvDifference(h, i5) +
      this._YuvDifference(f, i4) +
      this._YuvDifference(f, b) +
      (this._YuvDifference(e, i) << 2)

    const px = this._YuvDifference(e, f) <= this._YuvDifference(e, h) ? f : h

    if (
      ee < ii &&
      ((f !== b && f !== c) ||
        (h !== d && h !== g) ||
        (e === i && ((f !== f4 && f !== i4) || (h !== h5 && h !== i5))) ||
        e === g ||
        e === c)
    ) {
      const ke = this._YuvDifference(f, g)
      const ki = this._YuvDifference(h, c)
      const ex2 = e !== c && b !== c
      const ex3 = e !== g && d !== g

      if ((ke << 1 <= ki && ex3) || (ke >= ki << 1 && ex2)) {
        if (ke << 1 <= ki && ex3) {
          const nfebdca = this._Left2(nf, ne, nb, nd, nc, na, px, blend)
          nf = nfebdca[0]
          ne = nfebdca[1]
          nb = nfebdca[2]
          nd = nfebdca[3]
          nc = nfebdca[4]
          na = nfebdca[5]
        }
        if (ke >= ki << 1 && ex2) {
          const nfeb37a = this._Up2(nf, ne, nb, n3, n7, na, px, blend)
          nf = nfeb37a[0]
          ne = nfeb37a[1]
          nb = nfeb37a[2]
          n3 = nfeb37a[3]
          n7 = nfeb37a[4]
          na = nfeb37a[5]
        }
      } else {
        const nfeb = this._Dia(nf, ne, nb, px, blend)
        nf = nfeb[0]
        ne = nfeb[1]
        nb = nfeb[2]
      }
    } else if (ee <= ii) {
      nf = this._AlphaBlend128W(nf, px, blend)
    }

    return [nf, ne, nb, n3, n7, na, nd, nc]
  }

  // main convert function
  static XBR(imageData: ImageData, scale: number, allowAlphaBlend: boolean) {
    const p = new PixelData(imageData)
    p.setDistSize(scale)

    for (let j = 0; j < p.height; j++) {
      for (let i = 0; i < p.width; i++) {
        const l = j * p.width + i
        //    A1 B1 C1
        // A0  A  B  C C4
        // D0  D  E  F F4
        // G0  G  H  I I4
        //    G5 H5 I5
        const A1 = p.getSourcePoint(l, -2, -1)
        const B1 = p.getSourcePoint(l, -2, 0)
        const C1 = p.getSourcePoint(l, -2, 1)

        const A0 = p.getSourcePoint(l, -1, -2)
        const A = p.getSourcePoint(l, -1, -1)
        const B = p.getSourcePoint(l, -1, 0)
        const C = p.getSourcePoint(l, -1, 1)
        const C4 = p.getSourcePoint(l, -1, 2)

        const D0 = p.getSourcePoint(l, 0, -2)
        const D = p.getSourcePoint(l, 0, -1)
        const E = p.getSourcePoint(l, 0, 0)
        const F = p.getSourcePoint(l, 0, 1)
        const F4 = p.getSourcePoint(l, 0, 2)

        const G0 = p.getSourcePoint(l, 1, -2)
        const G = p.getSourcePoint(l, 1, -1)
        const H = p.getSourcePoint(l, 1, 0)
        const I = p.getSourcePoint(l, 1, 1)
        const I4 = p.getSourcePoint(l, 1, 2)

        const G5 = p.getSourcePoint(l, 2, -1)
        const H5 = p.getSourcePoint(l, 2, 0)
        const I5 = p.getSourcePoint(l, 2, 1)

        let e0, e1, e2, e3
        e0 = e1 = e2 = e3 = E

        const rl = j * p.width * scale ** 2 + i * scale
        if (scale === 2) {
          // eslint-disable-next-line prettier/prettier
          const e123 = this._Kernel2x(E,I,H,F,G,C,D,B, F4,I4,H5,I5, e1,e2,e3, allowAlphaBlend, C1, G0)
          e1 = e123[0]
          e2 = e123[1]
          e3 = e123[2]
          // eslint-disable-next-line prettier/prettier
          const e031 = this._Kernel2x(E,C,F,B,I,A,H,D, B1,C1,F4,C4, e0,e3,e1, allowAlphaBlend, A0, I5)
          e0 = e031[0]
          e3 = e031[1]
          e1 = e031[2]
          // eslint-disable-next-line prettier/prettier
          const e210 = this._Kernel2x(E,A,B,D,C,G,F,H, D0,A0,B1,A1, e2,e1,e0, allowAlphaBlend, G5, C4)
          e2 = e210[0]
          e1 = e210[1]
          e0 = e210[2]
          // eslint-disable-next-line prettier/prettier
          const e302 = this._Kernel2x(E,G,D,H,A,I,B,F, H5,G5,D0,G0, e3,e0,e2, allowAlphaBlend, I4, A1)
          e3 = e302[0]
          e0 = e302[1]
          e2 = e302[2]

          p.setDistPoint(rl, 0, 0, e0)
          p.setDistPoint(rl, 0, 1, e1)
          p.setDistPoint(rl, 1, 0, e2)
          p.setDistPoint(rl, 1, 1, e3)
        } else if (scale === 3) {
          const e4 = E
          let e5, e6, e7, e8
          e5 = e6 = e7 = e8 = E

          // eslint-disable-next-line prettier/prettier
          const e25678 = this._Kernel3x(E,I,H,F,G,C,D,B, F4,I4,H5,I5, e2,e5,e6,e7,e8, allowAlphaBlend)
          e2 = e25678[0]
          e5 = e25678[1]
          e6 = e25678[2]
          e7 = e25678[3]
          e8 = e25678[4]
          // eslint-disable-next-line prettier/prettier
          const e01852 = this._Kernel3x(E,C,F,B,I,A,H,D, B1,C1,F4,C4, e0,e1,e8,e5,e2, allowAlphaBlend)
          e0 = e01852[0]
          e1 = e01852[1]
          e8 = e01852[2]
          e5 = e01852[3]
          e2 = e01852[4]
          // eslint-disable-next-line prettier/prettier
          const e63210 = this._Kernel3x(E,A,B,D,C,G,F,H, D0,A0,B1,A1, e6,e3,e2,e1,e0, allowAlphaBlend)
          e6 = e63210[0]
          e3 = e63210[1]
          e2 = e63210[2]
          e1 = e63210[3]
          e0 = e63210[4]
          // eslint-disable-next-line prettier/prettier
          const e87036 = this._Kernel3x(E,G,D,H,A,I,B,F, H5,G5,D0,G0, e8,e7,e0,e3,e6, allowAlphaBlend)
          e8 = e87036[0]
          e7 = e87036[1]
          e0 = e87036[2]
          e3 = e87036[3]
          e6 = e87036[4]

          p.setDistPoint(rl, 0, 0, e0)
          p.setDistPoint(rl, 0, 1, e1)
          p.setDistPoint(rl, 0, 2, e2)
          p.setDistPoint(rl, 1, 0, e3)
          p.setDistPoint(rl, 1, 1, e4)
          p.setDistPoint(rl, 1, 2, e5)
          p.setDistPoint(rl, 2, 0, e6)
          p.setDistPoint(rl, 2, 1, e7)
          p.setDistPoint(rl, 2, 2, e8)
        } else if (scale === 4) {
          let e4, e5, e6, e7, e8, e9, ea, eb, ec, ed, ee, ef
          e4 = e5 = e6 = e7 = e8 = e9 = ea = eb = ec = ed = ee = ef = E

          // eslint-disable-next-line prettier/prettier
          const efeb37adc = this._Kernel4x(E,I,H,F,G,C,D,B, F4,I4,H5,I5, ef,ee,eb,e3,e7,ea,ed,ec, allowAlphaBlend)
          ef = efeb37adc[0]
          ee = efeb37adc[1]
          eb = efeb37adc[2]
          e3 = efeb37adc[3]
          e7 = efeb37adc[4]
          ea = efeb37adc[5]
          ed = efeb37adc[6]
          ec = efeb37adc[7]
          // eslint-disable-next-line prettier/prettier
          const e372016bf = this._Kernel4x(E,C,F,B,I,A,H,D, B1,C1,F4,C4, e3,e7,e2,e0,e1,e6,eb,ef, allowAlphaBlend)
          e3 = e372016bf[0]
          e7 = e372016bf[1]
          e2 = e372016bf[2]
          e0 = e372016bf[3]
          e1 = e372016bf[4]
          e6 = e372016bf[5]
          eb = e372016bf[6]
          ef = e372016bf[7]
          // eslint-disable-next-line prettier/prettier
          const e014c8523 = this._Kernel4x(E,A,B,D,C,G,F,H, D0,A0,B1,A1, e0,e1,e4,ec,e8,e5,e2,e3, allowAlphaBlend)
          e0 = e014c8523[0]
          e1 = e014c8523[1]
          e4 = e014c8523[2]
          ec = e014c8523[3]
          e8 = e014c8523[4]
          e5 = e014c8523[5]
          e2 = e014c8523[6]
          e3 = e014c8523[7]
          // eslint-disable-next-line prettier/prettier
          const ec8dfe940 = this._Kernel4x(E,G,D,H,A,I,B,F, H5,G5,D0,G0, ec,e8,ed,ef,ee,e9,e4,e0, allowAlphaBlend)
          ec = ec8dfe940[0]
          e8 = ec8dfe940[1]
          ed = ec8dfe940[2]
          ef = ec8dfe940[3]
          ee = ec8dfe940[4]
          e9 = ec8dfe940[5]
          e4 = ec8dfe940[6]
          e0 = ec8dfe940[7]

          p.setDistPoint(rl, 0, 0, e0)
          p.setDistPoint(rl, 0, 1, e1)
          p.setDistPoint(rl, 0, 2, e2)
          p.setDistPoint(rl, 0, 3, e3)
          p.setDistPoint(rl, 1, 0, e4)
          p.setDistPoint(rl, 1, 1, e5)
          p.setDistPoint(rl, 1, 2, e6)
          p.setDistPoint(rl, 1, 3, e7)
          p.setDistPoint(rl, 2, 0, e8)
          p.setDistPoint(rl, 2, 1, e9)
          p.setDistPoint(rl, 2, 2, ea)
          p.setDistPoint(rl, 2, 3, eb)
          p.setDistPoint(rl, 3, 0, ec)
          p.setDistPoint(rl, 3, 1, ed)
          p.setDistPoint(rl, 3, 2, ee)
          p.setDistPoint(rl, 3, 3, ef)
        }
      } // end i for
    } // end j for
    return p.outImageData()
  } // end xbr
}

// Pixel Art Scaler: jsPixelFilter
//
// Reference: 2dImageFilter (http://hawkynt.github.io/2dimagefilter/)

import PixelData from './pixelData'

export default class Eagle {
  // Eagle algorithm
  // original 3x and 3xB was made by Hawkynt
  static Eagle(imageData: ImageData, scale: number, mode = 'normal') {
    const p = new PixelData(imageData)
    p.setDistSize(scale)

    for (let j = 0; j < p.height; j++) {
      for (let i = 0; i < p.width; i++) {
        const l = j * p.width + i
        // A  B  C
        // D  E  F
        // G  H  I
        const A = p.getSourcePoint(l, -1, -1)
        const B = p.getSourcePoint(l, -1, 0)
        const C = p.getSourcePoint(l, -1, 1)
        const D = p.getSourcePoint(l, 0, -1)
        const E = p.getSourcePoint(l, 0, 0)
        const F = p.getSourcePoint(l, 0, 1)
        const G = p.getSourcePoint(l, 1, -1)
        const H = p.getSourcePoint(l, 1, 0)
        const I = p.getSourcePoint(l, 1, 1)
        // out
        const rl = j * p.width * scale ** 2 + i * scale
        let e00, e01, e10, e11
        if (scale === 2) {
          e00 = e01 = e10 = e11 = E
          if (A === B && A === D) e00 = A
          if (C === B && C === F) e01 = C
          if (G === D && G === H) e10 = G
          if (I === F && I === H) e11 = I
          p.setDistPoint(rl, 0, 0, e00)
          p.setDistPoint(rl, 0, 1, e01)
          p.setDistPoint(rl, 1, 0, e10)
          p.setDistPoint(rl, 1, 1, e11)
        } else if (scale === 3 && mode === 'normal') {
          let e02, e12, e20, e21, e22

          e00 = e01 = e02 = e10 = e11 = e12 = e20 = e21 = e22 = E
          if (A === B && A === D) e00 = A
          if (C === B && C === F) e02 = C
          if (G === D && G === H) e20 = G
          if (I === F && I === H) e22 = I
          if (A === B && A === D && C === B && C === F) e01 = B
          if (C === B && C === F && I === F && I === H) e12 = F
          if (G === D && G === H && I === F && I === H) e21 = H
          if (A === B && A === D && G === D && G === H) e10 = D
          p.setDistPoint(rl, 0, 0, e00)
          p.setDistPoint(rl, 0, 1, e01)
          p.setDistPoint(rl, 0, 2, e02)
          p.setDistPoint(rl, 1, 0, e10)
          p.setDistPoint(rl, 1, 1, e11)
          p.setDistPoint(rl, 1, 2, e12)
          p.setDistPoint(rl, 2, 0, e20)
          p.setDistPoint(rl, 2, 1, e21)
          p.setDistPoint(rl, 2, 2, e22)
        } else if (scale === 3 && mode === 'B') {
          let e02, e12, e20, e21, e22

          e00 = e01 = e02 = e10 = e11 = e12 = e20 = e21 = e22 = E
          if (A === B && A === D) e00 = A
          if (C === B && C === F) e02 = C
          if (G === D && G === H) e20 = G
          if (I === F && I === H) e22 = I
          p.setDistPoint(rl, 0, 0, e00)
          p.setDistPoint(rl, 0, 1, e01)
          p.setDistPoint(rl, 0, 2, e02)
          p.setDistPoint(rl, 1, 0, e10)
          p.setDistPoint(rl, 1, 1, e11)
          p.setDistPoint(rl, 1, 2, e12)
          p.setDistPoint(rl, 2, 0, e20)
          p.setDistPoint(rl, 2, 1, e21)
          p.setDistPoint(rl, 2, 2, e22)
        }
      }
    } // end of for
    return p.outImageData()
  }
}

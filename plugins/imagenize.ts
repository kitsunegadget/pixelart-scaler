/* eslint-disable unicorn/number-literal-case */
import PixelData from './pixelData'
// ImageDataをPixelData型にしてスケール変換するstaticクラス
export default class Imagenize {
  // Eric's Pixel Expansion / Scale Nx Algorithm
  static EPX(imageData: ImageData, scale: number) {
    const p = new PixelData(imageData)
    p.setDistSize(scale)

    for (let j = 0; j < p.height; j++) {
      for (let i = 0; i < p.width; i++) {
        const l = j * p.width + i
        // A  B  C
        // D  E  F
        // G  H  I
        const B = p.getSourcePoint(l, -1, 0)
        const D = p.getSourcePoint(l, 0, -1)
        const E = p.data[l]
        const F = p.getSourcePoint(l, 0, 1)
        const H = p.getSourcePoint(l, 1, 0)

        const rl = j * p.width * scale ** 2 + i * scale
        let e00, e01, e10, e11
        if (scale === 2) {
          if (B !== H && D !== F) {
            e00 = D === B ? D : E
            e01 = B === F ? F : E
            e10 = D === H ? D : E
            e11 = H === F ? F : E
          } else {
            e00 = e01 = e10 = e11 = E
          }
          p.setDistPoint(rl, 0, 0, e00)
          p.setDistPoint(rl, 0, 1, e01)
          p.setDistPoint(rl, 1, 0, e10)
          p.setDistPoint(rl, 1, 1, e11)
        } else if (scale === 3) {
          const A = p.getSourcePoint(l, -1, -1)
          const C = p.getSourcePoint(l, -1, 1)
          const G = p.getSourcePoint(l, 1, -1)
          const I = p.getSourcePoint(l, 1, 1)
          // out
          let e02, e12, e20, e21, e22
          if (B !== H && D !== F) {
            e00 = D === B ? D : E
            e01 = (D === B && E !== C) || (B === F && E !== A) ? B : E
            e02 = B === F ? F : E
            e10 = (D === B && E !== G) || (D === H && E !== A) ? D : E
            e11 = E
            e12 = (B === F && E !== I) || (H === F && E !== C) ? F : E
            e20 = D === H ? D : E
            e21 = (D === H && E !== I) || (H === F && E !== G) ? H : E
            e22 = H === F ? F : E
          } else {
            e00 = e01 = e02 = e10 = e11 = e12 = e20 = e21 = e22 = E
          }
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

  // Eagle algorithm
  // 3x and 3xB is based on Hawkynt's modified
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
        const E = p.data[l]
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

  // 2xSaI algorithm
  // original auther is Drek Liauw Kie Fa
  static x2SaI(imageData: ImageData, scale: number) {
    const getResult = (c00: number, c01: number, c10: number, c11: number) => {
      let x = 0
      let y = 0
      let r = 0
      if (c00 === c10) x++
      else if (c01 === c10) y++
      if (c00 === c11) x++
      else if (c01 === c11) y++
      if (x <= 1) r++
      if (y <= 1) r--
      return r
    }
    const p = new PixelData(imageData)
    p.setDistSize(scale)

    for (let j = 0; j < p.height; j++) {
      for (let i = 0; i < p.width; i++) {
        const l = j * p.width + i
        // I  E  F  J
        // G  A  B  K
        // H  C  D  L
        // M  N  O  P
        const I = p.getSourcePoint(l, -1, -1)
        const E = p.getSourcePoint(l, -1, 0)
        const F = p.getSourcePoint(l, -1, 1)
        const J = p.getSourcePoint(l, -1, 2)

        const G = p.getSourcePoint(l, 0, -1)
        const A = p.data[l]
        const B = p.getSourcePoint(l, 0, 1)
        const K = p.getSourcePoint(l, 0, 2)

        const H = p.getSourcePoint(l, 1, -1)
        const C = p.getSourcePoint(l, 1, 0)
        const D = p.getSourcePoint(l, 1, 1)
        const L = p.getSourcePoint(l, 1, 2)

        const M = p.getSourcePoint(l, 2, -1)
        const N = p.getSourcePoint(l, 2, 0)
        const O = p.getSourcePoint(l, 2, 1)
        // const P = p.getSourcePoint(l, 2, 2)

        const rl = j * p.width * scale ** 2 + i * scale
        const e00 = A
        let e01, e10, e11
        e01 = e10 = e11 = A
        if (A === D && B !== C) {
          if (
            (A === E && B === L) ||
            (A === C && A === F && B !== E && B === J)
          ) {
            // e01 = A
          } else {
            e01 = PixelData.InterPolate(A, B)
          }

          if (
            (A === G && C === O) ||
            (A === B && A === H && G !== C && C === M)
          ) {
            // e10 = A
          } else {
            e10 = PixelData.InterPolate(A, C)
          }
          // e11 = A
          //
        } else if (B === C && A !== D) {
          if (
            (B === F && A === H) ||
            (B === E && B === D && A !== F && A === I)
          ) {
            e01 = B
          } else {
            e01 = PixelData.InterPolate(A, B)
          }
          if (
            (C === H && A === F) ||
            (C === G && C === D && A !== H && A === I)
          ) {
            e10 = C
          } else {
            e10 = PixelData.InterPolate(A, C)
          }
          e11 = B
          //
        } else if (A === D && B === C) {
          if (A === B) {
            // e01 = e10 = e11 = A
          } else {
            let r = 0
            e10 = PixelData.InterPolate(A, C)
            e01 = PixelData.InterPolate(A, B)

            r += getResult(A, B, G, E)
            r -= getResult(B, A, K, F)
            r -= getResult(B, A, H, N)
            r += getResult(A, B, L, O)

            if (r > 0) {
              e11 = A
            } else if (r < 0) {
              e11 = B
            } else {
              e11 = PixelData.InterPolate(A, B, C, D)
            }
          }
          //
        } else {
          e11 = PixelData.InterPolate(A, B, C, D)

          if (A === C && A === F && B !== E && B === J) {
            // e01 = A
          } else if (B === E && B === D && A !== F && A === I) {
            e01 = B
          } else {
            e01 = PixelData.InterPolate(A, B)
          }

          if (A === B && A === H && G !== C && C === M) {
            // e10 = A
          } else if (C === G && C === D && A !== H && A === I) {
            e10 = C
          } else {
            e10 = PixelData.InterPolate(A, C)
          }
        }

        p.setDistPoint(rl, 0, 0, e00)
        p.setDistPoint(rl, 0, 1, e01)
        p.setDistPoint(rl, 1, 0, e10)
        p.setDistPoint(rl, 1, 1, e11)
      } // end of i for
    } // end of j for
    return p.outImageData()
  }
}

export class StandardFilter {
  static invert(imageData: ImageData) {
    const data = new Uint32Array(imageData.data.buffer)

    for (let i = 0; i < data.length; i++) {
      const a = data[i] >> 24
      const b = 255 - ((data[i] >> 16) & 0xff)
      const g = 255 - ((data[i] >> 8) & 0xff)
      const r = (255 - data[i]) & 0xff
      const out = (a << 24) | (b << 16) | (g << 8) | r
      data[i] = out
    }
    const outData = new Uint8ClampedArray(data.buffer)
    return new ImageData(outData, imageData.width)
  }

  static grayScale(imageData: ImageData) {
    const data = new Uint32Array(imageData.data.buffer)

    for (let i = 0; i < data.length; i++) {
      const a = data[i] >> 24
      const b = (data[i] >> 16) & 0xff
      const g = (data[i] >> 8) & 0xff
      const r = data[i] & 0xff
      const avg = Math.round((r + g + b) / 3)
      const out = (a << 24) | (avg << 16) | (avg << 8) | avg
      data[i] = out
    }
    const outData = new Uint8ClampedArray(data.buffer)
    return new ImageData(outData, imageData.width)
  }

  static binarization(imageData: ImageData, threshold: number) {
    const data = new Uint32Array(imageData.data.buffer)

    for (let i = 0; i < data.length; i++) {
      const a = data[i] >> 24
      const b = (data[i] >> 16) & 0xff
      const g = (data[i] >> 8) & 0xff
      const r = data[i] & 0xff
      const avg = Math.round((r + g + b) / 3)
      let out = 0
      if (avg < threshold) {
        out = (a << 24) | 0x00ffffff
      } else {
        out = (a << 24) | 0x00000000
      }
      data[i] = out
    }
    const outData = new Uint8ClampedArray(data.buffer)
    return new ImageData(outData, imageData.width)
  }
}

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
  static _2xSaI(imageData: ImageData, scale: number) {
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
        // c0 c1 c2 d3
        // c3 c4 c5 d4
        // c6 c7 c8 d5
        // d0 d1 d2
        const c0 = p.getSourcePoint(l, -1, -1)
        const c1 = p.getSourcePoint(l, -1, 0)
        const c2 = p.getSourcePoint(l, -1, 1)
        const d3 = p.getSourcePoint(l, -1, 2)

        const c3 = p.getSourcePoint(l, 0, -1)
        const c4 = p.data[l]
        const c5 = p.getSourcePoint(l, 0, 1)
        const d4 = p.getSourcePoint(l, 0, 2)

        const c6 = p.getSourcePoint(l, 1, -1)
        const c7 = p.getSourcePoint(l, 1, 0)
        const c8 = p.getSourcePoint(l, 1, 1)
        const d5 = p.getSourcePoint(l, 1, 2)

        const d0 = p.getSourcePoint(l, 2, -1)
        const d1 = p.getSourcePoint(l, 2, 0)
        const d2 = p.getSourcePoint(l, 2, 1)
        // const P = p.getSourcePoint(l, 2, 2)

        const e00 = c4
        let e01, e10, e11
        e01 = e10 = e11 = c4

        if (c4 === c8 && c5 !== c7) {
          const c48 = PixelData.InterPolate(c4, c8)
          if (
            (c48 === c1 && c5 === d5) ||
            (c48 === c7 && c48 === c2 && c5 !== c1 && c5 === d3)
          ) {
            // e01 = c4
          } else {
            e01 = PixelData.InterPolate(c48, c5)
          }

          if (
            (c48 === c3 && c7 === d2) ||
            (c48 === c5 && c48 === c6 && c3 !== c7 && c7 === d0)
          ) {
            // e10 = c4
          } else {
            e10 = PixelData.InterPolate(c48, c7)
          }
          // e11 = c4
          //
        } else if (c5 === c7 && c4 !== c8) {
          const c57 = PixelData.InterPolate(c5, c7)
          if (
            (c57 === c2 && c4 === c6) ||
            (c57 === c1 && c57 === c8 && c4 !== c2 && c4 === c0)
          ) {
            e01 = c57
          } else {
            e01 = PixelData.InterPolate(c4, c57)
          }
          if (
            (c57 === c6 && c4 === c2) ||
            (c57 === c3 && c57 === c8 && c4 !== c6 && c4 === c0)
          ) {
            e10 = c57
          } else {
            e10 = PixelData.InterPolate(c4, c57)
          }
          e11 = c57
          //
        } else if (c4 === c8 && c5 === c7) {
          const c48 = PixelData.InterPolate(c4, c8)
          const c57 = PixelData.InterPolate(c5, c7)
          if (c48 !== c57) {
            let r = 0
            r += getResult(c48, c57, c3, c1)
            r -= getResult(c57, c48, d4, c2)
            r -= getResult(c57, c48, c6, d1)
            r += getResult(c48, c57, d5, d2)

            if (r < 0) {
              e11 = c57
            } else if (r === 0) {
              e11 = PixelData.InterPolate(c48, c57)
            }
            e10 = PixelData.InterPolate(c48, c57)
            e01 = PixelData.InterPolate(c48, c57)
          }
          //
        } else {
          e11 = PixelData.InterPolate(c4, c5, c7, c8)

          if (c4 === c7 && c4 === c2 && c5 !== c1 && c5 === d3) {
            // e01 = c4
          } else if (c5 === c1 && c5 === c8 && c4 !== c2 && c4 === c0) {
            e01 = PixelData.InterPolate(c5, c1, c8)
          } else {
            e01 = PixelData.InterPolate(c4, c5)
          }

          if (c4 === c5 && c4 === c6 && c3 !== c7 && c7 === d0) {
            // e10 = c4
          } else if (c7 === c3 && c7 === c8 && c4 !== c6 && c4 === c0) {
            e10 = PixelData.InterPolate(c7, c3, c8)
          } else {
            e10 = PixelData.InterPolate(c4, c7)
          }
        }
        const rl = j * p.width * scale ** 2 + i * scale
        p.setDistPoint(rl, 0, 0, e00)
        p.setDistPoint(rl, 0, 1, e01)
        p.setDistPoint(rl, 1, 0, e10)
        p.setDistPoint(rl, 1, 1, e11)
      } // end of i for
    } // end of j for
    return p.outImageData()
  }

  // Super2xSaI algorithm
  // original auther is Drek Liauw Kie Fa modified by Hawkynt
  static Super2xSaI(imageData: ImageData, scale: number) {
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
        // c0 c1 c2 d3
        // c3 c4 c5 d4
        // c6 c7 c8 d5
        // d0 d1 d2 d6
        const c0 = p.getSourcePoint(l, -1, -1)
        const c1 = p.getSourcePoint(l, -1, 0)
        const c2 = p.getSourcePoint(l, -1, 1)
        const d3 = p.getSourcePoint(l, -1, 2)

        const c3 = p.getSourcePoint(l, 0, -1)
        const c4 = p.data[l]
        const c5 = p.getSourcePoint(l, 0, 1)
        const d4 = p.getSourcePoint(l, 0, 2)

        const c6 = p.getSourcePoint(l, 1, -1)
        const c7 = p.getSourcePoint(l, 1, 0)
        const c8 = p.getSourcePoint(l, 1, 1)
        const d5 = p.getSourcePoint(l, 1, 2)

        const d0 = p.getSourcePoint(l, 2, -1)
        const d1 = p.getSourcePoint(l, 2, 0)
        const d2 = p.getSourcePoint(l, 2, 1)
        const d6 = p.getSourcePoint(l, 2, 2)

        let e00, e01, e10, e11
        e00 = e01 = e11 = c4

        if (c7 === c5 && c4 !== c8) {
          const c57 = PixelData.InterPolate(c7, c5)
          e11 = c57
          e01 = c57
        } else if (c4 === c8 && c7 !== c5) {
          // e11 = c48
          // e01 = c48
        } else if (c4 === c8 && c7 === c5) {
          const c57 = PixelData.InterPolate(c7, c5)
          const c48 = PixelData.InterPolate(c4, c8)
          let r = 0
          r += getResult(c57, c48, c6, d1)
          r += getResult(c57, c48, c3, c1)
          r += getResult(c57, c48, d2, d5)
          r += getResult(c57, c48, c2, d4)

          if (r > 0) {
            e11 = c57
            e01 = c57
          } else if (r === 0) {
            e11 = PixelData.InterPolate(c48, c57)
            e01 = PixelData.InterPolate(c48, c57)
          } else {
            // e11 = c4
            // e01 = c4
          }
        } else {
          if (c8 === c5 && c8 === d1 && c7 !== d2 && c8 !== d0) {
            // eslint-disable-next-line prettier/prettier
            e11 = PixelData.InterpolateFiltered2(PixelData.InterPolate(c8, c5, d1), c7, 3, 1)
          } else if (c7 === c4 && c7 === d2 && c7 !== d6 && c8 !== d1) {
            // eslint-disable-next-line prettier/prettier
            e11 = PixelData.InterpolateFiltered2(PixelData.InterPolate(c7, c4, d2), c8, 3, 1)
          } else {
            e11 = PixelData.InterPolate(c7, c8)
          }
          if (c5 === c8 && c5 === c1 && c5 !== c0 && c4 !== c2) {
            // eslint-disable-next-line prettier/prettier
            e01 = PixelData.InterpolateFiltered2(PixelData.InterPolate(c5, c8, c1), c4, 3, 1)
          } else if (c4 === c7 && c4 === c2 && c5 !== c1 && c4 !== d3) {
            // eslint-disable-next-line prettier/prettier
            e01 = PixelData.InterpolateFiltered2(PixelData.InterPolate(c4, c7, c2), c5, 3, 1)
          } else {
            e01 = PixelData.InterPolate(c4, c5)
          }

          if (c4 === c8 && c4 === c3 && c7 !== c5 && c4 !== d2) {
            e10 = PixelData.InterPolate(c7, PixelData.InterPolate(c4, c8, c3))
          } else if (c4 === c6 && c4 === c5 && c7 !== c3 && c4 !== d0) {
            e10 = PixelData.InterPolate(c7, PixelData.InterPolate(c4, c6, c5))
          } else {
            e10 = c7
          }
          if (c7 === c5 && c7 === c6 && c4 !== c8 && c7 !== c2) {
            e00 = PixelData.InterPolate(PixelData.InterPolate(c7, c5, c6), c4)
          } else if (c7 === c3 && c7 === c8 && c4 !== c6 && c7 !== c0) {
            e00 = PixelData.InterPolate(PixelData.InterPolate(c7, c3, c8), c4)
          } else {
            // e10 = c4
          }
        }
        const rl = j * p.width * scale ** 2 + i * scale
        p.setDistPoint(rl, 0, 0, e00)
        p.setDistPoint(rl, 0, 1, e01)
        p.setDistPoint(rl, 1, 0, e10)
        p.setDistPoint(rl, 1, 1, e11)
      } // end of i for
    } // end of j for
    return p.outImageData()
  }

  // SuperEagle algorithm
  // original auther is Drek Liauw Kie Fa modified by Hawkynt
  static SuperEagle(imageData: ImageData, scale: number) {
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
        // c0 c1 c2
        // c3 c4 c5 d4
        // c6 c7 c8 d5
        //    d1 d2
        // const c0 = p.getSourcePoint(l, -1, -1)
        const c1 = p.getSourcePoint(l, -1, 0)
        const c2 = p.getSourcePoint(l, -1, 1)

        const c3 = p.getSourcePoint(l, 0, -1)
        const c4 = p.data[l]
        const c5 = p.getSourcePoint(l, 0, 1)
        const d4 = p.getSourcePoint(l, 0, 2)

        const c6 = p.getSourcePoint(l, 1, -1)
        const c7 = p.getSourcePoint(l, 1, 0)
        const c8 = p.getSourcePoint(l, 1, 1)
        const d5 = p.getSourcePoint(l, 1, 2)

        const d1 = p.getSourcePoint(l, 2, 0)
        const d2 = p.getSourcePoint(l, 2, 1)

        let e00 = c4
        let e11 = c4
        let e01, e10

        if (c4 === c8) {
          const c48 = PixelData.InterPolate(c4, c8)
          if (c7 === c5) {
            const c57 = PixelData.InterPolate(c5, c7)
            let r = 0
            r += getResult(c57, c48, c6, d1)
            r += getResult(c57, c48, c3, c1)
            r += getResult(c57, c48, d2, d5)
            r += getResult(c57, c48, c2, d4)

            if (r > 0) {
              e10 = c57
              e01 = c57
              e11 = PixelData.InterPolate(c48, c57)
              e00 = PixelData.InterPolate(c48, c57)
            } else if (r < 0) {
              e10 = PixelData.InterPolate(c48, c57)
              e01 = PixelData.InterPolate(c48, c57)
            } else {
              e10 = c57
              e01 = c57
            }
          } else {
            if (c48 === c1 && c48 === d5) {
              // eslint-disable-next-line prettier/prettier
              e01 = PixelData.InterpolateFiltered2(PixelData.InterPolate(c48, c1, d5), c5, 3, 1)
            } else if (c48 === c1) {
              // eslint-disable-next-line prettier/prettier
              e01 = PixelData.InterpolateFiltered2(PixelData.InterPolate(c48, c1), c5, 3, 1)
            } else if (c48 === d5) {
              // eslint-disable-next-line prettier/prettier
              e01 = PixelData.InterpolateFiltered2(PixelData.InterPolate(c48, d5), c5, 3, 1)
            } else {
              e01 = PixelData.InterPolate(c48, c5)
            }

            if (c48 === d2 && c48 === c3) {
              // eslint-disable-next-line prettier/prettier
              e10 = PixelData.InterpolateFiltered2(PixelData.InterPolate(c48, d2, c3), c7, 3, 1)
            } else if (c48 === d2) {
              // eslint-disable-next-line prettier/prettier
              e10 = PixelData.InterpolateFiltered2(PixelData.InterPolate(c48, d2), c7, 3, 1)
            } else if (c48 === c3) {
              // eslint-disable-next-line prettier/prettier
              e10 = PixelData.InterpolateFiltered2(PixelData.InterPolate(c48, c3), c7, 3, 1)
            } else {
              e10 = PixelData.InterPolate(c48, c7)
            }
          }
        } else if (c7 === c5) {
          const c57 = PixelData.InterPolate(c5, c7)
          e01 = c57
          e10 = c57

          if (c57 === c6 && c57 === c2) {
            // eslint-disable-next-line prettier/prettier
            e00 = PixelData.InterpolateFiltered2(PixelData.InterPolate(c57, c6, c2), c4, 3, 1)
          } else if (c57 === c6) {
            // eslint-disable-next-line prettier/prettier
            e00 = PixelData.InterpolateFiltered2(PixelData.InterPolate(c57, c6), c4, 3, 1)
          } else if (c57 === c2) {
            // eslint-disable-next-line prettier/prettier
            e00 = PixelData.InterpolateFiltered2(PixelData.InterPolate(c57, c2), c4, 3, 1)
          } else {
            e00 = PixelData.InterPolate(c57, c4)
          }

          if (c57 === d4 && c57 === d1) {
            // eslint-disable-next-line prettier/prettier
            e11 = PixelData.InterpolateFiltered2(PixelData.InterPolate(c57, d4, d1), c8, 3, 1)
          } else if (c57 === d4) {
            // eslint-disable-next-line prettier/prettier
            e11 = PixelData.InterpolateFiltered2(PixelData.InterPolate(c57, d4), c8, 3, 1)
          } else if (c57 === d1) {
            // eslint-disable-next-line prettier/prettier
            e11 = PixelData.InterpolateFiltered2(PixelData.InterPolate(c57, d1), c8, 3, 1)
          } else {
            e11 = PixelData.InterPolate(c57, c8)
          }
        } else {
          e11 = PixelData.InterpolateFiltered3(c8, c7, c5, 6, 1, 1)
          e00 = PixelData.InterpolateFiltered3(c4, c7, c5, 6, 1, 1)
          e10 = PixelData.InterpolateFiltered3(c7, c4, c8, 6, 1, 1)
          e01 = PixelData.InterpolateFiltered3(c5, c4, c8, 6, 1, 1)
        }
        const rl = j * p.width * scale ** 2 + i * scale
        p.setDistPoint(rl, 0, 0, e00)
        p.setDistPoint(rl, 0, 1, e01)
        p.setDistPoint(rl, 1, 0, e10)
        p.setDistPoint(rl, 1, 1, e11)
      } // end i for
    } // end j for
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

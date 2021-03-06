// Pixel Art Scaler: jsPixelFilter
/* 
   jsPixelFilter
   Copyright (C) 2020 Kitsune Gadget

   This program is free software: you can redistribute it and/or modify
   it under the terms of the GNU General Public License as published by
   the Free Software Foundation, either version 3 of the License, or
   (at your option) any later version.
  
   This program is distributed in the hope that it will be useful,
   but WITHOUT ANY WARRANTY; without even the implied warranty of
   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
   GNU General Public License for more details.
  
   You should have received a copy of the GNU General Public License
   along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

// Reference: 2xSaI by Drek Liauw Kie Fa (https://vdnoort.home.xs4all.nl/emulation/2xsai/)
import PixelData from './pixelData'

export default class Kreed {
  static getResult(c00: number, c01: number, c10: number, c11: number) {
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

  // ////////
  // 2xSaI //
  // ////////
  static _2xSaI(imageData: ImageData, scale: number) {
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
        const c4 = p.getSourcePoint(l, 0, 0)
        const c5 = p.getSourcePoint(l, 0, 1)
        const d4 = p.getSourcePoint(l, 0, 2)

        const c6 = p.getSourcePoint(l, 1, -1)
        const c7 = p.getSourcePoint(l, 1, 0)
        const c8 = p.getSourcePoint(l, 1, 1)
        const d5 = p.getSourcePoint(l, 1, 2)

        const d0 = p.getSourcePoint(l, 2, -1)
        const d1 = p.getSourcePoint(l, 2, 0)
        const d2 = p.getSourcePoint(l, 2, 1)
        // const d6 = p.getSourcePoint(l, 2, 2)

        const e00 = c4
        let e01, e10, e11
        // e01 = e10 = e11 = c4

        if (c4 === c8 && c5 !== c7) {
          if ((c4 === c1 && c5 === d5) || (c4 === c7 && c4 === c2 && c5 !== c1 && c5 === d3)) {
            e01 = c4
          } else {
            e01 = PixelData.Interpolate(c4, c5)
          }

          if ((c4 === c3 && c7 === d2) || (c4 === c5 && c4 === c6 && c3 !== c7 && c7 === d0)) {
            e10 = c4
          } else {
            e10 = PixelData.Interpolate(c4, c7)
          }
          e11 = c4
          //
        } else if (c5 === c7 && c4 !== c8) {
          if ((c5 === c2 && c4 === c6) || (c5 === c1 && c5 === c8 && c4 !== c2 && c4 === c0)) {
            e01 = c5
          } else {
            e01 = PixelData.Interpolate(c4, c5)
          }

          if ((c7 === c6 && c4 === c2) || (c7 === c3 && c7 === c8 && c4 !== c6 && c4 === c0)) {
            e10 = c7
          } else {
            e10 = PixelData.Interpolate(c4, c7)
          }
          e11 = c5
          //
        } else if (c4 === c8 && c5 === c7) {
          if (c4 === c5) {
            e01 = c4
            e10 = c4
            e11 = c4
          } else {
            let r = 0
            e10 = PixelData.Interpolate(c4, c7)
            e01 = PixelData.Interpolate(c4, c5)

            r += this.getResult(c4, c5, c3, c1)
            r -= this.getResult(c5, c4, d4, c2)
            r -= this.getResult(c5, c4, c6, d1)
            r += this.getResult(c4, c5, d5, d2)

            if (r > 0) {
              e11 = c4
            } else if (r < 0) {
              e11 = c5
            } else {
              e11 = PixelData.Interpolate(c4, c5, c7, c8)
            }
          }
          //
        } else {
          e11 = PixelData.Interpolate(c4, c5, c7, c8)

          if (c4 === c7 && c4 === c2 && c5 !== c1 && c5 === d3) {
            e01 = c4
          } else if (c5 === c1 && c5 === c8 && c4 !== c2 && c4 === c0) {
            e01 = c5
          } else {
            e01 = PixelData.Interpolate(c4, c5)
          }

          if (c4 === c5 && c4 === c6 && c3 !== c7 && c7 === d0) {
            e10 = c4
          } else if (c7 === c3 && c7 === c8 && c4 !== c6 && c4 === c0) {
            e10 = c7
          } else {
            e10 = PixelData.Interpolate(c4, c7)
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

  // /////////////
  // Super2xSaI //
  // /////////////
  static Super2xSaI(imageData: ImageData, scale: number) {
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
        const c4 = p.getSourcePoint(l, 0, 0)
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
        // e00 = e01 = e11 = c4

        if (c7 === c5 && c4 !== c8) {
          e11 = c7
          e01 = c7
        } else if (c4 === c8 && c7 !== c5) {
          e11 = c4
          e01 = c4
        } else if (c4 === c8 && c7 === c5) {
          let r = 0
          r += this.getResult(c5, c4, c6, d1)
          r += this.getResult(c5, c4, c3, c1)
          r += this.getResult(c5, c4, d2, d5)
          r += this.getResult(c5, c4, c2, d4)

          if (r > 0) {
            e11 = c5
            e01 = c5
          } else if (r < 0) {
            e11 = c4
            e01 = c4
          } else {
            e11 = PixelData.Interpolate(c4, c5)
            e01 = PixelData.Interpolate(c4, c5)
          }
          //
        } else {
          if (c5 === c8 && c8 === d1 && c7 !== d2 && c8 !== d0) {
            e11 = PixelData.Interpolate(c8, c8, c8, c7)
          } else if (c4 === c7 && c7 === d2 && d1 !== c8 && c7 !== d6) {
            e11 = PixelData.Interpolate(c7, c7, c7, c8)
          } else {
            e11 = PixelData.Interpolate(c7, c8)
          }

          if (c5 === c8 && c5 === c1 && c4 !== c2 && c5 !== c0) {
            e01 = PixelData.Interpolate(c5, c5, c5, c4)
          } else if (c4 === c7 && c4 === c2 && c1 !== c5 && c4 !== d3) {
            e01 = PixelData.Interpolate(c4, c4, c4, c5)
          } else {
            e01 = PixelData.Interpolate(c4, c5)
          }
        }

        if (c4 === c8 && c7 !== c5 && c3 === c4 && c4 !== d2) {
          e10 = PixelData.Interpolate(c7, c4)
        } else if (c4 === c6 && c5 === c4 && c3 !== c7 && c4 !== d0) {
          e10 = PixelData.Interpolate(c7, c4)
        } else {
          e10 = c7
        }

        if (c7 === c5 && c4 !== c8 && c6 === c7 && c7 !== c2) {
          e00 = PixelData.Interpolate(c7, c4)
        } else if (c3 === c7 && c8 === c7 && c6 !== c4 && c7 !== c0) {
          e00 = PixelData.Interpolate(c7, c4)
        } else {
          e00 = c4
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

  // /////////////
  // SuperEagle //
  // /////////////
  static SuperEagle(imageData: ImageData, scale: number) {
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
        const c4 = p.getSourcePoint(l, 0, 0)
        const c5 = p.getSourcePoint(l, 0, 1)
        const d4 = p.getSourcePoint(l, 0, 2)

        const c6 = p.getSourcePoint(l, 1, -1)
        const c7 = p.getSourcePoint(l, 1, 0)
        const c8 = p.getSourcePoint(l, 1, 1)
        const d5 = p.getSourcePoint(l, 1, 2)

        const d1 = p.getSourcePoint(l, 2, 0)
        const d2 = p.getSourcePoint(l, 2, 1)

        let e00, e01, e10, e11
        // e00 = e01 = e10 = e11 = c4

        if (c7 === c5 && c4 !== c8) {
          e01 = e10 = c7
          if (c6 === c7 || c5 === c2) {
            e00 = PixelData.Interpolate(c7, c4)
            e00 = PixelData.Interpolate(c7, e00)
            // e00 = c7
          } else {
            e00 = PixelData.Interpolate(c4, c5)
          }

          if (c5 === d4 || c7 === d1) {
            e11 = PixelData.Interpolate(c7, c8)
            e11 = PixelData.Interpolate(c7, e11)
            // e11 = c7
          } else {
            e11 = PixelData.Interpolate(c7, c8)
          }
          //
        } else if (c4 === c8 && c7 !== c5) {
          e11 = e00 = c4
          if (c1 === c4 || c8 === d5) {
            e01 = PixelData.Interpolate(c4, c5)
            e01 = PixelData.Interpolate(c4, e01)
            // e01 = c4
          } else {
            e01 = PixelData.Interpolate(c4, c5)
          }

          if (c8 === d2 || c3 === c4) {
            e10 = PixelData.Interpolate(c4, c7)
            e10 = PixelData.Interpolate(c4, e10)
            // e10 = c4
          } else {
            e10 = PixelData.Interpolate(c7, c8)
          }
          //
        } else if (c4 === c8 && c7 === c5) {
          let r = 0
          r += this.getResult(c5, c4, c6, d1)
          r += this.getResult(c5, c4, c3, c1)
          r += this.getResult(c5, c4, d2, d5)
          r += this.getResult(c5, c4, c2, d4)

          if (r > 0) {
            e01 = e10 = c7
            e11 = PixelData.Interpolate(c4, c5)
            e00 = PixelData.Interpolate(c4, c5)
          } else if (r < 0) {
            e11 = e00 = c4
            e10 = PixelData.Interpolate(c4, c5)
            e01 = PixelData.Interpolate(c4, c5)
          } else {
            e11 = e00 = c4
            e01 = e10 = c7
          }
          //
        } else {
          e11 = e00 = PixelData.Interpolate(c7, c5)
          e11 = PixelData.Interpolate(c8, c8, c8, e11)
          e00 = PixelData.Interpolate(c4, c4, c4, e00)

          e10 = e01 = PixelData.Interpolate(c4, c8)
          e10 = PixelData.Interpolate(c7, c7, c7, e10)
          e01 = PixelData.Interpolate(c5, c5, c5, e01)
          // e11 = PixelData.InterpolateWeighted3(c8, c7, c5, 6, 1, 1)
          // e00 = PixelData.InterpolateWeighted3(c4, c7, c5, 6, 1, 1)
          // e10 = PixelData.InterpolateWeighted3(c7, c4, c8, 6, 1, 1)
          // e01 = PixelData.InterpolateWeighted3(c5, c4, c8, 6, 1, 1)
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

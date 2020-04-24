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

// Reference: 2dImageFilter by Hawkynt (http://hawkynt.github.io/2dimagefilter/)
import PixelData from './pixelData'

export default class SNES9x {
  // SNES9x's EPX filter
  static EPXB(imageData: ImageData, scale: number) {
    const p = new PixelData(imageData)
    p.setDistSize(scale)

    for (let y = 0; y < p.height; y++) {
      for (let x = 0; x < p.width; x++) {
        const l = y * p.width + x

        const a = p.getSourcePoint(l, -1, -1)
        const b = p.getSourcePoint(l, -1, 0)
        const c = p.getSourcePoint(l, -1, 1)
        const d = p.getSourcePoint(l, 0, -1)
        const e = p.getSourcePoint(l, 0, 0)
        const f = p.getSourcePoint(l, 0, 1)
        const g = p.getSourcePoint(l, 1, -1)
        const h = p.getSourcePoint(l, 1, 0)
        const i = p.getSourcePoint(l, 1, 1)

        let e00, e01, e10, e11
        e00 = e01 = e10 = e11 = e

        if (d !== f && b !== h) {
          if (
            e === d || e === h || e === f || e === b || // eslint-disable-line prettier/prettier
            ((a !== i || e === g || e === c) && (g !== c || e === a || e === i))
          ) {
            if (b === d && (e !== a || e !== i || b !== c || d !== g)) {
              e00 = b
            }
            if (f === b && (e !== c || e !== g || f !== i || b !== a)) {
              e01 = f
            }
            if (d === h && (e !== g || e !== c || d !== a || h !== i)) {
              e10 = d
            }
            if (h === f && (e !== i || e !== a || h !== g || f !== c)) {
              e11 = h
            }
          }
        }

        const rl = y * p.width * scale ** 2 + x * scale
        p.setDistPoint(rl, 0, 0, e00)
        p.setDistPoint(rl, 0, 1, e01)
        p.setDistPoint(rl, 1, 0, e10)
        p.setDistPoint(rl, 1, 1, e11)
      }
    } // end of for
    return p.outImageData()
  }

  static EPXC(imageData: ImageData, scale: number) {
    const p = new PixelData(imageData)
    p.setDistSize(scale)

    for (let y = 0; y < p.height; y++) {
      for (let x = 0; x < p.width; x++) {
        const l = y * p.width + x

        const a = p.getSourcePoint(l, -1, -1)
        const b = p.getSourcePoint(l, -1, 0)
        const c = p.getSourcePoint(l, -1, 1)
        const d = p.getSourcePoint(l, 0, -1)
        const e = p.getSourcePoint(l, 0, 0)
        const f = p.getSourcePoint(l, 0, 1)
        const g = p.getSourcePoint(l, 1, -1)
        const h = p.getSourcePoint(l, 1, 0)
        const i = p.getSourcePoint(l, 1, 1)

        let e00, e01, e10, e11
        e00 = e01 = e10 = e11 = e

        if (d !== f && b !== h) {
          const eqBD = b === d && (e !== a || e !== i || b !== c || d !== g)
          const eqDH = d === h && (e !== g || e !== c || d !== a || h !== i)
          const eqHF = h === f && (e !== i || e !== a || h !== g || f !== c)
          const eqFB = f === b && (e !== c || e !== g || f !== i || b !== a)

          if (eqBD) e00 = b
          if (eqFB) e01 = f
          if (eqDH) e10 = d
          if (eqHF) e11 = h

          if (
            e === a || e === b || e === c || e === d || // eslint-disable-line prettier/prettier
            e === f || e === g || e === h || e === i // eslint-disable-line prettier/prettier
          ) {
            let dA: number
            if (eqBD && e !== g && eqDH && e !== a) {
              dA = d
            } else if (eqBD && e !== g) {
              dA = d
            } else if (eqDH && e !== a) {
              dA = d
            } else {
              dA = e
            }

            let hB: number
            if (eqDH && e !== i && eqHF && e !== g) {
              hB = h
            } else if (eqDH && e !== i) {
              hB = h
            } else if (eqHF && e !== g) {
              hB = h
            } else {
              hB = e
            }

            let fC: number
            if (eqHF && e !== c && eqFB && e !== i) {
              fC = f
            } else if (eqHF && e !== c) {
              fC = f
            } else if (eqFB && e !== i) {
              fC = f
            } else {
              fC = e
            }

            let bD: number
            if (eqFB && e !== a && eqBD && e !== c) {
              bD = b
            } else if (eqFB && e !== a) {
              bD = b
            } else if (eqBD && e !== c) {
              bD = b
            } else {
              bD = e
            }

            e00 = PixelData.InterpolateWeighted4(e00, bD, dA, e, 5, 1, 1, 1)
            e01 = PixelData.InterpolateWeighted4(e01, fC, bD, e, 5, 1, 1, 1)
            e10 = PixelData.InterpolateWeighted4(e10, dA, hB, e, 5, 1, 1, 1)
            e11 = PixelData.InterpolateWeighted4(e11, hB, fC, e, 5, 1, 1, 1)
            //
          } else {
            e00 = PixelData.InterpolateWeighted2(e, e00, 3, 1)
            e01 = PixelData.InterpolateWeighted2(e, e01, 3, 1)
            e10 = PixelData.InterpolateWeighted2(e, e10, 3, 1)
            e11 = PixelData.InterpolateWeighted2(e, e11, 3, 1)
          }
        }

        const rl = y * p.width * scale ** 2 + x * scale
        p.setDistPoint(rl, 0, 0, e00)
        p.setDistPoint(rl, 0, 1, e01)
        p.setDistPoint(rl, 1, 0, e10)
        p.setDistPoint(rl, 1, 1, e11)
      }
    } // end of for
    return p.outImageData()
  }

  static EPX3(imageData: ImageData, scale: number) {
    const p = new PixelData(imageData)
    p.setDistSize(scale)

    for (let y = 0; y < p.height; y++) {
      for (let x = 0; x < p.width; x++) {
        const l = y * p.width + x

        const a = p.getSourcePoint(l, -1, -1)
        const b = p.getSourcePoint(l, -1, 0)
        const c = p.getSourcePoint(l, -1, 1)
        const d = p.getSourcePoint(l, 0, -1)
        const e = p.getSourcePoint(l, 0, 0)
        const f = p.getSourcePoint(l, 0, 1)
        const g = p.getSourcePoint(l, 1, -1)
        const h = p.getSourcePoint(l, 1, 0)
        const i = p.getSourcePoint(l, 1, 1)

        let e00, e01, e02, e10, e11, e12, e20, e21, e22
        e00 = e01 = e02 = e10 = e11 = e12 = e20 = e21 = e22 = e

        if (d !== f && b !== h) {
          const eqBD = b === d && (e !== a || e !== i || b !== c || d !== g)
          const eqDH = d === h && (e !== g || e !== c || d !== a || h !== i)
          const eqHF = h === f && (e !== i || e !== a || h !== g || f !== c)
          const eqFB = f === b && (e !== c || e !== g || f !== i || b !== a)

          if (
            e === a || e === b || e === c || e === d || // eslint-disable-line prettier/prettier
            e === f || e === g || e === h || e === i // eslint-disable-line prettier/prettier
          ) {
            if (eqFB && e !== a && eqBD && e !== c) {
              e01 = b
            } else if (eqFB && e !== a) {
              e01 = b
            } else if (eqBD && e !== c) {
              e01 = b
            }

            if (eqBD && e !== g && eqDH && e !== a) {
              e10 = d
            } else if (eqBD && e !== g) {
              e10 = d
            } else if (eqDH && e !== a) {
              e10 = d
            }

            if (eqHF && e !== c && eqFB && e !== i) {
              e12 = f
            } else if (eqHF && e !== c) {
              e12 = f
            } else if (eqFB && e !== i) {
              e12 = f
            }

            if (eqDH && e !== i && eqHF && e !== g) {
              e21 = h
            } else if (eqDH && e !== i) {
              e21 = h
            } else if (eqHF && e !== g) {
              e21 = h
            }
          }
          if (eqBD) e00 = b
          if (eqFB) e02 = f
          if (eqDH) e20 = d
          if (eqHF) e22 = h
        }

        const rl = y * p.width * scale ** 2 + x * scale
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
    } // end of for
    return p.outImageData()
  }
}

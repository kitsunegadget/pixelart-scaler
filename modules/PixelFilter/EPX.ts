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

import PixelData from './pixelData'

export default class EPX {
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
        const E = p.getSourcePoint(l, 0, 0)
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
}

/* eslint-disable unicorn/number-literal-case */
import PixelData from './pixelData'
// ImageDataをPixelData型にしてスケール変換するstaticクラス
export default class Imagenize {
  // Eric's Pixel Expansion / Scale Nx Algorithm
  static EPX(imageData: ImageData, scales: number) {
    const p = new PixelData(imageData)
    p.setDistSize(p.data.length, scales)

    for (let j = 0; j < p.height; j++) {
      for (let i = 0; i < p.width; i++) {
        const l = j * p.width + i
        // A  B  C
        // D  E  F
        // G  H  I
        const B = p.getSourcePoint(l, j, i, -1, 0)
        const D = p.getSourcePoint(l, j, i, 0, -1)
        const E = p.data[l]
        const F = p.getSourcePoint(l, j, i, 0, 1)
        const H = p.getSourcePoint(l, j, i, 1, 0)

        const rl = j * p.width * scales ** 2 + i * scales
        let e00 = 0
        let e01 = 0
        let e10 = 0
        let e11 = 0
        if (scales === 2) {
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
        } else if (scales === 3) {
          const A = p.getSourcePoint(l, j, i, -1, -1)
          const C = p.getSourcePoint(l, j, i, -1, 1)
          const G = p.getSourcePoint(l, j, i, 1, -1)
          const I = p.getSourcePoint(l, j, i, 1, 1)
          // out
          let e02
          let e12
          let e20
          let e21
          let e22
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
    }
    return p.outImageData()
  }

  static Eagle(imageData: ImageData, scale: number, mode = 'normal') {
    // Eagle algorithm
    const data = new Uint32Array(imageData.data.buffer)
    const width = imageData.width
    const height = imageData.height

    const rData = new Uint32Array(data.length * scale ** 2)
    for (let j = 0; j < height; j++) {
      for (let i = 0; i < width; i++) {
        const l = j * width + i
        // A  B  C
        // D  E  F
        // G  H  I
        const B = j === 0 ? data[l] : data[l - width]
        const D = i === 0 ? data[l] : data[l - 1]
        const E = data[l]
        const F = i === width - 1 ? data[l] : data[l + 1]
        const H = j === height - 1 ? data[l] : data[l + width]
        const A =
          j === 0 && i === 0
            ? data[l]
            : j === 0
            ? data[l - 1]
            : i === 0
            ? data[l - width]
            : data[l - width - 1]
        const C =
          j === 0 && i === width - 1
            ? data[l]
            : j === 0
            ? data[l + 1]
            : i === width - 1
            ? data[l - width]
            : data[l - width + 1]
        const G =
          j === height - 1 && i === 0
            ? data[l]
            : j === height - 1
            ? data[l - 1]
            : i === 0
            ? data[l + width]
            : data[l + width - 1]
        const I =
          j === height - 1 && i === width - 1
            ? data[l]
            : j === height - 1
            ? data[l + 1]
            : i === width - 1
            ? data[l + width]
            : data[l + width + 1]

        // out
        const rl = j * width * scale ** 2 + i * scale
        if (scale === 2) {
          rData[rl] = rData[rl + 1] = rData[rl + width * scale] = rData[
            rl + width * scale + 1
          ] = E
          if (A === B && A === D) rData[rl] = A
          if (C === B && C === F) rData[rl + 1] = C
          if (G === D && G === H) rData[rl + width * scale] = G
          if (I === F && I === H) rData[rl + width * scale + 1] = I
        } else if (scale === 3 && mode === 'normal') {
          rData[rl] = rData[rl + 1] = rData[rl + 2] = rData[
            rl + width * scale
          ] = rData[rl + width * scale + 1] = rData[
            rl + width * scale + 2
          ] = rData[rl + width * scale * 2] = rData[
            rl + width * scale * 2 + 1
          ] = rData[rl + width * scale * 2 + 2] = E

          if (A === B && A === D) rData[rl] = A
          if (C === B && C === F) rData[rl + 2] = C
          if (G === D && G === H) rData[rl + width * scale * 2] = G
          if (I === F && I === H) rData[rl + width * scale * 2 + 2] = I
          if (A === B && A === D && C === B && C === F) rData[rl + 1] = B
          if (C === B && C === F && I === F && I === H)
            rData[rl + width * scale + 2] = F
          if (G === D && G === H && I === F && I === H)
            rData[rl + width * scale * 2 + 1] = H
          if (A === B && A === D && G === D && G === H)
            rData[rl + width * scale] = D
        } else if (scale === 3 && mode === 'B') {
          rData[rl] = rData[rl + 1] = rData[rl + 2] = rData[
            rl + width * scale
          ] = rData[rl + width * scale + 1] = rData[
            rl + width * scale + 2
          ] = rData[rl + width * scale * 2] = rData[
            rl + width * scale * 2 + 1
          ] = rData[rl + width * scale * 2 + 2] = E
          if (A === B && A === D) rData[rl] = A
          if (C === B && C === F) rData[rl + 2] = C
          if (G === D && G === H) rData[rl + width * scale * 2] = G
          if (I === F && I === H) rData[rl + width * scale * 2 + 2] = I
        }
      }
    }
    const outData = new Uint8ClampedArray(rData.buffer)
    return new ImageData(outData, width * scale)
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

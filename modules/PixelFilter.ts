/* eslint-disable unicorn/number-literal-case */
// import PixelData from './PixelFilter/pixelData'
import EPX from './PixelFilter/EPX'
import SNES9x from './PixelFilter/SNES9x'
import Eagle from './PixelFilter/Eagle'
import Kreed from './PixelFilter/Kreed'
import jsHQx from './js-hqx/hqx'
import XBR from './PixelFilter/xBR'
// import XBRm from './PixelFilter/xBRm'
import XBRZ from './PixelFilter/xBRZ'
// ImageDataをPixelData型にしてスケール変換するstaticクラス
export default class PixelFilter {
  static EPX(ctx: CanvasRenderingContext2D, imageData: ImageData, scale: number) {
    ctx.canvas.width *= scale
    ctx.canvas.height *= scale
    return EPX.EPX(imageData, scale)
  }

  static SNES9x(ctx: CanvasRenderingContext2D, imageData: ImageData, scale: number, mode = 'B') {
    ctx.canvas.width *= scale
    ctx.canvas.height *= scale
    if (mode === 'B') {
      return SNES9x.EPXB(imageData, scale)
    } else if (mode === '3') {
      return SNES9x.EPX3(imageData, scale)
    } else if (mode === 'C') {
      return SNES9x.EPXC(imageData, scale)
    }
    return imageData
  }

  static Eagle(
    ctx: CanvasRenderingContext2D,
    imageData: ImageData,
    scale: number,
    mode = 'normal'
  ) {
    ctx.canvas.width *= scale
    ctx.canvas.height *= scale
    return Eagle.Eagle(imageData, scale, mode)
  }

  static _2xSaI(ctx: CanvasRenderingContext2D, imageData: ImageData, scale: number) {
    ctx.canvas.width *= scale
    ctx.canvas.height *= scale
    return Kreed._2xSaI(imageData, scale)
  }

  static Super2xSaI(ctx: CanvasRenderingContext2D, imageData: ImageData, scale: number) {
    ctx.canvas.width *= scale
    ctx.canvas.height *= scale
    return Kreed.Super2xSaI(imageData, scale)
  }

  static SuperEagle(ctx: CanvasRenderingContext2D, imageData: ImageData, scale: number) {
    ctx.canvas.width *= scale
    ctx.canvas.height *= scale
    return Kreed.SuperEagle(imageData, scale)
  }

  static HQx(ctx: CanvasRenderingContext2D, image: HTMLImageElement, scale: number) {
    ctx.canvas.width *= scale
    ctx.canvas.height *= scale
    return jsHQx(image, scale)
  }

  static XBR(ctx: CanvasRenderingContext2D, imageData: ImageData, scale: number) {
    ctx.canvas.width *= scale
    ctx.canvas.height *= scale
    return XBR.XBR(imageData, scale, true)
  }

  static XBRz(ctx: CanvasRenderingContext2D, imageData: ImageData, scale: number) {
    ctx.canvas.width *= scale
    ctx.canvas.height *= scale
    return XBRZ.XBRZ(imageData, scale)
  }

  // static XBRm(imageData: ImageData, scale: number) {
  //   return XBRm.XBR(imageData, scale)
  // }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static Test(imageData: ImageData, scale: number) {
    // let a = [[1, 2]]
    // let b = [[1,2],[3,4]]
    // console.log(Vector.mul(a, b))
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
      // const avg = Math.round((r + g + b) / 3)
      const avg = r * 0.299 + g * 0.587 + b * 0.114
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

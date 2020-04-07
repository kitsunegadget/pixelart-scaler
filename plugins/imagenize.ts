/* eslint-disable unicorn/number-literal-case */
// canvasとimgから画像を編集
export class Imagenize {
  protected v = new Array(0)
  protected unit: Uint32Array
  constructor(ctx: CanvasRenderingContext2D, img: HTMLImageElement) {
    ctx.imageSmoothingEnabled = false
    // 入力画像とキャンバスサイズを合わせないと
    // ImageDataでcanvasをオーバーした画素が取得出来ない
    ctx.canvas.width = img.width
    ctx.canvas.height = img.height
    ctx.drawImage(img, 0, 0)
    img.style.display = 'none'
    const imageData = ctx.getImageData(0, 0, img.width, img.height)
    const data = imageData.data
    // 速度を上げるためにunit32に変換
    this.unit = new Uint32Array(data.buffer)
  }

  transTwoDimention(data: Uint8ClampedArray, width: number) {
    this.v = []
    // 配列を2次元化
    for (let j = 0; j < data.length; j += width * 4) {
      const u = []
      for (let i = 0; i < width * 4; i += 4) {
        const color = []
        color.push(data[i + j]) // R
        color.push(data[i + j + 1]) // G
        color.push(data[i + j + 2]) // B
        color.push(data[i + j + 3]) // A
        u.push(color)
      }
      this.v.push(u)
    }
  }
}

export default class StandardTransform extends Imagenize {
  invert() {
    return new Promise<Uint8ClampedArray>(resolve => {
      for (let i = 0; i < this.unit.length; i++) {
        const a = this.unit[i] >> 24
        const b = 255 - ((this.unit[i] >> 16) & 0xff)
        const g = 255 - ((this.unit[i] >> 8) & 0xff)
        const r = (255 - this.unit[i]) & 0xff
        const mixed = (a << 24) | (b << 16) | (g << 8) | r
        this.unit[i] = mixed
      }
      resolve(new Uint8ClampedArray(this.unit.buffer))
    })
  }

  grayScale() {
    return new Promise<Uint8ClampedArray>(resolve => {
      for (let i = 0; i < this.unit.length; i++) {
        const a = this.unit[i] >> 24
        const b = (this.unit[i] >> 16) & 0xff
        const g = (this.unit[i] >> 8) & 0xff
        const r = this.unit[i] & 0xff
        const avg = Math.round((r + g + b) / 3)
        const mixed = (a << 24) | (avg << 16) | (avg << 8) | avg
        this.unit[i] = mixed
      }
      resolve(new Uint8ClampedArray(this.unit.buffer))
    })
  }
}

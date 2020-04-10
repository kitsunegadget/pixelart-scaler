// 変換の見通しを良くするためのpixelDataクラス
interface PixelData {
  data: Uint32Array
  width: number
  height: number
  outImageData(): ImageData
}

class PixelData implements PixelData {
  data!: Uint32Array
  width!: number
  height!: number
  private dist!: Uint32Array
  private targetScale!: number

  constructor(imageData: ImageData)
  constructor(length: number, width: number)
  constructor(obj: any, width?: number) {
    if (obj instanceof ImageData) {
      this.data = new Uint32Array(obj.data.buffer)
      this.width = obj.width
      this.height = obj.height
    } else if (typeof obj === 'number') {
      if (typeof width !== 'undefined' && typeof width !== null) {
        this.data = new Uint32Array(obj)
        this. width = width
      }
    }
  }
  
  setDistSize(origLength: number, scale: number) {
    this.dist = new Uint32Array(origLength * scale ** 2)
    this.targetScale = scale
  }

  getSourcePoint(x: number, j: number, i: number, v: number, u: number): number {
    if ((j === 0 && i === 0) 
      || (j === 0 && i === this.width - 1)
      || (j === this.height - 1 && i === 0) 
      || (j === this.height - 1 && i === this.width - 1)) {

      return this.data[x]

    } else if (i === 0 || i === this.width - 1){
      return this.data[x + this.width * v]

    } else if (j === 0 || j === this.height - 1) {
      return this.data[x + u]

    } else {
      return this.data[x + this.width * v + u]
    }
  }

  setDistPoint(topleft: number, v: number, u: number, d: number): void {
    this.dist[topleft + this.width * this.targetScale * v + u] = d
  }

  outImageData(): ImageData {
    const outData = new Uint8ClampedArray(this.dist.buffer)
    return new ImageData(outData, this.width * this.targetScale)
  }
}

export default PixelData

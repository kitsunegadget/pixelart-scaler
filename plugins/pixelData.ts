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

  getSourcePoint(x: number, v: number, u: number): number {
    if (this.data[x + this.width * v + u] === undefined) {
      let line_u = u
      while (line_u !== 0) {
        line_u += line_u > 0 ? -1 : 1 // 方向とは逆向きに1減らす
        if (this.data[x + this.width * v + line_u] !== undefined) {
          return this.data[x + this.width * v + line_u]
        }
      }
      let line_v = v
      while (line_v !== 0) {
        line_v += line_v > 0 ? -1 : 1
        if (this.data[x + this.width * line_v + u] !== undefined) {
          return this.data[x + this.width * line_v + u]
        }
      }
      // 存在しなければvとuを1つ戻して再帰検索
      v += v === 0 ? 0 : v > 0 ? -1 : 1
      u += u === 0 ? 0 : u > 0 ? -1 : 1
      if (u === 0 && v === 0) {
        // どちらも0の場合は終了
        return this.data[x]
      }
      return this.getSourcePoint(x, v, u)
    } else {
      return this.data[x + this.width * v + u]
    }
  }

  setDistPoint(topleft: number, v: number, u: number, value: number): void {
    this.dist[topleft + this.width * this.targetScale * v + u] = value
  }

  outImageData(): ImageData {
    const outData = new Uint8ClampedArray(this.dist.buffer)
    return new ImageData(outData, this.width * this.targetScale)
  }

  static InterPolate(A: number, B: number) {
    if (A !== B) {
      const A_a = A >> 24
      const A_b = (A >> 16) & 0xff
      const A_g = (A >> 8) & 0xff
      const A_r = A & 0xff
      const B_a = B >> 24
      const B_b = (B >> 16) & 0xff
      const B_g = (B >> 8) & 0xff
      const B_r = B & 0xff
      return (A_a + B_a) >> 1 || (A_b + B_b) >> 1 || (A_g + B_g) >> 1 || (A_r + B_r) >> 1
    } else {
      return A
    }
  }
}

export default PixelData

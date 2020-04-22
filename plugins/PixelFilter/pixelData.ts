// Pixel Art Scaler: jsPixelFilter
//

// 変換の見通しを良くするためのpixelDataクラス
interface PixelData {
  width: number
  height: number
  outImageData(): ImageData
}

class PixelData implements PixelData {
  private data!: Uint32Array
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
        this.width = width
      }
    }
  }
  
  setDistSize(scale: number) {
    this.dist = new Uint32Array(this.data.length * scale ** 2)
    this.targetScale = scale
  }

  getSourcePoint(x: number, v: number, u: number): number {
    if ((x + u) < this.width * Math.floor(x / this.width) 
      || (x + u) > this.width * Math.floor((x / this.width) + 1) - 1) {
      // データは横方向に連続なので左右ボーダーを超えるときはuを1つ戻す
      u += u === 0 ? 0 : u > 0 ? -1 : 1
    }

    if ((x + this.width * v + u) < 0 || (x + this.width * v + u) >= this.data.length) {
      // データ範囲外
      v += v === 0 ? 0 : v > 0 ? -1 : 1
      if (u === 0 && v === 0) {
        return this.data[x + this.width * v + u]
      }
      return this.getSourcePoint(x, v, u)
      //
    } else {
      return this.data[x + this.width * v + u]
    }
  }

  setDistPoint(topleft: number, v: number, u: number, value: number): void {
    this.dist[topleft + this.width * this.targetScale * v + u] = value
  }

  getDistPoint(trg: number) {
    return this.dist[trg]
  }

  outImageData(): ImageData {
    const outData = new Uint8ClampedArray(this.dist.buffer)
    console.log(this.targetScale)
    return new ImageData(outData, this.width * this.targetScale)
  }

  // ピクセルXのカラー取得
  static getR(X: number) {
    return X & 0xff
  }
  static getG(X: number) {
    return (X >> 8) & 0xff
  }
  static getB(X: number) {
    return (X >> 16) & 0xff
  }
  static getA(X: number) {
    return X >> 24
  }

  // ピクセル色補完
  static Interpolate(A: number, B: number, C?: number, D?: number): number {
    const A_a = A >> 24
    const A_b = (A >> 16) & 0xff
    const A_g = (A >> 8) & 0xff
    const A_r = A & 0xff
    const B_a = B >> 24
    const B_b = (B >> 16) & 0xff
    const B_g = (B >> 8) & 0xff
    const B_r = B & 0xff

    if (C !== undefined && D !== undefined) {
      const C_a = C >> 24
      const C_b = (C >> 16) & 0xff
      const C_g = (C >> 8) & 0xff
      const C_r = C & 0xff
      const D_a = D >> 24
      const D_b = (D >> 16) & 0xff
      const D_g = (D >> 8) & 0xff
      const D_r = D & 0xff

      return ((A_a + B_a + C_a + D_a) >> 2) << 24 
          | ((A_b + B_b + C_b + D_b) >> 2) << 16
          | ((A_g + B_g + C_g + D_g) >> 2) << 8 
          | ((A_r + B_r + C_r + D_r) >> 2)
      //
    } else if (C !== undefined && D === undefined) {
      const C_a = C >> 24
      const C_b = (C >> 16) & 0xff
      const C_g = (C >> 8) & 0xff
      const C_r = C & 0xff

      return Math.floor((A_a + B_a + C_a) / 3) << 24 
          | Math.floor((A_b + B_b + C_b) / 3) << 16
          | Math.floor((A_g + B_g + C_g) / 3) << 8 
          | Math.floor((A_r + B_r + C_r) / 3)
      //
    } else {
      return ((A_a + B_a) >> 1) << 24 
          | ((A_b + B_b) >> 1) << 16 
          | ((A_g + B_g) >> 1) << 8 
          | ((A_r + B_r) >> 1)
    }
  }

  static InterpolateWeighted2(A: number, B: number, f1: number, f2: number) {
    let total = (f1 + f2)

    const A_a = A >> 24
    const A_b = (A >> 16) & 0xff
    const A_g = (A >> 8) & 0xff
    const A_r = A & 0xff
    const B_a = B >> 24
    const B_b = (B >> 16) & 0xff
    const B_g = (B >> 8) & 0xff
    const B_r = B & 0xff

    return Math.floor((A_a * f1 + B_a * f2) / total) << 24 
        | Math.floor((A_b * f1 + B_b * f2) / total) << 16 
        | Math.floor((A_g * f1 + B_g * f2) / total) << 8 
        | Math.floor((A_r * f1 + B_r * f2) / total)
  }

  static InterpolateWeighted3(A: number, B: number, C: number, f1: number, f2: number, f3: number) {
    let total = (f1 + f2 + f3)

    const A_a = A >> 24
    const A_b = (A >> 16) & 0xff
    const A_g = (A >> 8) & 0xff
    const A_r = A & 0xff
    const B_a = B >> 24
    const B_b = (B >> 16) & 0xff
    const B_g = (B >> 8) & 0xff
    const B_r = B & 0xff
    const C_a = C >> 24
    const C_b = (C >> 16) & 0xff
    const C_g = (C >> 8) & 0xff
    const C_r = C & 0xff

    return Math.floor((A_a * f1 + B_a * f2 + C_a * f3) / total) << 24 
        | Math.floor((A_b * f1 + B_b * f2 + C_b * f3) / total) << 16 
        | Math.floor((A_g * f1 + B_g * f2 + C_g * f3) / total) << 8 
        | Math.floor((A_r * f1 + B_r * f2 + C_r * f3) / total)
  }

  static InterpolateWeighted4(
    A: number, B: number, C: number, D: number, 
    w1: number, w2: number, w3: number, w4: number
  ) {
    let total = (w1 + w2 + w3 + w4)

    const A_a = A >> 24
    const A_b = (A >> 16) & 0xff
    const A_g = (A >> 8) & 0xff
    const A_r = A & 0xff
    const B_a = B >> 24
    const B_b = (B >> 16) & 0xff
    const B_g = (B >> 8) & 0xff
    const B_r = B & 0xff
    const C_a = C >> 24
    const C_b = (C >> 16) & 0xff
    const C_g = (C >> 8) & 0xff
    const C_r = C & 0xff
    const D_a = D >> 24
    const D_b = (D >> 16) & 0xff
    const D_g = (D >> 8) & 0xff
    const D_r = D & 0xff

    return Math.floor((A_a * w1 + B_a * w2 + C_a * w3 + D_a * w4) / total) << 24 
        | Math.floor((A_b * w1 + B_b * w2 + C_b * w3 + D_b * w4) / total) << 16 
        | Math.floor((A_g * w1 + B_g * w2 + C_g * w3 + D_g * w4) / total) << 8 
        | Math.floor((A_r * w1 + B_r * w2 + C_r * w3 + D_r * w4) / total)
  }
}

export default PixelData

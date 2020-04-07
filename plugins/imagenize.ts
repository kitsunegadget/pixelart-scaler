// ImageDataを2次元配列として扱えるように変換
export class Imagenize {
  protected v = new Array(0)
  constructor(data: Uint8ClampedArray, width: number) {
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
    return new Promise<any[]>(resolve => {
      const array = []
      for (let j = 0; j < this.v.length; j++) {
        for (let i = 0; i < this.v[j].length; i++) {
          array.push(255 - this.v[j][i][0]) // R
          array.push(255 - this.v[j][i][1]) // G
          array.push(255 - this.v[j][i][2]) // B
          array.push(this.v[j][i][3]) // A
        }
      }
      resolve([Uint8ClampedArray.from(array), this.v[0].length])
    })
  }

  grayScale() {
    return new Promise<any[]>(resolve => {
      const array = []
      for (let j = 0; j < this.v.length; j++) {
        for (let i = 0; i < this.v[j].length; i++) {
          const avg = (this.v[j][i][0] + this.v[j][i][1] + this.v[j][i][2]) / 3
          array.push(avg)
          array.push(avg)
          array.push(avg)
          array.push(this.v[j][i][3])
        }
      }
      resolve([Uint8ClampedArray.from(array), this.v[0].length])
    })
  }
}

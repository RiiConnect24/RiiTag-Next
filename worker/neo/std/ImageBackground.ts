export default class ImageBackground {
  img: string
  x: number
  y: number
  width: number
  height: number

  constructor (img, x, y, width, height) {
    this.img = img
    this.x = x
    this.y = y
    this.width = width
    this.height = height
  }
}

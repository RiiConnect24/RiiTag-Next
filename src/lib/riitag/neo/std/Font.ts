export default class Font {
  name: string
  size: number
  style: string
  color: string
  force: boolean

  constructor (name, size, style, color, force) {
    this.name = name
    this.size = size
    this.style = style
    this.color = color
    this.force = force
  }
}

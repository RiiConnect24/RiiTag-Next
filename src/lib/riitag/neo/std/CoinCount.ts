import Font from './Font'
import ModuleBase from '../ModuleBase'
import Canvas, { CanvasTextAlign } from 'canvas'
import { drawText } from '../Utils'

export default class CoinCount extends ModuleBase {
  font: Font
  align: CanvasTextAlign
  x: number
  y: number
  max: number

  constructor (overlay) {
    super()

    this.font = new Font(
      overlay.coin_count.font.name,
      overlay.coin_count.font.size,
      overlay.coin_count.font.style,
      overlay.coin_count.font.color,
      overlay.coin_count.font.force
    )

    if (overlay.coin_count.align) this.align = overlay.coin_count.align

    this.x = overlay.coin_count.x
    this.y = overlay.coin_count.y
    this.max = overlay.coin_count.max
  }

  render (ctx: Canvas.CanvasRenderingContext2D, user) {
    if (user.font !== 'default' && this.font.force === false) { this.font.name = user.font }

    drawText(ctx, this.font, user.coins > this.max ? this.max : user.coins, this.x, this.y, this.align)
  }
}

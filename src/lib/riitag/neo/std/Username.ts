import Font from './Font'
import ModuleBase from '../ModuleBase'
import Canvas from 'canvas'
import { drawText } from '../Utils'
import logger from '@/lib/logger'

export default class Username extends ModuleBase {
  font: Font
  align: Canvas.CanvasTextAlign
  x: number
  y: number

  constructor (overlay) {
    super()

    this.font = new Font(
      overlay.username.font.name,
      overlay.username.font.size,
      overlay.username.font.style,
      overlay.username.font.color,
      overlay.username.font.force
    )

    if (overlay.username.align) this.align = overlay.username.align

    this.x = overlay.username.x
    this.y = overlay.username.y
  }

  render (ctx: Canvas.CanvasRenderingContext2D, user) {
    if (user.font !== 'default' && this.font.force === false) this.font.name = user.font

    logger.info(`User Font: ${user.font}`)
    logger.info(`Font Info: ${this.font.name} ${this.font.size} ${this.font.style} ${this.font.color} ${this.font.force}`)
    drawText(ctx, this.font, user.name_on_riitag, this.x, this.y, this.align)
  }
}

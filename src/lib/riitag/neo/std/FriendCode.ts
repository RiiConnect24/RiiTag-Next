import Font from './Font'
import ModuleBase from '../ModuleBase'
import Canvas, { CanvasTextAlign } from 'canvas'
import { drawText } from '../Utils'
import { user } from '@prisma/client'

export default class FriendCode extends ModuleBase {
  font: Font
  align: CanvasTextAlign
  x: number
  y: number

  constructor (overlay) {
    super()

    this.font = new Font(
      overlay.friend_code.font.name,
      overlay.friend_code.font.size,
      overlay.friend_code.font.style,
      overlay.friend_code.font.color,
      overlay.friend_code.font.force
    )

    if (overlay.friend_code.align) this.align = overlay.friend_code.align

    this.x = overlay.friend_code.x
    this.y = overlay.friend_code.y
  }

  render (ctx: Canvas.CanvasRenderingContext2D, user: user): void {
    if (user.font !== 'default' && this.font.force === false) this.font.name = user.font

    drawText(ctx, this.font, user.comment || '', this.x, this.y, this.align)
  }
}

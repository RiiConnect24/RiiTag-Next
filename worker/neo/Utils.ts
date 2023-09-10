import Font from './std/Font'
import Canvas from 'canvas'

export function drawText (ctx: Canvas.CanvasRenderingContext2D, font: Font, text: string, x: number, y: number, align?: Canvas.CanvasTextAlign): void {
  ctx.font = `${font.style} ${font.size}px ${font.name}`

  ctx.fillStyle = font.color
  ctx.textAlign = align || 'start'
  ctx.fillText(text, font.size + x, font.size + y)
}

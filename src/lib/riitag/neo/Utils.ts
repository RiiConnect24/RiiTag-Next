import logger from '@/lib/logger'
import Font from './std/Font'
import Canvas from 'canvas'

export function drawText (ctx: Canvas.CanvasRenderingContext2D, font: Font, text: string, x: number, y: number, align?: Canvas.CanvasTextAlign) {
  ctx.font = `${font.style} ${font.size}px ${font.name}`
  logger.info(`Font info: ${ctx.font}`)
  ctx.fillStyle = font.color
  ctx.textAlign = align || 'start'
  ctx.fillText(text, font.size + x, font.size + y)
}

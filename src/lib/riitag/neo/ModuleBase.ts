import logger from '@/lib/logger'
import Canvas from 'canvas'

export default class ModuleBase {
  render (ctx: Canvas.CanvasRenderingContext2D, user) {
    logger.error('ModuleBase.render() not implemented')
  }
}

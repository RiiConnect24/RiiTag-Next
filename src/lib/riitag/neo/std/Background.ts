import { PUBLIC } from '@/lib/constants/filePaths'
import path from 'node:path'
import Canvas from 'canvas'
import fs from 'node:fs'
import ModuleBase from '../ModuleBase'
import logger from '@/lib/logger'

export default class Background extends ModuleBase {
  render (ctx: Canvas.CanvasRenderingContext2D, user) {
    const bgPath = path.resolve(PUBLIC.BACKGROUND, user.background)

    if (!fs.existsSync(bgPath)) {
      logger.error(`Background image does not exist: ${bgPath}`)
    }

    Canvas.loadImage(bgPath).then((image) => {
      ctx.drawImage(image, 0, 0)
    })
  }
}

import { PUBLIC } from '../../../src/lib/constants/filePaths'
import path from 'node:path'
import Canvas from 'canvas'
import fs from 'node:fs'
import ModuleBase from '../ModuleBase'

export default class Background extends ModuleBase {
  async render (ctx: Canvas.CanvasRenderingContext2D, user: any): Promise<void> {
    const bgPath = path.resolve(PUBLIC.BACKGROUND, user.background)

    if (!fs.existsSync(bgPath)) {
      return
    }

    const bg = await Canvas.loadImage(bgPath)
    ctx.drawImage(bg, 0, 0)
  }
}

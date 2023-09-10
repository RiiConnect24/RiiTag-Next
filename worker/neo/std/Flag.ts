import ModuleBase from '../ModuleBase'
import Canvas from 'canvas'
import path from 'node:path'
import fs from 'node:fs'
import { PUBLIC } from '../../../src/lib/constants/filePaths'
import { user } from '@prisma/client'

export default class Flag extends ModuleBase {
  x: number
  y: number

  constructor (overlay) {
    super()

    this.x = overlay.flag.x
    this.y = overlay.flag.y
  }

  async render (ctx: Canvas.CanvasRenderingContext2D, user: user): Promise<void> {
    const filepath = path.resolve(PUBLIC.FLAG, `${user.flag}.png`)

    if (!fs.existsSync(filepath)) {
      return
    }

    const flag = await Canvas.loadImage(filepath)
    ctx.drawImage(flag, this.x, this.y, 72, 72)
  }
}

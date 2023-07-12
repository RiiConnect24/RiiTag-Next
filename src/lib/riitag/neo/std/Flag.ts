import logger from '@/lib/logger'
import ModuleBase from '../ModuleBase'
import Canvas from 'canvas'
import path from 'node:path'
import fs from 'node:fs'
import { PUBLIC } from '@/lib/constants/filePaths'

export default class Flag extends ModuleBase {
  x: number
  y: number

  constructor (overlay) {
    super()

    this.x = overlay.flag.x
    this.y = overlay.flag.y
  }

  render (ctx: Canvas.CanvasRenderingContext2D, user) {
    const filepath = path.resolve(PUBLIC.FLAG, `${user.flag}.png`)

    if (!fs.existsSync(filepath)) {
      logger.error(`Flag ${user.flag} not found`)
      return
    }

    Canvas.loadImage(filepath).then((flag) => {
      ctx.drawImage(flag, this.x, this.y, 72, 72)
    })
  }
}

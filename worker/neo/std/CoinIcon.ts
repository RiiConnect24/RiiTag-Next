import ModuleBase from '../ModuleBase'
import { PUBLIC } from '../../../src/lib/constants/filePaths'
import path from 'node:path'
import Canvas from 'canvas'
import fs from 'node:fs'
import { user } from '@prisma/client'

export default class CoinIcon extends ModuleBase {
  defaultImg: string
  x: number
  y: number

  constructor (overlay) {
    super()

    this.defaultImg = overlay.coin_icon.img
    this.x = overlay.coin_icon.x
    this.y = overlay.coin_icon.y
  }

  async render (ctx: Canvas.CanvasRenderingContext2D, user: user): Promise<void> {
    const coinImage = user.coin === 'default' ? this.defaultImg : user.coin
    const coinPath = path.resolve(PUBLIC.COIN, `${coinImage}.png`)

    if (!fs.existsSync(coinPath)) {
      return
    }

    const coin = await Canvas.loadImage(coinPath)
    ctx.drawImage(coin, this.x, this.y)
  }
}

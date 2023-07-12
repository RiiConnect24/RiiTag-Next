import ModuleBase from '../ModuleBase'
import { PUBLIC } from '@/lib/constants/filePaths'
import path from 'node:path'
import Canvas from 'canvas'
import fs from 'node:fs'
import logger from '@/lib/logger'

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

  render (ctx: Canvas.CanvasRenderingContext2D, user) {
    const coinImage = user.coin === 'default' ? this.defaultImg : user.coin
    const coinPath = path.resolve(PUBLIC.COIN, `${coinImage}.png`)

    if (!fs.existsSync(coinPath)) {
      logger.error(`Coin image does not exist: ${coinPath}`)
    }

    Canvas.loadImage(coinPath).then((image) => {
      ctx.drawImage(image, this.x, this.y)
    })
  }
}

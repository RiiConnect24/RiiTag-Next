import logger from '@/lib/logger'
import ModuleBase from '../ModuleBase'
import ImageBackground from './ImageBackground'
import Canvas from 'canvas'
import path from 'node:path'
import { CACHE, PUBLIC } from '@/lib/constants/filePaths'
import { saveFile } from '@/lib/utils/fileUtils'
import { user } from '@prisma/client'

export default class Avatar extends ModuleBase {
  enabled: boolean
  x: number
  y: number
  size: number
  background: ImageBackground

  constructor (overlay) {
    super()

    if (!overlay.avatar) {
      this.enabled = false
      return
    }

    this.enabled = true

    this.x = overlay.avatar.x
    this.y = overlay.avatar.y
    this.size = overlay.avatar.size

    if (overlay.avatar.background) {
      this.background = new ImageBackground(overlay.avatar.background.img, overlay.avatar.background.x, overlay.avatar.background.y, overlay.avatar.background.width, overlay.avatar.background.height)
    }
  }

  async getAvatar (username: string, image: string): Promise<Canvas.Image> {
    const filepath = path.resolve(CACHE.AVATAR, `${username}.png`)
    const response = await fetch(image)

    if (!response.ok) {
      logger.error(`Failed to fetch avatar for ${username}: ${response.statusText}`)
      return
    }

    await saveFile(filepath, response.body)
    return Canvas.loadImage(filepath)
  }

  async render (ctx: Canvas.CanvasRenderingContext2D, user: user): Promise<void> {
    logger.info(`Rendering avatar for ${user.username}`)

    if (!(user.show_avatar && this.enabled)) return

    if (this.background) {
      const background = await Canvas.loadImage(path.resolve(PUBLIC.OVERLAY_IMAGE, this.background.img))
      logger.info('Background loaded')
      ctx.drawImage(background, this.background.x, this.background.y, this.background.width, this.background.height)
      logger.info('Avatar finished rendering')
    }

    const avatar = await this.getAvatar(user.username, user.image)
    ctx.drawImage(avatar, this.x, this.y, this.size, this.size)
  }
}

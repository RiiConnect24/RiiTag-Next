import ModuleBase from '../ModuleBase'
import ImageBackground from './ImageBackground'
import Canvas from 'canvas'
import path from 'node:path'
import { CACHE, PUBLIC } from '../../../src/lib/constants/filePaths'
import { writeFileSync } from 'node:fs'
import { user } from '@prisma/client'
import axios from 'axios'

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
    const response = await axios.get(image, { responseType: 'arraybuffer', validateStatus: () => true })

    if (response.status !== 200) {
      return
    }

    const fileData = Buffer.from(response.data, 'binary')
    await writeFileSync(filepath, fileData)
    return Canvas.loadImage(filepath)
  }

  async render (ctx: Canvas.CanvasRenderingContext2D, user: user): Promise<void> {
    if (!(user.show_avatar && this.enabled)) return

    if (this.background) {
      const background = await Canvas.loadImage(path.resolve(PUBLIC.OVERLAY_IMAGE, this.background.img))
      ctx.drawImage(background, this.background.x, this.background.y, this.background.width, this.background.height)
    }

    const avatar = await this.getAvatar(user.username, user.image)
    ctx.drawImage(avatar, this.x, this.y, this.size, this.size)
  }
}

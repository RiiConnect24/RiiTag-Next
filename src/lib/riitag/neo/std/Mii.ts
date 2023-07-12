import logger from '@/lib/logger'
import ModuleBase from '../ModuleBase'
import ImageBackground from './ImageBackground'
import Canvas from 'canvas'
import { CACHE, PUBLIC } from '@/lib/constants/filePaths'
import path from 'node:path'
import fs from 'node:fs'
import { isBlank } from '@/lib/utils/utils'
import { getMiiFromHexData, getMiiHexDataFromCMOC } from '../../mii'
import { saveFile } from '@/lib/utils/fileUtils'

export default class Mii extends ModuleBase {
  enabled: boolean
  x: number
  y: number
  size: number
  background: ImageBackground

  constructor (overlay) {
    super()

    if (!overlay.mii) { this.enabled = false; return }

    this.enabled = true
    this.x = overlay.mii.x
    this.y = overlay.mii.y
    this.size = overlay.mii.size

    if (overlay.mii.background) {
      this.background = new ImageBackground(overlay.mii.background.img, overlay.mii.background.x, overlay.mii.background.y, overlay.mii.background.width, overlay.mii.background.height)
    }
  }

  async getMii (user) {
    let miiPath = PUBLIC.BLANK_MII

    switch (user.mii_type) {
      case 'guest':
        if (user.mii_data !== null) {
          miiPath = path.resolve(PUBLIC.GUEST_MIIS, `${user.mii_data}.png`)
        }
        return await Canvas.loadImage(miiPath)

      case 'cmoc':
        miiPath = path.resolve(CACHE.CMOC_MIIS, `${user.cmoc_entry_no}.png`)

        if (fs.existsSync(miiPath)) {
          return await Canvas.loadImage(miiPath)
        }

        try {
          let miiHexData = user.mii_data

          if (isBlank(miiHexData)) {
            miiHexData = await getMiiHexDataFromCMOC(user.cmoc_entry_no)
          }

          const mii = await getMiiFromHexData(miiHexData)
          await saveFile(miiPath, mii)
        } catch {
          miiPath = PUBLIC.BLANK_MII
        }

        return await Canvas.loadImage(miiPath)

      case 'upload':
        miiPath = path.resolve(CACHE.MIIS, `${user.username}.png`)

        if (!fs.existsSync(miiPath)) {
          try {
            const mii = await getMiiFromHexData(user.mii_data)
            await saveFile(miiPath, mii)
          } catch {
            miiPath = PUBLIC.BLANK_MII
          }
        }
        return await Canvas.loadImage(miiPath)

      default:
        logger.error(`Unknown mii type: ${user.mii_type}`)
        return await Canvas.loadImage(miiPath)
    }
  }

  async render (ctx: Canvas.CanvasRenderingContext2D, user) {
    if (!user.show_mii) { return }
    if (!this.enabled) { return }

    const mii = await this.getMii(user)

    if (this.background) {
      const background = await Canvas.loadImage(path.resolve(PUBLIC.OVERLAY_IMAGE, this.background.img))
      ctx.drawImage(background, this.background.x, this.background.y, this.background.width, this.background.height)
      ctx.drawImage(mii, this.x, this.y, this.size, this.size)
    } else {
      ctx.drawImage(mii, this.x, this.y, this.size, this.size)
    }
  }
}

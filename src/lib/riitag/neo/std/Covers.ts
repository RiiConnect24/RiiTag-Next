import prisma from '@/lib/db'
import CONSOLE from '@/lib/constants/console'
import { CACHE, DATA } from '@/lib/constants/filePaths'
import path from 'node:path'
import COVER_TYPE from '@/lib/constants/coverType'
import fs from 'node:fs'
import { saveFile } from '@/lib/utils/fileUtils'
import Canvas from 'canvas'
import ModuleBase from '../ModuleBase'
import { user } from '@prisma/client'

const xml2js = require('xml2js')

export default class Covers extends ModuleBase {
  x: number
  y: number
  width: number
  height: number
  increment_x: number
  increment_y: number
  max: number

  constructor (overlay) {
    super()

    this.x = overlay.covers.x
    this.y = overlay.covers.y
    this.width = overlay.covers.width
    this.height = overlay.covers.height
    this.increment_x = overlay.covers.increment_x
    this.increment_y = overlay.covers.increment_y
    this.max = overlay.covers.max
  }

  findRegionByGameId (gameId, games) {
    let regions = null
    games.forEach(game => {
      if (game.id[0] === gameId) {
        regions = game.region[0].split(',').map(region => region.trim())
      }
    })
    return regions // Ex. NA,EU,JA
  }

  getBoxGameRegion (gameId) {
    switch (gameId.charAt(3)) {
      case 'P': {
        return 'EN'
      }
      case 'E': {
        return 'US'
      }
      case 'J': {
        return 'JA'
      }
      case 'K': {
        return 'KO'
      }
      case 'W': {
        return 'ZH'
      }
      default: {
        return 'EN'
      }
    }
  }

  async getSwitchGameRegion (gameId) {
    try {
      const data = await fs.promises.readFile(
        path.resolve(DATA.IDS, 'switchtdb.xml'),
        'utf8'
      )

      const result: any = await new Promise((resolve, reject) => {
        xml2js.parseString(data, (parseError, parseResult) => {
          if (parseError) {
            reject(parseError)
          } else {
            resolve(parseResult)
          }
        })
      })

      const games = result.datafile.game
      const region = this.findRegionByGameId(gameId, games)

      // Slight exceptions for some god damn reason
      if (region === 'EUR' || region === 'ALL') {
        return 'EN'
      }

      return region.slice(0, 2)
    } catch (error) {
      console.error(error)
      return null
    }
  }

  async getGameRegion (console, gameId) {
    switch (console) {
      case CONSOLE.WII:
      case CONSOLE.WII_U:
      case CONSOLE.THREEDS: {
        return this.getBoxGameRegion(gameId)
      }
      case CONSOLE.SWITCH: {
        return await this.getSwitchGameRegion(gameId)
      }
      default: {
        throw new Error(`Unknown console ${console}`)
      }
    }
  }

  getCoverURL (console, type, region, gameId, extention) {
    return `https://art.gametdb.com/${console}/${type}/${region}/${gameId}.${extention}`
  }

  async downloadCover (console, type, gameId, region) {
    // Determine if a cache already exists, if so, return it.
    const filepath = path.resolve(CACHE.COVER, console, type, region, `${gameId}.${this.getExtension(type, console)}`)
    if (fs.existsSync(filepath)) return filepath

    // Fetch the the cover directly from the coverDB.
    const response = await fetch(this.getCoverURL(console, type, region, gameId, this.getExtension(type, console)))
    if (!response.ok) throw new Error(`Failed to download cover for ${gameId}`)

    // Save to a cache and return it.
    await saveFile(filepath, await response.body)
    return filepath
  }

  // Wii uses the JPG format for covers so make sure to have an exception for that.
  getExtension (coverType, gameConsole) {
    if (gameConsole !== CONSOLE.WII && coverType === COVER_TYPE.COVER) return 'jpg'
    return 'png'
  }

  async getCover (console, type, gameId, region) {
    switch (console) {
      case CONSOLE.THREEDS:
      case CONSOLE.SWITCH:
        switch (type) {
          case COVER_TYPE.COVER_3D: {
            type = COVER_TYPE.BOX
            break
          }
          case COVER_TYPE.DISC: {
            type = COVER_TYPE.CART
            break
          }
          default: {
            break
          }
        }
        break
      default: {
        break
      }
    }

    const gameRegion = await this.getGameRegion(console, gameId)

    if (region === gameRegion) {
      try {
        return await this.downloadCover(console, type, gameId, region)
      } catch {
        try {
          return await this.downloadCover(console, type, gameId, 'EN')
        } catch {
          return this.downloadCover(console, type, gameId, 'US')
        }
      }
    }

    try {
      return await this.downloadCover(console, type, gameId, gameRegion)
    } catch {
      try {
        return await this.downloadCover(console, type, gameId, this.getGameRegion(console, gameId))
      } catch {
        try {
          return await this.downloadCover(console, type, gameId, 'EN')
        } catch {
          return this.downloadCover(console, type, gameId, 'US')
        }
      }
    }
  }

  async getAllUserCovers (user: user): Promise<string[]> {
    const coverType = user.cover_type
    const playlog = await prisma.playlog.findMany({
      where: {
        user: {
          id: user.id
        }
      },
      select: {
        game: {
          select: {
            game_id: true,
            console: true
          }
        }
      },
      orderBy: {
        played_on: 'desc'
      },
      distinct: ['game_pk'],
      take: this.max * 2
    })

    if (playlog.length > 0) {
      // const coverDownloads = playlog.map((logEntry) => {
      //     this.getCover(
      //         logEntry.game.console,
      //         coverType,
      //         logEntry.game.game_id,
      //         user.cover_region
      //     )
      // })

      // const coverPaths = await Promise.allSettled(coverDownloads).then((results) => {
      //     results
      //         .filter((result) => result.status === 'fulfilled')
      //         .map((result: any) => result.value)
      //         .reverse()
      //         .slice(-this.max);
      // });

      const coverPaths = []

      for (const logEntry of playlog) {
        coverPaths.push(this.getCover(
          logEntry.game.console,
          coverType,
          logEntry.game.game_id,
          user.cover_region
        ))
      }

      return await Promise.all(coverPaths)
    }

    return []
  }

  async render (context: Canvas.CanvasRenderingContext2D, user) {
    this.renderCovers(await this.getAllUserCovers(user), context)
  };

  renderCovers (coverPaths: string[], context: Canvas.CanvasRenderingContext2D) {
    const object = this

    // Load the final cover with the y-offset applied
    // Y-offset is arbitrarily defined based on relative scale of box/cover.
    function loadFinalCover (xOffset: number, yOffset: number, coverPath: string, width: number, height: number) {
      Canvas.loadImage(coverPath).then((image) => {
        context.drawImage(image, object.x + xOffset, (object.y + yOffset))
      })
    }

    let currentY: number = 0
    let currentX: number = 0
    let yOffset: number = 0

    coverPaths.forEach((coverPath) => {
      const coverPathSegments = coverPath.split(path.sep)
      const coverType = coverPathSegments[coverPathSegments.length - 4]
      console.log(coverPathSegments)

      let gameConsole

      switch (gameConsole) {
        case CONSOLE.THREEDS: { // 3DS has tiny boxes and requires special conditions
          // Add specific Y offsets to Cover_3d to allow it to render inline with the other covers despite being different sizes.
          if (coverType === COVER_TYPE.COVER_3D) { yOffset = 15 } else if (coverType === COVER_TYPE.COVER) { yOffset = 80 }

          switch (coverType) {
            case COVER_TYPE.DISC:
              loadFinalCover(currentX, currentY + yOffset, coverPath, 160, 160)
              break

            case COVER_TYPE.COVER_3D:
              loadFinalCover(currentX, currentY + yOffset, coverPath, 142, 230)
              break
          }

          break
        }

        case CONSOLE.SWITCH:
        default:
          switch (coverType) {
            case COVER_TYPE.DISC:
            default:
              loadFinalCover(currentX, currentY + yOffset, coverPath, 107, 160)
              break
          }

          break
      }

      currentX += this.increment_x
      currentY += this.increment_y
    })
  }
}

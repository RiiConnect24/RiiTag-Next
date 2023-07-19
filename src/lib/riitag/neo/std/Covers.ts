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

  /**
   * Trim a game ID to pull the region out of it.
   * @param gameId
   * @param games
   * @returns
   */
  findRegionByGameId (gameId: string, games): string {
    let regions = null
    games.forEach(game => {
      if (game.id[0] === gameId) {
        regions = game.region[0].split(',').map(region => region.trim())
      }
    })
    return regions // Ex. NA,EU,JA
  }

  /**
   * Get the region associated with a box.
   * @param gameId
   * @returns
   */
  getBoxGameRegion (gameId: string): string {
    switch (gameId.charAt(3)) {
      case 'P':
        return 'EN'
      case 'E':
        return 'US'
      case 'J':
        return 'JA'
      case 'K':
        return 'KO'
      case 'W':
        return 'ZH'
      default:
        return 'EN'
    }
  }

  /**
   * Get a region for a switch game.
   * @param gameId
   * @returns
   */
  async getSwitchGameRegion (gameId: string): Promise<string> {
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

  /**
   * Get the region associated with a game.
   * @param console
   * @param gameId
   * @returns
   */
  async getGameRegion (console: string, gameId: string): Promise<string> {
    switch (console) {
      case CONSOLE.WII:
      case CONSOLE.WII_U:
      case CONSOLE.THREEDS:
        return this.getBoxGameRegion(gameId)
      case CONSOLE.SWITCH:
        return await this.getSwitchGameRegion(gameId)
      default:
        throw new Error(`Unknown console ${console}`)
    }
  }

  getBaseURL (console, type, region, gameId, extention): string {
    return `https://art.gametdb.com/${console}/${type}/${region}/${gameId}.${extention}`
  }

  async downloadCover (console: string, type: string, gameId: string, region: string): Promise<string> {
    // Determine if a cache already exists, if so, return it.
    const filepath = path.resolve(CACHE.COVER, console, type, region, `${gameId}.${this.getExtension(type, console)}`)
    if (fs.existsSync(filepath)) return filepath

    // Fetch the the cover directly from the coverDB.
    const response = await fetch(this.getBaseURL(console, type, region, gameId, this.getExtension(type, console)))
    if (!response.ok) return null

    // Save to a cache and return it.
    await saveFile(filepath, await response.body)
    return filepath
  }

  // Wii uses the JPG format for covers so make sure to have an exception for that.
  getExtension (coverType: string, gameConsole: string): string {
    if (gameConsole !== CONSOLE.WII && coverType === COVER_TYPE.COVER) return 'jpg'
    return 'png'
  }

  /**
   * Get the cover associated with the game ID and console.
   * @param gameConsole
   * @param type
   * @param gameId
   * @param region
   * @returns
   */
  async getCover (gameConsole: string, type: string, gameId: string, region: string): Promise<string> {
    switch (gameConsole) {
      case CONSOLE.THREEDS:
      case CONSOLE.SWITCH:
        switch (type) {
          case COVER_TYPE.COVER_3D:
            type = COVER_TYPE.BOX
            break

          case COVER_TYPE.DISC:
            type = COVER_TYPE.CART
            break
        }
        break
    }

    // Attempt to get game cover from user region
    let cover = await this.downloadCover(gameConsole, type, gameId, region)

    // If unable, get the official region
    if (!cover) {
      cover = await this.downloadCover(gameConsole, type, gameId, await this.getGameRegion(gameConsole, gameId))
    }

    return cover
  }

  /**
   * Get all of the covers for a user.
   * @param user The user to get the covers for.
   * @returns
   */
  async getAllUserCovers (user: user): Promise<string[]> {
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
      take: this.max
    })

    // Return a default empty array if the user has no playlog.
    if (playlog.length === 0) {
      return []
    }

    const coverPaths = []

    for (const logEntry of playlog) {
      coverPaths.push(this.getCover(
        logEntry.game.console,
        user.cover_type,
        logEntry.game.game_id,
        user.cover_region
      ))
    }

    return await Promise.all(coverPaths)
  }

  async render (context: Canvas.CanvasRenderingContext2D, user): Promise<void> {
    this.drawCovers(await this.getAllUserCovers(user), context)
  };

  /**
   * Draw the covers onto the supplied canvas.
   * @param coverPaths The paths to the covers to draw.
   * @param context The canvas context to draw the covers onto.
   */
  drawCovers (coverPaths: string[], context: Canvas.CanvasRenderingContext2D): void {
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
      if (!coverPath) return
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

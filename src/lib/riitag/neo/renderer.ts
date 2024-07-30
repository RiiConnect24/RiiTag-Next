import path from 'node:path'
import { existsSync, readdirSync, readFileSync, createWriteStream } from 'node:fs'
import Canvas from 'canvas'
import { CACHE, DATA } from '@/lib/constants/filePaths'
import ModuleBase from './ModuleBase'
import logger from '@/lib/logger'
import { user } from '@prisma/client'
import { setupWorkers, startWorkerRender } from '@/lib/utils/riitagUtils'

let fontsLoaded = false

async function loadFonts () {
  if (fontsLoaded) return
  const fontJsons = readdirSync(DATA.FONTS)
  fontsLoaded = true

  await Promise.all(
    fontJsons.map(async (fontJson) => {
      const font = JSON.parse(
        readFileSync(path.resolve(DATA.FONTS, fontJson), 'utf8')
      )

      font.styles.map(async (fontStyle) => {
        Canvas.registerFont(path.resolve(DATA.FONTFILES, fontStyle.file), {
          family: font.family,
          weight: fontStyle.weight,
          style: fontStyle.style
        })
      })
    })
  )
}

export async function renderTag (user: user): Promise<void> {
  await setupWorkers()
  startWorkerRender(user)
}

export async function doRender (user: user): Promise<void> {
  await loadFonts()
  const overlayPath = path.resolve(DATA.OVERLAYS, `neo.${user.overlay}.json`)

  if (!(existsSync(overlayPath))) throw new Error(`Overlay ${overlayPath} does not exist`)
  const overlay = JSON.parse(readFileSync(overlayPath, 'utf-8'))

  const canvas = new Canvas.Canvas(overlay.width, overlay.height)
  const context = canvas.getContext('2d')
  context.globalAlpha = 0

  // Load all renderable elements for the overlay
  const elements: ModuleBase[] = await Promise.all(overlay.draw_order.map(async (element) => {
    const ModuleName = await import(`@/lib/riitag/neo/std/${element}`)
    // eslint-disable-next-line new-cap
    const module: ModuleBase = new ModuleName.default(overlay)
    logger.info(`Building render element: ${element}; for ${user.username}`)

    return module
  }))

  let finished = 0

  // Write the renderable elements to the canvas
  for (const element of elements) {
    await element.render(context, user)
    finished++
    logger.info(`Finished: ${finished}/${overlay.draw_order.length}`)
  }

  const tagFileStream = createWriteStream(path.resolve(CACHE.TAGS, `${user.username}.max.png`))
  canvas.createPNGStream().pipe(tagFileStream)

  context.clearRect()
}

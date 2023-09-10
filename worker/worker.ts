import Canvas from 'canvas'

const { Server } = require('net')
const path = require('path')
const { existsSync, readFileSync, readdirSync } = require('fs')

const FONTS = path.resolve('../data', 'fonts')
const FONTFILES = path.resolve('../data', 'fontfiles')
const OVERLAYS = path.resolve('../', 'data', 'overlays')

const worker = new Server()
worker.listen(9200)

let activeJobs = 0

worker.on('connection', (socket: any) => {
  console.log('Connected')

  socket.on('error', () => {
    console.log('error on socket')
  })

  socket.on('data', async (data: any) => {
    const json = JSON.parse(String(data))

    activeJobs++
    socket.write(JSON.stringify({ o: 1, c: activeJobs }) + '\n')

    const d = await render(json)

    activeJobs--
    socket.write(JSON.stringify({ o: 2, d, u: json.username, c: activeJobs }) + '\n')
  })
})

async function loadFonts () {
  const fontJsons = readdirSync(FONTS)

  await Promise.all(
    fontJsons.map(async (fontJson) => {
      const font = JSON.parse(
        readFileSync(path.resolve(FONTS, fontJson), 'utf8')
      )

      font.styles.map(async (fontStyle) => {
        Canvas.registerFont(path.resolve(FONTFILES, fontStyle.file), {
          family: font.family,
          weight: fontStyle.weight,
          style: fontStyle.style
        })
      })
    })
  )
}

async function render (user: any) {
  await loadFonts()
  const overlayPath = path.resolve(OVERLAYS, `neo.${user.overlay}.json`)

  if (!(existsSync(overlayPath))) throw new Error(`Overlay ${overlayPath} does not exist`)
  const overlay = JSON.parse(readFileSync(overlayPath, 'utf-8'))

  const canvas = new Canvas.Canvas(overlay.width, overlay.height)
  const context = canvas.getContext('2d')

  // Load all renderable elements for the overlay
  const elements = await Promise.all(overlay.draw_order.map(async (element: any) => {
    const ModuleName = await import(`./neo/std/${element}`)
    // eslint-disable-next-line new-cap
    const module = new ModuleName.default(overlay)

    return module
  }))

  // Write the renderable elements to the canvas
  for (const element of elements) {
    await element.render(context, user)
  }

  return canvas.toBuffer()
}

console.log('Listening')

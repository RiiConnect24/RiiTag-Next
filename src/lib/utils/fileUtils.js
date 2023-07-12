import fs from 'node:fs'
import path from 'node:path'
import logger from '@/lib/logger'

export const exists = async (filename) =>
  !!(await fs.promises.stat(filename).catch(() => null))

export async function saveFile (filepath, file) {
  logger.info(`Saving file to ${filepath}`)
  if (!(await exists(filepath))) {
    await fs.promises.mkdir(path.dirname(filepath), { recursive: true })
  }

  const fileStream = fs.createWriteStream(filepath)

  await new Promise((resolve, reject) => {
    file.pipe(fileStream)
    file.on('error', reject)
    fileStream.on('finish', resolve)
  })
}

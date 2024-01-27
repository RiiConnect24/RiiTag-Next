import fs from 'node:fs'
import path from 'node:path'
import logger from '@/lib/logger'
import { Readable } from 'stream'
import { finished } from 'node:stream/promises'

export const exists = async (filename) =>
  !!(await fs.promises.stat(filename).catch(() => null))

export async function saveFile (filepath, file: any | null) {
  if (file == null) return

  if (!(await exists(filepath))) {
    await fs.promises.mkdir(path.dirname(filepath), { recursive: true })
  }

  // write file to disk
  const fileStream = fs.createWriteStream(filepath)
  await finished(Readable.fromWeb(file).pipe(fileStream))

  logger.info('File saved successfully')
}

import fs from 'node:fs'
import path from 'node:path'
import logger from '@/lib/logger'

export const exists = async (filename) =>
  !!(await fs.promises.stat(filename).catch(() => null))

export async function saveFile (filepath, file: ReadableStream<Uint8Array> | null) {
  if (file == null) return

  if (!(await exists(filepath))) {
    await fs.promises.mkdir(path.dirname(filepath), { recursive: true })
  }

  const fileStream = fs.createWriteStream(filepath)

  const readableStream = file as unknown as NodeJS.ReadableStream
  readableStream.pipe(fileStream)

  logger.info('File saved successfully')
}

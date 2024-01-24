import fs from 'node:fs'
import path from 'node:path'

export const exists = async (filename) =>
  !!(await fs.promises.stat(filename).catch(() => null))

export async function saveFile (filepath, file: ReadableStream<Uint8Array> | null) {
  if (file == null) return

  if (!(await exists(filepath))) {
    await fs.promises.mkdir(path.dirname(filepath), { recursive: true })
  }

  file.getReader().read().then(({ done, value }) => { console.log(value) })
  const fileStream = fs.createWriteStream(filepath)
  fileStream.write(file)
  fileStream.end()
}

export async function readStreamIntoArray (stream: unknown[]) {
  const chunks = []
  for await (const chunk of stream) {
    chunks.push(chunk)
  }
  return chunks
}

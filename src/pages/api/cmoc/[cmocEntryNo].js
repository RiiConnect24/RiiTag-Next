import path from 'node:path'
import fs from 'node:fs'
import { nc } from '@/lib/routing'
import HTTP_CODE from '@/lib/constants/httpStatusCodes'
import { CACHE, PUBLIC } from '@/lib/constants/filePaths'
import { exists, saveFile } from '@/lib/utils/fileUtils'
import { setFileHeaders } from '@/lib/utils/utils'
import logger from '@/lib/logger'
import { getMiiFromHexData, getMiiHexDataFromCMOC } from '@/lib/linktag/mii'

/* Endpoint examples:
 * /api/cmoc/3362-4305-0645
 * /api/cmoc/900961553119
 * /api/cmoc/111111111111 <- should return unknown
 */
async function getCmocMii (request, response) {
  let { cmocEntryNo } = request.query
  cmocEntryNo = cmocEntryNo.replaceAll('-', '')

  if (cmocEntryNo.length !== 12 || Number.isNaN(cmocEntryNo)) {
    return response
      .status(HTTP_CODE.BAD_REQUEST)
      .send({ error: 'Invalid data' })
  }

  const filepath = path.resolve(CACHE.CMOC_MIIS, `${cmocEntryNo}.png`)
  if (!(await exists(filepath))) {
    // Download first
    try {
      const miiHexData = await getMiiHexDataFromCMOC(cmocEntryNo)
      const mii = await getMiiFromHexData(miiHexData)
      await saveFile(filepath, mii)
    } catch (error) {
      logger.error(error)
      response.setHeader('Content-Type', 'image/png')
      setFileHeaders(response, 'unknown.png')
      return response
        .status(HTTP_CODE.NOT_FOUND)
        .send(await fs.promises.readFile(PUBLIC.UNKNOWN_MII))
    }
  }

  response.setHeader('Content-Type', 'image/png')
  setFileHeaders(response, `${cmocEntryNo}.png`)
  return response
    .status(HTTP_CODE.OK)
    .send(await fs.promises.readFile(filepath))
}

const handler = nc().get(getCmocMii)

export default handler

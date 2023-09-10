import { IncomingForm } from 'formidable'
import { createReadStream } from 'node:fs'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { ncWithSession } from '@/lib/routing'
import HTTP_CODE from '@/lib/constants/httpStatusCodes'
import { getMiiFromHexData, getMiiFromQR } from '@/lib/linktag/mii'
import { saveFile } from '@/lib/utils/fileUtils'
import { CACHE } from '@/lib/constants/filePaths'
import prisma from '@/lib/db'
import { MII_TYPE } from '@/lib/constants/miiType'
import { renderTag } from '@/lib/linktag/neo/renderer'
import logger from '@/lib/logger'

async function uploadMii (request, response) {
  if (request.socket.bytesRead > 1_048_576) {
    return response
      .status(HTTP_CODE.REQUEST_ENTITY_TOO_LARGE)
      .send({ error: 'Request entity too large.' })
  }
  const username = request.session?.username

  if (!username) {
    return response
      .status(HTTP_CODE.UNAUTHORIZED)
      .json({ error: 'Unauthorized' })
  }

  const data = await new Promise((resolve, reject) => {
    const form = new IncomingForm()

    form.parse(request, (error, fields, files) => {
      if (error) {
        return reject(error)
      }
      return resolve({ fields, files })
    })
  }).catch((error) => {
    logger.error(error)
    return response
      .status(HTTP_CODE.BAD_REQUEST)
      .send({ error: 'Invalid data' })
  })

  const { file } = data.files
  const isQrCode = file.mimetype === 'image/jpeg'
  const isOctetStream = file.mimetype === 'application/octet-stream'

  if (
    !isQrCode &&
    (!isOctetStream ||
      (isOctetStream && !file.originalFilename.endsWith('.mae')))
  ) {
    return response
      .status(HTTP_CODE.BAD_REQUEST)
      .send({ error: 'Invalid data' })
  }

  // MAE files are always 74 bytes big
  if (!isQrCode && file.size !== 74) {
    return response
      .status(HTTP_CODE.REQUEST_ENTITY_TOO_LARGE)
      .send({ error: 'Request entity too large.' })
  }

  let miiHexData
  try {
    if (isQrCode) {
      const fileData = createReadStream(file.filepath)
      miiHexData = await getMiiFromQR(fileData)
    } else {
      const fileData = await readFile(file.filepath)
      const buf = Buffer.from(fileData, 'ascii')
      miiHexData = buf.toString('hex')
    }
  } catch (error) {
    logger.error(error)
    return response
      .status(HTTP_CODE.BAD_REQUEST)
      .send({ error: 'Invalid data' })
  }

  let user = await prisma.user.findFirst({
    where: {
      username
    },
    select: {
      username: true
    }
  })

  const filepath = path.resolve(CACHE.MIIS, `${user.username}.png`)

  try {
    const mii = await getMiiFromHexData(miiHexData)
    await saveFile(filepath, mii)

    user = await prisma.user.update({
      where: {
        username
      },
      data: {
        mii_type: MII_TYPE.UPLOAD,
        mii_data: miiHexData
      }
    })
  } catch (error) {
    logger.error(error)
    return response
      .status(HTTP_CODE.BAD_REQUEST)
      .send({ error: 'Invalid data' })
  }

  if (user.show_mii === true) {
    renderTag(user)
  }

  return response.status(HTTP_CODE.OK).send()
}

const handler = ncWithSession().post(uploadMii)

export const config = {
  api: {
    bodyParser: false
  }
}

export default handler

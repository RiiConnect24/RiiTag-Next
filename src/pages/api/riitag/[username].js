import path from 'node:path'
import fs from 'node:fs'
import HTTP_CODE from '@/lib/constants/httpStatusCodes'
import { nc } from '@/lib/routing'
import prisma from '@/lib/db'
import { CACHE } from '@/lib/constants/filePaths'
import { exists } from '@/lib/utils/fileUtils'
import { renderTag } from '@/lib/riitag/neo/renderer'
import logger from '@/lib/logger'
import { setFileHeaders } from '@/lib/utils/utils'

async function getRiiTag (request, response) {
  const { username } = request.query
  const max = request.query.max === 'true'

  const user = await prisma.user.findUnique({
    where: {
      username: username.toString()
    }
  })

  if (user === null) {
    response.setHeader('Content-Type', 'image/png')
    setFileHeaders(response, `riitag-${username}.png`)
    return response.status(HTTP_CODE.NOT_FOUND).send(await fs.promises.readFile('public/img/tag/tagnotfound.max.png'))
  }

  const filepath = path.resolve(
    CACHE.TAGS,
    max ? `${user.username}.max.png` : `${user.username}.png`
  )

  if (!(await exists(filepath))) {
    try {
      await renderTag(user)
    } catch (error) {
      logger.error(error)
      response.setHeader('Content-Type', 'image/png')
      setFileHeaders(response, `riitag-${username}.png`)
      return response.status(HTTP_CODE.INTERNAL_SERVER_ERROR).send(await fs.promises.readFile('public/error.png'))
    }
  }

  response.setHeader('Content-Type', 'image/png')
  setFileHeaders(response, `riitag-${username}.png`)
  return response.status(200).send(await fs.promises.readFile(filepath))
}

const handler = nc().get(getRiiTag)

export default handler

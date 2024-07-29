import HTTP_CODE from '@/lib/constants/httpStatusCodes'
import { ncWithSession } from '@/lib/routing'
import { userIsMod } from '@/lib/utils/databaseUtils'
import prisma from '@/lib/db'
import logger from '@/lib/logger'
import { isBlank } from '@/lib/utils/utils'

async function exportData (request, response) {
  const loggedInUser = request.session?.username
  const {
    reason,
    shadow,
    user
  } = request.body

  if (
    isBlank(reason) || isBlank(String(user)) || isBlank(String(shadow))
  ) {
    const fields = []
    if (isBlank(reason)) fields.push('reason')
    if (isBlank(String(user))) fields.push('user')
    if (isBlank(String(shadow))) fields.push('shadow')

    return response
      .status(HTTP_CODE.BAD_REQUEST)
      .send({ error: 'Invalid data', fields })
  }

  if (!loggedInUser) {
    return response
      .status(HTTP_CODE.UNAUTHORIZED)
      .json({ error: 'Unauthorized' })
  }

  if (!(await userIsMod(loggedInUser))) {
    return response
      .status(HTTP_CODE.UNAUTHORIZED)
      .json({ error: 'Unauthorized' })
  }

  try {
    await prisma.user.update({
      data: {
        publicOverride: +shadow
      },
      where: {
        id: user
      }
    })

    await prisma.moderation_log.create({
      data: {
        user_id: user,
        reason: `${shadow ? 'Shadow ' : ''}Hide: ${reason}`,
        action_time: new Date()
      }
    })

    return response.status(HTTP_CODE.OK).send({ })
  } catch (error) {
    logger.error(error)
    return response.status(HTTP_CODE.INTERNAL_SERVER_ERROR).send()
  }
}

const handler = ncWithSession().post(exportData)

export default handler

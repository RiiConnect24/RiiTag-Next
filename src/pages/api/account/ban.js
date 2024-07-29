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
    user
  } = request.body

  if (
    isBlank(reason) || isBlank(String(user))
  ) {
    return response
      .status(HTTP_CODE.BAD_REQUEST)
      .send({ error: 'Invalid data' })
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
        isBanned: 1
      },
      where: {
        id: user
      }
    })

    await prisma.moderation_log.create({
      data: {
        user_id: user,
        reason: `Ban: ${reason}`,
        action_time: new Date()
      }
    })

    await prisma.banned_user.create({
      data: {
        user_id: user,
        ip_address: '0.0.0.0',
        reason,
        action_time: new Date()
      }
    })

    return response.status(HTTP_CODE.OK).send(null)
  } catch (error) {
    logger.error(error)
    return response.status(HTTP_CODE.INTERNAL_SERVER_ERROR).send()
  }
}

const handler = ncWithSession().post(exportData)

export default handler

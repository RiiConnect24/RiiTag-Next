import HTTP_CODE from '@/lib/constants/httpStatusCodes'
import { ncWithSession } from '@/lib/routing'
import { userIsMod } from '@/lib/utils/databaseUtils'
import prisma from '@/lib/db'
import logger from '@/lib/logger'
import { isBlank } from '@/lib/utils/utils'

async function exportData (request, response) {
  const loggedInUser = request.session?.username
  const {
    user
  } = request.body

  if (
    isBlank(String(user))
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
        isBanned: false
      },
      where: {
        id: user
      }
    })

    await prisma.moderation_log.create({
      data: {
        user_id: user,
        reason: 'Unban',
        action_time: new Date()
      }
    })

    await prisma.banned_user.delete({
      where: {
        user_id: user
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

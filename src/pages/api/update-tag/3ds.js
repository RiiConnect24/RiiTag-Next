import { nc } from '@/lib/routing'
import rateLimit from '@/lib/rate-limit'
import ENV from '@/lib/constants/environmentVariables'
import HTTP_CODE from '@/lib/constants/httpStatusCodes'
import { isBlank } from '@/lib/utils/utils'
import {
  get3DSGameIdByNameAndRegion,
  get3DSGameName,
  updatelinktag
} from '@/lib/utils/linktagUtils'
import CONSOLE from '@/lib/constants/console'
import logger from '@/lib/logger'
import { getUserByRandKey } from '@/lib/utils/databaseUtils'
import { renderTag } from '@/lib/linktag/neo/renderer'

const limiter = rateLimit({
  interval: ENV.IS_DEV ? 1 : 60_000, // 60 Seconds
  uniqueTokenPerInterval: 500 // Max 500 users per second
})

/*
 * Endpoint example:
 * Citra: /3ds?key=dev&gameName=SUPER%20MARIO%203D%20LAND
 */
async function add3dsGame (request, response) {
  const { key, gameName } = request.query

  if (isBlank(key) || isBlank(gameName) || gameName.length > 255) {
    return response
      .status(HTTP_CODE.BAD_REQUEST)
      .json({ error: 'Invalid data' })
  }

  try {
    await limiter.check(response, 3, key)
  } catch {
    return response
      .status(HTTP_CODE.TOO_MANY_REQUESTS)
      .json({ error: 'Rate limit exceeded' })
  }

  const user = await getUserByRandKey(key)

  if (!user) {
    return response.status(HTTP_CODE.UNAUTHORIZED).send({
      error: 'Invalid key.'
    })
  }

  const gameId = await get3DSGameIdByNameAndRegion(gameName, user.cover_region)
  if (!gameId) {
    return response
      .status(HTTP_CODE.BAD_REQUEST)
      .send({ error: 'Game not found.' })
  }

  const gameTitle = await get3DSGameName(gameId)

  try {
    const updatedUser = await updatelinktag(
      user,
      gameId,
      gameTitle,
      CONSOLE.THREEDS
    )
    renderTag(updatedUser)
  } catch (error) {
    logger.error(error)
    return response
      .status(HTTP_CODE.INTERNAL_SERVER_ERROR)
      .json({ error: 'Error updating RiiTag' })
  }

  return response.status(HTTP_CODE.OK).send()
}

const handler = nc().get(add3dsGame)

export default handler

import { nc } from '@/lib/routing'
import rateLimit from '@/lib/rate-limit'
import ENV from '@/lib/constants/environmentVariables'
import HTTP_CODE from '@/lib/constants/httpStatusCodes'
import { isBlank } from '@/lib/utils/utils'
import {
  getSwitchGameIdByNameAndRegion,
  getSwitchGameName,
  updateriitag
} from '@/lib/utils/riitagUtils'
import CONSOLE from '@/lib/constants/console'
import logger from '@/lib/logger'
import { getUserByRandKey } from '@/lib/utils/databaseUtils'
import { renderTag } from '@/lib/riitag/neo/renderer'

const limiter = rateLimit({
  interval: ENV.IS_DEV ? 1 : 60_000, // 60 Seconds
  uniqueTokenPerInterval: 500 // Max 500 users per second
})

/*
 * Endpoint example:
 * Citra: /switch?key=dev&gameName=SUPER%20MARIO%20ODYSSEY
 */
async function addSwitchGame (request, response) {
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

  const gameId = await getSwitchGameIdByNameAndRegion(gameName, user.cover_region)
  if (!gameId) {
    return response
      .status(HTTP_CODE.BAD_REQUEST)
      .send({ error: 'Game not found.' })
  }

  const gameTitle = await getSwitchGameName(gameId)

  try {
    const updatedUser = await updateriitag(
      user,
      gameId,
      gameTitle,
      CONSOLE.SWITCH
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

const handler = nc().get(addSwitchGame)

export default handler

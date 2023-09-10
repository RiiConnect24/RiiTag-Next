import { nc } from '@/lib/routing'
import rateLimit from '@/lib/rate-limit'
import ENV from '@/lib/constants/environmentVariables'
import HTTP_CODE from '@/lib/constants/httpStatusCodes'
import { isBlank } from '@/lib/utils/utils'
import { getWiiGameName, updatelinktag } from '@/lib/utils/linktagUtils'
import CONSOLE from '@/lib/constants/console'
import logger from '@/lib/logger'
import { renderTag } from '@/lib/linktag/neo/renderer'
import { getUserByRandKey } from '@/lib/utils/databaseUtils'

const limiter = rateLimit({
  interval: ENV.IS_DEV ? 1 : 60_000, // 60 Seconds
  uniqueTokenPerInterval: 500 // Max 500 users per second
})

/* Endpoint example:
 * /wii?key=dev&game=RSBP01
 */
async function addWiiGame (request, response) {
  const { key, game, playtime } = request.query

  const truePlaytime = playtime ? parseInt(playtime) : 0

  if (isBlank(key) || isBlank(game) || game.length < 4 || game.length > 6) {
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

  const gameName = await getWiiGameName(game)

  try {
    const updatedUser = await updatelinktag(user, game, gameName, CONSOLE.WII, truePlaytime)
    renderTag(updatedUser)
  } catch (error) {
    logger.error(error)
    return response
      .status(HTTP_CODE.INTERNAL_SERVER_ERROR)
      .json({ error: 'Error updating linktag' })
  }

  return response.status(HTTP_CODE.OK).send()
}

const handler = nc().get(addWiiGame)

export default handler

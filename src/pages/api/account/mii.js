import { ncWithSession } from '@/lib/routing'
import HTTP_CODE from '@/lib/constants/httpStatusCodes'
import { isBlank } from '@/lib/utils/utils'
import prisma from '@/lib/db'
import { renderTag } from '@/lib/riitag/neo/renderer'
import { isValidMiiType, MII_TYPE } from '@/lib/constants/miiType'
import { isValidGuestMii } from '@/lib/constants/forms/guestMiis'
import logger from '@/lib/logger'
import { getMiiHexDataFromCMOC } from '@/lib/riitag/mii'

async function updateMii (request, response) {
  const { miiType, guestMii, cmocEntryNo } = request.body
  const username = request.session?.username

  if (!username) {
    return response
      .status(HTTP_CODE.UNAUTHORIZED)
      .json({ error: 'Unauthorized' })
  }

  if (isBlank(miiType) || !isValidMiiType(miiType)) {
    return response
      .status(HTTP_CODE.BAD_REQUEST)
      .send({ error: 'Invalid data' })
  }

  let user
  switch (miiType) {
    case MII_TYPE.GUEST: {
      if (isBlank(guestMii) || !isValidGuestMii(guestMii)) {
        return response
          .status(HTTP_CODE.BAD_REQUEST)
          .send({ error: 'Invalid data' })
      }
      try {
        user = await prisma.user.update({
          where: {
            username
          },
          data: {
            mii_type: MII_TYPE.GUEST,
            mii_data: guestMii
          }
        })
      } catch (error) {
        logger.error(error)
        return response
          .status(HTTP_CODE.BAD_REQUEST)
          .send({ error: 'Invalid data' })
      }
      break
    }
    case MII_TYPE.CMOC: {
      try {
        const miiHexData = await getMiiHexDataFromCMOC(cmocEntryNo)
        user = await prisma.user.update({
          where: {
            username
          },
          data: {
            mii_type: MII_TYPE.CMOC,
            cmoc_entry_no: cmocEntryNo.replaceAll('-', ''),
            mii_data: miiHexData
          }
        })
      } catch (error) {
        logger.error(error)
        return response
          .status(HTTP_CODE.BAD_REQUEST)
          .send({ error: 'Invalid data' })
      }
      break
    }
    default: {
      return response
        .status(HTTP_CODE.BAD_REQUEST)
        .send({ error: 'Invalid data' })
    }
  }

  if (user.show_mii === true) {
    renderTag(user)
  }

  return response.status(HTTP_CODE.OK).send()
}

const handler = ncWithSession().post(updateMii)

export default handler

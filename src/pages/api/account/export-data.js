import HTTP_CODE from '@/lib/constants/httpStatusCodes';
import { ncWithSession } from '@/lib/routing';
import prisma from '@/lib/db';
import logger from '@/lib/logger';

async function exportData(request, response) {
  const username = request.session?.username;

  if (!username) {
    return response
      .status(HTTP_CODE.UNAUTHORIZED)
      .json({ error: 'Unauthorized' });
  }

  try {
    const data = await prisma.user.findUnique({
      where: {
        username,
      },
      select: {
        username: true,
        name_on_riitag: true,
        image: true,
        randkey: true,
        coins: true,
        cover_region: true,
        cover_type: true,
        comment: true,
        overlay: true,
        background: true,
        flag: true,
        coin: true,
        font: true,
        show_avatar: true,
        show_mii: true,
        mii_type: true,
        mii_data: true,
        cmoc_entry_no: true,
        created_at: true,
        updated_at: true,
        accounts: {
          select: {
            provider_id: true,
            provider_account_id: true,
            created_at: true,
            updated_at: true,
          },
        },
        playlog: {
          select: {
            played_on: true,
            game: {
              select: {
                game_id: true,
                console: true,
                name: true,
              },
            },
          },
        },
      },
    });

    return response.status(HTTP_CODE.OK).json(data);
  } catch (error) {
    logger.error(error);
    return response.status(HTTP_CODE.INTERNAL_SERVER_ERROR).send();
  }
}

const handler = ncWithSession().post(exportData);

export default handler;

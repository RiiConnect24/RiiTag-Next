import HTTP_CODE from "@/lib/constants/httpStatusCodes";
import { makeBanner } from "@/lib/riitag/banner";
import logger from "@/lib/logger";
import prisma from "@/lib/db";
import { ncWithSession } from "@/lib/routing";
import rateLimit from "@/lib/rate-limit";
import ENV from "@/lib/constants/environmentVariables";

const limiter = rateLimit({
    interval: ENV.IS_DEV ? 1 : 30_000, // 30 Seconds
    uniqueTokenPerInterval: 500, // Max 500 users per second
  });

async function refreshTag(request, response) {
    const username = request.session?.username;

    if (!username) {
        return response
        .status(HTTP_CODE.UNAUTHORIZED)
        .json({ error: 'Unauthorized' });
    }

    const user = await prisma.user.findFirst({
        where: {
            username,
        }
    });

    try {
        await limiter.check(response, 3, username);
      } catch {
        return response
          .status(HTTP_CODE.TOO_MANY_REQUESTS)
          .json({ error: 'Rate limit exceeded' });
      }

    try {
        await makeBanner(user);
    } catch (error) {
        logger.error(error);
        return response
            .status(HTTP_CODE.INTERNAL_SERVER_ERROR)
            .json({ error: "Error while creating tag." 
        });
    }

    return response.status(HTTP_CODE.OK).json({ success: true });
}

const handler = ncWithSession().post(refreshTag);

export default handler;

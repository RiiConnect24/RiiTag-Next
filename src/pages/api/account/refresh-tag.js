import HTTP_CODE from "@/lib/constants/httpStatusCodes";
import { makeBanner } from "@/lib/riitag/banner";
import logger from "@/lib/logger";
import { ncWithSession } from "@/lib/routing";

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

const handler = ncWithSession().get(refreshTag);

export default handler;

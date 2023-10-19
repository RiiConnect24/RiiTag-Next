import fs from 'node:fs';
import path from 'node:path';
import { ncWithSession } from '@/lib/routing';
import HTTP_CODE from '@/lib/constants/httpStatusCodes';
import { setFileHeaders } from '@/lib/utils/utils';
import { CACHE } from '@/lib/constants/filePaths';

async function getMyUploadedBackground(request, response) {
    const username = request.session?.username;

    if (!username) {
        return response
            .status(HTTP_CODE.UNAUTHORIZED)
            .json({ error: 'Unauthorized' });
    }

    response.setHeader('Content-Type', 'image/png');
    setFileHeaders(response, `${username}.png`);
    return response
        .status(HTTP_CODE.OK)
        .send(await fs.promises.readFile(path.resolve(CACHE.BACKGROUNDS, username + ".png")));
}

const handler = ncWithSession().get(getMyUploadedBackground);

export default handler;

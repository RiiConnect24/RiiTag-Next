import FormData from 'form-data';
import logger from '@/lib/logger';

export async function getMiiHexDataFromCMOC(entryNo) {
  entryNo = entryNo.replaceAll('-', '');
  if (entryNo.length !== 12 || Number.isNaN(entryNo) === true) {
    throw new Error(
      'Entry Number must be exactly 12 characters long (without dashes).'
    );
  }

  const cmocUrl = 'https://miicontestp.wii.rc24.xyz/cgi-bin/studio.cgi';
  const formData = new FormData();
  formData.append('platform', 'wii');
  formData.append('id', entryNo);

  let response;
  logger.info(`Getting CMOC entry no. ${entryNo}`);
  try {
    response = await fetch(cmocUrl, { method: 'POST', body: formData });
  } catch (error) {
    throw new Error(
      `Error while fetching Mii from CMOC (Entry No. ${entryNo}): ${error.message}`
    );
  }

  if (response.status !== 200) {
    throw new Error('Mii entry not found.');
  }

  const json = await response.json();

  if (!json.mii) {
    throw new Error('Got invalid Mii data.', json);
  }

  return json.mii;
}

export async function getMiiFromQR(data) {
  const cmocUrl = 'https://miicontestp.wii.rc24.xyz/cgi-bin/studio.cgi';
  const formData = new FormData();
  formData.append('platform', 'gen2');
  formData.append('data', data);

  let response;
  logger.info(`Sending QR-Code Mii`);
  try {
    response = await fetch(cmocUrl, {
      method: 'POST',
      headers: formData.getHeaders(),
      body: formData,
    });
  } catch (error) {
    throw new Error(`Error while fetching Mii from QR Code: ${error.message}`);
  }

  if (response.status !== 200) {
    throw new Error('There was an error while loading the Mii.');
  }

  const json = await response.json();

  if (!json.mii) {
    throw new Error('Got invalid Mii data.', json);
  }

  return json.mii;
}

export async function getMiiFromHexData(hexData) {
  let url = `https://miicontestp.wii.rc24.xyz/cgi-bin/render.cgi?data=${hexData}`;
  if (hexData.length === 94) {
    // QR code
    url = `https://studio.mii.nintendo.com/miis/image.png?data=${hexData}&type=face&width=512&instanceCount=1`;
  }
  logger.info(`Downloading Mii from ${url}`);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(
      `Image download failed, got HTTP error ${response.status} from Nintendo: ${url}`
    );
  }

  return response.body;
}

import fs from 'node:fs';
import path from 'node:path';
import logger from '@/lib/logger';

export const exists = async (filename) =>
  !!(await fs.promises.stat(filename).catch(() => null));

export async function saveFile(filepath, file) {
  logger.info(`Saving file to ${filepath}`);
  if (!(await exists(filepath))) {
    await fs.promises.mkdir(path.dirname(filepath), { recursive: true });
  }

  const fileStream = fs.createWriteStream(filepath);

  try {
    await fs.promises.writeFile(filepath, file);
    logger.info('File saved successfully');
  } catch (error) {
    logger.error('Error saving the file:', error);
  }
}

import { DATA } from '@/lib/constants/filePaths'
import path from 'node:path'
import Covers from '@/lib/riitag/neo/std/Covers'
import logger from '@/lib/logger'
import fs from 'node:fs'

const overlay = JSON.parse(fs.readFileSync(path.resolve(DATA.OVERLAYS, 'neo', 'overlay7.json'), 'utf-8'))

export default function runTests (): void {
  const region = new Covers(overlay).getBoxGameRegion('RMCE01')

  logger.info('Tests:')
  logger.info(region)
}

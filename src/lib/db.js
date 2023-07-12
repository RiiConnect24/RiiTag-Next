import { PrismaClient } from '@prisma/client'
import ENV from '@/lib/constants/environmentVariables'

const prisma = global.prisma || new PrismaClient()

if (ENV.IS_DEV) {
  global.prisma = prisma
}

export default prisma

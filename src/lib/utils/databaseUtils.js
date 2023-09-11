import prisma from '@/lib/db';

export async function getRandKeyByUsername(username) {
  return prisma.user.findUnique({
    where: {
      username,
    },
    select: {
      randkey: true,
    },
  });
}

export async function getUserByUsername(username) {
  return prisma.user.findUnique({
    where: {
      username,
    },
  });
}

export async function getUserByRandKey(randkey) {
  return prisma.user.findUnique({
    where: {
      randkey,
    },
  });
}

export async function userIsAdmin(username) {
  const user = await prisma.user.findFirst({
    where: {
      username,
    },
    select: {
      role: true,
    },
  });

  return user.role === 'admin';
}

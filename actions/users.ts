import { prisma } from "@/lib/prisma";

export async function getUsers(count?: number) {
  const usersRaw = await prisma.user.findMany({
    take: count,
  });

  return usersRaw;
}

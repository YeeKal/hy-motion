import { prisma } from "./prisma";

// update credits
export async function updateUserCredits(userId: string, creditsChange: number) {
  const updateUsers = await prisma.user.update({
    where: { id: userId },
    data: { credits: { increment: creditsChange } },
  });
  if(updateUsers.credits < 0){
    throw new Error(`Insufficient credits`);
  }
}

export async function deductUserCredits(userId: string, creditsToDeduct: number) {
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { credits: { decrement: creditsToDeduct } },
  });
  if (updatedUser.credits < 0) {
    throw new Error(`Insufficient credits`);
  }
}

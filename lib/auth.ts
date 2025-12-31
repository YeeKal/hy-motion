import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/auth-config";

export async function getUserSession() {
  return await getServerSession(authOptions);
}
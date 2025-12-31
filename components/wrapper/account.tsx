import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "../ui/dropdown-menu";
import Image from "next/image";
import { Coins, UserCircle2 } from "lucide-react";
import { useRouter } from "@/i18n/routing";
import { Badge } from "../ui/badge";
import {formatTier} from "@/lib/utils";
import { useCredits } from "@/hooks/useCredits";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";


export default function AccountWrapper() {
    const router = useRouter();
    const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      return null;
    },});
    const { credits,subscriptionTier, isLoading } = useCredits();
    const t=useTranslations("common.account")

  // Callback for upgrade (redirect to pricing)
  const handleUpgrade = () => {
    router.push("/pricing");
  };

  // 显示加载状态
  if (status === "loading" || isLoading) {
    return null;
  }


  return (
    <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full bg-gradient-to-br from-pink-200 via-purple-200 to-teal-200 p-0">
                  {session.user.image ? (
                    <Image
                      src={session.user.image}
                      alt="User Avatar"
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  ) : ( 
                    <UserCircle2 className="h-7 w-7 text-[#D56575]" />
                  )}
                  <span className="sr-only">Account</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="px-2 py-2 text-sm flex  items-center gap-2">
                <Coins className="h-4 w-4 text-pink-500" />                
                <span className="font-semibold">{isLoading? "..." : credits}</span>
                <Badge variant={subscriptionTier === "FREE" ? "outline" : "default"}>
                  {formatTier(subscriptionTier)}
                </Badge>

                </div>
                <DropdownMenuItem onClick={handleUpgrade}>
                  {t("upgrade")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/account")}>
                                    {t("account")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
  );
}
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export function isDev() {
  return process.env.NODE_ENV === "development";
}

export const scrollToPlayground = (id:string) => {
  console.log("Scrolling to:", id);
    const el = document.getElementById(id);
    if (el) {
  console.log("find:", id);

      el.scrollIntoView({ behavior: "smooth" });
    }
  };
export function getBadgeColor(index: number) {
  const colors = [
    "text-blue-800",
    "text-red-800",
    "text-purple-800",
    "text-green-800",
    "text-yellow-800",
    "text-orange-800",
    "text-pink-800",
    "text-indigo-800",
    "text-teal-800",
    "text-lime-800",
    "text-cyan-800",
    "text-rose-800",
  ];
  return colors[index % colors.length];
}

export function getBadgeColorGradient(index: number) {
  const colors = [
    "from-blue-500",
    "from-red-500",
    "from-purple-500",
    "from-green-500",
    "from-yellow-500",
    "from-orange-500",
    "from-pink-500",
    "from-indigo-500",
    "from-teal-500",
    "from-lime-500",
    "from-cyan-500",
    "from-rose-500",
  ];
  return colors[index % colors.length];
}
export function getBadgeColorBackground(index: number) {
  const colors = [
    "bg-blue-500",
    "bg-red-500",
    "bg-purple-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-orange-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-teal-500",
    "bg-lime-500",
    "bg-cyan-500",
    "bg-rose-500",
  ];
  return colors[index % colors.length];
}

  // Format subscription tier for display
  export const formatTier = (tier: string | undefined) => {
    if (!tier) return "Free"
    return tier.charAt(0).toUpperCase() + tier.slice(1).toLowerCase()
  }

  export function formatDate(date: Date): string {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date)
  }

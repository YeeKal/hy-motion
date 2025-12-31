'use client'
import { Link } from "@/i18n/routing";
import { useState } from "react";
import { Box, Images, Radical, User, Sparkles} from "lucide-react";
import { LOGO_URL, BRAND_NAME } from "@/lib/constants";
import Image from "next/image";
import AccountWrapper from "./account";
import { ToolMetaConfig } from "@/lib/config/tool-types";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "./language-switcher";
import { PLAYGROUND_SECTION_ID } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
interface HeaderProps {
  toolMetaConfigs?: ToolMetaConfig[];
}

function ListItem({
  title,
  children,
  href,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link href={href}>
          <div className="text-sm leading-none font-medium hover:bg-accent/50 hover:text-primary">{title}</div>
          <p className="text-muted-foreground line-clamp-2 text-sm leading-snug ">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  )
}



export function Header({ toolMetaConfigs }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const t = useTranslations('common.header');
  const ocrToolsLabel = t('ocr-tools');


  const navText = [
    // {
    //   label: t("createLabel"),
    //   href: "/create",
    //   icon: <Sparkles  className="mr-2 h-4 w-4"></Sparkles >,
    // },
    {
      label: t("playground-label"),
      href: `/playground`,
      icon: <Box className="mr-2 h-4 w-4"></Box>,
    },
     {
      label: "Showcase",
      href: `/#showcase`,
      icon: <Images className="mr-2 h-4 w-4"></Images>,
    },
    // {
    //   label: t("galleryLabel"),
    //   href: "/gallery",
    //   icon: <Images className="mr-2 h-4 w-4"></Images>,
    // },
    {
      label: t("pricingLabel"),
      href: "/pricing",
      icon: <Radical className="mr-2 h-4 w-4"></Radical>,
    },
    {
      label: t("loginLabel"),
      href: "/login",
      icon: <User className="mr-2 h-4 w-4"></User>,
    },

  ];


  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background py-4 ">
      {/* katex is not needed */}
      {/* <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css"></link> */}
      <div className="container px-4 sm:px-6 flex items-center justify-between mx-auto">
        <div className="flex items-center gap-2">
          <Image
            src={LOGO_URL}
            alt={`${BRAND_NAME} logo`}
            width={48}
            height={48}
          />

          <Link
            href="/"
            className="font-bold text-xl bg-gradient-to-r from-[#5182ED]  to-[#D56575] bg-clip-text text-transparent no-underline"
          >
            {BRAND_NAME}
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-2">



          {navText.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center hover:text-primary hover:bg-accent hover:rounded-md px-2 py-1 transition-all duration-200 ease-in-out"
              prefetch={false}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}




          {/* {!session  && 
            <div className="flex items-center gap-4">
              <Link href="/login" className="hidden md:inline-flex">
                <Button variant="ghost">Login</Button>
              </Link>
            </div>
          } */}
        </nav>

        <div className="flex items-center gap-2">
          {/* <LanguageSwitcher /> */}
          {/* <ThemeToggle /> */}

          {/* Mobile Menu Button - Hidden on large screens */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-expanded={isMenuOpen}
            className="md:hidden"
          >
            <span className="sr-only">Menu</span>
            {isMenuOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-x"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-menu"
              >
                <line x1="4" x2="20" y1="12" y2="12" />
                <line x1="4" x2="20" y1="6" y2="6" />
                <line x1="4" x2="20" y1="18" y2="18" />
              </svg>
            )}
          </Button>
        </div>
        <AccountWrapper />
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-background border-b shadow-lg z-50">
          <nav className="container mx-auto px-4 py-4 flex flex-col items-center gap-4">


            {navText.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center justify-center hover:text-primary hover:bg-accent hover:rounded-md px-2 py-1 transition-all duration-200 ease-in-out"
                prefetch={false}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}

"use client";

import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { scrollToPlayground } from "@/lib/utils"
import { PLAYGROUND_SECTION_ID } from "@/lib/constants"
import { Icon, } from "../wrapper/lucide-icon";
import { Link } from "@/i18n/routing";
import { Zap } from "lucide-react";
interface HeroComponentProps {
  hero: {
    eyebrow: string;
    titlePrefix: string;
    tagline: string;
    ctaButton: {
      text: string
      link: string;
    },
    proButtonLable: string;
    features: {
      icon?: string;
      text: string;
    }[];
    backgroundImage?: string;
  };
}

export default function Hero({ hero }: HeroComponentProps) {
  return (
    <section className="relative py-8 sm:py-14 px-4 md:px-6 overflow-hidden flex items-center justify-center">

      {/* ================= BACKGROUND LAYER START ================= */}
      <div className="absolute inset-0 w-full h-full -z-10">
        {/* <Image 
          src={hero.backgroundImage || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop"} 
          alt="Z-Image Background"
          fill
          priority
          className="object-cover opacity-20 dark:opacity-30 blur-xl"
        /> */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-background/20 to-background" />
      </div>
      {/* ================= BACKGROUND LAYER END ================= */}

      <div className="relative z-10 max-w-4xl mx-auto text-center">

        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-block mb-6"
        >
          <span className="px-4 py-1.5 text-xs sm:text-sm font-medium text-primary bg-primary/10 border border-primary/20 rounded-full backdrop-blur-sm">
            {hero.eyebrow}
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          className="flex flex-col text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-pretty leading-tight tracking-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-foreground drop-shadow-sm">
            {hero.titlePrefix}
          </span>
          {/* <span className="text-primary">
            Z-Image
          </span> */}
        </motion.h1>

        {/* Tagline */}
        <motion.p
          className=" hidden sm:inline text-xs sm:text-lg md:text-xl text-muted-foreground mb-5 sm:mb-10 max-w-2xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {hero.tagline}
        </motion.p>

        {/* Features */}
        {hero.features && hero.features.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap justify-center gap-4 md:gap-8 sm:mb-10"
          >
            {hero.features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2 text-foreground/80 bg-background/40 px-3 py-1 rounded-lg backdrop-blur-md border border-white/5">
                {feature.icon && (
                  <div className="flex-shrink-0 text-primary">
                    <Icon name={feature.icon} className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                )}
                <span className="text-xs sm:text-sm md:text-base font-medium">{feature.text}</span>
              </div>
            ))}
          </motion.div>
        )}

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          // 2. 增加 Flex 布局容器，控制两个按钮的间距和排列
          className="flex flex-wrap items-center justify-center gap-4"
        >
          {/* Primary Button: Scroll to Playground */}
          {/* <Button
            onClick={() => scrollToPlayground(PLAYGROUND_SECTION_ID)}
            size="lg"
            className="text-xs sm:text-base md:text-lg px-4 sm:px-8 py-3 sm:py-6 rounded-full shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300"
          >
            {hero.ctaButton?.text || "Try for Free"}
          </Button> */}

           <Link
            href={`/playground`}
            className="inline-flex  items-center justify-center h-10 sm:h-12  px-4 sm:px-8 text-xs sm:text-base md:text-lg font-medium border border-border hover:bg-pink-100 hover:text-pink-700 bg-primary text-primary-foreground bg-background/50 backdrop-blur-sm rounded-full transition-colors  shadow-sm"
          >
            <Zap className=" w-4 h-4 mr-2" />
            {hero.ctaButton?.text || "Try for Free"}
          </Link>

          {/* Secondary Button: Link to Waitlist */}
          {/* 3. 使用 Link 组件替代 Router.push，并统一圆角样式为 rounded-full */}
          <Link
            href={"/pricing"}
            className="inline-flex  items-center justify-center h-10 sm:h-12  px-4 sm:px-8 text-xs sm:text-base md:text-lg font-medium border border-border text-foreground hover:bg-pink-100 bg-background/50 backdrop-blur-sm rounded-full transition-colors hover:text-pink-700 shadow-sm"
          >
            <Zap className="text-pink-700 w-4 h-4 mr-2" />
            {hero.proButtonLable}
          </Link>

        </motion.div>
      </div>

    </section>
  );
}
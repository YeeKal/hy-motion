"use client";

import React, { use, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from '@/i18n/routing';
import { useTranslations } from "next-intl";

export default function Hero() {
  const t = useTranslations("home.hero");
  const [loading] = useState(false);
  const router = useRouter();

  const scrollToForm = () => {
    const link = t("ctaButton.link");
    const el = document.getElementById(link);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="w-full  py-8 px-4 relative py-20 bg-gradient-to-br from-pink-200 via-purple-200 to-teal-200 shadow-lg">
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      <div className="container mx-auto px-4 md:px-6 relative">
        <div className="flex flex-col items-center space-y-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* <div className="inline-flex items-center rounded-full px-3 py-1 text-sm bg-primary/10 text-primary mb-4">
              {t("eyebrow")}
            </div> */}

            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
              {t("title")}
            </h1>

            <p className="mt-6 text-xl text-foreground md:text-2xl max-w-3xl mx-auto">
              {t("tagline")}
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-8 flex flex-col sm:flex-row gap-4 justify-center"
            >
              <button
                onClick={scrollToForm}
                className="inline-flex items-center justify-center h-14 px-8 text-lg font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-md transition-colors shadow-lg"
              >
                {loading ? "Loading..." : t("ctaButton.text")}
              </button>
              <button
                onClick={() => {
                  router.push(t("waitlistButton.link"));
                }}
                className="inline-flex items-center justify-center h-14 px-8 text-lg font-medium border border-border text-foreground hover:bg-muted rounded-md transition-colors bg-background shadow-lg"
              >
                {t("waitlistButton.text")}
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex items-center justify-center gap-8 pt-8 text-sm text-muted-foreground"
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                {t("features.f1")}
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                {t("features.f2")}
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                {t("features.f3")}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}


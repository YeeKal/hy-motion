"use client";

import { EARLY_CODE, EARLY_END_DATE } from "@/lib/constants";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

export function EarlyBirdBanner() {
    const t = useTranslations("earlyBirds");
    const [show, setShow] = useState(false);
    const [copied, setCopied] = useState(false);

    // 倒计时状态
    const [timeLeft, setTimeLeft] = useState({
        days: 0, hours: 0, minutes: 0, seconds: 0
    });

    useEffect(() => {
        // 1. 使用传入的常量日期
        const targetDate = new Date(EARLY_END_DATE);

        const calculateTimeLeft = () => {
            const difference = +targetDate - +new Date();
            if (difference > 0) {
                return {
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60),
                };
            }
            return { days: 0, hours: 0, minutes: 0, seconds: 0 };
        };

        if (new Date() < targetDate) {
            setShow(true);
            setTimeLeft(calculateTimeLeft());
        }

        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const handleCopy = () => {
        navigator.clipboard.writeText(EARLY_CODE);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const pad = (num: number) => num.toString().padStart(2, '0');

    if (!show) return null;

    return (
        <div className="mb-8 mx-auto max-w-4xl rounded-xl bg-gradient-to-r from-pink-100 via-rose-100 to-pink-200 p-3 sm:p-4 border border-pink-200 shadow-sm animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">

                {/* 左侧：文案 + 复制按钮 */}
                <div className="flex-1 flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
                    <div className="bg-pink-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse whitespace-nowrap">
                        {t("badge")}
                    </div>

                    <div className="text-pink-900 text-sm sm:text-base">
                        {t.rich("text", {
                            highlight: (chunks) => <span className="font-bold">{chunks}</span>
                        })}
                    </div>

                    {/* 紧凑的复制组件 */}
                    <button
                        onClick={handleCopy}
                        className="group flex items-center gap-2 bg-white/60 hover:bg-white border border-pink-300 rounded px-2 py-1 transition-all cursor-pointer active:scale-95"
                        title="Click to copy"
                    >
                        <code className="font-mono font-bold text-pink-700 text-sm">
                            {EARLY_CODE}
                        </code>
                        <div className="text-pink-500">
                            {copied ? (
                                <span className="flex items-center text-xs font-bold text-green-600">
                                    <CheckIcon className="w-3.5 h-3.5 mr-1" />
                                    {t("copied")}
                                </span>
                            ) : (
                                <CopyIcon className="w-3.5 h-3.5 group-hover:text-pink-700" />
                            )}
                        </div>
                    </button>
                </div>

                {/* 右侧：紧凑倒计时 */}
                <div className="flex items-center gap-2 text-pink-900 scale-90 sm:scale-100 origin-center">
                    <span className="text-xs font-bold uppercase tracking-wide text-pink-800 mr-1">{t("endsIn")}</span>

                    {timeLeft.days > 0 && (
                        <>
                            <TimeBlock value={pad(timeLeft.days)} label="d" />
                            <span className="text-lg font-bold text-pink-400 pb-2">:</span>
                        </>
                    )}
                    <TimeBlock value={pad(timeLeft.hours)} label="h" />
                    <span className="text-lg font-bold text-pink-400 pb-2">:</span>
                    <TimeBlock value={pad(timeLeft.minutes)} label="m" />
                    <span className="text-lg font-bold text-pink-400 pb-2">:</span>
                    <TimeBlock value={pad(timeLeft.seconds)} label="s" />
                </div>
            </div>
        </div>
    );
}

// 更紧凑的时间块组件
function TimeBlock({ value, label }: { value: string | number, label: string }) {
    return (
        <div className="flex flex-col items-center">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-white/60 backdrop-blur-sm rounded border border-pink-300 flex items-center justify-center shadow-sm">
                <span className="text-sm sm:text-base font-bold text-pink-600 font-mono leading-none">
                    {value}
                </span>
            </div>
            {/* 标签可选：如果觉得太挤，可以把下面的 span 隐藏，只保留上面的数字 */}
            <span className="text-[10px] font-medium text-pink-500 leading-none mt-0.5">{label}</span>
        </div>
    );
}

// SVG Icons (无依赖)
function CopyIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
        </svg>
    )
}

function CheckIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M20 6 9 17l-5-5" />
        </svg>
    )
}
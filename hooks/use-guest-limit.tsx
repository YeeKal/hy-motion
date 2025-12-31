"use client";

import { useState, useEffect } from "react";

import { STORAGE_KEY, MAX_DAILY_LIMIT } from "@/lib/constants";

export function useGuestLimit() {
  const [count, setCount] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // 1. 初始化：组件挂载时读取 LocalStorage
  useEffect(() => {
    const now = Date.now();
    const twentyFourHours = 24 * 60 * 60 * 1000;

    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
      // 旧版使用 date (string), 新版使用 startTime (number)
      const startTime = typeof stored.startTime === 'number' ? stored.startTime : 0;

      // 如果 startTime 存在且在 24 小时内，恢复计数；否则重置
      if (startTime > 0 && (now - startTime < twentyFourHours)) {
        setCount(stored.count || 0);
      } else {
        // 新的 24 小时周期或初次使用
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ startTime: now, count: 0 }));
        setCount(0);
      }
    } catch (e) {
      console.error("Failed to parse usage limit", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // 2. 检查并增加计数 (返回 true 代表允许，false 代表拦截)
  const checkAndIncrement = (): boolean => {
    if (count >= MAX_DAILY_LIMIT) {
      return false; // 次数已满
    }

    const newCount = count + 1;
    const now = Date.now();

    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
      const startTime = typeof stored.startTime === 'number' ? stored.startTime : now;

      setCount(newCount);
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ startTime, count: newCount }));
    } catch (e) {
      console.error("Failed to update usage limit", e);
      // 回退存储逻辑
      setCount(newCount);
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ startTime: now, count: newCount }));
    }

    return true; // 允许生成
  };

  return {
    count,
    remaining: Math.max(0, MAX_DAILY_LIMIT - count),
    max: MAX_DAILY_LIMIT,
    isLoaded,
    checkAndIncrement,
    hasReachedLimit: count >= MAX_DAILY_LIMIT
  };
}
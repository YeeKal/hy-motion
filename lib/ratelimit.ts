// lib/rate-limit.ts
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import {MAX_DAILY_LIMIT} from "@/lib/constants"
// 1. 初始化 Redis 客户端
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// 2. 创建限流器实例
// 规则：每 24 小时 (86400 秒) 允许 3 次请求
const limiter = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(MAX_DAILY_LIMIT, "86400 s"),
  analytics: true, // 启用分析，可以在 Upstash 后台看到图表
  prefix: "@z-image/free-tier", // Redis key 前缀，防止冲突
});

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}


/**
 * 宽松模式：标准化 User-Agent
 * 去掉版本号、构建号，只保留核心设备特征
 * 
 * 例子: 
 * 输入: "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15..."
 * 输出: "mozilla/0 (iphone; cpu iphone os 0 like mac os x) applewebkit/0..."
 */
function normalizeUserAgent(ua: string): string {
  if (!ua) return "unknown";
  
  return ua
    .toLowerCase()
    // 正则解释：匹配所有 [数字]、[点]、[下划线] 的组合，替换为 "0"
    // 这样 Chrome/120.0.1 和 Chrome/121.0.0 都会变成 chrome/0
    .replace(/[\d\._]+/g, "0")
    // 去掉多余的空格
    .replace(/\s+/g, " ")
    .trim();
}


/**
 * 检查限流状态
 * @param ip 用户的 IP 地址
 * @param userAgent 用户的 User-Agent 字符串
 */
export async function checkRateLimit(ip: string, userAgent: string): Promise<RateLimitResult> {
  // 3. 构造复合键：IP + UserAgent
  // 这样同一个办公室内，用 Chrome 的人和用 Safari 的人不会互相占用额度
  // 如果 UserAgent 为空，兜底使用 "unknown"
  const ua  = normalizeUserAgent(userAgent);

  
  // 简单清理一下 UA 字符串，防止 key 过长或包含非法字符 (可选)
  const cleanUA = ua.substring(0, 100).replace(/[^a-zA-Z0-9]/g, "");
  
  const identifier = `${ip}_${cleanUA}`;

  // 4. 执行限流检查
  return await limiter.limit(identifier);
}
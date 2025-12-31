import { Creem } from "creem";

/**
 * Initialize Creem SDK client
 * Server index 1 is used for test environment
 * // 0: production, 1: test-mode
 */
export const creem = new Creem({
serverIdx: process.env.NODE_ENV === "production" ? 0 : 1,
});
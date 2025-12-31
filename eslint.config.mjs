import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    // 在这里添加你的自定义规则
    rules: {
      // 禁用 ESLint 自身的 no-unused-vars 规则，通常在 TypeScript 项目中不需要
      "no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any":"off",
      "@next/next/no-img-element": "off", // 禁用 Next.js 的 no-img-element 规则，允许使用 <img> 标签

      // 配置 @typescript-eslint/no-unused-vars 规则
      // "warn" 表示警告，"error" 表示错误，"off" 表示禁用
      "@typescript-eslint/no-unused-vars": [
        "off", // 或者 "error"
        {
          "argsIgnorePattern": "^_", // 忽略以下划线开头的函数参数，例如 `_event`
          "varsIgnorePattern": "^_", // 忽略以下划线开头的变量，例如 `_unused`
          "caughtErrorsIgnorePattern": "^_", // 忽略 catch 块中以下划线开头的错误变量
          // 其他配置选项...
          // "ignoreRestSiblings": true,
        },
      ],
    },
  },
];

export default eslintConfig;

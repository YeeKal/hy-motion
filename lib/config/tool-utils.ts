import type { ToolMetaConfig } from "@/lib/config/tool-types"
import 'server-only'; // 确保只在服务端运行，防止 fs 模块报错
import fs from 'fs/promises';
import path from 'path';
import { cache } from 'react';


// 🔥 使用 React cache 缓存结果，
// 确保在一个请求周期内，无论多少个组件调用，只会读取一次文件系统
// TODO: process.cwd() 在 Serverless 环境中不可靠
export const getAllToolConfigs = cache(async (locale: string): Promise<ToolMetaConfig[]> => {
  const messagesDir = path.join(process.cwd(), 'messages', locale, "models");
  
  try {
    // 1. 读取目录下所有文件
    const files = await fs.readdir(messagesDir);


    // 3. 并行读取所有文件内容
    const toolsData = await Promise.all(
      files.map(async (file) => {
        const filePath = path.join(messagesDir, file);
        const fileContent = await fs.readFile(filePath, 'utf-8');
        
        try {
          const json = JSON.parse(fileContent);
          
          // 假设你的 JSON 结构里有一个 'config' 字段，或者直接取顶层字段
          // 这里的逻辑取决于你的 JSON 结构
          // 示例结构: { "config": { "title": "PDF Tool", ... }, "button_start": "Start" }
          const config = json.meta || {}; 
        
          return config as ToolMetaConfig;
        } catch (e) {
          console.error(`Error parsing JSON for file ${file}:`, e);
          return null;
        }
      })
    );

    // 4. 过滤掉解析失败的 null，并排序（可选）
    return toolsData
        .filter((t): t is ToolMetaConfig => t !== null)
        // 比如按 title 排序
        // .sort((a, b) => a.title.localeCompare(b.title));

  } catch (error) {
    console.error('Error reading tools directory:', error);
    return [];
  }
});


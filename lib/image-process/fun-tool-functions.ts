import {updateUserCredits} from "@/lib/db";

// 1. 定义每个 toolId 对应的参数类型
interface ToolParamsMap {
    "sora-2-watermark-remover": { videoUrl: string };
    toolB: { action: string; delay: number };
}

// 2. 工具 ID 类型
export type ToolId = keyof ToolParamsMap;

// 3. 通用处理函数类型（用于内部注册）
type ToolHandler = (params: Record<string, unknown>) => unknown | Promise<unknown>;

// ───────────────────────────────────────
// 4. 独立的具体工具处理函数（可很长，可复杂）
// ───────────────────────────────────────

interface PostLinks {
    mp4_wm: string;
    gif: string;
    md: string;
    thumbnail: string;
    mp4: string;
}

interface PostInfo {
    like_count: number;
    attachments_count: number;
    title: string;
    prompt: string | null;
    view_count: number;
}

interface ApiResponse {
    original_input: string;
    post_id: string;
    links: PostLinks;
    post_info: PostInfo;
}

async function Sora2WatermarkRemover(params: ToolParamsMap['sora-2-watermark-remover']): Promise<unknown> {
    // timer
    const startTime = Date.now();

    // 这里可以写很长的逻辑
    const { videoUrl } = params;
    console.log(`[sora-2-watermark-remover] Processing video URL: ${videoUrl}`);

    try {
        new URL(videoUrl);
    } catch {
        console.error('Invalid URL provided:', videoUrl);
        return null;
    }

    // Construct API endpoint
    const apiUrl = `https://api.dyysy.com/links/${encodeURIComponent(videoUrl)}`;

    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            console.error(`API request failed with status ${response.status}`);
            return null;
        }

        const data: ApiResponse = await response.json();
        // Generate mock response with CDN URLs
        const trimData = {
            original_input: videoUrl,
            post_id: data.post_id,
            links: data.links
        };

        // time end
        // const endTime = Date.now();
        // const duration = endTime - startTime;
        // if(duration < 2000){
        //     await new Promise((resolve) => setTimeout(resolve, 2000 - duration));
        // }

        return trimData;
    } catch (error) {
        console.error('Error fetching post data:', error);
        return null;
    }


}

function toolBHandler(params: ToolParamsMap['toolB']): unknown {
    // 这里也可以写很长的逻辑
    const { action, delay } = params;
    if (delay < 0) {
        throw new Error('Delay must be non-negative');
    }
    console.log(`[toolB] Scheduling action "${action}" in ${delay}ms.`);
    setTimeout(() => {
        console.log(`[toolB] Executed: ${action}`);
    }, delay);
    // ... 更多异步或复杂逻辑
    return {};
}

// 5. 创建类型安全的包装器（桥接独立函数与通用调用）
function createToolHandler<T extends ToolId>(
    toolId: T,
    handler: (params: ToolParamsMap[T]) => unknown | Promise<unknown>
): ToolHandler {
    return (params: Record<string, unknown>) => {
        // 可选：此处可加入运行时验证（如 Zod）
        return handler(params as ToolParamsMap[T]); // 类型断言（假设 JSON 结构正确）
    };
}

// 6. 注册所有工具（映射 toolId 到包装后的处理函数）
const toolHandlers: { [K in ToolId]: ToolHandler } = {
    'sora-2-watermark-remover': createToolHandler('sora-2-watermark-remover', Sora2WatermarkRemover),
    toolB: createToolHandler('toolB', toolBHandler),
};

// 7. 主分发函数
export async function dispatchTool(userId: string, toolId: ToolId, toolParam: string): Promise<unknown> {
    try {
        await updateUserCredits(userId, -5);
    } catch (error) {
        console.error('Error deducting user credits:', error);
        throw new Error(`Failed to deduct user credits: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    let parsedParams: Record<string, unknown>;
    try {
        parsedParams = JSON.parse(toolParam);
    } catch (error) {
        throw new Error(`Invalid JSON in toolParam: ${toolParam}`);
    }

    const handler = toolHandlers[toolId];
    if (!handler) {
        throw new Error(`Unknown toolId: ${toolId}`); // 理论上不会发生（TS 保证）
    }

    const result = await handler(parsedParams);
    return result;
}

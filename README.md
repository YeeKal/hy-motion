## commands

convert mp4 to gif on ubuntu

> ffmpeg -i formula-ocr-step3.mp4 -r 15 -vf "scale=680:-1" formula-ocr-step3.gif

convert images to webp:

> for file in *.png *.jpeg *.jpg; do cwebp "$file" -o "${file%.*}.webp"; done
> for file in *.mp4;do ffmpeg -i "$file" -c:v libvpx-vp9 -crf 32 -b:v 0 -cpu-used 4 -c:a libopus "${file%.*}.webm"; done

batch replace to .webp

> /assert/models/(.*)\.(png|jpe?g|webp)  -> https://cdn.z-image.app/models/$1.webp

## TODO

用户痛点收集

- 自动化转换与重定向（Retargeting）
    - 骨骼绑定（Rigging）
        预设骨骼支持：直接支持导出适配 Unity Humanoid、Unreal Engine 5 Manny/Quinn、Mixamo 的格式
    - 重定向（Retargeting）：，让生成的动作能自动适配到用户上传的常见模型（如 Mixamo 骨骼、UE5 Mannequin、VRM 模型）上
- 非人类模型 human motion
- 转换为视频
- 连贯性问题：AI 生成的动作往往是片段式的。如果用户需要“先走路，然后停下，再挥手”，目前的模型可能很难一次性生成流畅的长序列。你可能需要开发“动作融合”功能

- [x] Planning
    - [x] multiple language support
- [ ] Implementation
    - [ ] Create `components/models-ui` directory
    - [ ] Implement `ModelSelector`
- [ ] Verification
    - [ ] Verify UI responsiveness and aesthetics
    - [x] Verify logic (Model inputs, validation, API integration)
- [ ] UI Improvements
    - [ ] playground history
    - [ ] canvas Loop / Play / Pause 控制按钮
- [ ] Function complete（功能完备性）
    - [ ] contact page submit
- [ ] Performance: https://pagespeed.web.dev/analysis/https-z-image-app/7gz67k5eoh?form_factor=mobile
    - [ ] improve performance

1. prompts
2. gallery


## competitors

- https://z-image.pro/pricing  功能最完善 模型支持多
- https://z-image.co/#ai-image-generator  多模型支持
- https://z-image.ai/  嵌入hf 链接 
- https://zimage.top/pricing  嵌入hf链接
- https://zimage.net/ 嵌入hf链接



## background

domain: z-image.app

model information:

- huggingface: https://huggingface.co/Tongyi-MAI/Z-Image-Turbo
- official hompage: https://tongyi-mai.github.io/Z-Image-homepage/

## dev commands

wsl 开发
> pnpm next dev -H 0.0.0.0

prisma
> pnpm add -D prisma
> pnpm add @prisma/client
> pnpm prisma generate # 生成 prisma client

prisma change schema
> # 1. 基于修改后的 schema.prisma 生成迁移文件
> npx prisma migrate dev --name 描述这次改动的名字

vercel deploy build config
> pnpm prisma generate && pnpm build

google auth:
https://console.cloud.google.com/auth/clients/create?hl=zh-cn&project=gen-lang-client-0746857282


pnpm add next@15.3.6 react@19.1.2 react-dom@19.1.2

## 踩坑记录

1. favicon 保留svg格式
2. cludflare 关闭 ai crawl control
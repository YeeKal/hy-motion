## commands

convert mp4 to gif on ubuntu

> ffmpeg -i formula-ocr-step3.mp4 -r 15 -vf "scale=680:-1" formula-ocr-step3.gif

convert images to webp:

> for file in *.png *.jpeg *.jpg; do cwebp "$file" -o "${file%.*}.webp"; done
> for file in *.mp4;do ffmpeg -i "$file" -c:v libvpx-vp9 -crf 32 -b:v 0 -cpu-used 4 -c:a libopus "${file%.*}.webm"; done

batch replace to .webp

> /assert/models/(.*)\.(png|jpe?g|webp)  -> https://cdn.z-image.app/models/$1.webp

## TODO

- [x] Planning
    - [x] multiple language support
- [ ] Implementation
    - [ ] Create `components/models-ui` directory
    - [ ] Implement `ModelSelector`
- [ ] Verification
    - [ ] Verify UI responsiveness and aesthetics
    - [x] Verify logic (Model inputs, validation, API integration)
- [ ] UI Improvements
    - [ ] nav bar menu  in mobile  
- [ ] Function complete（功能完备性）
    - [ ] contact page submit
- [ ] Performance: https://pagespeed.web.dev/analysis/https-z-image-app/7gz67k5eoh?form_factor=mobile
    - [ ] improve performance

1. prompts
2. gallery
3. develop
    - z image turbo gguf
    - z image turbo fp8
    - z-image comfyui
    - z-image lora
3. comfy ui
4. lora 
5. style prompt: https://github.com/twri/sdxl_prompt_styler/tree/main

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
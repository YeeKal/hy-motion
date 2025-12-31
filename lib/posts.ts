import fs from 'fs';
import path from 'path';
import matter from "gray-matter";
import { parseMarkdown } from "./markdown"

export type BlogPostMeta  = {
    id?: string
    slug: string
    title: string
    date: string | Date
    cover: string
    description: string
    seoTitle?: string
    seoDesc?: string
    category?: string
  }
  
  export type BlogCardProps = {
    post: BlogPostMeta
    variant?: "default" | "compact"
  }


const POST_DIR = "";// "resources/posts";
const ABOUT_DIR = "resource/about";

let cachedPosts: BlogPostMeta[] | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 60 * 1000 * 60 * 24; // 1 minute cache

export async function getAllPosts() {
    // Return cached posts if available and not expired
    if (cachedPosts && Date.now() - lastFetchTime < CACHE_DURATION) {
        return cachedPosts;
    }

    // 获取Markdown文件的路径
    const contentDirectory = path.join(process.cwd(), POST_DIR);
    const fileNames = fs.readdirSync(contentDirectory);
    const allPostsData = await Promise.all(
        fileNames
          .filter((fileName) => fileName.endsWith(".md"))
          .map(async (fileName, index) => {
            const slug = fileName.replace(/\.md$/, "")
            const fullPath = path.join(contentDirectory, fileName)
            const fileContents = fs.readFileSync(fullPath, "utf8")
    
            // Use gray-matter to parse the post metadata section
            const { data } = matter(fileContents)
    
            return {
                id: index.toString(), 
                slug: slug,
                title: data.title,
                date: data.date,
                cover: data.cover,
                description: data.description,
                seoTitle: data.seoTitle,
                seoDesc: data.seoDesc,
                category: data?.category
            } as BlogPostMeta
          }),
      )

    // Sort posts by date
    cachedPosts = allPostsData.sort((a, b) => {
        if (a.date < b.date) {
            return 1
        } else {
            return -1
        }
    });
    lastFetchTime = Date.now();
    
    return cachedPosts;
}

export async function getPostContent(slug:string){
    const filePath = path.join(process.cwd(), 
    POST_DIR, 
    `${slug}.md`);
    const fileContents = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(fileContents);

    // Parse the markdown content
    const { html, toc } = await parseMarkdown(content)

    return {
        meta:{
            id: "0", 
            slug: slug,
            title: data.title,
            date: data.date,
            cover: data.cover,
            description: data.description,
            seoTitle: data.seoTitle,
            seoDesc: data.seoDesc,
            category: data?.category
        } as BlogPostMeta,
        content: html,
        toc,
    }
}

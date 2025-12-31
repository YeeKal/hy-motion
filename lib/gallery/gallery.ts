import type { GalleryItem, CategoryType } from "./types"
import data from '../../resources/gallery.json'; // 👈 注意路径前缀 @/ 指向 src/ 或根目录

export const getStaticData = () => data;

async function loadGalleryData(): Promise<GalleryItem[]> {
  try {
    
    const response = getStaticData();
    return response as GalleryItem[];
  } catch (error) {
    console.error("Error loading gallery data:", error)
    return []
  }
}

export async function getGalleryItems(category?: CategoryType): Promise<GalleryItem[]> {
  const rawItems = await loadGalleryData()
  

  // 1. 创建副本并排序
  // 使用 new Date().getTime() 将字符串转换为时间戳进行比较
  const sortedItems = [...rawItems].sort((a, b) => {
    // b - a = 降序 (最新的日期排在前面)
    // a - b = 升序 (最旧的日期排在前面)
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  // 2. 接着进行分类筛选
  if (!category || category === "All") {
    return sortedItems;
  }

  return sortedItems.filter((item) => item.category === category);

}

export async function getGalleryItemBySlug(slug: string): Promise<GalleryItem | undefined> {
  const items = await loadGalleryData()
  return items.find((item) => item.slug === slug)
}

export async function getAllSlugs(): Promise<string[]> {
  const items = await loadGalleryData()
  return items.map((item) => item.slug)
}

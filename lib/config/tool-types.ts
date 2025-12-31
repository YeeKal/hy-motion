
// 为 JSON-LD 结构化数据定义一个基础类型，可以根据需要扩展
// 例如，可以创建 'HowTo' 和 'FAQPage' 类型的 schema
type StructuredData = {
  '@context': 'https://schema.org';
  '@type': 'FAQPage' | 'HowTo' | 'SoftwareApplication'; // 页面类型
  [key: string]: any; // 其他属性
};

export type ToolMetaConfig = { // 元数据，主要用于预览
  slug: string; // 与上面slug相同，用于元数据引用
  name: string; // 工具名称，例如 "Nano Banana Pro"
  description: string; // 简短描述，用于预览
  cover: {       // 封面图片，用于社交分享等
    url: string;
    alt: string;
  };
}


export interface ToolConfig {
  meta: ToolMetaConfig;
  seo: {
    title: string; // 页面标题，60个字符以内
    description: string; // 页面描述，160个字符以内
    keywords?: string[];
    ogImage: string; // Open Graph 图片，用于社交分享
    creator: string; // default "@yeekal"
    structuredData: StructuredData[]; // 结构化数据,只需要SoftwareApplication 类型
  };

  hero: {
    eyebrow: string; // 小标题，例如 "Free Online Tool"
    title: string; // H1 标题
    tagline: string; // H1 下的描述性文字
    features: {
      icon?: string; // 可选的图标
      text: string;
    }[];
  };

  imageGallery: {
    title: string;
    description: string;
    images:
    {
      src: string;
      alt: string;
    }[]

  };

  how_to: {
    title: string;
    description: string;
    steps: {
      icon: string;
      title: string;
      description: string;
      // 新增：可选的媒体字段
      media?: {
        type: 'image' | 'video' | 'gif'; // 定义媒体类型
        url: string; // 媒体文件的URL
        alt: string; // SEO和可访问性的alt文本
      };
    }[];
  };


  useCases: {
    title: string;
    description: string;
    scenarios: {
      key: string;
      shortTitle: string;
      originalTitle: string;
      tagline: string;
      description: string;
      image: {
        src: string;
        alt: string;
      };
    }[];
  };

  features: {
    title: string;
    description: string;
    items: {
      icon: string;
      title: string;
      description: string;
    }[];
  };

  faq: {
    title: string;
    items: {
      question: string;
      answer: string;
    }[];
  };

  cta: {
    title: string;
    description: string;
    button: {
      text: string;
    };
  };
}
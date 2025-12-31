



export type OCRResult = {
  text_content: string
  bounding_boxes?: Array<{ text: string; box: number[] }>
  visualization_b64?: string | string[]
  delayTime?: number
  executionTime?: number
}
// --- DATA TYPES ---
export interface ImageDetail {
  src: string;
  alt: string;
}

export interface VideoDetail {
  videoUrl: string; // URL to the video file
  posterImage?: string; // Optional poster image for the video
  alt: string; // Alt text for accessibility
}

export interface Scenario {
  id: string;
  shortTitle: string;
  originalTitle: string;
  tagline: string;
  description: string;
  images: ImageDetail[];
}

export interface ScenarioShowcaseConfig {
  title: string;
  description: string;
  scenarios: Scenario[];
}

export enum ToolType {
    ImageGeneration,
    EditImage,
    RemoveBackground
}

export enum ModelType {
  TextToImage,
  TIToImage, // text required, image optional
  TIIToImage, // text required, image required
  // ImageToImage, // no text general image is meaningless
  BackgroundRemover,
  LabubuLora,
  KontextLora, // for lora model
  FluxLora, // for flux lora model
  ImageToVideo, // image required
}

export interface LoraParams {
  id: string; // Unique identifier for the LoRA
  loraPath:string,
  loraScale: number,
  icon?: string, // Optional icon for the LoRA
  name?: string, // Optional name for the LoRA
  description?: string, // Optional description for the LoRA
  triggerWords?: string,
  steps?: number,
  size?: `${number}x${number}`,
  n?: number,
}

export type Model={
    id:string
    apiId: string
    type: ModelType
    name:string
    description:string
    providerId: string
    price:number
    duration:number
    credits:number
    isFree:boolean
    isAvailable:boolean
    withImg:boolean  // if this model can receive the image
    lora?: LoraParams
    //  composer will check the compatibility with prompt and image as the order
    composer?:{
      type: ModelType
      apiId: string
      providerId: string
      credits: number
      price: number
    }[]
}

export type Tool={
    id:string
    name:string
    description:string
    type:ToolType
    defaultModel:Model
    defaultPrompt:string
    imgRequired:ParamRequirement
    promptRequired:boolean
}


export enum ToolCategory {
    ImageGeneration = "image-generation",
    ImageEditing = "image-editing",
    ImageStyle = "style-ai",
    ImageModels = "image-models", // For pages detailing specific models
    KontextLora = "kontext-lora", // For pages detailing specific Lora models
    VideoGeneration = "video-generation",
    Ai3DIcon = "ai-3d-icon",
    FunTools = "fun-tools", // image or video , text process tools
  }
  
  export enum ParamRequirement {
    Required = "required",
    Optional = "optional",
    Disabled = "disabled", // e.g., for a purely text-to-image generator or informational model page
  }
  
  export interface SEOConfig {
    title: string;
    description: string;
    keywords?: string[];
    ogImage?: string;
  }
  
  export interface PageHeaderConfig {
    pageTitle: string; // e.g., "Ghibli Style AI Generator" - used as H1
    pageTagline: string; 
    videoSrc?: string; // URL to a video file (e.g., .webm or .mp4)
    videoPoster?: string; // Optional poster image for the video
    heroImage?: {
      src: string; // URL to the hero image
      alt: string; // Alt text for accessibility
    };
    buttons?: {label:string, link:string}[]
  }
  
  export interface FeatureItemConfig {
    icon: string;
    title: string;
    description: string; 
  }
  
  export interface FeaturesSectionConfig {
    title: string;
    description: string; 
    items: FeatureItemConfig[];
  }
  
  export interface GalleryImageConfig {
    srcs: string[]; // there may be two or multi image , such as combine two into one
    alts: string[]; // the same length of srcs
    prompt?: string;
  }
  
  export interface GallerySectionConfig {
    title: string;
    description: string; 
    images: GalleryImageConfig[];
  }
  
  export interface FAQItemConfig {
    question: string;
    answer: string; // Markdown
  }
  
  export interface FAQSectionConfig {
    title: string;
    items: FAQItemConfig[];
  }

  export interface CallToActionConfig {
      title: string;
      description: string;
      button: {
        text: string;
        link: string;
      };
    }
  
  export interface PromptEngineConfig {
    defaultPrompt: string;
    promptPrefix: string;
    promptSuffix: string;
    placeholder: string;
    promptExamples: string[];
    promptRequired: ParamRequirement;
    exampleImgUrl: string;
  }

  export interface Lora{
    coverSrc:string; // URL to the cover image for the LoRA
    coverAlt:string; // Alt text for the cover image
    title: string; // Title of the LoRA
  }

  export interface LoraSectionConfig {
    title: string; // Section title, e.g., "LoRA Models"
    description: string; // Optional description for the section
    loras: Lora[]; // Array of LoRA models
  }
  
  export interface ParamSubItem {
    name: string;
    id: string;
    icon: string;
    value: string;

  }
  export interface ParamItem {
    name: string
    id: string;
    defaultSubItemId: string;
    subItems: ParamSubItem [] 
  }
  type CallbackFunc = (rawPrompt:string,params:string,paramDef:ParamItem[]) => string;

  export interface ParamSchema {
    callbackFunc: CallbackFunc;
    params: ParamItem[]
  }

  // --- Main Configuration for a Tool / Page Content ---
  export interface ToolConfig {
    id: string; // Unique identifier, e.g., "ghibli-style"
    slug: string; // URL-friendly, e.g., "ghibli-style"
    name: string; // User-friendly name, e.g., "Ghibli Style AI Generator"
    category: ToolCategory;
    icon?: string; // Optional icon for the tool
    defaultAspectRatio?: string; // e.g., "1024x1024" - default image size for this tool
    isDefaultToolForTheme?: boolean; // True if this is the default for a theme page
    paramSchema?:ParamSchema;
    // For the editor instance on this page
    editorConfig: {
      modelTypes: ModelType[]; // e.g., [ModelType.TextToImage, ModelType.TIToImage]
      isExclusive: boolean; // True if THE DEFAULT MODEL for this tool, false if just one of many options
      imgRequired: ParamRequirement;
      defaultModelId: string; // ID of the FLUX.1 model (from a separate models constant)
      promptEngine: PromptEngineConfig;
    //   specificToolParams?: Record<string, any>; // e.g., { style_strength: 0.8 }
      // Potentially add editor layout hints here if needed
    };
  
    seo: SEOConfig;
    pageHeader: PageHeaderConfig  // render before editor
    loraSectionConfig?: LoraSectionConfig;
    scenarioShowcase?: ScenarioShowcaseConfig; // Optional, if this tool has practical scenarios
    gallerySection: GallerySectionConfig; // Examples created with *this* tool/style
    featuresSection: FeaturesSectionConfig; // Features of *this* specific tool/style
    faqSection: FAQSectionConfig; // FAQs specific to *this* tool/style
    cta?:CallToActionConfig;
    summaryMD?: string;
  }
  
  // --- Configuration for a Theme/Parent Page ---
  export interface ThemeConfig {
    id: ToolCategory; // e.g., ToolCategory.ImageGeneration, defaultToolId is this too
    iconType: string
    slug: string;
    tools: ToolConfig[]
  }

  export interface ToolMiniConfig {
    id: string,
    slug: string,
    name:string,
    defaultAspectRatio?: string, // e.g., "1024x1024" - default image size for this tool
    defaultModel:string
    placeholder: string,
    promptRequired:ParamRequirement,
    imgRequired: ParamRequirement,
    exampleImgUrl: string,
    modelTypes: ModelType[]; // e.g., [ModelType.TextToImage, ModelType.TIToImage]
    isExclusive: boolean;
    paramItems?: ParamItem[];
  }

  export interface ThemeMiniConfig{
    iconType:string,
    slug:string,
    name:string,
    tools:ToolMiniConfig[]
  }

  /*
  1. if prompt optional and no empt specified, then use default prompt
  2. if prompt required and suffix or prefix specified, then add suffix and prefix to the prompt
   */

  export interface ImageParam{
    src: string;
        alt: string;
  }

// types/pageConfig.ts
export interface PageConfig {
  seo: {
    title: string;
    description: string;
    keywords: string[];
    ogImage: string;
    creator: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    tagline: string;
    ctaButton: {
      text: string;
      link: string;
    };
     waitlistButton: {
      text: string;
      link: string;
    };
    features:{
      f1: string;
      f2:string;
      f3: string;
    }
  };
  playground: {
    title: string;
    tagline: string;
    iframeUrl: string;
  };
  taskAbilities: {
    title: string;
    description: string;
    tasks: {
      icon: string;
      title: string;
      description: string;
      images: {
        input: string;
        output: string;
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
  useCases: {
    title: string;
    description: string;
    scenarios: {
      id: string;
      shortTitle: string;
      originalTitle: string;
      tagline: string;
      description: string;
      images:ImageParam[];
    }[];
  };
  diveDeeper: {
    title: string;
    description: string;
    items: {
      title: string;
      description: string;
      link: string;
      icon: string;
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
      link: string;
    };
  };
  waitlist: {
    title: string;
    description: string;
    placeholder: string;
    buttonText: string;
  };
  footer: {
    tagline: string;
    copyright: string;
    sections: 
      {
        title: string,
        links:
        {
          text:string,
          href: string,
        }[]
      
      }[];

  },
}
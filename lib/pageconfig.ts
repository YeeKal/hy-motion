import { PageConfig } from "@/lib/types";

export const pageConfig: PageConfig = {
  seo: {
    title: "Free DeepSeek-OCR: High-Accuracy Text & Table Extraction | DeepSeekOCR.io",
    description: "Experience DeepSeek-OCR, convert scanned notes, reports, and charts into editable text with incredible accuracy. Free to use, no sign-up required",
    keywords: [
      "deepseekocr",
      "deepseek ocr",
      "contexts optical compression",
      "efficient ocr",
      "document parsing",
      "vision language model",
      "long-context compression",
      "ocr api",
      "deepseek ocr paper"
    ],
    ogImage: "https://cdn.deepseekocr.io/tools/ai-ocr/ai-ocr-og.webp",
    creator: "@yeekal"
  },
  hero: {
    eyebrow: "Experience a Leading Document Understanding Technology",
    title: "Free OCR Playground",
    tagline: "Experience a Leading Document Understanding Technology. Powered by DeepSeek OCR and PaddleOCR",
    ctaButton: {
      text: "Try for Free Now",
      link: "playground"
    },
     waitlistButton: {
      text: "Join Pro features Waitlist",
      link: "/waitlist"
    },
    features:{
        f1: "High accuracy",
        f2: "Structured Markdown",
        f3: "Layout Aware"
    }
  },
  playground: {
    title: "Try the Interactive Demo",
    tagline: "Drag and drop a document or image into the window below to see the power of optical compression in action. No sign-up required.",
    // iframeUrl: "https://axiilay-deepseek-ocr-demo.hf.space/"
    iframeUrl: "https://huggingface.co/spaces/axiilay/DeepSeek-OCR-Demo"
    // iframeUrl: "https://huggingface.co/spaces/khang119966/DeepSeek-OCR-DEMO"
  },
  taskAbilities: {
    title: "One Tool, Multiple Abilities",
    description: "DeepSeek-OCR is more than just a text extractor. It's a versatile vision model capable of performing a wide range of document and image intelligence tasks.",
    tasks: [
      {
        icon: "📝",
        title: "Free OCR",
        description: "Extracts raw, unformatted text from any image or document page. Perfect for quick digitization and content extraction.",
        images: {
          input: "https://cdn.deepseekocr.io/home/wiki-free-ocr.webp",
          output: "https://cdn.deepseekocr.io/home/wiki-free-ocr-res.webp"
        }
      },
      {
        icon: "📄",
        title: "Convert to Markdown",
        description: "Preserves the document's structure, including headings, lists, and tables, by converting it into clean, readable Markdown.",
        images: {
          input: "https://cdn.deepseekocr.io/home/doc_markdown.webp",
          output: "https://cdn.deepseekocr.io/home/doc_markdown_layout.webp"
        }
      },
      {
        icon: "📈",
        title: "Parse Figure",
        description: "Goes beyond text to extract structured data from charts and graphs, turning visual information into usable data tables.",
        images: {
          input: "https://cdn.deepseekocr.io/home/2010_homicide_rates.webp",
          output: "https://cdn.deepseekocr.io/home/2010_homicide_rates_-ocr.webp"
        }
      },
      {
        icon: "🔍",
        title: "Locate Object (Grounding)",
        description: "Finds specific text or elements within an image based on your prompt, providing precise bounding box coordinates.",
        images: {
          input: "https://cdn.deepseekocr.io/home/industrial-revolution.webp",
          output: "https://cdn.deepseekocr.io/home/industrial-revolution-locate.webp"
        }
      },
      {
        icon: "🖼️",
        title: "Detailed Image Description",
        description: "Functions as a powerful Vision-Language Model, providing rich, detailed captions and descriptions for any image.",
        images: {
          input: "https://cdn.deepseekocr.io/home/annisa.webp",
          output: "https://cdn.deepseekocr.io/home/image-describe.webp"
        }
      }
    ]
  },
  features: {
    title: "A Breakthrough in Efficiency and Accuracy",
    description: "DeepSeek-OCR isn't just another text recognition tool. It's a fundamental rethinking of how machines process visual information, built to be both powerful and lightweight.",
    items: [
      {
        icon: "📦",
        title: "Contexts Optical Compression",
        description: "The core innovation. We represent high-resolution documents with a fraction of the vision tokens, dramatically reducing computational costs and increasing processing speed."
      },
      {
        icon: "🎯",
        title: "State-of-the-Art Accuracy",
        description: "Achieve up to 97% OCR precision on complex benchmarks. DeepSeek-OCR surpasses leading models while using significantly fewer resources."
      },
      {
        icon: "📄",
        title: "Versatile Document Parsing",
        description: "Go beyond plain text. Intelligently extract data from complex layouts, including academic papers, financial charts, chemical formulas, and geometric figures."
      },
      {
        icon: "🚀",
        title: "Built for Massive Scale",
        description: "Engineered for real-world deployment, capable of processing over 200,000 pages per day on a single GPU, making it ideal for large-scale data annotation and LLM training."
      },
      {
        icon: "🌍",
        title: "Global Language Recognition",
        description: "Trained on a vast dataset covering nearly 100 languages, allowing for accurate text extraction from international documents without changing models."
      },
      {
        icon: "🧠",
        title: "Low-Memory Architecture",
        description: "The novel DeepEncoder design processes high-resolution images while maintaining low activation memory, enabling deployment on less powerful hardware and reducing operational costs."
      }
    ]
  },
  useCases: {
    title: "From Research to Enterprise: Real-World Applications",
    description: "DeepSeek-OCR unlocks new possibilities across industries by making sophisticated document analysis accessible and scalable.",
    scenarios: [
      {
        id: "academic-research",
        shortTitle: "Academic Research",
        originalTitle: "Accelerating Academic & Historical Research",
        tagline: "Digitize entire archives in record time.",
        description: "Researchers can now convert vast libraries of scanned papers, historical texts, and manuscripts into machine-readable text with incredible speed. The model's ability to handle diverse layouts and languages makes it an indispensable tool for data mining in the humanities and sciences.",
        images:[
            {
                src:"https://cdn.deepseekocr.io/home/ocr-paper.webp",
                alt:"Academic Research with DeepSeek-OCR"
            },
            {
                src:"https://cdn.deepseekocr.io/home/ocr-manuscript.webp",
                alt:"Historical Manuscript Digitization"

            }
        ]
      },
      {
        id: "financial-automation",
        shortTitle: "Financial Automation",
        originalTitle: "Automating Financial Data Extraction",
        tagline: "Turn reports into structured data.",
        description: "Effortlessly extract tables, charts, and key figures from dense financial reports, invoices, and bank statements. The high accuracy and layout-aware parsing reduce manual data entry, minimize errors, and accelerate financial workflows and analysis.",
        images:[
             {
                src:"https://cdn.deepseekocr.io/home/ocr-research.webp",
                alt:"Financial Report Analysis with DeepSeek-OCR"

            }
        ]
      },
      {
        id: "llm-data-pipelines",
        shortTitle: "LLM Data Pipelines",
        originalTitle: "Powering Next-Gen AI with Quality Data",
        tagline: "The ultimate data source for LLMs.",
        description: "Generate vast, high-quality datasets for training Large Language Models (LLMs) and Vision-Language Models (VLMs). DeepSeek-OCR's efficiency makes it economically viable to process millions of documents, creating diverse and rich training corpora.",
        images:[
             {
                src:"https://cdn.deepseekocr.io/home/diverse-documents.webp",
                alt:"Diverse Document Processing for LLMs"

            }
        ]
      },
      {
        id: "digital-archiving",
        shortTitle: "Digital Archiving",
        originalTitle: "Creating Efficient Digital Libraries",
        tagline: "Archive, search, and manage documents.",
        description: "Transform physical documents into a lightweight, searchable digital archive. The optical compression ensures that storage requirements are minimized while the high-quality text extraction makes every document instantly discoverable.",
        images:[
             {
                src:"https://cdn.deepseekocr.io/home/old-manu.webp",
                alt:"Digital Archiving with DeepSeek-OCR"

            }
        ]
      }
    ]
  },
  diveDeeper: {
    title: "For Researchers and Developers",
    description: "Explore the technology that powers DeepSeek-OCR. Read the full paper or dive into the open-source code on GitHub.",
    items: [
      {
        title: "Read The Research Paper",
        description: "Get a detailed breakdown of the model architecture, training process, and benchmark performance.",
        link: "https://github.com/deepseek-ai/DeepSeek-OCR/blob/main/DeepSeek_OCR_paper.pdf",
        icon: "📜"
      },
      {
        title: "Explore The Source Code",
        description: "Access the complete codebase, model weights, and contribute to the future of optical compression.",
        link: "https://github.com/deepseek-ai/DeepSeek-OCR",
        icon: "💻"
      }
    ]
  },
  faq: {
    title: "Frequently Asked Questions",
    items: [
      {
        question: "What is DeepSeek-OCR?",
        answer: "DeepSeek-OCR is a new vision-language model that specializes in recognizing and extracting text and data from documents using an innovative technique called 'Contexts Optical Compression'."
      },
      {
        question: "What makes 'Contexts Optical Compression' different?",
        answer: "Instead of converting every detail of an image into a large number of tokens, it intelligently compresses the visual information. This means it can represent a full, complex page with up to 10x fewer data points than traditional models, making it incredibly fast and efficient."
      },
      {
        question: "Is DeepSeek-OCR free to use?",
        answer: "Yes, the model is open-source and the live demo on this site is free to use. For commercial or large-scale use, you can access the model weights and code from the official GitHub repository."
      },
      {
        question: "Is there an official API available?",
        answer: "Currently, there is no official hosted API. However, the project is open-source, allowing you to deploy and host your own instance. We recommend following the GitHub project for future announcements about a public API."
      },
      {
        question: "What file types can I analyze?",
        answer: "The underlying model can process a wide range of image formats (PNG, JPEG, WebP) and is particularly effective on pages from PDF documents. The live demo supports direct image uploads and pastes."
      },
      {
        question: "How does this compare to Tesseract or other OCR libraries?",
        answer: "DeepSeek-OCR is an end-to-end deep learning model that excels at understanding complex layouts, like tables and charts, which traditional OCR libraries often struggle with. Its primary advantage is superior efficiency and accuracy on dense, structured documents."
      },
      {
        question: "What languages does the model support?",
        answer: "The model was trained on a massive dataset covering nearly 100 languages, making it highly effective for multilingual document analysis."
      },
      {
        question: "Can it understand document structure, not just text?",
        answer: "Absolutely. This is a key strength. It can parse charts into structured data, understand tables, and recognize layouts, converting them into clean formats like Markdown."
      }
    ]
  },
  cta: {
      title: "Experience the Difference Yourself",
      description: "Reading about it is one thing, but seeing it in action is another. Scroll back up to the playground and analyze your own document to witness the speed and accuracy of DeepSeek-OCR firsthand.",
      button: {
        text: "Try the Demo Now",
        link: "playground"
      }
  },
  waitlist: {
    title: "Be the First to Know",
    description: "We are developing an enhanced suite of tools built on DeepSeek-OCR, including API access and advanced features. Join the waitlist to get notified when we launch.",
    placeholder: "Enter your email address",
    buttonText: "Join Waitlist"
  },
  footer: {
    tagline: "Analyze More. Compute Less. A showcase for the DeepSeek-OCR project.",
    copyright: "© 2025 DeepSeekOCR.io. All rights reserved. Not affiliated with DeepSeek-AI.",
    sections: [
      {
        title: "PROJECT",
        links:[
        {
          text: "Official GitHub",
          href: `https://github.com/deepseek-ai/DeepSeek-OCR`,
        },
        {
          text: "Research Paper",
          href: `https://github.com/deepseek-ai/DeepSeek-OCR/blob/main/DeepSeek_OCR_paper.pdf`,
        },
        {
          text: "DeepSeek-AI",
          href: `https://www.deepseek.com/`,
        },
      ]
      },
      {
        title: "LEGAL",
        links: [
          { text: "About This Site", href: "/about" },
          { text: "Contact", href: "/contact" },
          { text: "Terms of Service", href: "/terms" },
          { text: "Privacy Policy", href: "/privacy" },
        ],
      },
      {
        title: "FRIENDS",
        links:[
            {text: "Runpod", href: "https://runpod.io?ref=5kdp9mps"},
        ]
      }
    ],
  },
};
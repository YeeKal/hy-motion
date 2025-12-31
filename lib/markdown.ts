import { unified } from "unified"
import remarkParse from "remark-parse"
import remarkRehype from "remark-rehype"
import rehypeStringify from "rehype-stringify"
import rehypeSlug from "rehype-slug"
import remarkGfm from "remark-gfm"
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { visit } from "unist-util-visit"

export interface TocItem {
  id: string
  text: string
  level: number
}

export interface ParsedContent {
  html: string
  toc: TocItem[]
}

// Plugin to extract TOC from markdown
function extractToc() {
  return (tree: any, file: any) => {
    const toc: TocItem[] = []

    visit(tree, "heading", (node) => {
      if (node.depth >= 2 && node.depth <= 4) {
        // Only include h2, h3, h4
        let text = ""

        // Extract text from the heading
        visit(node, "text", (textNode) => {
          text += textNode.value
        })

        // Get the ID (will be set by remark-slug)
        const id =
          node.data?.id ||
          text
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^\w-]/g, "")

        // Ensure node has data and id for remark-slug
        node.data = node.data || {}
        node.data.id = id

        toc.push({
          id,
          text,
          level: node.depth,
        })
      }
    })

    file.data.toc = toc
  }
}

export async function parseMarkdown(content: string): Promise<ParsedContent> {
  const file = await unified()
    .use(remarkParse) // Parse markdown
    .use(remarkGfm) // GitHub Flavored Markdown
    .use(extractToc) // Extract TOC
    .use(remarkRehype) // Convert to HTML AST
    .use(rehypeSlug) // Add IDs to headings
    .use(rehypeStringify) // Convert to HTML string
    .process(content)

  return {
    html: String(file),
    toc: file.data.toc as TocItem[],
  }
}

export async function parseMarkdownWithMath(content: string): Promise<ParsedContent> {
  const file = await unified()
    .use(remarkParse) // Parse markdown
    .use(remarkGfm) // GitHub Flavored Markdown
    .use(remarkMath)   
    .use(extractToc) // Extract TOC
    .use(remarkRehype,  { allowDangerousHtml: true }) // Convert to HTML AST
    .use(rehypeKatex) // Render LaTeX math
    .use(rehypeSlug) // Add IDs to headings
    .use(rehypeStringify,  { allowDangerousHtml: true }) // Convert to HTML string
    .process(content)

  return {
    html: String(file.value),
    toc: file.data.toc as TocItem[],
  }
}


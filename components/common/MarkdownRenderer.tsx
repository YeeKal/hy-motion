
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'; // For GitHub Flavored Markdown (tables, strikethrough, etc.)

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      
      components={{
        // You can customize rendering of specific elements here if needed
        // For example, to make links open in a new tab:
        // a: ({node, ...props}) => <a {...props} target="_blank" rel="noopener noreferrer" />
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
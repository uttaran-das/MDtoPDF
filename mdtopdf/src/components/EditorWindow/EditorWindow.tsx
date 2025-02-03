import { useEffect, useState } from 'react';
import { marked } from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';
import DOMPurify from 'dompurify';

import './EditorWindow.css';

// Configure highlight.js
hljs.configure({
    languages: ['javascript', 'typescript', 'python', 'html', 'css', 'bash'],
});

declare module 'marked' {
    interface MarkedOptions {
        highlight?: (code: string, lang: string) => string;
    }
}

// Configure marked
marked.setOptions({
    breaks: true,
    gfm: true,
    highlight: (code, lang) => {
        const language = hljs.getLanguage(lang) ? lang : 'plaintext';
        return hljs.highlight(code, { language }).value;
    },
});

export default function EditorWindow() {
    const [markdown, setMarkdown] = useState(
        `# Welcome to MDtoPDF!\n\n## Code Example\n\`\`\`javascript\nfunction hello() {\n  console.log("Hello, world!");\n}\n\`\`\``
    );
    const [parsedHtml, setParsedHtml] = useState('');

    useEffect(() => {
        let isActive = true;
        const parseMarkdown = async () => {
            try {
                const html = await marked.parse(markdown);
                const cleanHtml = DOMPurify.sanitize(html);
                if (isActive) setParsedHtml(cleanHtml);
            } catch (error) {
                if (isActive) setParsedHtml('<p>Error parsing markdown</p>');
            }
        };

        parseMarkdown();
        return () => { isActive = false; };
    }, [markdown]);

    return (
        <div className="editor-container">
            <textarea
                className="editor-pane markdown-editor"
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
                placeholder="Enter your markdown here..."
            />
            <div className="preview-pane">
                <div
                    className="markdown-preview"
                    dangerouslySetInnerHTML={{ __html: parsedHtml }}
                />
            </div>
        </div>
    );
}
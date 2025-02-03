import React, { useEffect, useState } from 'react';
import { marked } from 'marked';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';

const MarkdownEditor: React.FC = () => {
  const [markdown, setMarkdown] = useState<string>('');
  const [html, setHtml] = useState<string>('');
  const [fontFamily, setFontFamily] = useState<string>('Arial');
  const [headingFontSize, setHeadingFontSize] = useState<number>(24);
  const [textFontSize, setTextFontSize] = useState<number>(16);
  const [backgroundColor, setBackgroundColor] = useState<string>('#000000');
  const [textColor, setTextColor] = useState<string>('#ffffff');

  // Function to handle changes in the textarea
  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMarkdown(event.target.value);
  };

  useEffect(() => {
    const renderMarkdown = async () => {
      const renderer = new marked.Renderer();

      renderer.heading = ({ text, depth }) => {
        const fontSize = `${headingFontSize * Math.pow(0.8, depth - 1)}px`;
        return `<h${depth} style="font-family: ${fontFamily}; font-size: ${fontSize}; color: ${textColor};">${text}</h${depth}>`;
      };

      renderer.paragraph = (text) => {
        return `<p style="font-family: ${fontFamily}; font-size: ${textFontSize}px; color: ${textColor};">${text.text}</p>`;
      };

      renderer.list = (list) => {
        const { items, ordered } = list;
        const tag = ordered ? 'ol' : 'ul';
        const body = items.map(item => `<li>${marked(item.text)}</li>`).join('');
        return `<${tag} style="font-family: ${fontFamily}; font-size: ${textFontSize}px; color: ${textColor}; padding-left: 20px;">${body}</${tag}>`;
      };

      renderer.listitem = (text) => {
        return `<li style="font-family: ${fontFamily}; font-size: ${textFontSize}px; color: ${textColor};">${text}</li>`;
      };

      renderer.code = ({ text, lang, escaped }) => {
        const languageClass = lang ? `language-${lang}` : '';
        return `
          <pre style="background-color: #2d2d2d; margin: 16px 0; padding: 16px; border-radius: 8px; overflow-x: auto;">
            <code class="${languageClass}" style="font-family: monospace; font-size: ${textFontSize}px; color: #ffffff; display: block;">
              ${escaped ? text : text.replace(/</g, '<').replace(/>/g, '>')}
            </code>
          </pre>
        `;
      };

      const renderedHtml = await marked(markdown, { renderer });
      setHtml(renderedHtml);
    };
    renderMarkdown();
  }, [markdown, fontFamily, headingFontSize, textFontSize, textColor]);

  useEffect(() => {
    Prism.highlightAll();
  }, [html]);

  return (
    <div style={styles.container}>
      <h1>MDtoPDF - Markdown Editor</h1>
      {/* Settings Panel */}
      <div style={styles.settingsPanel}>
        <h3>Customize Rendering</h3>
        <label>
          Font:
          <select value={fontFamily} onChange={(e) => setFontFamily(e.target.value)}>
            <option value="Arial">Arial</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Courier New">Courier New</option>
            <option value="Georgia">Georgia</option>
            <option value="Verdana">Verdana</option>
          </select>
        </label>
        <label>
          Heading Font Size (px):
          <input
            type="number"
            value={headingFontSize}
            onChange={(e) => setHeadingFontSize(Number(e.target.value))}
            min="12"
            max="72"
          />
        </label>
        <label>
          Text Font Size (px):
          <input
            type="number"
            value={textFontSize}
            onChange={(e) => setTextFontSize(Number(e.target.value))}
            min="8"
            max="48"
          />
        </label>
        <label>
          Background Color:
          <input
            type="color"
            value={backgroundColor}
            onChange={(e) => setBackgroundColor(e.target.value)}
          />
        </label>
        <label>
          Text Color:
          <input
            type="color"
            value={textColor}
            onChange={(e) => setTextColor(e.target.value)}
          />
        </label>
      </div>
      {/* Editor and Preview Container */}
      <div style={styles.editorContainer}>
        {/* Markdown Editor */}
        <textarea
          value={markdown}
          onChange={handleInputChange}
          placeholder="Write your markdown here..."
          style={styles.textarea}
        />
        {/* Preview Pane */}
        <div
          dangerouslySetInnerHTML={{ __html: html }}
          style={{
            ...styles.preview,
            fontFamily,
            backgroundColor,
            color: textColor,
          }}
        />
      </div>
    </div>
  );
};

// Basic styling for the editor
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minHeight: '100vh',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  settingsPanel: {
    width: '100%',
    maxWidth: '1200px',
    padding: '10px',
    marginBottom: '20px',
    border: '1px solid #ccc',
    borderRadius: '8px',
  },
  editorContainer: {
    display: 'flex',
    width: '100%',
    maxWidth: '1200px',
    height: '600px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  textarea: {
    flex: 1,
    padding: '10px',
    fontSize: '16px',
    border: 'none',
    outline: 'none',
    resize: 'none',
    marginRight: '20px',
  },
  preview: {
    flex: 1,
    padding: '10px',
    borderLeft: '1px solid #ccc',
    overflowY: 'auto',
  },
};

export default MarkdownEditor;
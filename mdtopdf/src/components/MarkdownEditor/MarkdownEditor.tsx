import React, { useState } from 'react';
import { marked } from 'marked';

const MarkdownEditor: React.FC = () => {
  const [markdown, setMarkdown] = useState<string>('');

  // Function to handle changes in the textarea
  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMarkdown(event.target.value);
  };

  return (
    <div style={styles.container}>
      <h1>MDtoPDF - Markdown Editor</h1>
      <div style={styles.editorContainer}>
        {/* Textarea for Markdown input */}
        <textarea
          value={markdown}
          onChange={handleInputChange}
          placeholder="Write your markdown here..."
          style={styles.textarea}
        />
        {/* Preview pane for rendered Markdown */}
        <div
          dangerouslySetInnerHTML={{ __html: marked(markdown) }}
          style={styles.preview}
        />
      </div>
    </div>
  );
};

// Basic styling for the editor
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  editorContainer: {
    display: 'flex',
    marginTop: '20px',
    height: '600px',
  },
  textarea: {
    flex: 1,
    padding: '10px',
    fontSize: '16px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    resize: 'none',
    marginRight: '20px',
  },
  preview: {
    flex: 1,
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    overflowY: 'auto',
  },
};

export default MarkdownEditor;
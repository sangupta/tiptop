import { render } from 'preact';
import { useState, useRef, useEffect } from 'preact/hooks';
import { TiptopEditor, FormattingToolbar } from './components';
import { TiptopEditorRef } from './types';
import { JSONContent } from '@tiptap/core';
import './styles/index.css';

// Main entry point for the Tiptop editor
function App() {
  const [content, setContent] = useState<string>('<p>Welcome to Tiptop! Start typing to see the editor in action.</p>');
  const [editorReady, setEditorReady] = useState(false);
  const editorRef = useRef<TiptopEditorRef>(null);

  // Check if editor is ready
  useEffect(() => {
    const checkEditor = () => {
      if (editorRef.current?.editor) {
        setEditorReady(true);
      } else {
        // Keep checking until editor is ready
        setTimeout(checkEditor, 50);
      }
    };
    checkEditor();
  }, []);

  const handleUpdate = (html: string, json: JSONContent) => {
    setContent(html);
    console.log('Content updated:', { html, json });
  };

  const handleSelectionUpdate = (selection: { from: number; to: number; empty: boolean }) => {
    console.log('Selection updated:', selection);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Tiptop Rich Text Editor
        </h1>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Text Formatting Demo
          </h2>
          <div className="space-y-4">
            {editorReady && (
              <FormattingToolbar 
                editor={editorRef.current?.editor || null} 
                className="mb-4"
              />
            )}
            <TiptopEditor
              ref={editorRef}
              content={content}
              onUpdate={handleUpdate}
              onSelectionUpdate={handleSelectionUpdate}
              placeholder="Start typing your content here..."
              className="mb-4"
            />
          </div>
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Current Content (HTML):
            </h3>
            <pre className="text-xs text-gray-600 dark:text-gray-400 whitespace-pre-wrap break-words">
              {content}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

render(<App />, document.getElementById('app')!);

// Export main components for library usage
export { App };
export * from './types';
export * from './components';
export * from './extensions';
export * from './services';
export * from './utils';

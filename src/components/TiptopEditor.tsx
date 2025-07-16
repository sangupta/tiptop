import { TiptopEditorProps } from '@/types';

// Placeholder TiptopEditor component - will be implemented in task 2
export function TiptopEditor(props: TiptopEditorProps) {
  return (
    <div className="tiptop-editor-container">
      <div className="tiptop-toolbar">
        <span className="text-sm text-gray-500">
          Editor toolbar will be implemented in the next task
        </span>
      </div>
      <div className="tiptop-editor min-h-[200px] p-4 border border-gray-200 dark:border-gray-700 rounded-b-lg">
        <p className="text-gray-600 dark:text-gray-300">
          {props.content || 'Tiptap editor will be initialized here...'}
        </p>
      </div>
    </div>
  );
}

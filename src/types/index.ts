// Core type definitions for Tiptop editor
import { Editor, JSONContent } from '@tiptap/core';

export interface TiptopEditorProps {
  content?: string | JSONContent;
  editable?: boolean;
  collaborative?: boolean;
  aiEnabled?: boolean;
  theme?: 'light' | 'dark' | 'auto';
  onUpdate?: (content: string, json: JSONContent) => void;
  onSelectionUpdate?: (selection: { from: number; to: number; empty: boolean }) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  className?: string;
  placeholder?: string;
}

export interface TiptopEditorRef {
  editor: Editor | null;
  getContent: () => string;
  getJSON: () => JSONContent;
  setContent: (content: string | JSONContent) => void;
  focus: () => void;
  blur: () => void;
  destroy: () => void;
}

export interface TiptopTheme {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
  };
  typography: {
    fontFamily: string;
    fontSize: Record<string, string>;
    lineHeight: Record<string, string>;
  };
  spacing: Record<string, string>;
  borderRadius: Record<string, string>;
}

export interface TiptopError {
  code: string;
  message: string;
  category: 'network' | 'ai' | 'validation' | 'collaboration' | 'media';
  recoverable: boolean;
  context?: Record<string, unknown>;
}

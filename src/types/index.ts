// Core type definitions for Tiptop editor
// These will be expanded in subsequent tasks

export interface TiptopEditorProps {
  content?: string;
  editable?: boolean;
  collaborative?: boolean;
  aiEnabled?: boolean;
  theme?: 'light' | 'dark' | 'auto';
  onUpdate?: (content: string) => void;
  onSelectionUpdate?: (selection: Selection) => void;
  className?: string;
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

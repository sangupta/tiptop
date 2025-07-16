import { Editor } from '@tiptap/core';
import { 
  Bold, 
  Italic, 
  Underline, 
  Strikethrough, 
  Subscript, 
  Superscript 
} from 'lucide-preact';
import { ColorPicker } from './ColorPicker';
import { FontSelector } from './FontSelector';

interface FormattingToolbarProps {
  editor: Editor | null;
  className?: string;
}

interface ToolbarButtonProps {
  onClick: () => void;
  isActive: boolean;
  disabled: boolean;
  children: preact.ComponentChildren;
  title: string;
}

const ToolbarButton = ({ onClick, isActive, disabled, children, title }: ToolbarButtonProps) => (
  <button
    onClick={onClick}
    disabled={disabled}
    title={title}
    className={`
      p-2 rounded-md border transition-colors duration-200 
      ${isActive 
        ? 'bg-primary-100 border-primary-300 text-primary-700 dark:bg-primary-900 dark:border-primary-700 dark:text-primary-300' 
        : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'
      }
      ${disabled 
        ? 'opacity-50 cursor-not-allowed' 
        : 'cursor-pointer'
      }
    `}
    data-testid={`toolbar-${title.toLowerCase().replace(/\s+/g, '-')}`}
  >
    {children}
  </button>
);

export const FormattingToolbar = ({ editor, className = '' }: FormattingToolbarProps) => {
  if (!editor) {
    return null;
  }

  const formatButtons = [
    {
      icon: <Bold size={16} />,
      title: 'Bold',
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: () => editor.isActive('bold'),
      canExecute: () => editor.can().chain().focus().toggleBold().run(),
    },
    {
      icon: <Italic size={16} />,
      title: 'Italic',
      action: () => editor.chain().focus().toggleItalic().run(),
      isActive: () => editor.isActive('italic'),
      canExecute: () => editor.can().chain().focus().toggleItalic().run(),
    },
    {
      icon: <Underline size={16} />,
      title: 'Underline',
      action: () => editor.chain().focus().toggleUnderline().run(),
      isActive: () => editor.isActive('underline'),
      canExecute: () => editor.can().chain().focus().toggleUnderline().run(),
    },
    {
      icon: <Strikethrough size={16} />,
      title: 'Strike',
      action: () => editor.chain().focus().toggleStrike().run(),
      isActive: () => editor.isActive('strike'),
      canExecute: () => editor.can().chain().focus().toggleStrike().run(),
    },
    {
      icon: <Subscript size={16} />,
      title: 'Subscript',
      action: () => editor.chain().focus().toggleSubscript().run(),
      isActive: () => editor.isActive('subscript'),
      canExecute: () => editor.can().chain().focus().toggleSubscript().run(),
    },
    {
      icon: <Superscript size={16} />,
      title: 'Superscript',
      action: () => editor.chain().focus().toggleSuperscript().run(),
      isActive: () => editor.isActive('superscript'),
      canExecute: () => editor.can().chain().focus().toggleSuperscript().run(),
    },
  ];

  const handleTextColorChange = (color: string) => {
    if (color) {
      editor.chain().focus().setColor(color).run();
    } else {
      editor.chain().focus().unsetColor().run();
    }
  };

  const handleHighlightColorChange = (color: string) => {
    if (color) {
      editor.chain().focus().setHighlight({ color }).run();
    } else {
      editor.chain().focus().unsetHighlight().run();
    }
  };

  const handleFontFamilyChange = (fontFamily: string) => {
    if (fontFamily) {
      editor.chain().focus().setMark('textStyle', { fontFamily }).run();
    } else {
      editor.chain().focus().unsetMark('textStyle', { fontFamily: null }).run();
    }
  };

  const handleFontSizeChange = (fontSize: string) => {
    if (fontSize) {
      editor.chain().focus().setMark('textStyle', { fontSize }).run();
    } else {
      editor.chain().focus().unsetMark('textStyle', { fontSize: null }).run();
    }
  };

  const getCurrentTextColor = () => {
    return editor.getAttributes('textStyle').color || '';
  };

  const getCurrentHighlightColor = () => {
    return editor.getAttributes('highlight').color || '';
  };

  const getCurrentFontFamily = () => {
    return editor.getAttributes('textStyle').fontFamily || '';
  };

  const getCurrentFontSize = () => {
    return editor.getAttributes('textStyle').fontSize || '';
  };

  return (
    <div 
      className={`flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg ${className}`}
      data-testid="formatting-toolbar"
    >
      {/* Basic formatting buttons */}
      <div className="flex items-center gap-1">
        {formatButtons.map((button) => (
          <ToolbarButton
            key={button.title}
            onClick={button.action}
            isActive={button.isActive()}
            disabled={!button.canExecute()}
            title={button.title}
          >
            {button.icon}
          </ToolbarButton>
        ))}
      </div>

      {/* Separator */}
      <div className="w-px h-6 bg-gray-300 dark:bg-gray-600" />

      {/* Font controls */}
      <FontSelector
        currentFont={getCurrentFontFamily()}
        currentSize={getCurrentFontSize()}
        onFontChange={handleFontFamilyChange}
        onSizeChange={handleFontSizeChange}
      />

      {/* Separator */}
      <div className="w-px h-6 bg-gray-300 dark:bg-gray-600" />

      {/* Color controls */}
      <div className="flex items-center gap-2">
        <ColorPicker
          currentColor={getCurrentTextColor()}
          onColorChange={handleTextColorChange}
          label="Text Color"
        />
        <ColorPicker
          currentColor={getCurrentHighlightColor()}
          onColorChange={handleHighlightColorChange}
          label="Highlight Color"
        />
      </div>
    </div>
  );
};
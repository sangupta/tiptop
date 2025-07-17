import { useEffect, useRef, useState } from 'preact/hooks';
import { Editor } from '@tiptap/core';
import { 
  Bold, 
  Italic, 
  Underline, 
  Strikethrough, 
  Link,
  Code,
  Palette,
  Type
} from 'lucide-preact';
import { LinkDialog } from './LinkDialog';
import { ColorPicker } from './ColorPicker';
import { FontSelector } from './FontSelector';

interface BubbleMenuProps {
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
      p-1.5 rounded-md border transition-colors duration-200 
      ${isActive 
        ? 'bg-primary-100 border-primary-300 text-primary-700 dark:bg-primary-900 dark:border-primary-700 dark:text-primary-300' 
        : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'
      }
      ${disabled 
        ? 'opacity-50 cursor-not-allowed' 
        : 'cursor-pointer'
      }
    `}
    data-testid={`bubble-menu-${title.toLowerCase().replace(/\s+/g, '-')}`}
  >
    {children}
  </button>
);

export const BubbleMenu = ({ editor, className = '' }: BubbleMenuProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showFontSelector, setShowFontSelector] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!editor) return;

    const updateMenuPosition = () => {
      const { state, view } = editor;
      const { selection } = state;
      
      // Hide menu if selection is empty
      if (selection.empty) {
        setIsVisible(false);
        return;
      }

      // Get the selection coordinates
      const { ranges } = selection;
      const from = Math.min(...ranges.map(range => range.$from.pos));
      const to = Math.max(...ranges.map(range => range.$to.pos));

      // Don't show menu for very small selections (likely just clicking)
      if (to - from < 2) {
        setIsVisible(false);
        return;
      }

      // Get the DOM coordinates of the selection
      const domSelection = window.getSelection();
      if (!domSelection || domSelection.rangeCount === 0) {
        setIsVisible(false);
        return;
      }

      const domRange = domSelection.getRangeAt(0);
      const rect = domRange.getBoundingClientRect();

      // Calculate menu position
      if (menuRef.current) {
        const menuWidth = menuRef.current.offsetWidth;
        const menuHeight = menuRef.current.offsetHeight;
        
        // Position the menu below the selection
        const editorRect = view.dom.getBoundingClientRect();
        const top = rect.bottom + 8 + window.scrollY - editorRect.top;
        const left = rect.left + rect.width / 2 - menuWidth / 2 + window.scrollX - editorRect.left;
        
        setPosition({ top, left });
        setIsVisible(true);
      }
    };

    // Update position when selection changes
    const onSelectionUpdate = () => {
      setTimeout(updateMenuPosition, 10);
    };

    // Hide menu when clicking outside the editor
    const onBlur = () => {
      setIsVisible(false);
      setShowColorPicker(false);
      setShowFontSelector(false);
    };

    editor.on('selectionUpdate', onSelectionUpdate);
    editor.on('blur', onBlur);

    return () => {
      editor.off('selectionUpdate', onSelectionUpdate);
      editor.off('blur', onBlur);
    };
  }, [editor]);

  if (!editor || !isVisible) {
    return null;
  }

  const formatButtons = [
    {
      icon: <Bold size={14} />,
      title: 'Bold',
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: () => editor.isActive('bold'),
      canExecute: () => editor.can().toggleBold(),
    },
    {
      icon: <Italic size={14} />,
      title: 'Italic',
      action: () => editor.chain().focus().toggleItalic().run(),
      isActive: () => editor.isActive('italic'),
      canExecute: () => editor.can().toggleItalic(),
    },
    {
      icon: <Underline size={14} />,
      title: 'Underline',
      action: () => editor.chain().focus().toggleUnderline().run(),
      isActive: () => editor.isActive('underline'),
      canExecute: () => editor.can().toggleUnderline(),
    },
    {
      icon: <Strikethrough size={14} />,
      title: 'Strike',
      action: () => editor.chain().focus().toggleStrike().run(),
      isActive: () => editor.isActive('strike'),
      canExecute: () => editor.can().toggleStrike(),
    },
    {
      icon: <Code size={14} />,
      title: 'Inline Code',
      action: () => editor.chain().focus().toggleCode().run(),
      isActive: () => editor.isActive('code'),
      canExecute: () => editor.can().toggleCode(),
    },
  ];

  const handleTextColorChange = (color: string) => {
    if (color) {
      editor.chain().focus().setColor(color).run();
    } else {
      editor.chain().focus().unsetColor().run();
    }
    setShowColorPicker(false);
  };

  const handleFontFamilyChange = (fontFamily: string) => {
    if (fontFamily) {
      editor.chain().focus().setMark('textStyle', { fontFamily }).run();
    } else {
      editor.chain().focus().unsetMark('textStyle').run();
    }
    setShowFontSelector(false);
  };

  const handleFontSizeChange = (fontSize: string) => {
    if (fontSize) {
      editor.chain().focus().setMark('textStyle', { fontSize }).run();
    } else {
      editor.chain().focus().unsetMark('textStyle').run();
    }
    setShowFontSelector(false);
  };

  const getCurrentTextColor = () => {
    return editor?.getAttributes('textStyle')?.color || '';
  };

  const getCurrentFontFamily = () => {
    return editor?.getAttributes('textStyle')?.fontFamily || '';
  };

  const getCurrentFontSize = () => {
    return editor?.getAttributes('textStyle')?.fontSize || '';
  };

  const getCurrentLinkUrl = () => {
    return editor?.getAttributes('link')?.href || '';
  };

  const getSelectedText = () => {
    if (!editor || !editor.state) return '';
    const { from, to } = editor.state.selection;
    return editor.state.doc.textBetween(from, to, '');
  };

  return (
    <>
      <div
        ref={menuRef}
        className={`absolute z-50 flex items-center gap-1 p-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md ${className}`}
        style={{
          top: `${position.top}px`,
          left: `${position.left}px`,
          transform: 'translateX(-50%)',
        }}
        data-testid="bubble-menu"
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
        <div className="w-px h-5 bg-gray-300 dark:bg-gray-600" />

        {/* Link button */}
        <ToolbarButton
          onClick={() => setIsLinkDialogOpen(true)}
          isActive={editor?.isActive('link') || false}
          disabled={false}
          title="Add Link"
        >
          <Link size={14} />
        </ToolbarButton>

        {/* Color picker button */}
        <div className="relative">
          <ToolbarButton
            onClick={() => setShowColorPicker(!showColorPicker)}
            isActive={!!getCurrentTextColor()}
            disabled={false}
            title="Text Color"
          >
            <Palette size={14} />
          </ToolbarButton>
          
          {showColorPicker && (
            <div className="absolute top-full left-0 mt-1 z-50">
              <ColorPicker
                currentColor={getCurrentTextColor()}
                onColorChange={handleTextColorChange}
                label="Text Color"
              />
            </div>
          )}
        </div>

        {/* Font selector button */}
        <div className="relative">
          <ToolbarButton
            onClick={() => setShowFontSelector(!showFontSelector)}
            isActive={!!getCurrentFontFamily() || !!getCurrentFontSize()}
            disabled={false}
            title="Font Options"
          >
            <Type size={14} />
          </ToolbarButton>
          
          {showFontSelector && (
            <div className="absolute top-full left-0 mt-1 z-50">
              <FontSelector
                currentFont={getCurrentFontFamily()}
                currentSize={getCurrentFontSize()}
                onFontChange={handleFontFamilyChange}
                onSizeChange={handleFontSizeChange}
              />
            </div>
          )}
        </div>
      </div>

      {/* Link Dialog */}
      <LinkDialog
        editor={editor}
        isOpen={isLinkDialogOpen}
        onClose={() => setIsLinkDialogOpen(false)}
        initialUrl={getCurrentLinkUrl()}
        initialText={getSelectedText()}
      />
    </>
  );
};
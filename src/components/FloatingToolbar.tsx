import { useEffect, useRef, useState } from 'preact/hooks';
import { Editor } from '@tiptap/core';
import { 
  Bold, 
  Italic, 
  Underline, 
  Strikethrough, 
  Link,
  Code,
  Quote,
  List,
  ListOrdered
} from 'lucide-preact';
import { LinkDialog } from './LinkDialog';

interface FloatingToolbarProps {
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
    data-testid={`floating-toolbar-${title.toLowerCase().replace(/\s+/g, '-')}`}
  >
    {children}
  </button>
);

export const FloatingToolbar = ({ editor, className = '' }: FloatingToolbarProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const toolbarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!editor) return;

    const updateToolbarPosition = () => {
      const { state, view } = editor;
      const { selection } = state;
      
      // Hide toolbar if selection is empty
      if (selection.empty) {
        setIsVisible(false);
        return;
      }

      // Get the selection coordinates
      const { ranges } = selection;
      const from = Math.min(...ranges.map(range => range.$from.pos));
      const to = Math.max(...ranges.map(range => range.$to.pos));

      // Don't show toolbar for very small selections (likely just clicking)
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

      // Calculate toolbar position
      if (toolbarRef.current) {
        const toolbarWidth = toolbarRef.current.offsetWidth;
        const toolbarHeight = toolbarRef.current.offsetHeight;
        
        // Position the toolbar above the selection
        const editorRect = view.dom.getBoundingClientRect();
        const top = rect.top - toolbarHeight - 8 + window.scrollY - editorRect.top;
        const left = rect.left + rect.width / 2 - toolbarWidth / 2 + window.scrollX - editorRect.left;
        
        setPosition({ top, left });
        setIsVisible(true);
      }
    };

    // Update position when selection changes
    const onSelectionUpdate = () => {
      setTimeout(updateToolbarPosition, 10);
    };

    // Hide toolbar when clicking outside the editor
    const onBlur = () => {
      setIsVisible(false);
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

  const blockButtons = [
    {
      icon: <Quote size={14} />,
      title: 'Blockquote',
      action: () => editor.chain().focus().toggleBlockquote().run(),
      isActive: () => editor.isActive('blockquote'),
      canExecute: () => editor.can().toggleBlockquote(),
    },
    {
      icon: <List size={14} />,
      title: 'Bullet List',
      action: () => editor.chain().focus().toggleBulletList().run(),
      isActive: () => editor.isActive('bulletList'),
      canExecute: () => editor.can().toggleBulletList(),
    },
    {
      icon: <ListOrdered size={14} />,
      title: 'Ordered List',
      action: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: () => editor.isActive('orderedList'),
      canExecute: () => editor.can().toggleOrderedList(),
    },
  ];

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
        ref={toolbarRef}
        className={`absolute z-50 flex items-center gap-1 p-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md ${className}`}
        style={{
          top: `${position.top}px`,
          left: `${position.left}px`,
          transform: 'translateX(-50%)',
        }}
        data-testid="floating-toolbar"
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

        {/* Block buttons */}
        <div className="flex items-center gap-1">
          {blockButtons.map((button) => (
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
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
  ListOrdered,
  Copy,
  Scissors,
  Clipboard,
  Trash2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify
} from 'lucide-preact';

interface ContextMenuProps {
  editor: Editor | null;
  className?: string;
}

interface MenuItemProps {
  icon: preact.ComponentChildren;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  isActive?: boolean;
}

const MenuItem = ({ icon, label, onClick, disabled = false, isActive = false }: MenuItemProps) => (
  <button
    onClick={(e) => {
      e.preventDefault();
      onClick();
    }}
    disabled={disabled}
    className={`
      flex items-center gap-2 w-full px-3 py-2 text-left text-sm transition-colors
      ${isActive 
        ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300' 
        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
      }
      ${disabled 
        ? 'opacity-50 cursor-not-allowed' 
        : 'cursor-pointer'
      }
    `}
    data-testid={`context-menu-${label.toLowerCase().replace(/\s+/g, '-')}`}
  >
    <span className="w-4 h-4 flex items-center justify-center">{icon}</span>
    <span>{label}</span>
  </button>
);

const MenuDivider = () => (
  <div className="h-px bg-gray-200 dark:bg-gray-700 my-1" />
);

const MenuSection = ({ title }: { title: string }) => (
  <div className="px-3 py-1 text-xs text-gray-500 dark:text-gray-400 font-medium">
    {title}
  </div>
);

export const ContextMenu = ({ editor, className = '' }: ContextMenuProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!editor) return;

    const handleContextMenu = (event: MouseEvent) => {
      event.preventDefault();
      
      // Get the editor element's position
      const editorElement = editor.view.dom;
      const editorRect = editorElement.getBoundingClientRect();
      
      // Calculate position relative to the editor
      const top = event.clientY - editorRect.top + window.scrollY;
      const left = event.clientX - editorRect.left + window.scrollX;
      
      setPosition({ top, left });
      setIsVisible(true);
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsVisible(false);
      }
    };

    // Add event listeners
    const editorElement = editor.view.dom;
    editorElement.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('click', handleClickOutside);
    document.addEventListener('contextmenu', handleClickOutside);

    return () => {
      editorElement.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('contextmenu', handleClickOutside);
    };
  }, [editor]);

  if (!editor || !isVisible) {
    return null;
  }

  const hasSelection = !editor.state.selection.empty;
  const isLink = editor.isActive('link');
  const isImage = editor.isActive('image');
  const isCodeBlock = editor.isActive('codeBlock');
  const isTable = editor.isActive('table');

  const handleCopy = () => {
    document.execCommand('copy');
    setIsVisible(false);
  };

  const handleCut = () => {
    document.execCommand('cut');
    setIsVisible(false);
  };

  const handlePaste = () => {
    document.execCommand('paste');
    setIsVisible(false);
  };

  const handleDelete = () => {
    editor.chain().focus().deleteSelection().run();
    setIsVisible(false);
  };

  const handleSelectAll = () => {
    editor.chain().focus().selectAll().run();
    setIsVisible(false);
  };

  return (
    <div
      ref={menuRef}
      className={`absolute z-50 min-w-[180px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-1 ${className}`}
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
      data-testid="context-menu"
    >
      {/* Edit section */}
      {hasSelection && (
        <>
          <MenuItem 
            icon={<Copy size={14} />} 
            label="Copy" 
            onClick={handleCopy} 
          />
          <MenuItem 
            icon={<Scissors size={14} />} 
            label="Cut" 
            onClick={handleCut} 
          />
          <MenuItem 
            icon={<Trash2 size={14} />} 
            label="Delete" 
            onClick={handleDelete} 
          />
          <MenuDivider />
        </>
      )}
      
      <MenuItem 
        icon={<Clipboard size={14} />} 
        label="Paste" 
        onClick={handlePaste} 
      />
      <MenuItem 
        icon={<span className="text-xs">All</span>} 
        label="Select All" 
        onClick={handleSelectAll} 
      />
      
      {hasSelection && (
        <>
          <MenuDivider />
          <MenuSection title="Formatting" />
          
          {/* Text formatting */}
          <MenuItem 
            icon={<Bold size={14} />} 
            label="Bold" 
            onClick={() => {
              editor.chain().focus().toggleBold().run();
              setIsVisible(false);
            }}
            isActive={editor.isActive('bold')}
          />
          <MenuItem 
            icon={<Italic size={14} />} 
            label="Italic" 
            onClick={() => {
              editor.chain().focus().toggleItalic().run();
              setIsVisible(false);
            }}
            isActive={editor.isActive('italic')}
          />
          <MenuItem 
            icon={<Underline size={14} />} 
            label="Underline" 
            onClick={() => {
              editor.chain().focus().toggleUnderline().run();
              setIsVisible(false);
            }}
            isActive={editor.isActive('underline')}
          />
          <MenuItem 
            icon={<Strikethrough size={14} />} 
            label="Strikethrough" 
            onClick={() => {
              editor.chain().focus().toggleStrike().run();
              setIsVisible(false);
            }}
            isActive={editor.isActive('strike')}
          />
          <MenuItem 
            icon={<Code size={14} />} 
            label="Code" 
            onClick={() => {
              editor.chain().focus().toggleCode().run();
              setIsVisible(false);
            }}
            isActive={editor.isActive('code')}
          />
          
          {/* Block formatting */}
          <MenuDivider />
          <MenuSection title="Blocks" />
          
          <MenuItem 
            icon={<Quote size={14} />} 
            label="Blockquote" 
            onClick={() => {
              editor.chain().focus().toggleBlockquote().run();
              setIsVisible(false);
            }}
            isActive={editor.isActive('blockquote')}
          />
          <MenuItem 
            icon={<List size={14} />} 
            label="Bullet List" 
            onClick={() => {
              editor.chain().focus().toggleBulletList().run();
              setIsVisible(false);
            }}
            isActive={editor.isActive('bulletList')}
          />
          <MenuItem 
            icon={<ListOrdered size={14} />} 
            label="Ordered List" 
            onClick={() => {
              editor.chain().focus().toggleOrderedList().run();
              setIsVisible(false);
            }}
            isActive={editor.isActive('orderedList')}
          />
          
          {/* Alignment */}
          <MenuDivider />
          <MenuSection title="Alignment" />
          
          <MenuItem 
            icon={<AlignLeft size={14} />} 
            label="Align Left" 
            onClick={() => {
              editor.chain().focus().setTextAlign('left').run();
              setIsVisible(false);
            }}
            isActive={editor.isActive({ textAlign: 'left' })}
          />
          <MenuItem 
            icon={<AlignCenter size={14} />} 
            label="Align Center" 
            onClick={() => {
              editor.chain().focus().setTextAlign('center').run();
              setIsVisible(false);
            }}
            isActive={editor.isActive({ textAlign: 'center' })}
          />
          <MenuItem 
            icon={<AlignRight size={14} />} 
            label="Align Right" 
            onClick={() => {
              editor.chain().focus().setTextAlign('right').run();
              setIsVisible(false);
            }}
            isActive={editor.isActive({ textAlign: 'right' })}
          />
          <MenuItem 
            icon={<AlignJustify size={14} />} 
            label="Justify" 
            onClick={() => {
              editor.chain().focus().setTextAlign('justify').run();
              setIsVisible(false);
            }}
            isActive={editor.isActive({ textAlign: 'justify' })}
          />
        </>
      )}
      
      {/* Special context menus for specific elements */}
      {isLink && (
        <>
          <MenuDivider />
          <MenuSection title="Link" />
          <MenuItem 
            icon={<Link size={14} />} 
            label="Edit Link" 
            onClick={() => {
              // This would typically open a link dialog
              // For now, we'll just toggle the link off
              editor.chain().focus().unsetLink().run();
              setIsVisible(false);
            }}
          />
          <MenuItem 
            icon={<span className="text-xs">↗</span>} 
            label="Open Link" 
            onClick={() => {
              const href = editor.getAttributes('link').href;
              if (href) {
                window.open(href, '_blank');
              }
              setIsVisible(false);
            }}
          />
        </>
      )}
      
      {isImage && (
        <>
          <MenuDivider />
          <MenuSection title="Image" />
          <MenuItem 
            icon={<span className="text-xs">🖼️</span>} 
            label="Edit Image" 
            onClick={() => {
              // This would typically open an image dialog
              setIsVisible(false);
            }}
          />
        </>
      )}
      
      {isCodeBlock && (
        <>
          <MenuDivider />
          <MenuSection title="Code Block" />
          <MenuItem 
            icon={<Copy size={14} />} 
            label="Copy Code" 
            onClick={() => {
              const codeContent = editor.getAttributes('codeBlock').content;
              if (codeContent) {
                navigator.clipboard.writeText(codeContent);
              }
              setIsVisible(false);
            }}
          />
        </>
      )}
    </div>
  );
};
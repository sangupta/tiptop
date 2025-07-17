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
  Image,
  Music,
  Video,
  FileText,
  SquareCode,
  Table,
  Heading1,
  Heading2,
  Heading3,
  HorizontalRule,
  Search
} from 'lucide-preact';

interface SlashMenuProps {
  editor: Editor | null;
  className?: string;
}

interface SlashCommandItem {
  title: string;
  description: string;
  icon: preact.ComponentChildren;
  command: (editor: Editor) => void;
  keywords: string[];
}

const SlashMenuItem = ({ 
  item, 
  isSelected, 
  onClick 
}: { 
  item: SlashCommandItem; 
  isSelected: boolean; 
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`
      flex items-center gap-3 w-full px-3 py-2 text-left transition-colors rounded-md
      ${isSelected 
        ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300' 
        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
      }
    `}
    data-testid={`slash-menu-${item.title.toLowerCase().replace(/\s+/g, '-')}`}
  >
    <span className="w-6 h-6 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-md">
      {item.icon}
    </span>
    <div className="flex flex-col">
      <span className="font-medium">{item.title}</span>
      <span className="text-xs text-gray-500 dark:text-gray-400">{item.description}</span>
    </div>
  </button>
);

export const SlashMenu = ({ editor, className = '' }: SlashMenuProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);

  // Define slash commands
  const slashCommands: SlashCommandItem[] = [
    {
      title: 'Text',
      description: 'Just start typing with plain text.',
      icon: <span className="text-xs">Aa</span>,
      command: (editor) => {
        editor.chain().focus().setParagraph().run();
      },
      keywords: ['paragraph', 'text', 'plain'],
    },
    {
      title: 'Heading 1',
      description: 'Large section heading.',
      icon: <Heading1 size={14} />,
      command: (editor) => {
        editor.chain().focus().toggleHeading({ level: 1 }).run();
      },
      keywords: ['h1', 'heading', 'title', 'large'],
    },
    {
      title: 'Heading 2',
      description: 'Medium section heading.',
      icon: <Heading2 size={14} />,
      command: (editor) => {
        editor.chain().focus().toggleHeading({ level: 2 }).run();
      },
      keywords: ['h2', 'heading', 'title', 'medium'],
    },
    {
      title: 'Heading 3',
      description: 'Small section heading.',
      icon: <Heading3 size={14} />,
      command: (editor) => {
        editor.chain().focus().toggleHeading({ level: 3 }).run();
      },
      keywords: ['h3', 'heading', 'title', 'small'],
    },
    {
      title: 'Bullet List',
      description: 'Create a simple bullet list.',
      icon: <List size={14} />,
      command: (editor) => {
        editor.chain().focus().toggleBulletList().run();
      },
      keywords: ['bullet', 'list', 'unordered', 'ul'],
    },
    {
      title: 'Numbered List',
      description: 'Create a numbered list.',
      icon: <ListOrdered size={14} />,
      command: (editor) => {
        editor.chain().focus().toggleOrderedList().run();
      },
      keywords: ['numbered', 'list', 'ordered', 'ol'],
    },
    {
      title: 'Blockquote',
      description: 'Capture a quote.',
      icon: <Quote size={14} />,
      command: (editor) => {
        editor.chain().focus().toggleBlockquote().run();
      },
      keywords: ['quote', 'blockquote', 'citation'],
    },
    {
      title: 'Code Block',
      description: 'Display code with syntax highlighting.',
      icon: <SquareCode size={14} />,
      command: (editor) => {
        editor.chain().focus().toggleCodeBlock().run();
      },
      keywords: ['code', 'codeblock', 'syntax', 'programming'],
    },
    {
      title: 'Image',
      description: 'Upload or embed an image.',
      icon: <Image size={14} />,
      command: (editor) => {
        // This would typically open an image dialog
        // For now, we'll just insert a placeholder
        const url = prompt('Enter image URL');
        if (url) {
          editor.chain().focus().setImage({ src: url }).run();
        }
      },
      keywords: ['image', 'photo', 'picture', 'img'],
    },
    {
      title: 'Audio',
      description: 'Upload or embed audio.',
      icon: <Music size={14} />,
      command: (editor) => {
        // This would typically open an audio dialog
        const url = prompt('Enter audio URL');
        if (url) {
          editor.chain().focus().insertContent({
            type: 'audio',
            attrs: { src: url, controls: true }
          }).run();
        }
      },
      keywords: ['audio', 'sound', 'music', 'mp3'],
    },
    {
      title: 'Video',
      description: 'Upload or embed video.',
      icon: <Video size={14} />,
      command: (editor) => {
        // This would typically open a video dialog
        const url = prompt('Enter video URL');
        if (url) {
          editor.chain().focus().insertContent({
            type: 'video',
            attrs: { src: url, controls: true }
          }).run();
        }
      },
      keywords: ['video', 'movie', 'mp4'],
    },
    {
      title: 'Table',
      description: 'Add a table.',
      icon: <Table size={14} />,
      command: (editor) => {
        editor.chain().focus().insertTable({ rows: 3, cols: 3 }).run();
      },
      keywords: ['table', 'grid', 'spreadsheet'],
    },
    {
      title: 'Horizontal Rule',
      description: 'Add a horizontal divider.',
      icon: <HorizontalRule size={14} />,
      command: (editor) => {
        editor.chain().focus().setHorizontalRule().run();
      },
      keywords: ['hr', 'rule', 'divider', 'separator'],
    },
    {
      title: 'Bold',
      description: 'Make text bold.',
      icon: <Bold size={14} />,
      command: (editor) => {
        editor.chain().focus().toggleBold().run();
      },
      keywords: ['bold', 'strong', 'b'],
    },
    {
      title: 'Italic',
      description: 'Make text italic.',
      icon: <Italic size={14} />,
      command: (editor) => {
        editor.chain().focus().toggleItalic().run();
      },
      keywords: ['italic', 'emphasis', 'i'],
    },
    {
      title: 'Underline',
      description: 'Underline text.',
      icon: <Underline size={14} />,
      command: (editor) => {
        editor.chain().focus().toggleUnderline().run();
      },
      keywords: ['underline', 'u'],
    },
    {
      title: 'Strikethrough',
      description: 'Strike through text.',
      icon: <Strikethrough size={14} />,
      command: (editor) => {
        editor.chain().focus().toggleStrike().run();
      },
      keywords: ['strikethrough', 'strike', 's'],
    },
    {
      title: 'Code',
      description: 'Inline code.',
      icon: <Code size={14} />,
      command: (editor) => {
        editor.chain().focus().toggleCode().run();
      },
      keywords: ['code', 'inline', 'monospace'],
    },
    {
      title: 'Link',
      description: 'Add a link.',
      icon: <Link size={14} />,
      command: (editor) => {
        const url = prompt('Enter URL');
        if (url) {
          editor.chain().focus().setLink({ href: url }).run();
        }
      },
      keywords: ['link', 'url', 'href', 'a'],
    },
  ];

  // Filter commands based on query
  const filteredCommands = query
    ? slashCommands.filter(command => 
        command.title.toLowerCase().includes(query.toLowerCase()) ||
        command.description.toLowerCase().includes(query.toLowerCase()) ||
        command.keywords.some(keyword => keyword.toLowerCase().includes(query.toLowerCase()))
      )
    : slashCommands;

  useEffect(() => {
    if (!editor) return;

    // Reset selected index when filtered commands change
    setSelectedIndex(0);
  }, [filteredCommands]);

  useEffect(() => {
    if (!editor) return;

    const checkForSlashCommand = ({ editor }) => {
      const { selection } = editor.state;
      const { $from, empty } = selection;
      
      // Only show menu when cursor is in an empty paragraph
      if (!empty) {
        setIsVisible(false);
        return;
      }
      
      // Get text from the start of the current block to the cursor
      const textFromBlockStart = $from.parent.textBetween(0, $from.parentOffset, null, ' ');
      
      // Check if the text starts with '/'
      if (textFromBlockStart.startsWith('/')) {
        // Extract the query (everything after the slash)
        const newQuery = textFromBlockStart.slice(1);
        setQuery(newQuery);
        
        // Get the position for the menu
        const coords = editor.view.coordsAtPos($from.pos);
        const editorRect = editor.view.dom.getBoundingClientRect();
        
        setPosition({
          top: coords.bottom - editorRect.top + window.scrollY,
          left: coords.left - editorRect.left + window.scrollX,
        });
        
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isVisible) return;
      
      // Handle arrow keys for navigation
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        setSelectedIndex(prev => 
          prev < filteredCommands.length - 1 ? prev + 1 : prev
        );
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : prev);
      } else if (event.key === 'Enter' && filteredCommands.length > 0) {
        event.preventDefault();
        executeCommand(filteredCommands[selectedIndex]);
      } else if (event.key === 'Escape') {
        event.preventDefault();
        setIsVisible(false);
      }
    };

    // Execute the selected command
    const executeCommand = (item: SlashCommandItem) => {
      // First, delete the slash command text
      const { selection } = editor.state;
      const { $from } = selection;
      const start = $from.start();
      const end = $from.pos;
      
      editor.chain().focus().deleteRange({ from: start, to: end }).run();
      
      // Then execute the command
      item.command(editor);
      
      // Hide the menu
      setIsVisible(false);
      setQuery('');
    };

    // Add event listeners
    editor.on('update', checkForSlashCommand);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      editor.off('update', checkForSlashCommand);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [editor, isVisible, filteredCommands, selectedIndex]);

  if (!editor || !isVisible || filteredCommands.length === 0) {
    return null;
  }

  return (
    <div
      ref={menuRef}
      className={`absolute z-50 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-1 ${className}`}
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
      data-testid="slash-menu"
    >
      <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-200 dark:border-gray-700">
        <Search size={14} className="text-gray-500 dark:text-gray-400" />
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {query ? `Search: ${query}` : 'Type to search...'}
        </span>
      </div>
      
      <div className="max-h-64 overflow-y-auto py-1">
        {filteredCommands.map((item, index) => (
          <SlashMenuItem
            key={item.title}
            item={item}
            isSelected={index === selectedIndex}
            onClick={() => {
              const selectedItem = filteredCommands[index];
              selectedItem.command(editor);
              setIsVisible(false);
              setQuery('');
            }}
          />
        ))}
      </div>
    </div>
  );
};
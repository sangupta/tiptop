import { useState } from 'preact/hooks';
import { Editor } from '@tiptap/core';
import { 
  Bold, 
  Italic, 
  Underline, 
  Strikethrough, 
  Subscript, 
  Superscript,
  List,
  ListOrdered,
  Indent,
  Outdent,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Link,
  Image,
  Music,
  Video
} from 'lucide-preact';
import { ColorPicker } from './ColorPicker';
import { FontSelector } from './FontSelector';
import { LinkDialog } from './LinkDialog';
import { MediaUpload } from './MediaUpload';

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
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [isAudioDialogOpen, setIsAudioDialogOpen] = useState(false);
  const [isVideoDialogOpen, setIsVideoDialogOpen] = useState(false);

  if (!editor) {
    return null;
  }

  const formatButtons = [
    {
      icon: <Bold size={16} />,
      title: 'Bold',
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: () => editor.isActive('bold'),
      canExecute: () => editor.can().toggleBold(),
    },
    {
      icon: <Italic size={16} />,
      title: 'Italic',
      action: () => editor.chain().focus().toggleItalic().run(),
      isActive: () => editor.isActive('italic'),
      canExecute: () => editor.can().toggleItalic(),
    },
    {
      icon: <Underline size={16} />,
      title: 'Underline',
      action: () => editor.chain().focus().toggleUnderline().run(),
      isActive: () => editor.isActive('underline'),
      canExecute: () => editor.can().toggleUnderline(),
    },
    {
      icon: <Strikethrough size={16} />,
      title: 'Strike',
      action: () => editor.chain().focus().toggleStrike().run(),
      isActive: () => editor.isActive('strike'),
      canExecute: () => editor.can().toggleStrike(),
    },
    {
      icon: <Subscript size={16} />,
      title: 'Subscript',
      action: () => editor.chain().focus().toggleSubscript().run(),
      isActive: () => editor.isActive('subscript'),
      canExecute: () => editor.can().toggleSubscript(),
    },
    {
      icon: <Superscript size={16} />,
      title: 'Superscript',
      action: () => editor.chain().focus().toggleSuperscript().run(),
      isActive: () => editor.isActive('superscript'),
      canExecute: () => editor.can().toggleSuperscript(),
    },
  ];

  const listButtons = [
    {
      icon: <List size={16} />,
      title: 'Bullet List',
      action: () => editor.chain().focus().toggleBulletList().run(),
      isActive: () => editor.isActive('bulletList'),
      canExecute: () => editor.can().toggleBulletList(),
    },
    {
      icon: <ListOrdered size={16} />,
      title: 'Ordered List',
      action: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: () => editor.isActive('orderedList'),
      canExecute: () => editor.can().toggleOrderedList(),
    },
  ];

  const indentButtons = [
    {
      icon: <Indent size={16} />,
      title: 'Indent',
      action: () => editor.chain().focus().sinkListItem('listItem').run(),
      isActive: () => false, // Indent buttons don't have active state
      canExecute: () => editor.can().sinkListItem('listItem'),
    },
    {
      icon: <Outdent size={16} />,
      title: 'Outdent',
      action: () => editor.chain().focus().liftListItem('listItem').run(),
      isActive: () => false, // Indent buttons don't have active state
      canExecute: () => editor.can().liftListItem('listItem'),
    },
  ];

  const alignmentButtons = [
    {
      icon: <AlignLeft size={16} />,
      title: 'Align Left',
      action: () => editor.chain().focus().setTextAlign('left').run(),
      isActive: () => editor.isActive({ textAlign: 'left' }),
      canExecute: () => editor.can().setTextAlign('left'),
    },
    {
      icon: <AlignCenter size={16} />,
      title: 'Align Center',
      action: () => editor.chain().focus().setTextAlign('center').run(),
      isActive: () => editor.isActive({ textAlign: 'center' }),
      canExecute: () => editor.can().setTextAlign('center'),
    },
    {
      icon: <AlignRight size={16} />,
      title: 'Align Right',
      action: () => editor.chain().focus().setTextAlign('right').run(),
      isActive: () => editor.isActive({ textAlign: 'right' }),
      canExecute: () => editor.can().setTextAlign('right'),
    },
    {
      icon: <AlignJustify size={16} />,
      title: 'Justify',
      action: () => editor.chain().focus().setTextAlign('justify').run(),
      isActive: () => editor.isActive({ textAlign: 'justify' }),
      canExecute: () => editor.can().setTextAlign('justify'),
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
      editor.chain().focus().unsetMark('textStyle').run();
    }
  };

  const handleFontSizeChange = (fontSize: string) => {
    if (fontSize) {
      editor.chain().focus().setMark('textStyle', { fontSize }).run();
    } else {
      editor.chain().focus().unsetMark('textStyle').run();
    }
  };

  const getCurrentTextColor = () => {
    return editor?.getAttributes('textStyle')?.color || '';
  };

  const getCurrentHighlightColor = () => {
    return editor?.getAttributes('highlight')?.color || '';
  };

  const getCurrentFontFamily = () => {
    return editor?.getAttributes('textStyle')?.fontFamily || '';
  };

  const getCurrentFontSize = () => {
    return editor?.getAttributes('textStyle')?.fontSize || '';
  };

  const handleLinkClick = () => {
    setIsLinkDialogOpen(true);
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

      {/* List buttons */}
      <div className="flex items-center gap-1">
        {listButtons.map((button) => (
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

      {/* Indent buttons */}
      <div className="flex items-center gap-1">
        {indentButtons.map((button) => (
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

      {/* Alignment buttons */}
      <div className="flex items-center gap-1">
        {alignmentButtons.map((button) => (
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

      {/* Media buttons */}
      <div className="flex items-center gap-1">
        {/* Link button */}
        <ToolbarButton
          onClick={handleLinkClick}
          isActive={editor?.isActive('link') || false}
          disabled={false}
          title="Add Link"
        >
          <Link size={16} />
        </ToolbarButton>
        
        {/* Image button */}
        <ToolbarButton
          onClick={() => setIsImageDialogOpen(true)}
          isActive={editor?.isActive('image') || false}
          disabled={false}
          title="Add Image"
        >
          <Image size={16} />
        </ToolbarButton>
        
        {/* Audio button */}
        <ToolbarButton
          onClick={() => setIsAudioDialogOpen(true)}
          isActive={editor?.isActive('audio') || false}
          disabled={false}
          title="Add Audio"
        >
          <Music size={16} />
        </ToolbarButton>
        
        {/* Video button */}
        <ToolbarButton
          onClick={() => setIsVideoDialogOpen(true)}
          isActive={editor?.isActive('video') || false}
          disabled={false}
          title="Add Video"
        >
          <Video size={16} />
        </ToolbarButton>
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

      {/* Link Dialog */}
      <LinkDialog
        editor={editor}
        isOpen={isLinkDialogOpen}
        onClose={() => setIsLinkDialogOpen(false)}
        initialUrl={getCurrentLinkUrl()}
        initialText={getSelectedText()}
      />

      {/* Image Upload Dialog */}
      <MediaUpload
        type="image"
        isOpen={isImageDialogOpen}
        onClose={() => setIsImageDialogOpen(false)}
        onUpload={(file) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            if (e.target?.result) {
              editor.chain().focus().setImage({ src: e.target.result as string }).run();
            }
          };
          reader.readAsDataURL(file);
        }}
        onUrlInsert={(url, title) => {
          editor.chain().focus().setImage({ src: url, alt: title || '' }).run();
        }}
      />

      {/* Audio Upload Dialog */}
      <MediaUpload
        type="audio"
        isOpen={isAudioDialogOpen}
        onClose={() => setIsAudioDialogOpen(false)}
        onUpload={(file) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            if (e.target?.result) {
              editor.chain().focus().insertContent({
                type: 'audio',
                attrs: { src: e.target.result as string, controls: true }
              }).run();
            }
          };
          reader.readAsDataURL(file);
        }}
        onUrlInsert={(url, title) => {
          editor.chain().focus().insertContent({
            type: 'audio',
            attrs: { src: url, controls: true, title: title || '' }
          }).run();
        }}
      />

      {/* Video Upload Dialog */}
      <MediaUpload
        type="video"
        isOpen={isVideoDialogOpen}
        onClose={() => setIsVideoDialogOpen(false)}
        onUpload={(file) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            if (e.target?.result) {
              editor.chain().focus().insertContent({
                type: 'video',
                attrs: { src: e.target.result as string, controls: true }
              }).run();
            }
          };
          reader.readAsDataURL(file);
        }}
        onUrlInsert={(url, title) => {
          editor.chain().focus().insertContent({
            type: 'video',
            attrs: { src: url, controls: true, title: title || '' }
          }).run();
        }}
      />
    </div>
  );
};
import { useEffect, useRef, useImperativeHandle } from 'preact/hooks';
import { forwardRef } from 'preact/compat';
import { Editor } from '@tiptap/core';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import Bold from '@tiptap/extension-bold';
import Italic from '@tiptap/extension-italic';
import Underline from '@tiptap/extension-underline';
import Strike from '@tiptap/extension-strike';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import TextStyle from '@tiptap/extension-text-style';
import TextAlign from '@tiptap/extension-text-align';
import { TiptopEditorProps, TiptopEditorRef } from '@/types';
import { EnhancedBulletList, EnhancedOrderedList, EnhancedListItem, ListUtilities, EnhancedImage, TiptopAudioEmbed, TiptopVideoEmbed } from '@/extensions';

export const TiptopEditor = forwardRef<TiptopEditorRef, TiptopEditorProps>((props, ref) => {
  const {
    content = '',
    editable = true,
    onUpdate,
    onSelectionUpdate,
    onFocus,
    onBlur,
    className = '',
    placeholder = 'Start typing...',
  } = props;

  const editorRef = useRef<HTMLDivElement>(null);
  const editorInstanceRef = useRef<Editor | null>(null);

  // Initialize editor
  useEffect(() => {
    if (!editorRef.current) return;

    const editor = new Editor({
      element: editorRef.current,
      extensions: [
        Document,
        Paragraph.configure({
          HTMLAttributes: {
            class: 'tiptop-paragraph',
          },
        }),
        Text,
        Bold,
        Italic,
        Underline,
        Strike,
        Subscript,
        Superscript,
        TextStyle,
        Color.configure({
          types: ['textStyle'],
        }),
        Highlight.configure({
          multicolor: true,
        }),
        TextAlign.configure({
          types: ['heading', 'paragraph'],
          alignments: ['left', 'center', 'right', 'justify'],
          defaultAlignment: 'left',
        }),
        EnhancedBulletList.configure({
          HTMLAttributes: {
            class: 'tiptop-bullet-list',
          },
          keepMarks: true,
          keepAttributes: false,
        }),
        EnhancedOrderedList.configure({
          HTMLAttributes: {
            class: 'tiptop-ordered-list',
          },
          keepMarks: true,
          keepAttributes: false,
        }),
        EnhancedListItem.configure({
          HTMLAttributes: {
            class: 'tiptop-list-item',
          },
        }),
        ListUtilities,
        EnhancedImage.configure({
          HTMLAttributes: {
            class: 'tiptop-image max-w-full h-auto rounded-lg',
          },
          inline: false,
          allowBase64: true,
        }),
        TiptopAudioEmbed.configure({
          HTMLAttributes: {
            class: 'tiptop-audio max-w-full rounded-lg',
          },
          inline: false,
          allowBase64: true,
        }),
        TiptopVideoEmbed.configure({
          HTMLAttributes: {
            class: 'tiptop-video max-w-full rounded-lg',
          },
          inline: false,
          allowBase64: true,
        }),
      ],
      content: content,
      editable: editable,
      editorProps: {
        attributes: {
          class: 'tiptop-editor-content prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',
          'data-placeholder': placeholder,
        },
      },
      onUpdate: ({ editor }) => {
        const html = editor.getHTML();
        const json = editor.getJSON();
        onUpdate?.(html, json);
      },
      onSelectionUpdate: ({ editor }) => {
        const { from, to, empty } = editor.state.selection;
        onSelectionUpdate?.({ from, to, empty });
      },
      onFocus: () => {
        onFocus?.();
      },
      onBlur: () => {
        onBlur?.();
      },
    });

    editorInstanceRef.current = editor;

    return () => {
      editor.destroy();
      editorInstanceRef.current = null;
    };
  }, []);

  // Update content when prop changes
  useEffect(() => {
    if (editorInstanceRef.current && content !== undefined) {
      const currentContent = editorInstanceRef.current.getHTML();
      const newContent = typeof content === 'string' ? content : content;
      
      if (currentContent !== newContent) {
        editorInstanceRef.current.commands.setContent(content, false);
      }
    }
  }, [content]);

  // Update editable state when prop changes
  useEffect(() => {
    if (editorInstanceRef.current) {
      editorInstanceRef.current.setEditable(editable);
    }
  }, [editable]);

  // Expose editor methods via ref
  useImperativeHandle(ref, () => ({
    editor: editorInstanceRef.current,
    getContent: () => editorInstanceRef.current?.getHTML() || '',
    getJSON: () => editorInstanceRef.current?.getJSON() || { type: 'doc', content: [] },
    setContent: (newContent) => {
      editorInstanceRef.current?.commands.setContent(newContent, false);
    },
    focus: () => {
      editorInstanceRef.current?.commands.focus();
    },
    blur: () => {
      editorInstanceRef.current?.commands.blur();
    },
    destroy: () => {
      editorInstanceRef.current?.destroy();
      editorInstanceRef.current = null;
    },
  }));

  return (
    <div className={`tiptop-editor-container ${className}`} data-testid="tiptop-editor-container">
      <div 
        ref={editorRef}
        className="tiptop-editor min-h-[200px] p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-primary-500 transition-colors"
        data-testid="tiptop-editor"
      />
    </div>
  );
});

TiptopEditor.displayName = 'TiptopEditor';

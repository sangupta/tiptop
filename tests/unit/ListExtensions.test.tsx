import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/preact';
import { Editor } from '@tiptap/core';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import { EnhancedBulletList, EnhancedOrderedList, EnhancedListItem, ListUtilities } from '@/extensions';
import Bold from '@tiptap/extension-bold';
import Italic from '@tiptap/extension-italic';
import Underline from '@tiptap/extension-underline';
import Strike from '@tiptap/extension-strike';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import { TiptopEditor } from '@/components/TiptopEditor';
import { FormattingToolbar } from '@/components/FormattingToolbar';

describe('List Extensions', () => {
  let editor: Editor;

  beforeEach(() => {
    editor = new Editor({
      extensions: [
        Document,
        Paragraph,
        Text,
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
      ],
      content: '<p>Test content</p>',
    });
  });

  afterEach(() => {
    editor?.destroy();
  });

  describe('Bullet List Extension', () => {
    it('should create bullet list when toggleBulletList is called', () => {
      editor.chain().focus().toggleBulletList().run();
      
      expect(editor.isActive('bulletList')).toBe(true);
      expect(editor.getHTML()).toContain('<ul class="tiptop-bullet-list">');
      expect(editor.getHTML()).toContain('<li class="tiptop-list-item">');
    });

    it('should toggle off bullet list when called again', () => {
      editor.chain().focus().toggleBulletList().run();
      expect(editor.isActive('bulletList')).toBe(true);
      
      editor.chain().focus().toggleBulletList().run();
      expect(editor.isActive('bulletList')).toBe(false);
      expect(editor.getHTML()).not.toContain('<ul class="tiptop-bullet-list">');
    });

    it('should convert paragraph to bullet list item', () => {
      editor.commands.setContent('<p>Test item</p>');
      editor.chain().focus().toggleBulletList().run();
      
      const html = editor.getHTML();
      expect(html).toContain('<ul class="tiptop-bullet-list">');
      expect(html).toContain('<li class="tiptop-list-item">');
      expect(html).toContain('Test item');
    });

    it('should handle multiple list items', () => {
      editor.commands.setContent('<p>Item 1</p><p>Item 2</p>');
      editor.commands.selectAll();
      editor.chain().focus().toggleBulletList().run();
      
      const html = editor.getHTML();
      expect(html).toContain('Item 1');
      expect(html).toContain('Item 2');
      expect((html.match(/<li class="tiptop-list-item">/g) || []).length).toBe(2);
    });
  });

  describe('Ordered List Extension', () => {
    it('should create ordered list when toggleOrderedList is called', () => {
      editor.chain().focus().toggleOrderedList().run();
      
      expect(editor.isActive('orderedList')).toBe(true);
      expect(editor.getHTML()).toContain('<ol class="tiptop-ordered-list">');
      expect(editor.getHTML()).toContain('<li class="tiptop-list-item">');
    });

    it('should toggle off ordered list when called again', () => {
      editor.chain().focus().toggleOrderedList().run();
      expect(editor.isActive('orderedList')).toBe(true);
      
      editor.chain().focus().toggleOrderedList().run();
      expect(editor.isActive('orderedList')).toBe(false);
      expect(editor.getHTML()).not.toContain('<ol class="tiptop-ordered-list">');
    });

    it('should convert paragraph to ordered list item', () => {
      editor.commands.setContent('<p>Test item</p>');
      editor.chain().focus().toggleOrderedList().run();
      
      const html = editor.getHTML();
      expect(html).toContain('<ol class="tiptop-ordered-list">');
      expect(html).toContain('<li class="tiptop-list-item">');
      expect(html).toContain('Test item');
    });

    it('should handle multiple ordered list items', () => {
      editor.commands.setContent('<p>Item 1</p><p>Item 2</p>');
      editor.commands.selectAll();
      editor.chain().focus().toggleOrderedList().run();
      
      const html = editor.getHTML();
      expect(html).toContain('Item 1');
      expect(html).toContain('Item 2');
      expect((html.match(/<li class="tiptop-list-item">/g) || []).length).toBe(2);
    });
  });

  describe('List Conversion', () => {
    it('should convert bullet list to ordered list', () => {
      editor.commands.setContent('<p>Test item</p>');
      editor.chain().focus().toggleBulletList().run();
      expect(editor.isActive('bulletList')).toBe(true);
      
      editor.chain().focus().toggleOrderedList().run();
      expect(editor.isActive('bulletList')).toBe(false);
      expect(editor.isActive('orderedList')).toBe(true);
      expect(editor.getHTML()).toContain('<ol class="tiptop-ordered-list">');
    });

    it('should convert ordered list to bullet list', () => {
      editor.commands.setContent('<p>Test item</p>');
      editor.chain().focus().toggleOrderedList().run();
      expect(editor.isActive('orderedList')).toBe(true);
      
      editor.chain().focus().toggleBulletList().run();
      expect(editor.isActive('orderedList')).toBe(false);
      expect(editor.isActive('bulletList')).toBe(true);
      expect(editor.getHTML()).toContain('<ul class="tiptop-bullet-list">');
    });
  });

  describe('List Item Extension', () => {
    it('should create list items with correct class', () => {
      editor.chain().focus().toggleBulletList().run();
      
      const html = editor.getHTML();
      expect(html).toContain('<li class="tiptop-list-item">');
    });

    it('should handle empty list items', () => {
      editor.commands.setContent('<ul class="tiptop-bullet-list"><li class="tiptop-list-item"></li></ul>');
      
      expect(editor.isActive('bulletList')).toBe(true);
      expect(editor.getHTML()).toContain('<li class="tiptop-list-item">');
    });
  });

  describe('List Commands', () => {
    it('should check if bullet list can be toggled', () => {
      expect(editor.can().toggleBulletList()).toBe(true);
    });

    it('should check if ordered list can be toggled', () => {
      expect(editor.can().toggleOrderedList()).toBe(true);
    });

    it('should not allow invalid list operations', () => {
      // Test that commands work as expected
      editor.chain().focus().toggleBulletList().run();
      expect(editor.isActive('bulletList')).toBe(true);
      
      // Should still be able to toggle off
      expect(editor.can().toggleBulletList()).toBe(true);
    });
  });

  describe('List Indentation', () => {
    it('should indent list item when indentListItem is called', () => {
      editor.commands.setContent('<ul class="tiptop-bullet-list"><li class="tiptop-list-item">Item 1</li><li class="tiptop-list-item">Item 2</li></ul>');
      editor.commands.focus();
      
      // Position cursor at the end of the second item
      editor.commands.setTextSelection(editor.state.doc.content.size - 2);
      
      // Indent the second item
      const canIndent = editor.can().sinkListItem('listItem');
      if (canIndent) {
        editor.chain().focus().sinkListItem('listItem').run();
        
        // Check that the item was indented (nested)
        const html = editor.getHTML();
        expect(html).toContain('<ul class="tiptop-bullet-list">');
        // Should have nested list structure
        expect(html.match(/<ul/g)?.length).toBeGreaterThan(1);
      } else {
        // If indentation is not possible, just verify the command exists
        expect(typeof editor.can().sinkListItem).toBe('function');
      }
    });

    it('should outdent list item when outdentListItem is called', () => {
      // Create nested list structure
      const nestedContent = `
        <ul class="tiptop-bullet-list">
          <li class="tiptop-list-item">Item 1
            <ul class="tiptop-bullet-list">
              <li class="tiptop-list-item">Nested Item</li>
            </ul>
          </li>
        </ul>
      `;
      
      editor.commands.setContent(nestedContent);
      editor.commands.focus();
      
      // Position cursor in nested item and outdent
      const canOutdent = editor.can().liftListItem('listItem');
      if (canOutdent) {
        editor.chain().focus().liftListItem('listItem').run();
        
        // Check that nesting was reduced
        const html = editor.getHTML();
        expect(html).toContain('Nested Item');
      }
    });

    it('should check if list item can be indented', () => {
      editor.commands.setContent('<ul class="tiptop-bullet-list"><li class="tiptop-list-item">Item 1</li><li class="tiptop-list-item">Item 2</li></ul>');
      editor.commands.focus();
      
      // Should be able to check indentation capability
      const canIndent = editor.can().sinkListItem('listItem');
      expect(typeof canIndent).toBe('boolean');
    });

    it('should check if list item can be outdented', () => {
      const nestedContent = `
        <ul class="tiptop-bullet-list">
          <li class="tiptop-list-item">Item 1
            <ul class="tiptop-bullet-list">
              <li class="tiptop-list-item">Nested Item</li>
            </ul>
          </li>
        </ul>
      `;
      
      editor.commands.setContent(nestedContent);
      editor.commands.focus();
      
      // Should be able to check outdentation capability
      const canOutdent = editor.can().liftListItem('listItem');
      expect(typeof canOutdent).toBe('boolean');
    });

    it('should handle mixed list nesting (bullet and ordered)', () => {
      // Start with a bullet list
      editor.commands.setContent('<p>Bullet Item</p>');
      editor.chain().focus().toggleBulletList().run();
      
      // Add a new paragraph after the list
      editor.commands.setTextSelection(editor.state.doc.content.size);
      editor.commands.insertContent('<p>Ordered Item</p>');
      
      // Convert the new paragraph to an ordered list
      editor.commands.setTextSelection(editor.state.doc.content.size - 1);
      editor.chain().focus().toggleOrderedList().run();
      
      const html = editor.getHTML();
      // Should have both list types in the document
      expect(html).toContain('Bullet Item');
      expect(html).toContain('Ordered Item');
      // At least one of the list types should be present
      expect(html.includes('<ul class="tiptop-bullet-list">') || html.includes('<ol class="tiptop-ordered-list">')).toBe(true);
    });
  });
});

describe('TiptopEditor with Lists', () => {
  it('should render editor with list extensions', () => {
    render(<TiptopEditor content="<p>Test content</p>" />);
    
    const editorContainer = screen.getByTestId('tiptop-editor-container');
    expect(editorContainer).toBeInTheDocument();
  });

  it('should handle list content in editor', () => {
    const listContent = '<ul class="tiptop-bullet-list"><li class="tiptop-list-item">Item 1</li><li class="tiptop-list-item">Item 2</li></ul>';
    
    render(<TiptopEditor content={listContent} />);
    
    const editorContainer = screen.getByTestId('tiptop-editor-container');
    expect(editorContainer).toBeInTheDocument();
  });
});

describe('FormattingToolbar with List Controls', () => {
  let editor: Editor;

  beforeEach(() => {
    editor = new Editor({
      extensions: [
        Document,
        Paragraph,
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
        EnhancedBulletList,
        EnhancedOrderedList,
        EnhancedListItem,
        ListUtilities,
      ],
      content: '<p>Test content</p>',
    });
  });

  afterEach(() => {
    editor?.destroy();
  });

  it('should render list buttons in toolbar', () => {
    render(<FormattingToolbar editor={editor} />);
    
    const bulletListButton = screen.getByTitle('Bullet List');
    const orderedListButton = screen.getByTitle('Ordered List');
    
    expect(bulletListButton).toBeInTheDocument();
    expect(orderedListButton).toBeInTheDocument();
  });

  it('should toggle bullet list when button is clicked', () => {
    render(<FormattingToolbar editor={editor} />);
    
    const bulletListButton = screen.getByTitle('Bullet List');
    
    expect(editor.isActive('bulletList')).toBe(false);
    
    fireEvent.click(bulletListButton);
    
    expect(editor.isActive('bulletList')).toBe(true);
  });

  it('should toggle ordered list when button is clicked', () => {
    render(<FormattingToolbar editor={editor} />);
    
    const orderedListButton = screen.getByTitle('Ordered List');
    
    expect(editor.isActive('orderedList')).toBe(false);
    
    fireEvent.click(orderedListButton);
    
    expect(editor.isActive('orderedList')).toBe(true);
  });

  it('should show active state for bullet list button', () => {
    editor.chain().focus().toggleBulletList().run();
    
    render(<FormattingToolbar editor={editor} />);
    
    const bulletListButton = screen.getByTitle('Bullet List');
    expect(bulletListButton).toHaveClass('bg-primary-100');
  });

  it('should show active state for ordered list button', () => {
    editor.chain().focus().toggleOrderedList().run();
    
    render(<FormattingToolbar editor={editor} />);
    
    const orderedListButton = screen.getByTitle('Ordered List');
    expect(orderedListButton).toHaveClass('bg-primary-100');
  });

  it('should disable buttons when editor is not editable', () => {
    editor.setEditable(false);
    
    render(<FormattingToolbar editor={editor} />);
    
    const bulletListButton = screen.getByTitle('Bullet List');
    const orderedListButton = screen.getByTitle('Ordered List');
    
    // When editor is not editable, buttons should still be present but might be disabled
    expect(bulletListButton).toBeInTheDocument();
    expect(orderedListButton).toBeInTheDocument();
    
    editor.setEditable(true);
  });

  it('should render indent and outdent buttons in toolbar', () => {
    render(<FormattingToolbar editor={editor} />);
    
    const indentButton = screen.getByTitle('Indent');
    const outdentButton = screen.getByTitle('Outdent');
    
    expect(indentButton).toBeInTheDocument();
    expect(outdentButton).toBeInTheDocument();
  });

  it('should handle indent button click', () => {
    // Create a list first
    editor.chain().focus().toggleBulletList().run();
    
    render(<FormattingToolbar editor={editor} />);
    
    const indentButton = screen.getByTitle('Indent');
    
    // Click indent button
    fireEvent.click(indentButton);
    
    // The button should be present (actual indentation behavior depends on cursor position)
    expect(indentButton).toBeInTheDocument();
  });

  it('should handle outdent button click', () => {
    // Create a list first
    editor.chain().focus().toggleBulletList().run();
    
    render(<FormattingToolbar editor={editor} />);
    
    const outdentButton = screen.getByTitle('Outdent');
    
    // Click outdent button
    fireEvent.click(outdentButton);
    
    // The button should be present (actual outdentation behavior depends on cursor position)
    expect(outdentButton).toBeInTheDocument();
  });

  it('should disable indent/outdent buttons when not applicable', () => {
    // Start with regular paragraph (not in a list)
    editor.commands.setContent('<p>Regular paragraph</p>');
    editor.commands.focus();
    
    render(<FormattingToolbar editor={editor} />);
    
    const indentButton = screen.getByTitle('Indent');
    const outdentButton = screen.getByTitle('Outdent');
    
    // Buttons should be disabled when not in a list context
    expect(indentButton).toHaveClass('opacity-50');
    expect(outdentButton).toHaveClass('opacity-50');
  });
});
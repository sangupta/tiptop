import { describe, it, expect, beforeEach, afterEach } from 'vitest';
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

describe('Text Formatting Integration', () => {
  let editor: Editor;
  let element: HTMLElement;

  beforeEach(() => {
    // Create a DOM element for the editor
    element = document.createElement('div');
    document.body.appendChild(element);

    // Initialize editor with text formatting extensions
    editor = new Editor({
      element,
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
      ],
      content: '<p>Test content for formatting</p>',
    });
  });

  afterEach(() => {
    editor.destroy();
    document.body.removeChild(element);
  });

  it('should apply bold formatting', () => {
    // Select all text
    editor.commands.selectAll();
    
    // Apply bold formatting
    editor.commands.toggleBold();
    
    // Check if bold is active
    expect(editor.isActive('bold')).toBe(true);
    
    // Check HTML output
    const html = editor.getHTML();
    expect(html).toContain('<strong>');
  });

  it('should apply italic formatting', () => {
    editor.commands.selectAll();
    editor.commands.toggleItalic();
    
    expect(editor.isActive('italic')).toBe(true);
    
    const html = editor.getHTML();
    expect(html).toContain('<em>');
  });

  it('should apply underline formatting', () => {
    editor.commands.selectAll();
    editor.commands.toggleUnderline();
    
    expect(editor.isActive('underline')).toBe(true);
    
    const html = editor.getHTML();
    expect(html).toContain('<u>');
  });

  it('should apply strike formatting', () => {
    editor.commands.selectAll();
    editor.commands.toggleStrike();
    
    expect(editor.isActive('strike')).toBe(true);
    
    const html = editor.getHTML();
    expect(html).toContain('<s>');
  });

  it('should apply subscript formatting', () => {
    editor.commands.selectAll();
    editor.commands.toggleSubscript();
    
    expect(editor.isActive('subscript')).toBe(true);
    
    const html = editor.getHTML();
    expect(html).toContain('<sub>');
  });

  it('should apply superscript formatting', () => {
    editor.commands.selectAll();
    editor.commands.toggleSuperscript();
    
    expect(editor.isActive('superscript')).toBe(true);
    
    const html = editor.getHTML();
    expect(html).toContain('<sup>');
  });

  it('should handle multiple formatting combinations', () => {
    editor.commands.selectAll();
    
    // Apply multiple formats
    editor.commands.toggleBold();
    editor.commands.toggleItalic();
    
    expect(editor.isActive('bold')).toBe(true);
    expect(editor.isActive('italic')).toBe(true);
    
    const html = editor.getHTML();
    expect(html).toContain('<strong>');
    expect(html).toContain('<em>');
  });

  it('should toggle formatting on and off', () => {
    editor.commands.selectAll();
    
    // Apply bold
    editor.commands.toggleBold();
    expect(editor.isActive('bold')).toBe(true);
    
    // Toggle bold off
    editor.commands.toggleBold();
    expect(editor.isActive('bold')).toBe(false);
  });

  it('should handle subscript and superscript independently', () => {
    editor.commands.selectAll();
    
    // Apply subscript
    editor.commands.toggleSubscript();
    expect(editor.isActive('subscript')).toBe(true);
    expect(editor.isActive('superscript')).toBe(false);
    
    // Apply superscript (both can be active simultaneously in Tiptap)
    editor.commands.toggleSuperscript();
    expect(editor.isActive('superscript')).toBe(true);
    expect(editor.isActive('subscript')).toBe(true);
    
    // Toggle subscript off
    editor.commands.toggleSubscript();
    expect(editor.isActive('subscript')).toBe(false);
    expect(editor.isActive('superscript')).toBe(true);
  });

  it('should preserve content when applying formatting', () => {
    const originalText = 'Test content for formatting';
    
    editor.commands.selectAll();
    editor.commands.toggleBold();
    
    // Text content should remain the same
    const textContent = editor.getText();
    expect(textContent).toBe(originalText);
  });

  it('should handle partial text selection formatting', () => {
    // Set specific content
    editor.commands.setContent('<p>Hello world test</p>');
    
    // Select only "world" (positions 6-11)
    editor.commands.setTextSelection({ from: 7, to: 12 });
    
    // Apply bold to selection
    editor.commands.toggleBold();
    
    const html = editor.getHTML();
    expect(html).toContain('Hello <strong>world</strong> test');
  });

  it('should handle keyboard shortcuts', () => {
    editor.commands.selectAll();
    
    // Test if commands can be executed (simulating keyboard shortcuts)
    expect(editor.can().toggleBold()).toBe(true);
    expect(editor.can().toggleItalic()).toBe(true);
    expect(editor.can().toggleUnderline()).toBe(true);
    expect(editor.can().toggleStrike()).toBe(true);
    expect(editor.can().toggleSubscript()).toBe(true);
    expect(editor.can().toggleSuperscript()).toBe(true);
  });
});
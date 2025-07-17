import { render, screen, fireEvent } from '@testing-library/preact';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Editor } from '@tiptap/core';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import { TiptopPreformatted } from '@/extensions/PreformattedExtension';

describe('PreformattedExtension', () => {
  let editor: Editor;

  beforeEach(() => {
    editor = new Editor({
      extensions: [
        Document,
        Paragraph,
        Text,
        TiptopPreformatted.configure({
          HTMLAttributes: {
            class: 'tiptop-preformatted',
          },
        }),
      ],
      content: '',
    });
  });

  afterEach(() => {
    editor.destroy();
  });

  describe('Node Definition', () => {
    it('should define a preformatted node type', () => {
      const preformattedType = editor.schema.nodes.preformatted;
      expect(preformattedType).toBeDefined();
    });

    it('should have the correct node attributes', () => {
      const preformattedType = editor.schema.nodes.preformatted;
      expect(preformattedType.spec.group).toBe('block');
      expect(preformattedType.spec.content).toBe('inline*');
      expect(preformattedType.spec.defining).toBe(true);
    });
  });

  describe('Commands', () => {
    it('should toggle preformatted text', () => {
      editor.commands.setContent('<p>Test content</p>');
      editor.commands.selectAll();
      editor.commands.togglePreformatted();
      
      const json = editor.getJSON();
      expect(json.content?.[0].type).toBe('preformatted');
      expect(json.content?.[0].content?.[0].text).toBe('Test content');
      
      // Toggle back to paragraph
      editor.commands.togglePreformatted();
      const updatedJson = editor.getJSON();
      expect(updatedJson.content?.[0].type).toBe('paragraph');
    });

    it('should set preformatted text', () => {
      editor.commands.setContent('<p>Test content</p>');
      editor.commands.selectAll();
      editor.commands.setPreformatted();
      
      const json = editor.getJSON();
      expect(json.content?.[0].type).toBe('preformatted');
    });

    it('should unset preformatted text', () => {
      editor.commands.setContent('<pre>Test content</pre>');
      editor.commands.selectAll();
      editor.commands.unsetPreformatted();
      
      const json = editor.getJSON();
      expect(json.content?.[0].type).toBe('paragraph');
    });
  });

  describe('HTML Parsing and Rendering', () => {
    it('should parse pre HTML correctly', () => {
      const html = '<pre>Preformatted text</pre>';
      editor.commands.setContent(html);
      
      const json = editor.getJSON();
      expect(json.content?.[0].type).toBe('preformatted');
      expect(json.content?.[0].content?.[0].text).toBe('Preformatted text');
    });

    it('should render preformatted node with correct HTML', () => {
      editor.commands.setContent('<pre>Preformatted text</pre>');
      
      const html = editor.getHTML();
      expect(html).toContain('<pre class="tiptop-preformatted">');
      expect(html).toContain('Preformatted text');
    });

    it('should preserve whitespace in preformatted text', () => {
      // Note: HTML rendering may normalize whitespace, so we'll check for content preservation
      // rather than exact string matching
      editor.commands.setContent('<pre>  This has   spaces  \n  and line breaks\n\n</pre>');
      
      const json = editor.getJSON();
      expect(json.content?.[0].type).toBe('preformatted');
      expect(json.content?.[0].content?.[0].text).toContain('This has   spaces');
      expect(json.content?.[0].content?.[0].text).toContain('and line breaks');
    });
  });

  describe('Keyboard Shortcuts', () => {
    it('should have keyboard shortcut for toggling preformatted text', () => {
      const shortcuts = TiptopPreformatted.config.addKeyboardShortcuts();
      expect(shortcuts).toHaveProperty('Mod-Alt-p');
      expect(typeof shortcuts['Mod-Alt-p']).toBe('function');
    });
  });
});
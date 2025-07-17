import { render, screen, fireEvent } from '@testing-library/preact';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Editor } from '@tiptap/core';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import { TiptopSyntaxHighlight } from '@/extensions/SyntaxHighlightExtension';

describe('SyntaxHighlightExtension', () => {
  let editor: Editor;

  beforeEach(() => {
    editor = new Editor({
      extensions: [
        Document,
        Paragraph,
        Text,
        TiptopSyntaxHighlight.configure({
          HTMLAttributes: {
            class: 'tiptop-code-block',
          },
          defaultLanguage: 'javascript',
        }),
      ],
      content: '',
    });
  });

  afterEach(() => {
    editor.destroy();
  });

  describe('Node Definition', () => {
    it('should define a code block node type', () => {
      const codeBlockType = editor.schema.nodes.codeBlock;
      expect(codeBlockType).toBeDefined();
    });

    it('should have the correct node attributes', () => {
      const codeBlockType = editor.schema.nodes.codeBlock;
      expect(codeBlockType.spec.group).toBe('block');
      expect(codeBlockType.spec.content).toBe('text*');
      expect(codeBlockType.spec.marks).toBe('');
      expect(codeBlockType.spec.defining).toBe(true);
      expect(codeBlockType.spec.code).toBe(true);
    });

    it('should have language attribute with default', () => {
      const codeBlockType = editor.schema.nodes.codeBlock;
      expect(codeBlockType.spec.attrs?.language).toBeDefined();
      expect(codeBlockType.spec.attrs?.language.default).toBe('javascript');
    });
  });

  describe('Commands', () => {
    it('should toggle code block', () => {
      editor.commands.setContent('<p>Test content</p>');
      editor.commands.selectAll();
      editor.commands.toggleCodeBlock();
      
      const json = editor.getJSON();
      expect(json.content?.[0].type).toBe('codeBlock');
      expect(json.content?.[0].content?.[0].text).toBe('Test content');
    });

    it('should set code block', () => {
      editor.commands.setContent('<p>Test content</p>');
      editor.commands.selectAll();
      editor.commands.setCodeBlock({ language: 'typescript' });
      
      const json = editor.getJSON();
      expect(json.content?.[0].type).toBe('codeBlock');
      expect(json.content?.[0].attrs?.language).toBe('typescript');
    });

    it('should update code block language', () => {
      editor.commands.setContent('<pre><code>const x = 1;</code></pre>');
      editor.commands.selectAll();
      editor.commands.updateCodeBlockLanguage('python');
      
      const json = editor.getJSON();
      expect(json.content?.[0].attrs?.language).toBe('python');
    });
  });

  describe('HTML Parsing and Rendering', () => {
    it('should parse pre HTML correctly', () => {
      const html = '<pre><code>const x = 1;</code></pre>';
      editor.commands.setContent(html);
      
      const json = editor.getJSON();
      expect(json.content?.[0].type).toBe('codeBlock');
      expect(json.content?.[0].content?.[0].text).toBe('const x = 1;');
    });

    it('should render code block with correct HTML', () => {
      editor.commands.setContent('<pre><code>const x = 1;</code></pre>');
      
      const html = editor.getHTML();
      // The default language is added automatically
      expect(html).toContain('class="tiptop-code-block language-javascript"');
      expect(html).toContain('<code>');
      expect(html).toContain('const x = 1;');
    });

    it('should set code block with specific language', () => {
      editor.commands.setContent('<p>Test content</p>');
      editor.commands.selectAll();
      editor.commands.setCodeBlock({ language: 'typescript' });
      
      const json = editor.getJSON();
      expect(json.content?.[0].type).toBe('codeBlock');
      expect(json.content?.[0].attrs?.language).toBe('typescript');
    });
  });

  describe('Keyboard Shortcuts', () => {
    it('should have keyboard shortcuts for code blocks', () => {
      const shortcuts = TiptopSyntaxHighlight.config.addKeyboardShortcuts();
      expect(shortcuts).toHaveProperty('Mod-Alt-c');
      expect(shortcuts).toHaveProperty('Mod-Alt-Shift-c');
      expect(typeof shortcuts['Mod-Alt-c']).toBe('function');
      expect(typeof shortcuts['Mod-Alt-Shift-c']).toBe('function');
    });
  });

  describe('Syntax Highlighting', () => {
    it('should add ProseMirror plugin for syntax highlighting', () => {
      const plugins = TiptopSyntaxHighlight.config.addProseMirrorPlugins?.call({
        name: 'codeBlock',
        options: {
          defaultLanguage: 'javascript',
          languageClassPrefix: 'language-',
        },
        editor: {} as any,
      });
      
      expect(plugins).toBeDefined();
      expect(plugins?.length).toBeGreaterThan(0);
    });
  });
});
import { describe, it, expect, beforeEach } from 'vitest';
import { Editor } from '@tiptap/core';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import { TiptopAudioEmbed } from '@/extensions/AudioExtension';

describe('TiptopAudioEmbed Extension', () => {
  let editor: Editor;

  beforeEach(() => {
    editor = new Editor({
      extensions: [
        Document,
        Paragraph,
        Text,
        TiptopAudioEmbed,
      ],
      content: '',
    });
  });

  afterEach(() => {
    editor.destroy();
  });

  describe('Extension Configuration', () => {
    it('should be configured with correct name', () => {
      expect(editor.extensionManager.extensions.find(ext => ext.name === 'tiptopAudio')).toBeDefined();
    });

    it('should have correct default options', () => {
      const extension = editor.extensionManager.extensions.find(ext => ext.name === 'tiptopAudio');
      expect(extension?.options).toEqual({
        inline: false,
        allowBase64: true,
        HTMLAttributes: {
          class: 'tiptop-audio',
        },
      });
    });

    it('should be a block-level node', () => {
      const audioType = editor.schema.nodes.tiptopAudio;
      expect(audioType.spec.group).toBe('block');
    });

    it('should be draggable', () => {
      const audioType = editor.schema.nodes.tiptopAudio;
      expect(audioType.spec.draggable).toBe(true);
    });
  });

  describe('Attributes', () => {
    it('should have src attribute', () => {
      const audioType = editor.schema.nodes.tiptopAudio;
      expect(audioType.spec.attrs?.src).toBeDefined();
      expect(audioType.spec.attrs?.src.default).toBe(null);
    });

    it('should have title attribute', () => {
      const audioType = editor.schema.nodes.tiptopAudio;
      expect(audioType.spec.attrs?.title).toBeDefined();
      expect(audioType.spec.attrs?.title.default).toBe(null);
    });

    it('should have controls attribute with default true', () => {
      const audioType = editor.schema.nodes.tiptopAudio;
      expect(audioType.spec.attrs?.controls).toBeDefined();
      expect(audioType.spec.attrs?.controls.default).toBe(true);
    });

    it('should have preload attribute with default metadata', () => {
      const audioType = editor.schema.nodes.tiptopAudio;
      expect(audioType.spec.attrs?.preload).toBeDefined();
      expect(audioType.spec.attrs?.preload.default).toBe('metadata');
    });
  });

  describe('Commands', () => {
    it('should have setAudio command', () => {
      expect(editor.commands.setAudio).toBeDefined();
      expect(typeof editor.commands.setAudio).toBe('function');
    });

    it('should have updateAudio command', () => {
      expect(editor.commands.updateAudio).toBeDefined();
      expect(typeof editor.commands.updateAudio).toBe('function');
    });

    it('should insert audio with setAudio command', () => {
      const result = editor.commands.setAudio({
        src: 'https://example.com/audio.mp3',
        title: 'Test Audio',
      });

      expect(result).toBe(true);
      
      const json = editor.getJSON();
      expect(json.content).toHaveLength(1);
      expect(json.content?.[0].type).toBe('tiptopAudio');
      expect(json.content?.[0].attrs?.src).toBe('https://example.com/audio.mp3');
      expect(json.content?.[0].attrs?.title).toBe('Test Audio');
      expect(json.content?.[0].attrs?.controls).toBe(true);
      expect(json.content?.[0].attrs?.preload).toBe('metadata');
    });

    it('should update audio attributes with updateAudio command', () => {
      // First insert an audio
      editor.commands.setAudio({
        src: 'https://example.com/audio.mp3',
        title: 'Original Title',
      });

      // Select the audio node
      editor.commands.selectAll();

      // Update the audio
      const result = editor.commands.updateAudio({
        title: 'Updated Title',
        controls: false,
      });

      expect(result).toBe(true);

      const json = editor.getJSON();
      expect(json.content?.[0].attrs?.src).toBe('https://example.com/audio.mp3');
      expect(json.content?.[0].attrs?.title).toBe('Updated Title');
      expect(json.content?.[0].attrs?.controls).toBe(false);
    });
  });

  describe('HTML Parsing and Rendering', () => {
    it('should parse audio HTML correctly', () => {
      const html = '<audio src="https://example.com/audio.mp3" title="Test Audio" controls preload="metadata"></audio>';
      editor.commands.setContent(html);

      const json = editor.getJSON();
      expect(json.content).toHaveLength(1);
      expect(json.content?.[0].type).toBe('tiptopAudio');
      expect(json.content?.[0].attrs?.src).toBe('https://example.com/audio.mp3');
      expect(json.content?.[0].attrs?.title).toBe('Test Audio');
      expect(json.content?.[0].attrs?.controls).toBe(true);
      expect(json.content?.[0].attrs?.preload).toBe('metadata');
    });

    it('should render audio HTML correctly', () => {
      editor.commands.setAudio({
        src: 'https://example.com/audio.mp3',
        title: 'Test Audio',
        controls: true,
      });

      const html = editor.getHTML();
      expect(html).toContain('<audio');
      expect(html).toContain('src="https://example.com/audio.mp3"');
      expect(html).toContain('title="Test Audio"');
      expect(html).toContain('controls="controls"');
      expect(html).toContain('preload="metadata"');
      expect(html).toContain('class="tiptop-audio"');
    });

    it('should handle audio without optional attributes', () => {
      editor.commands.setAudio({
        src: 'https://example.com/audio.mp3',
      });

      const html = editor.getHTML();
      expect(html).toContain('<audio');
      expect(html).toContain('src="https://example.com/audio.mp3"');
      expect(html).toContain('controls="controls"');
      expect(html).toContain('preload="metadata"');
      expect(html).not.toContain('title=');
    });
  });

  describe('Input Rules', () => {
    it('should create audio from command', () => {
      const result = editor.commands.setAudio({
        src: 'https://example.com/audio.mp3',
      });
      
      expect(result).toBe(true);
      const json = editor.getJSON();
      expect(json.content).toHaveLength(1);
      expect(json.content?.[0].type).toBe('tiptopAudio');
      expect(json.content?.[0].attrs?.src).toBe('https://example.com/audio.mp3');
      expect(json.content?.[0].attrs?.controls).toBe(true);
      expect(json.content?.[0].attrs?.preload).toBe('metadata');
    });

    it('should create audio with title from command', () => {
      const result = editor.commands.setAudio({
        src: 'https://example.com/audio.mp3',
        title: 'My Audio Title',
      });
      
      expect(result).toBe(true);
      const json = editor.getJSON();
      expect(json.content).toHaveLength(1);
      expect(json.content?.[0].type).toBe('tiptopAudio');
      expect(json.content?.[0].attrs?.src).toBe('https://example.com/audio.mp3');
      expect(json.content?.[0].attrs?.title).toBe('My Audio Title');
      expect(json.content?.[0].attrs?.controls).toBe(true);
      expect(json.content?.[0].attrs?.preload).toBe('metadata');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty src attribute', () => {
      const html = '<audio></audio>';
      editor.commands.setContent(html);

      const json = editor.getJSON();
      expect(json.content).toHaveLength(1);
      expect(json.content?.[0].type).toBe('tiptopAudio');
      expect(json.content?.[0].attrs?.src).toBe(null);
    });

    it('should handle audio without controls attribute', () => {
      const html = '<audio src="https://example.com/audio.mp3"></audio>';
      editor.commands.setContent(html);

      const json = editor.getJSON();
      expect(json.content?.[0].attrs?.controls).toBe(false);
    });

    it('should handle different preload values', () => {
      const html = '<audio src="https://example.com/audio.mp3" preload="auto"></audio>';
      editor.commands.setContent(html);

      const json = editor.getJSON();
      expect(json.content?.[0].attrs?.preload).toBe('auto');
    });

    it('should not update audio when no audio node is selected', () => {
      editor.commands.setContent('<p>Some text</p>');
      editor.commands.selectAll();

      const result = editor.commands.updateAudio({
        title: 'New Title',
      });

      expect(result).toBe(false);
    });
  });
});
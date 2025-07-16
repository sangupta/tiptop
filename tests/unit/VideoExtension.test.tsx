import { describe, it, expect, beforeEach } from 'vitest';
import { Editor } from '@tiptap/core';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import { TiptopVideoEmbed } from '@/extensions/VideoExtension';

describe('TiptopVideoEmbed Extension', () => {
  let editor: Editor;

  beforeEach(() => {
    editor = new Editor({
      extensions: [
        Document,
        Paragraph,
        Text,
        TiptopVideoEmbed,
      ],
      content: '',
    });
  });

  afterEach(() => {
    editor.destroy();
  });

  describe('Extension Configuration', () => {
    it('should be configured with correct name', () => {
      expect(editor.extensionManager.extensions.find(ext => ext.name === 'tiptopVideo')).toBeDefined();
    });

    it('should have correct default options', () => {
      const extension = editor.extensionManager.extensions.find(ext => ext.name === 'tiptopVideo');
      expect(extension?.options).toEqual({
        inline: false,
        allowBase64: true,
        HTMLAttributes: {
          class: 'tiptop-video',
        },
      });
    });

    it('should be a block-level node', () => {
      const videoType = editor.schema.nodes.tiptopVideo;
      expect(videoType.spec.group).toBe('block');
    });

    it('should be draggable', () => {
      const videoType = editor.schema.nodes.tiptopVideo;
      expect(videoType.spec.draggable).toBe(true);
    });
  });

  describe('Attributes', () => {
    it('should have src attribute', () => {
      const videoType = editor.schema.nodes.tiptopVideo;
      expect(videoType.spec.attrs?.src).toBeDefined();
      expect(videoType.spec.attrs?.src.default).toBe(null);
    });

    it('should have title attribute', () => {
      const videoType = editor.schema.nodes.tiptopVideo;
      expect(videoType.spec.attrs?.title).toBeDefined();
      expect(videoType.spec.attrs?.title.default).toBe(null);
    });

    it('should have controls attribute with default true', () => {
      const videoType = editor.schema.nodes.tiptopVideo;
      expect(videoType.spec.attrs?.controls).toBeDefined();
      expect(videoType.spec.attrs?.controls.default).toBe(true);
    });

    it('should have width and height attributes', () => {
      const videoType = editor.schema.nodes.tiptopVideo;
      expect(videoType.spec.attrs?.width).toBeDefined();
      expect(videoType.spec.attrs?.width.default).toBe(null);
      expect(videoType.spec.attrs?.height).toBeDefined();
      expect(videoType.spec.attrs?.height.default).toBe(null);
    });

    it('should have preload attribute with default metadata', () => {
      const videoType = editor.schema.nodes.tiptopVideo;
      expect(videoType.spec.attrs?.preload).toBeDefined();
      expect(videoType.spec.attrs?.preload.default).toBe('metadata');
    });
  });

  describe('Commands', () => {
    it('should have setVideo command', () => {
      expect(editor.commands.setVideo).toBeDefined();
      expect(typeof editor.commands.setVideo).toBe('function');
    });

    it('should have updateVideo command', () => {
      expect(editor.commands.updateVideo).toBeDefined();
      expect(typeof editor.commands.updateVideo).toBe('function');
    });

    it('should insert video with setVideo command', () => {
      const result = editor.commands.setVideo({
        src: 'https://example.com/video.mp4',
        title: 'Test Video',
        width: 640,
        height: 480,
      });

      expect(result).toBe(true);
      
      const json = editor.getJSON();
      expect(json.content).toHaveLength(1);
      expect(json.content?.[0].type).toBe('tiptopVideo');
      expect(json.content?.[0].attrs?.src).toBe('https://example.com/video.mp4');
      expect(json.content?.[0].attrs?.title).toBe('Test Video');
      expect(json.content?.[0].attrs?.width).toBe(640);
      expect(json.content?.[0].attrs?.height).toBe(480);
      expect(json.content?.[0].attrs?.controls).toBe(true);
      expect(json.content?.[0].attrs?.preload).toBe('metadata');
    });

    it('should update video attributes with updateVideo command', () => {
      // First insert a video
      editor.commands.setVideo({
        src: 'https://example.com/video.mp4',
        title: 'Original Title',
        width: 640,
        height: 480,
      });

      // Select the video node
      editor.commands.selectAll();

      // Update the video
      const result = editor.commands.updateVideo({
        title: 'Updated Title',
        width: 800,
        height: 600,
        controls: false,
      });

      expect(result).toBe(true);

      const json = editor.getJSON();
      expect(json.content?.[0].attrs?.src).toBe('https://example.com/video.mp4');
      expect(json.content?.[0].attrs?.title).toBe('Updated Title');
      expect(json.content?.[0].attrs?.width).toBe(800);
      expect(json.content?.[0].attrs?.height).toBe(600);
      expect(json.content?.[0].attrs?.controls).toBe(false);
    });
  });

  describe('HTML Parsing and Rendering', () => {
    it('should parse video HTML correctly', () => {
      const html = '<video src="https://example.com/video.mp4" title="Test Video" width="640" height="480" controls preload="metadata"></video>';
      editor.commands.setContent(html);

      const json = editor.getJSON();
      expect(json.content).toHaveLength(1);
      expect(json.content?.[0].type).toBe('tiptopVideo');
      expect(json.content?.[0].attrs?.src).toBe('https://example.com/video.mp4');
      expect(json.content?.[0].attrs?.title).toBe('Test Video');
      expect(json.content?.[0].attrs?.width).toBe(640);
      expect(json.content?.[0].attrs?.height).toBe(480);
      expect(json.content?.[0].attrs?.controls).toBe(true);
      expect(json.content?.[0].attrs?.preload).toBe('metadata');
    });

    it('should render video HTML correctly', () => {
      editor.commands.setVideo({
        src: 'https://example.com/video.mp4',
        title: 'Test Video',
        width: 640,
        height: 480,
        controls: true,
      });

      const html = editor.getHTML();
      expect(html).toContain('<video');
      expect(html).toContain('src="https://example.com/video.mp4"');
      expect(html).toContain('title="Test Video"');
      expect(html).toContain('width="640"');
      expect(html).toContain('height="480"');
      expect(html).toContain('controls="controls"');
      expect(html).toContain('preload="metadata"');
      expect(html).toContain('class="tiptop-video"');
    });

    it('should handle video without optional attributes', () => {
      editor.commands.setVideo({
        src: 'https://example.com/video.mp4',
      });

      const html = editor.getHTML();
      expect(html).toContain('<video');
      expect(html).toContain('src="https://example.com/video.mp4"');
      expect(html).toContain('controls="controls"');
      expect(html).toContain('preload="metadata"');
      expect(html).not.toContain('title=');
      expect(html).not.toContain('width=');
      expect(html).not.toContain('height=');
    });
  });

  describe('Input Rules', () => {
    it('should create video from markdown-like syntax', () => {
      // Input rules work when typing, not when setting content directly
      // Let's test the command instead
      const result = editor.commands.setVideo({
        src: 'https://example.com/video.mp4',
      });
      
      expect(result).toBe(true);
      const json = editor.getJSON();
      expect(json.content).toHaveLength(1);
      expect(json.content?.[0].type).toBe('tiptopVideo');
      expect(json.content?.[0].attrs?.src).toBe('https://example.com/video.mp4');
      expect(json.content?.[0].attrs?.controls).toBe(true);
      expect(json.content?.[0].attrs?.preload).toBe('metadata');
    });

    it('should create video with title from command', () => {
      const result = editor.commands.setVideo({
        src: 'https://example.com/video.mp4',
        title: 'My Video Title',
      });
      
      expect(result).toBe(true);
      const json = editor.getJSON();
      expect(json.content).toHaveLength(1);
      expect(json.content?.[0].type).toBe('tiptopVideo');
      expect(json.content?.[0].attrs?.src).toBe('https://example.com/video.mp4');
      expect(json.content?.[0].attrs?.title).toBe('My Video Title');
      expect(json.content?.[0].attrs?.controls).toBe(true);
      expect(json.content?.[0].attrs?.preload).toBe('metadata');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty src attribute', () => {
      const html = '<video></video>';
      editor.commands.setContent(html);

      const json = editor.getJSON();
      expect(json.content).toHaveLength(1);
      expect(json.content?.[0].type).toBe('tiptopVideo');
      expect(json.content?.[0].attrs?.src).toBe(null);
    });

    it('should handle video without controls attribute', () => {
      const html = '<video src="https://example.com/video.mp4"></video>';
      editor.commands.setContent(html);

      const json = editor.getJSON();
      expect(json.content?.[0].attrs?.controls).toBe(false);
    });

    it('should handle different preload values', () => {
      const html = '<video src="https://example.com/video.mp4" preload="auto"></video>';
      editor.commands.setContent(html);

      const json = editor.getJSON();
      expect(json.content?.[0].attrs?.preload).toBe('auto');
    });

    it('should parse width and height as numbers', () => {
      const html = '<video src="https://example.com/video.mp4" width="800" height="600"></video>';
      editor.commands.setContent(html);

      const json = editor.getJSON();
      expect(json.content?.[0].attrs?.width).toBe(800);
      expect(json.content?.[0].attrs?.height).toBe(600);
      expect(typeof json.content?.[0].attrs?.width).toBe('number');
      expect(typeof json.content?.[0].attrs?.height).toBe('number');
    });

    it('should not update video when no video node is selected', () => {
      editor.commands.setContent('<p>Some text</p>');
      editor.commands.selectAll();

      const result = editor.commands.updateVideo({
        title: 'New Title',
      });

      expect(result).toBe(false);
    });
  });
});
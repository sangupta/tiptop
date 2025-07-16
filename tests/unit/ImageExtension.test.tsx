import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/preact';
import { Editor } from '@tiptap/core';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import { EnhancedImage } from '@/extensions/ImageExtension';

describe('EnhancedImage Extension', () => {
  let editor: Editor;

  beforeEach(() => {
    editor = new Editor({
      extensions: [
        Document,
        Paragraph,
        Text,
        EnhancedImage.configure({
          HTMLAttributes: {
            class: 'tiptop-image',
          },
          inline: false,
          allowBase64: true,
        }),
      ],
      content: '',
    });
  });

  afterEach(() => {
    editor.destroy();
  });

  it('should be defined', () => {
    expect(EnhancedImage).toBeDefined();
  });

  it('should have correct name', () => {
    expect(EnhancedImage.name).toBe('enhancedImage');
  });

  it('should insert image with setImage command', () => {
    const imageData = {
      src: 'https://example.com/image.jpg',
      alt: 'Test image',
      title: 'Test title',
    };

    editor.commands.setImage(imageData);

    const html = editor.getHTML();
    expect(html).toContain('src="https://example.com/image.jpg"');
    expect(html).toContain('alt="Test image"');
    expect(html).toContain('title="Test title"');
    expect(html).toContain('class="tiptop-image"');
  });

  it('should handle image with width and height attributes', () => {
    const imageData = {
      src: 'https://example.com/image.jpg',
      alt: 'Test image',
      width: 300,
      height: 200,
    };

    editor.commands.setImage(imageData);

    const html = editor.getHTML();
    expect(html).toContain('width="300"');
    expect(html).toContain('height="200"');
  });

  it('should support image insertion and manipulation', () => {
    // Test that we can insert and work with images
    editor.commands.setImage({
      src: 'https://example.com/test.jpg',
      alt: 'Test image',
    });

    const json = editor.getJSON();
    expect(json.content).toBeDefined();
    expect(json.content?.[0]?.type).toBe('enhancedImage');
    expect(json.content?.[0]?.attrs?.src).toBe('https://example.com/test.jpg');
    expect(json.content?.[0]?.attrs?.alt).toBe('Test image');
  });

  it('should handle base64 images when allowBase64 is true', () => {
    const base64Image = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
    
    editor.commands.setImage({
      src: base64Image,
      alt: 'Base64 image',
    });

    const html = editor.getHTML();
    expect(html).toContain(base64Image);
    expect(html).toContain('alt="Base64 image"');
  });

  it('should update image attributes with updateImage command', () => {
    // First insert an image
    editor.commands.setImage({
      src: 'https://example.com/image.jpg',
      alt: 'Original alt',
    });

    // Select the entire document to include the image
    editor.commands.selectAll();

    // Update the image
    editor.commands.updateImage({
      alt: 'Updated alt',
      title: 'New title',
    });

    const html = editor.getHTML();
    expect(html).toContain('alt="Updated alt"');
    expect(html).toContain('title="New title"');
    expect(html).toContain('src="https://example.com/image.jpg"');
  });

  it('should render with correct HTML attributes', () => {
    editor.commands.setImage({
      src: 'https://example.com/image.jpg',
      alt: 'Test image',
    });

    const html = editor.getHTML();
    expect(html).toContain('<img');
    expect(html).toContain('class="tiptop-image"');
  });

  it('should handle empty or null attributes gracefully', () => {
    editor.commands.setImage({
      src: 'https://example.com/image.jpg',
      alt: null,
      title: undefined,
    });

    const html = editor.getHTML();
    expect(html).toContain('src="https://example.com/image.jpg"');
    expect(html).not.toContain('alt=""');
    expect(html).not.toContain('title=""');
  });

  it('should maintain image attributes when parsing HTML', () => {
    const htmlContent = '<img src="https://example.com/image.jpg" alt="Test" title="Title" width="300" height="200" class="tiptop-image" />';
    
    editor.commands.setContent(htmlContent);
    
    const outputHtml = editor.getHTML();
    expect(outputHtml).toContain('src="https://example.com/image.jpg"');
    expect(outputHtml).toContain('alt="Test"');
    expect(outputHtml).toContain('title="Title"');
    expect(outputHtml).toContain('width="300"');
    expect(outputHtml).toContain('height="200"');
  });
});
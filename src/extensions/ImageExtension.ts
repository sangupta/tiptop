import { Node, mergeAttributes, nodeInputRule } from '@tiptap/core';
import Image from '@tiptap/extension-image';

export interface ImageOptions {
  inline: boolean;
  allowBase64: boolean;
  HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    image: {
      /**
       * Add an image
       */
      setImage: (options: { src: string; alt?: string; title?: string; width?: number; height?: number }) => ReturnType;
      /**
       * Update image attributes
       */
      updateImage: (options: { src?: string; alt?: string; title?: string; width?: number; height?: number }) => ReturnType;
    };
  }
}

export const EnhancedImage = Image.extend<ImageOptions>({
  name: 'enhancedImage',

  addOptions() {
    return {
      ...this.parent?.(),
      inline: false,
      allowBase64: true,
      HTMLAttributes: {
        class: 'tiptop-image',
      },
    };
  },

  addAttributes() {
    return {
      ...this.parent?.(),
      src: {
        default: null,
        parseHTML: element => element.getAttribute('src'),
        renderHTML: attributes => {
          if (!attributes.src) {
            return {};
          }
          return {
            src: attributes.src,
          };
        },
      },
      alt: {
        default: null,
        parseHTML: element => element.getAttribute('alt'),
        renderHTML: attributes => {
          if (!attributes.alt) {
            return {};
          }
          return {
            alt: attributes.alt,
          };
        },
      },
      title: {
        default: null,
        parseHTML: element => element.getAttribute('title'),
        renderHTML: attributes => {
          if (!attributes.title) {
            return {};
          }
          return {
            title: attributes.title,
          };
        },
      },
      width: {
        default: null,
        parseHTML: element => {
          const width = element.getAttribute('width');
          return width ? parseInt(width, 10) : null;
        },
        renderHTML: attributes => {
          if (!attributes.width) {
            return {};
          }
          return {
            width: attributes.width,
          };
        },
      },
      height: {
        default: null,
        parseHTML: element => {
          const height = element.getAttribute('height');
          return height ? parseInt(height, 10) : null;
        },
        renderHTML: attributes => {
          if (!attributes.height) {
            return {};
          }
          return {
            height: attributes.height,
          };
        },
      },
    };
  },

  renderHTML({ HTMLAttributes }) {
    return ['img', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)];
  },

  addCommands() {
    return {
      ...this.parent?.(),
      setImage: options => ({ commands }) => {
        return commands.insertContent({
          type: this.name,
          attrs: options,
        });
      },
      updateImage: options => ({ tr, state, dispatch }) => {
        const { selection } = state;
        const { from, to } = selection;
        
        let updated = false;
        state.doc.nodesBetween(from, to, (node, pos) => {
          if (node.type.name === this.name) {
            const attrs = { ...node.attrs, ...options };
            tr.setNodeMarkup(pos, undefined, attrs);
            updated = true;
          }
        });
        
        if (updated && dispatch) {
          dispatch(tr);
        }
        
        return updated;
      },
    };
  },

  addInputRules() {
    return [
      nodeInputRule({
        find: /!\[([^\]]*)\]\(([^\s\)]+)(?:\s+"([^"]*)")?\)/,
        type: this.type,
        getAttributes: match => {
          const [, alt, src, title] = match;
          return { src, alt: alt || null, title: title || null };
        },
      }),
    ];
  },
});

export default EnhancedImage;
import { Node, mergeAttributes, nodeInputRule } from '@tiptap/core';

export interface VideoOptions {
  inline: boolean;
  allowBase64: boolean;
  HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    video: {
      /**
       * Add a video element
       */
      setVideo: (options: { src: string; title?: string; controls?: boolean; width?: number; height?: number }) => ReturnType;
      /**
       * Update video attributes
       */
      updateVideo: (options: { src?: string; title?: string; controls?: boolean; width?: number; height?: number }) => ReturnType;
    };
  }
}

export const TiptopVideoEmbed = Node.create<VideoOptions>({
  name: 'tiptopVideo',

  addOptions() {
    return {
      inline: false,
      allowBase64: true,
      HTMLAttributes: {
        class: 'tiptop-video',
      },
    };
  },

  group: 'block',

  draggable: true,

  addAttributes() {
    return {
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
      controls: {
        default: true,
        parseHTML: element => element.hasAttribute('controls'),
        renderHTML: attributes => {
          if (!attributes.controls) {
            return {};
          }
          return {
            controls: 'controls',
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
      preload: {
        default: 'metadata',
        parseHTML: element => element.getAttribute('preload') || 'metadata',
        renderHTML: attributes => ({
          preload: attributes.preload || 'metadata',
        }),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'video',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['video', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)];
  },

  addCommands() {
    return {
      setVideo: options => ({ commands }) => {
        return commands.insertContent({
          type: this.name,
          attrs: {
            controls: true,
            preload: 'metadata',
            ...options,
          },
        });
      },
      updateVideo: options => ({ tr, state, dispatch }) => {
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
        find: /!\[video\]\(([^\s\)]+)(?:\s+"([^"]*)")?\)/,
        type: this.type,
        getAttributes: match => {
          const [, src, title] = match;
          return { 
            src, 
            title: title || null,
            controls: true,
            preload: 'metadata'
          };
        },
      }),
    ];
  },
});

export default TiptopVideoEmbed;
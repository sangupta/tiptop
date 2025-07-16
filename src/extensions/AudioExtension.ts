import { Node, mergeAttributes, nodeInputRule } from '@tiptap/core';

export interface AudioOptions {
  inline: boolean;
  allowBase64: boolean;
  HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    audio: {
      /**
       * Add an audio element
       */
      setAudio: (options: { src: string; title?: string; controls?: boolean }) => ReturnType;
      /**
       * Update audio attributes
       */
      updateAudio: (options: { src?: string; title?: string; controls?: boolean }) => ReturnType;
    };
  }
}

export const TiptopAudioEmbed = Node.create<AudioOptions>({
  name: 'tiptopAudio',

  addOptions() {
    return {
      inline: false,
      allowBase64: true,
      HTMLAttributes: {
        class: 'tiptop-audio',
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
        tag: 'audio',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['audio', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)];
  },

  addCommands() {
    return {
      setAudio: options => ({ commands }) => {
        return commands.insertContent({
          type: this.name,
          attrs: {
            controls: true,
            preload: 'metadata',
            ...options,
          },
        });
      },
      updateAudio: options => ({ tr, state, dispatch }) => {
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
        find: /!\[audio\]\(([^\s\)]+)(?:\s+"([^"]*)")?\)/,
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

export default TiptopAudioEmbed;
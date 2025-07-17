import { Node, mergeAttributes } from '@tiptap/core';

export interface PreformattedOptions {
  HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    preformatted: {
      /**
       * Toggle a preformatted block
       */
      togglePreformatted: () => ReturnType;
      /**
       * Set a preformatted block
       */
      setPreformatted: () => ReturnType;
      /**
       * Unset a preformatted block
       */
      unsetPreformatted: () => ReturnType;
    };
  }
}

export const TiptopPreformatted = Node.create<PreformattedOptions>({
  name: 'preformatted',
  
  priority: 100,
  
  addOptions() {
    return {
      HTMLAttributes: {
        class: 'tiptop-preformatted',
      },
    };
  },
  
  group: 'block',
  
  content: 'inline*',
  
  defining: true,
  
  parseHTML() {
    return [
      { tag: 'pre' },
    ];
  },
  
  renderHTML({ HTMLAttributes }) {
    return ['pre', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
  },
  
  addCommands() {
    return {
      togglePreformatted: () => ({ commands }) => {
        return commands.toggleNode('preformatted', 'paragraph');
      },
      setPreformatted: () => ({ commands }) => {
        return commands.setNode('preformatted');
      },
      unsetPreformatted: () => ({ commands }) => {
        return commands.setNode('paragraph');
      },
    };
  },
  
  addKeyboardShortcuts() {
    return {
      'Mod-Alt-p': () => this.editor.commands.togglePreformatted(),
    };
  },
});
import { Node, mergeAttributes, NodeViewRenderer } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { Decoration, DecorationSet, NodeView } from '@tiptap/pm/view';
import Prism from 'prismjs';
import { CodeBlockView } from './CodeBlockView';

// Import additional languages (in order of dependencies)
import 'prismjs/components/prism-markup-templating';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-scss';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-csharp';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-rust';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-yaml';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-php';
import 'prismjs/components/prism-ruby';
import 'prismjs/components/prism-swift';

export interface SyntaxHighlightOptions {
  HTMLAttributes: Record<string, any>;
  defaultLanguage: string;
  languageClassPrefix: string;
}

export interface CodeBlockAttributes {
  language: string;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    syntaxHighlight: {
      /**
       * Set a code block
       */
      setCodeBlock: (attributes?: CodeBlockAttributes) => ReturnType;
      /**
       * Toggle a code block
       */
      toggleCodeBlock: (attributes?: CodeBlockAttributes) => ReturnType;
      /**
       * Update code block language
       */
      updateCodeBlockLanguage: (language: string) => ReturnType;
    };
  }
}

export const TiptopSyntaxHighlight = Node.create<SyntaxHighlightOptions>({
  name: 'codeBlock',

  addOptions() {
    return {
      HTMLAttributes: {
        class: 'tiptop-code-block',
      },
      defaultLanguage: 'javascript',
      languageClassPrefix: 'language-',
    };
  },

  content: 'text*',

  marks: '',

  group: 'block',

  code: true,

  defining: true,

  addAttributes() {
    return {
      language: {
        default: this.options.defaultLanguage,
        parseHTML: element => {
          const classNames = element.getAttribute('class');
          if (!classNames) return this.options.defaultLanguage;

          const matches = classNames
            .split(' ')
            .filter(className => className.startsWith(this.options.languageClassPrefix));

          if (matches.length) {
            return matches[0].replace(this.options.languageClassPrefix, '');
          }

          return this.options.defaultLanguage;
        },
        renderHTML: attributes => {
          return {
            class: attributes.language
              ? `${this.options.languageClassPrefix}${attributes.language}`
              : null,
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'pre',
        preserveWhitespace: 'full',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'pre',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      ['code', {}, 0],
    ];
  },

  addCommands() {
    return {
      setCodeBlock:
        attributes => ({ commands }) => {
          return commands.setNode(this.name, attributes);
        },
      toggleCodeBlock:
        attributes => ({ commands }) => {
          return commands.toggleNode(this.name, 'paragraph', attributes);
        },
      updateCodeBlockLanguage:
        language => ({ commands, tr }) => {
          const { selection } = tr;
          const node = tr.doc.nodeAt(selection.from);

          if (!node || node.type.name !== this.name) {
            return false;
          }

          return commands.updateAttributes(this.name, { language });
        },
    };
  },

  addKeyboardShortcuts() {
    return {
      'Mod-Alt-c': () => this.editor.commands.toggleCodeBlock(),
      'Mod-Alt-Shift-c': () => this.editor.chain().focus().toggleCodeBlock().run(),
    };
  },

  addNodeView() {
    return ({ node, editor, getPos }) => {
      return new CodeBlockView(node, editor.view, getPos as () => number, editor);
    };
  },
  
  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('syntaxHighlighting'),
        props: {
          decorations: ({ doc }) => {
            const decorations: Decoration[] = [];

            doc.descendants((node, pos) => {
              if (node.type.name !== this.name) {
                return;
              }

              const language = node.attrs.language || this.options.defaultLanguage;
              const grammar = Prism.languages[language];

              if (!grammar) {
                return;
              }

              const content = node.textContent;
              if (!content) return;

              const tokens = Prism.tokenize(content, grammar);
              let offset = 0;

              const parseTokens = (tokens: (string | Prism.Token)[], parentClassNames: string[] = []) => {
                tokens.forEach(token => {
                  if (typeof token === 'string') {
                    offset += token.length;
                    return;
                  }

                  const content = token.content as string | (string | Prism.Token)[];
                  const classNames = parentClassNames.concat(
                    token.type ? `token ${token.type}` : []
                  );

                  if (typeof content === 'string') {
                    decorations.push(
                      Decoration.inline(pos + 1 + offset, pos + 1 + offset + content.length, {
                        class: classNames.join(' '),
                      })
                    );
                    offset += content.length;
                  } else {
                    parseTokens(Array.isArray(content) ? content : [content], classNames);
                  }
                });
              };

              parseTokens(Array.isArray(tokens) ? tokens : [tokens]);
            });

            return DecorationSet.create(doc, decorations);
          },
        },
      }),
    ];
  },
});
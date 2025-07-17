import { NodeView, EditorView } from '@tiptap/pm/view';
import { Node as ProseMirrorNode } from '@tiptap/pm/model';
import { Editor } from '@tiptap/core';
import { h, render } from 'preact';
import { CodeBlockToolbar } from '../components/CodeBlockToolbar';

export class CodeBlockView implements NodeView {
  node: ProseMirrorNode;
  editor: Editor;
  view: EditorView;
  getPos: () => number;
  
  dom: HTMLElement;
  contentDOM: HTMLElement;
  toolbarContainer: HTMLElement;
  preElement: HTMLElement;
  
  id: string;
  
  constructor(node: ProseMirrorNode, view: EditorView, getPos: () => number, editor: Editor) {
    this.node = node;
    this.view = view;
    this.getPos = getPos;
    this.editor = editor;
    
    // Generate a unique ID for this code block
    this.id = `code-block-${Math.random().toString(36).substring(2, 11)}`;
    
    // Create the wrapper element (this will be the main DOM element)
    this.dom = document.createElement('div');
    this.dom.classList.add('tiptop-code-block-wrapper');
    
    // Create the toolbar container
    this.toolbarContainer = document.createElement('div');
    this.toolbarContainer.classList.add('tiptop-code-block-toolbar');
    
    // Create the code block element
    this.preElement = document.createElement('pre');
    this.preElement.classList.add('tiptop-code-block');
    this.preElement.id = this.id;
    
    if (this.node.attrs.language) {
      this.preElement.classList.add(`language-${this.node.attrs.language}`);
    }
    
    // Create the content DOM
    this.contentDOM = document.createElement('code');
    
    // Assemble the elements
    this.preElement.appendChild(this.contentDOM);
    this.dom.appendChild(this.toolbarContainer);
    this.dom.appendChild(this.preElement);
    
    // Render the toolbar
    this.renderToolbar();
    
    // Set up MutationObserver to apply syntax highlighting when content changes
    this.setupSyntaxHighlighting();
  }
  
  renderToolbar() {
    render(
      h(CodeBlockToolbar, {
        editor: this.editor,
        language: this.node.attrs.language || 'javascript',
        onLanguageChange: this.updateLanguage.bind(this),
        codeBlockId: this.id,
      }),
      this.toolbarContainer
    );
  }
  
  updateLanguage(language: string) {
    if (this.getPos && this.editor) {
      this.editor
        .chain()
        .focus()
        .setNodeSelection(this.getPos())
        .updateAttributes('codeBlock', { language })
        .run();
      
      // Update the class on the pre element
      this.preElement.className = 'tiptop-code-block';
      this.preElement.classList.add(`language-${language}`);
    }
  }
  
  update(node: ProseMirrorNode) {
    if (node.type !== this.node.type) {
      return false;
    }
    
    if (node.attrs.language !== this.node.attrs.language) {
      this.node = node;
      this.renderToolbar();
      // Update the class on the pre element
      this.preElement.className = 'tiptop-code-block';
      if (node.attrs.language) {
        this.preElement.classList.add(`language-${node.attrs.language}`);
      }
      return true;
    }
    
    this.node = node;
    return true;
  }
  
  destroy() {
    // Clean up Preact component
    render(null, this.toolbarContainer);
  }
  
  stopEvent(event: Event) {
    // Allow events in the toolbar to be handled by the toolbar component
    const target = event.target as HTMLElement;
    return this.toolbarContainer.contains(target);
  }
  
  ignoreMutation(mutation: MutationRecord) {
    // Ignore mutations in the toolbar but allow content mutations
    return mutation.target === this.toolbarContainer || 
           this.toolbarContainer.contains(mutation.target as Node);
  }
  
  setupSyntaxHighlighting() {
    // We'll let the CSS handle basic styling and focus on the toolbar functionality
    // The syntax highlighting will be handled by the ProseMirror decorations in the extension
  }
}
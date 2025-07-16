import { Extension } from '@tiptap/core';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import ListItem from '@tiptap/extension-list-item';

// Enhanced BulletList with indentation support
export const EnhancedBulletList = BulletList.extend({
  name: 'bulletList',

  addKeyboardShortcuts() {
    return {
      ...this.parent?.() || {},
      'Tab': () => {
        if (this.editor.isActive('bulletList') || this.editor.isActive('orderedList')) {
          return this.editor.commands.sinkListItem('listItem');
        }
        return false;
      },
      'Shift-Tab': () => {
        if (this.editor.isActive('bulletList') || this.editor.isActive('orderedList')) {
          return this.editor.commands.liftListItem('listItem');
        }
        return false;
      },
    };
  },
});

// Enhanced OrderedList with indentation support
export const EnhancedOrderedList = OrderedList.extend({
  name: 'orderedList',

  addKeyboardShortcuts() {
    return {
      ...this.parent?.() || {},
      'Tab': () => {
        if (this.editor.isActive('bulletList') || this.editor.isActive('orderedList')) {
          return this.editor.commands.sinkListItem('listItem');
        }
        return false;
      },
      'Shift-Tab': () => {
        if (this.editor.isActive('bulletList') || this.editor.isActive('orderedList')) {
          return this.editor.commands.liftListItem('listItem');
        }
        return false;
      },
    };
  },
});

// Enhanced ListItem with better nesting support
export const EnhancedListItem = ListItem.extend({
  name: 'listItem',

  addKeyboardShortcuts() {
    return {
      ...this.parent?.() || {},
      'Enter': () => {
        if (this.editor.isActive('listItem')) {
          // Check if current list item is empty
          const { $from } = this.editor.state.selection;
          const listItem = $from.node($from.depth - 1);

          if (listItem && listItem.textContent === '') {
            // If empty, lift the list item (outdent)
            return this.editor.commands.liftListItem('listItem');
          }

          // Otherwise, split the list item normally
          return this.editor.commands.splitListItem('listItem');
        }
        return false;
      },
    };
  },
});

// List utilities extension that provides additional functionality
export const ListUtilities = Extension.create({
  name: 'listUtilities',

  // This extension provides keyboard shortcuts and enhanced list behavior
  // The actual indent/outdent functionality is handled by the built-in TipTap commands
});
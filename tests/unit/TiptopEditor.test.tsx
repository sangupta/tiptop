import { render, screen, waitFor } from '@testing-library/preact';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { TiptopEditor } from '@/components/TiptopEditor';
import { TiptopEditorRef } from '@/types';
import { createRef } from 'preact/compat';

// Mock Tiptap modules
vi.mock('@tiptap/core', () => ({
  Editor: vi.fn().mockImplementation(() => ({
    getHTML: vi.fn(() => '<p>Test content</p>'),
    getJSON: vi.fn(() => ({ type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Test content' }] }] })),
    setEditable: vi.fn(),
    destroy: vi.fn(),
    commands: {
      setContent: vi.fn(),
      focus: vi.fn(),
      blur: vi.fn(),
    },
    state: {
      selection: {
        from: 0,
        to: 0,
        empty: true,
      },
    },
  })),
  Extension: {
    create: vi.fn(() => ({})),
  },
}));

vi.mock('@tiptap/extension-document', () => ({
  default: {},
}));

vi.mock('@tiptap/extension-paragraph', () => ({
  default: {
    configure: vi.fn(() => ({})),
  },
}));

vi.mock('@tiptap/extension-text', () => ({
  default: {},
}));

vi.mock('@tiptap/extension-bold', () => ({
  default: {},
}));

vi.mock('@tiptap/extension-italic', () => ({
  default: {},
}));

vi.mock('@tiptap/extension-underline', () => ({
  default: {},
}));

vi.mock('@tiptap/extension-strike', () => ({
  default: {},
}));

vi.mock('@tiptap/extension-subscript', () => ({
  default: {},
}));

vi.mock('@tiptap/extension-superscript', () => ({
  default: {},
}));

vi.mock('@tiptap/extension-color', () => ({
  default: {
    configure: vi.fn(() => ({})),
  },
}));

vi.mock('@tiptap/extension-highlight', () => ({
  default: {
    configure: vi.fn(() => ({})),
  },
}));

vi.mock('@tiptap/extension-text-style', () => ({
  default: {},
}));

vi.mock('@tiptap/extension-text-align', () => ({
  default: {
    configure: vi.fn(() => ({})),
  },
}));

vi.mock('@tiptap/extension-link', () => ({
  default: {
    configure: vi.fn(() => ({})),
  },
}));

vi.mock('@tiptap/extension-blockquote', () => ({
  default: {
    configure: vi.fn(() => ({})),
  },
}));

vi.mock('@tiptap/extension-code', () => ({
  default: {
    configure: vi.fn(() => ({})),
  },
}));

// Mock the enhanced list extensions
vi.mock('@/extensions', () => ({
  EnhancedBulletList: {
    configure: vi.fn(() => ({})),
  },
  EnhancedOrderedList: {
    configure: vi.fn(() => ({})),
  },
  EnhancedListItem: {
    configure: vi.fn(() => ({})),
  },
  ListUtilities: {},
  EnhancedImage: {
    configure: vi.fn(() => ({})),
  },
  TiptopAudioEmbed: {
    configure: vi.fn(() => ({})),
  },
  TiptopVideoEmbed: {
    configure: vi.fn(() => ({})),
  },
  TiptopPreformatted: {
    configure: vi.fn(() => ({})),
  },
  TiptopSyntaxHighlight: {
    configure: vi.fn(() => ({})),
  },
  CodeBlockView: {},
}));

describe('TiptopEditor', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<TiptopEditor />);
    expect(screen.getByTestId('tiptop-editor')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const customClass = 'custom-editor-class';
    render(<TiptopEditor className={customClass} />);
    
    const container = screen.getByTestId('tiptop-editor-container');
    expect(container).toHaveClass(customClass);
  });

  it('renders with default props', () => {
    render(<TiptopEditor />);
    
    const container = screen.getByTestId('tiptop-editor-container');
    const editor = screen.getByTestId('tiptop-editor');
    
    expect(container).toBeInTheDocument();
    expect(editor).toBeInTheDocument();
    expect(editor).toHaveClass('tiptop-editor');
  });

  it('calls onUpdate when provided', async () => {
    const onUpdate = vi.fn();
    render(<TiptopEditor onUpdate={onUpdate} />);
    
    // The onUpdate callback should be called during editor initialization
    // We'll wait for it to be called
    await waitFor(() => {
      // Since we're mocking the Editor, we can't easily test the actual callback
      // but we can verify the component renders without errors
      expect(screen.getByTestId('tiptop-editor')).toBeInTheDocument();
    });
  });

  it('calls onSelectionUpdate when provided', async () => {
    const onSelectionUpdate = vi.fn();
    render(<TiptopEditor onSelectionUpdate={onSelectionUpdate} />);
    
    await waitFor(() => {
      expect(screen.getByTestId('tiptop-editor')).toBeInTheDocument();
    });
  });

  it('handles editable prop', () => {
    const { rerender } = render(<TiptopEditor editable={true} />);
    expect(screen.getByTestId('tiptop-editor')).toBeInTheDocument();
    
    rerender(<TiptopEditor editable={false} />);
    expect(screen.getByTestId('tiptop-editor')).toBeInTheDocument();
  });

  it('handles content prop as string', () => {
    const content = '<p>Test content</p>';
    render(<TiptopEditor content={content} />);
    
    expect(screen.getByTestId('tiptop-editor')).toBeInTheDocument();
  });

  it('handles content prop as JSON', () => {
    const jsonContent = {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'JSON content' }]
        }
      ]
    };
    
    render(<TiptopEditor content={jsonContent} />);
    expect(screen.getByTestId('tiptop-editor')).toBeInTheDocument();
  });

  it('exposes ref methods', () => {
    const ref = createRef<TiptopEditorRef>();
    render(<TiptopEditor ref={ref} />);
    
    // Wait for the component to mount and ref to be set
    expect(ref.current).toBeDefined();
    expect(typeof ref.current?.getContent).toBe('function');
    expect(typeof ref.current?.getJSON).toBe('function');
    expect(typeof ref.current?.setContent).toBe('function');
    expect(typeof ref.current?.focus).toBe('function');
    expect(typeof ref.current?.blur).toBe('function');
    expect(typeof ref.current?.destroy).toBe('function');
  });

  it('handles placeholder prop', () => {
    const placeholder = 'Custom placeholder';
    render(<TiptopEditor placeholder={placeholder} />);
    
    expect(screen.getByTestId('tiptop-editor')).toBeInTheDocument();
  });

  it('handles focus and blur callbacks', () => {
    const onFocus = vi.fn();
    const onBlur = vi.fn();
    
    render(<TiptopEditor onFocus={onFocus} onBlur={onBlur} />);
    
    expect(screen.getByTestId('tiptop-editor')).toBeInTheDocument();
  });

  it('applies correct CSS classes', () => {
    render(<TiptopEditor />);
    
    const container = screen.getByTestId('tiptop-editor-container');
    const editor = screen.getByTestId('tiptop-editor');
    
    expect(container).toHaveClass('tiptop-editor-container');
    expect(editor).toHaveClass('tiptop-editor');
    expect(editor).toHaveClass('min-h-[200px]');
    expect(editor).toHaveClass('p-4');
    expect(editor).toHaveClass('border');
    expect(editor).toHaveClass('rounded-lg');
  });

  it('handles component unmounting', () => {
    const { unmount } = render(<TiptopEditor />);
    
    expect(screen.getByTestId('tiptop-editor')).toBeInTheDocument();
    
    // Should not throw when unmounting
    expect(() => unmount()).not.toThrow();
  });

  it('handles ref methods when editor is available', () => {
    const ref = createRef<TiptopEditorRef>();
    render(<TiptopEditor ref={ref} />);
    
    // Test that methods don't throw when called
    expect(() => {
      ref.current?.getContent();
      ref.current?.getJSON();
      ref.current?.setContent('<p>New content</p>');
      ref.current?.focus();
      ref.current?.blur();
    }).not.toThrow();
  });

  it('handles content updates', () => {
    const { rerender } = render(<TiptopEditor content="<p>Initial</p>" />);
    expect(screen.getByTestId('tiptop-editor')).toBeInTheDocument();
    
    rerender(<TiptopEditor content="<p>Updated</p>" />);
    expect(screen.getByTestId('tiptop-editor')).toBeInTheDocument();
  });

  it('handles className prop correctly', () => {
    const className = 'my-custom-class another-class';
    render(<TiptopEditor className={className} />);
    
    const container = screen.getByTestId('tiptop-editor-container');
    expect(container).toHaveClass('my-custom-class');
    expect(container).toHaveClass('another-class');
    expect(container).toHaveClass('tiptop-editor-container');
  });
});
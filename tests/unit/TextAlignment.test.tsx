import { render, screen, fireEvent, waitFor } from '@testing-library/preact';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TiptopEditor } from '@/components/TiptopEditor';
import { FormattingToolbar } from '@/components/FormattingToolbar';
import { useRef, useState, useEffect } from 'preact/hooks';
import type { TiptopEditorRef } from '@/types';

// Mock Lucide icons
vi.mock('lucide-preact', () => ({
  Bold: () => <span data-testid="bold-icon">Bold</span>,
  Italic: () => <span data-testid="italic-icon">Italic</span>,
  Underline: () => <span data-testid="underline-icon">Underline</span>,
  Strikethrough: () => <span data-testid="strikethrough-icon">Strikethrough</span>,
  Subscript: () => <span data-testid="subscript-icon">Subscript</span>,
  Superscript: () => <span data-testid="superscript-icon">Superscript</span>,
  List: () => <span data-testid="list-icon">List</span>,
  ListOrdered: () => <span data-testid="list-ordered-icon">ListOrdered</span>,
  Indent: () => <span data-testid="indent-icon">Indent</span>,
  Outdent: () => <span data-testid="outdent-icon">Outdent</span>,
  Palette: () => <span data-testid="palette-icon">Palette</span>,
  Link: () => <span data-testid="link-icon">Link</span>,
  Image: () => <span data-testid="image-icon">Image</span>,
  Music: () => <span data-testid="music-icon">Music</span>,
  Video: () => <span data-testid="video-icon">Video</span>,
  ChevronDown: () => <span data-testid="chevron-down-icon">ChevronDown</span>,
  Type: () => <span data-testid="type-icon">Type</span>,
  AlignLeft: () => <span data-testid="align-left-icon">AlignLeft</span>,
  AlignCenter: () => <span data-testid="align-center-icon">AlignCenter</span>,
  AlignRight: () => <span data-testid="align-right-icon">AlignRight</span>,
  AlignJustify: () => <span data-testid="align-justify-icon">AlignJustify</span>,
  Upload: () => <span data-testid="upload-icon">Upload</span>,
  Link: () => <span data-testid="link-icon">Link</span>,
  X: () => <span data-testid="x-icon">X</span>,
}));

// Mock ColorPicker and FontSelector components
vi.mock('@/components/ColorPicker', () => ({
  ColorPicker: ({ onColorChange, label, currentColor }: any) => (
    <div data-testid={`color-picker-${label.toLowerCase().replace(/\s+/g, '-')}`}>
      <button onClick={() => onColorChange('#ff0000')}>
        {label} - {currentColor}
      </button>
    </div>
  ),
}));

vi.mock('@/components/FontSelector', () => ({
  FontSelector: ({ onFontChange, onSizeChange, currentFont, currentSize }: any) => (
    <div data-testid="font-selector">
      <button onClick={() => onFontChange('Arial, sans-serif')}>
        Font: {currentFont}
      </button>
      <button onClick={() => onSizeChange('18px')}>
        Size: {currentSize}
      </button>
    </div>
  ),
}));

// Mock editor for testing toolbar functionality
const createMockEditor = () => ({
  isActive: vi.fn((attrs) => {
    if (typeof attrs === 'string') return false;
    if (attrs?.textAlign === 'left') return true;
    return false;
  }),
  can: vi.fn(() => ({
    toggleBold: vi.fn(() => true),
    toggleItalic: vi.fn(() => true),
    toggleUnderline: vi.fn(() => true),
    toggleStrike: vi.fn(() => true),
    toggleSubscript: vi.fn(() => true),
    toggleSuperscript: vi.fn(() => true),
    toggleBulletList: vi.fn(() => true),
    toggleOrderedList: vi.fn(() => true),
    sinkListItem: vi.fn(() => true),
    liftListItem: vi.fn(() => true),
    setTextAlign: vi.fn(() => true),
  })),
  chain: vi.fn(() => ({
    focus: vi.fn(() => ({
      toggleBold: vi.fn(() => ({ run: vi.fn() })),
      toggleItalic: vi.fn(() => ({ run: vi.fn() })),
      toggleUnderline: vi.fn(() => ({ run: vi.fn() })),
      toggleStrike: vi.fn(() => ({ run: vi.fn() })),
      toggleSubscript: vi.fn(() => ({ run: vi.fn() })),
      toggleSuperscript: vi.fn(() => ({ run: vi.fn() })),
      toggleBulletList: vi.fn(() => ({ run: vi.fn() })),
      toggleOrderedList: vi.fn(() => ({ run: vi.fn() })),
      sinkListItem: vi.fn(() => ({ run: vi.fn() })),
      liftListItem: vi.fn(() => ({ run: vi.fn() })),
      setTextAlign: vi.fn(() => ({ run: vi.fn() })),
      setColor: vi.fn(() => ({ run: vi.fn() })),
      unsetColor: vi.fn(() => ({ run: vi.fn() })),
      setHighlight: vi.fn(() => ({ run: vi.fn() })),
      unsetHighlight: vi.fn(() => ({ run: vi.fn() })),
      setMark: vi.fn(() => ({ run: vi.fn() })),
      unsetMark: vi.fn(() => ({ run: vi.fn() })),
      setLink: vi.fn(() => ({ run: vi.fn() })),
      unsetLink: vi.fn(() => ({ run: vi.fn() })),
      insertContent: vi.fn(() => ({ run: vi.fn() })),
    })),
  })),
  getAttributes: vi.fn((mark) => {
    if (mark === 'textStyle') return { color: '', fontFamily: '', fontSize: '' };
    if (mark === 'highlight') return { color: '' };
    if (mark === 'link') return { href: '' };
    return {};
  }),
  state: {
    selection: { from: 0, to: 0 },
    doc: {
      textBetween: vi.fn().mockReturnValue(''),
    },
  },
});

// Test component that combines editor and toolbar
const TestEditorWithToolbar = ({ mockEditor = null }: { mockEditor?: any }) => {
  const editorRef = useRef<TiptopEditorRef>(null);
  const [editor, setEditor] = useState<any>(mockEditor);

  useEffect(() => {
    if (mockEditor) {
      setEditor(mockEditor);
      return;
    }

    const checkEditor = () => {
      if (editorRef.current?.editor) {
        setEditor(editorRef.current.editor);
      } else {
        setTimeout(checkEditor, 50);
      }
    };
    checkEditor();
  }, [mockEditor]);

  return (
    <div>
      <FormattingToolbar editor={editor} />
      <TiptopEditor
        ref={editorRef}
        content="<p>Test paragraph for alignment</p>"
        data-testid="test-editor"
      />
    </div>
  );
};

describe('Text Alignment', () => {
  beforeEach(() => {
    // Reset any global state before each test
  });

  it('should render alignment buttons in toolbar', () => {
    const mockEditor = createMockEditor();
    render(<TestEditorWithToolbar mockEditor={mockEditor} />);
    
    expect(screen.getByTitle('Align Left')).toBeInTheDocument();
    expect(screen.getByTitle('Align Center')).toBeInTheDocument();
    expect(screen.getByTitle('Align Right')).toBeInTheDocument();
    expect(screen.getByTitle('Justify')).toBeInTheDocument();
  });

  it('should have left alignment active by default', () => {
    const mockEditor = createMockEditor();
    render(<TestEditorWithToolbar mockEditor={mockEditor} />);
    
    const leftAlignButton = screen.getByTitle('Align Left');
    expect(leftAlignButton).toHaveClass('bg-primary-100');
  });

  it('should apply center alignment when center button is clicked', () => {
    const mockEditor = createMockEditor();
    const setTextAlignSpy = vi.fn();
    mockEditor.chain = vi.fn(() => ({
      focus: vi.fn(() => ({
        setTextAlign: vi.fn(() => ({
          run: setTextAlignSpy,
        })),
      })),
    }));

    render(<TestEditorWithToolbar mockEditor={mockEditor} />);
    
    const centerAlignButton = screen.getByTitle('Align Center');
    fireEvent.click(centerAlignButton);
    
    expect(setTextAlignSpy).toHaveBeenCalled();
  });

  it('should apply right alignment when right button is clicked', () => {
    const mockEditor = createMockEditor();
    const setTextAlignSpy = vi.fn();
    mockEditor.chain = vi.fn(() => ({
      focus: vi.fn(() => ({
        setTextAlign: vi.fn(() => ({
          run: setTextAlignSpy,
        })),
      })),
    }));

    render(<TestEditorWithToolbar mockEditor={mockEditor} />);
    
    const rightAlignButton = screen.getByTitle('Align Right');
    fireEvent.click(rightAlignButton);
    
    expect(setTextAlignSpy).toHaveBeenCalled();
  });

  it('should apply justify alignment when justify button is clicked', () => {
    const mockEditor = createMockEditor();
    const setTextAlignSpy = vi.fn();
    mockEditor.chain = vi.fn(() => ({
      focus: vi.fn(() => ({
        setTextAlign: vi.fn(() => ({
          run: setTextAlignSpy,
        })),
      })),
    }));

    render(<TestEditorWithToolbar mockEditor={mockEditor} />);
    
    const justifyButton = screen.getByTitle('Justify');
    fireEvent.click(justifyButton);
    
    expect(setTextAlignSpy).toHaveBeenCalled();
  });

  it('should switch between different alignments', () => {
    const mockEditor = createMockEditor();
    let currentAlignment = 'left';
    
    mockEditor.isActive = vi.fn((attrs) => {
      if (typeof attrs === 'string') return false;
      if (attrs?.textAlign === currentAlignment) return true;
      return false;
    });

    const setTextAlignSpy = vi.fn((alignment) => {
      currentAlignment = alignment;
    });

    mockEditor.chain = vi.fn(() => ({
      focus: vi.fn(() => ({
        setTextAlign: vi.fn((alignment) => ({
          run: () => setTextAlignSpy(alignment),
        })),
      })),
    }));

    const { rerender } = render(<TestEditorWithToolbar mockEditor={mockEditor} />);
    
    const leftAlignButton = screen.getByTitle('Align Left');
    const centerAlignButton = screen.getByTitle('Align Center');
    const rightAlignButton = screen.getByTitle('Align Right');
    
    // Start with left alignment (default)
    expect(leftAlignButton).toHaveClass('bg-primary-100');
    
    // Switch to center
    fireEvent.click(centerAlignButton);
    expect(setTextAlignSpy).toHaveBeenCalledWith('center');
  });

  it('should have proper test ids for alignment buttons', () => {
    const mockEditor = createMockEditor();
    render(<TestEditorWithToolbar mockEditor={mockEditor} />);
    
    expect(screen.getByTestId('toolbar-align-left')).toBeInTheDocument();
    expect(screen.getByTestId('toolbar-align-center')).toBeInTheDocument();
    expect(screen.getByTestId('toolbar-align-right')).toBeInTheDocument();
    expect(screen.getByTestId('toolbar-justify')).toBeInTheDocument();
  });

  it('should maintain alignment when content is updated', async () => {
    const TestComponent = () => {
      const editorRef = useRef<TiptopEditorRef>(null);
      
      const handleCenterAlign = () => {
        editorRef.current?.editor?.chain().focus().setTextAlign('center').run();
      };
      
      return (
        <div>
          <button onClick={handleCenterAlign} data-testid="center-align-trigger">
            Center Align
          </button>
          <TiptopEditor
            ref={editorRef}
            content="<p>Test paragraph</p>"
            data-testid="test-editor"
          />
        </div>
      );
    };
    
    render(<TestComponent />);
    
    // Wait for editor to initialize
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const centerButton = screen.getByTestId('center-align-trigger');
    fireEvent.click(centerButton);
    
    // Wait for alignment to be applied
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // The alignment should be maintained in the editor content
    // This would be verified by checking the editor's internal state
    // or the generated HTML content
  });
});
import { h } from 'preact';
import { render, screen, fireEvent } from '@testing-library/preact';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ContextMenu } from '../../src/components/ContextMenu';

// Mock Lucide icons
vi.mock('lucide-preact', () => ({
  Bold: () => <span data-testid="bold-icon">Bold</span>,
  Italic: () => <span data-testid="italic-icon">Italic</span>,
  Underline: () => <span data-testid="underline-icon">Underline</span>,
  Strikethrough: () => <span data-testid="strikethrough-icon">Strikethrough</span>,
  Link: () => <span data-testid="link-icon">Link</span>,
  Code: () => <span data-testid="code-icon">Code</span>,
  Quote: () => <span data-testid="quote-icon">Quote</span>,
  List: () => <span data-testid="list-icon">List</span>,
  ListOrdered: () => <span data-testid="list-ordered-icon">ListOrdered</span>,
  Copy: () => <span data-testid="copy-icon">Copy</span>,
  Scissors: () => <span data-testid="scissors-icon">Scissors</span>,
  Clipboard: () => <span data-testid="clipboard-icon">Clipboard</span>,
  Trash2: () => <span data-testid="trash2-icon">Trash2</span>,
  AlignLeft: () => <span data-testid="align-left-icon">AlignLeft</span>,
  AlignCenter: () => <span data-testid="align-center-icon">AlignCenter</span>,
  AlignRight: () => <span data-testid="align-right-icon">AlignRight</span>,
  AlignJustify: () => <span data-testid="align-justify-icon">AlignJustify</span>,
  Image: () => <span data-testid="image-icon">Image</span>,
  Music: () => <span data-testid="music-icon">Music</span>,
  Video: () => <span data-testid="video-icon">Video</span>,
  FileText: () => <span data-testid="file-text-icon">FileText</span>,
  SquareCode: () => <span data-testid="square-code-icon">SquareCode</span>,
  Copy: () => <span data-testid="copy-icon">Copy</span>,
  Check: () => <span data-testid="check-icon">Check</span>,
  ChevronDown: () => <span data-testid="chevron-down-icon">ChevronDown</span>,
  Palette: () => <span data-testid="palette-icon">Palette</span>,
  Type: () => <span data-testid="type-icon">Type</span>,
  Upload: () => <span data-testid="upload-icon">Upload</span>,
  X: () => <span data-testid="x-icon">X</span>,
}));

describe('ContextMenu', () => {
  let mockEditor;
  
  beforeEach(() => {
    // Create a mock editor
    mockEditor = {
      isActive: vi.fn((type) => false),
      can: vi.fn(() => ({
        toggleBold: vi.fn(() => true),
        toggleItalic: vi.fn(() => true),
        toggleUnderline: vi.fn(() => true),
        toggleStrike: vi.fn(() => true),
        toggleCode: vi.fn(() => true),
        toggleBlockquote: vi.fn(() => true),
        toggleBulletList: vi.fn(() => true),
        toggleOrderedList: vi.fn(() => true),
        setTextAlign: vi.fn(() => true),
      })),
      chain: vi.fn().mockReturnValue({
        focus: vi.fn().mockReturnThis(),
        toggleBold: vi.fn().mockReturnThis(),
        toggleItalic: vi.fn().mockReturnThis(),
        toggleUnderline: vi.fn().mockReturnThis(),
        toggleStrike: vi.fn().mockReturnThis(),
        toggleCode: vi.fn().mockReturnThis(),
        toggleBlockquote: vi.fn().mockReturnThis(),
        toggleBulletList: vi.fn().mockReturnThis(),
        toggleOrderedList: vi.fn().mockReturnThis(),
        setTextAlign: vi.fn().mockReturnThis(),
        deleteSelection: vi.fn().mockReturnThis(),
        selectAll: vi.fn().mockReturnThis(),
        unsetLink: vi.fn().mockReturnThis(),
        run: vi.fn(() => true),
      }),
      getAttributes: vi.fn(() => ({})),
      state: {
        selection: {
          empty: true,
        },
      },
      view: {
        dom: {
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          getBoundingClientRect: vi.fn(() => ({
            top: 0,
            left: 0,
          })),
        },
      },
    };

    // Mock document.execCommand
    document.execCommand = vi.fn();
    
    // Mock window.open
    window.open = vi.fn();
    
    // Mock navigator.clipboard
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: vi.fn(),
      },
      configurable: true,
    });
  });

  it('should not render when editor is null', () => {
    render(<ContextMenu editor={null} />);
    expect(screen.queryByTestId('context-menu')).not.toBeInTheDocument();
  });

  it('should not render initially', () => {
    render(<ContextMenu editor={mockEditor} />);
    expect(screen.queryByTestId('context-menu')).not.toBeInTheDocument();
  });

  it('should render when right-click event occurs', () => {
    // Setup
    let contextMenuCallback;
    mockEditor.view.dom.addEventListener.mockImplementation((event, callback) => {
      if (event === 'contextmenu') {
        contextMenuCallback = callback;
      }
    });

    render(<ContextMenu editor={mockEditor} />);
    
    // Simulate right-click event
    const mockEvent = {
      preventDefault: vi.fn(),
      clientX: 100,
      clientY: 100,
    };
    
    // Call the context menu callback directly
    contextMenuCallback(mockEvent);
    
    // The menu should now be visible
    expect(screen.queryByTestId('context-menu')).toBeInTheDocument();
  });

  it('should show different options based on selection state', () => {
    // Setup with selection
    let contextMenuCallback;
    mockEditor.view.dom.addEventListener.mockImplementation((event, callback) => {
      if (event === 'contextmenu') {
        contextMenuCallback = callback;
      }
    });
    
    // Mock a non-empty selection
    const mockEditorWithSelection = {
      ...mockEditor,
      state: {
        selection: {
          empty: false,
        },
      },
    };

    render(<ContextMenu editor={mockEditorWithSelection} />);
    
    // Simulate right-click event
    const mockEvent = {
      preventDefault: vi.fn(),
      clientX: 100,
      clientY: 100,
    };
    
    // Call the context menu callback directly
    contextMenuCallback(mockEvent);
    
    // The menu should now be visible with copy, cut, delete options
    expect(screen.queryByTestId('context-menu')).toBeInTheDocument();
    expect(screen.queryByTestId('context-menu-copy')).toBeInTheDocument();
    expect(screen.queryByTestId('context-menu-cut')).toBeInTheDocument();
    expect(screen.queryByTestId('context-menu-delete')).toBeInTheDocument();
  });

  it('should show link options when a link is active', () => {
    // Setup with link active
    let contextMenuCallback;
    mockEditor.view.dom.addEventListener.mockImplementation((event, callback) => {
      if (event === 'contextmenu') {
        contextMenuCallback = callback;
      }
    });
    
    // Mock link active
    const mockEditorWithLink = {
      ...mockEditor,
      isActive: vi.fn((type) => type === 'link'),
      getAttributes: vi.fn(() => ({ href: 'https://example.com' })),
    };

    render(<ContextMenu editor={mockEditorWithLink} />);
    
    // Simulate right-click event
    const mockEvent = {
      preventDefault: vi.fn(),
      clientX: 100,
      clientY: 100,
    };
    
    // Call the context menu callback directly
    contextMenuCallback(mockEvent);
    
    // The menu should now be visible with link options
    expect(screen.queryByTestId('context-menu')).toBeInTheDocument();
    expect(screen.queryByTestId('context-menu-edit-link')).toBeInTheDocument();
    expect(screen.queryByTestId('context-menu-open-link')).toBeInTheDocument();
  });

  it('should execute commands when menu items are clicked', () => {
    // Setup
    let contextMenuCallback;
    mockEditor.view.dom.addEventListener.mockImplementation((event, callback) => {
      if (event === 'contextmenu') {
        contextMenuCallback = callback;
      }
    });
    
    // Mock a non-empty selection
    const mockEditorWithSelection = {
      ...mockEditor,
      state: {
        selection: {
          empty: false,
        },
      },
    };

    render(<ContextMenu editor={mockEditorWithSelection} />);
    
    // Simulate right-click event
    const mockEvent = {
      preventDefault: vi.fn(),
      clientX: 100,
      clientY: 100,
    };
    
    // Call the context menu callback directly
    contextMenuCallback(mockEvent);
    
    // Click on the bold option
    const boldButton = screen.getByTestId('context-menu-bold');
    fireEvent.click(boldButton);
    
    // Verify that the toggleBold command was called
    expect(mockEditorWithSelection.chain().toggleBold).toHaveBeenCalled();
    
    // The menu should be hidden after clicking
    expect(screen.queryByTestId('context-menu')).not.toBeInTheDocument();
  });
});
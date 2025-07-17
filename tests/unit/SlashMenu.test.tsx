import { h } from 'preact';
import { render, screen, fireEvent } from '@testing-library/preact';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SlashMenu } from '../../src/components/SlashMenu';

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
  Image: () => <span data-testid="image-icon">Image</span>,
  Music: () => <span data-testid="music-icon">Music</span>,
  Video: () => <span data-testid="video-icon">Video</span>,
  FileText: () => <span data-testid="file-text-icon">FileText</span>,
  SquareCode: () => <span data-testid="square-code-icon">SquareCode</span>,
  Table: () => <span data-testid="table-icon">Table</span>,
  Heading1: () => <span data-testid="heading1-icon">Heading1</span>,
  Heading2: () => <span data-testid="heading2-icon">Heading2</span>,
  Heading3: () => <span data-testid="heading3-icon">Heading3</span>,
  HorizontalRule: () => <span data-testid="horizontal-rule-icon">HorizontalRule</span>,
  Search: () => <span data-testid="search-icon">Search</span>,
}));

describe('SlashMenu', () => {
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
        toggleHeading: vi.fn(() => true),
        setParagraph: vi.fn(() => true),
        setHorizontalRule: vi.fn(() => true),
        insertTable: vi.fn(() => true),
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
        toggleHeading: vi.fn().mockReturnThis(),
        setParagraph: vi.fn().mockReturnThis(),
        setHorizontalRule: vi.fn().mockReturnThis(),
        insertTable: vi.fn().mockReturnThis(),
        setImage: vi.fn().mockReturnThis(),
        setLink: vi.fn().mockReturnThis(),
        insertContent: vi.fn().mockReturnThis(),
        deleteRange: vi.fn().mockReturnThis(),
        run: vi.fn(() => true),
      }),
      state: {
        selection: {
          $from: {
            parent: {
              textBetween: vi.fn(() => ''),
            },
            parentOffset: 0,
            pos: 0,
            start: vi.fn(() => 0),
          },
          empty: true,
        },
      },
      view: {
        coordsAtPos: vi.fn(() => ({ top: 100, bottom: 120, left: 100 })),
        dom: {
          getBoundingClientRect: vi.fn(() => ({
            top: 50,
            left: 50,
          })),
        },
      },
      on: vi.fn(),
      off: vi.fn(),
    };

    // Mock window.prompt
    window.prompt = vi.fn(() => 'https://example.com');
  });

  it('should not render when editor is null', () => {
    render(<SlashMenu editor={null} />);
    expect(screen.queryByTestId('slash-menu')).not.toBeInTheDocument();
  });

  it('should not render initially', () => {
    render(<SlashMenu editor={mockEditor} />);
    expect(screen.queryByTestId('slash-menu')).not.toBeInTheDocument();
  });

  it('should render when slash command is detected', () => {
    // Setup
    let updateCallback;
    mockEditor.on.mockImplementation((event, callback) => {
      if (event === 'update') {
        updateCallback = callback;
      }
    });
    
    // Mock text that starts with slash
    mockEditor.state.selection.$from.parent.textBetween.mockReturnValue('/');

    render(<SlashMenu editor={mockEditor} />);
    
    // Simulate update event
    updateCallback({ editor: mockEditor });
    
    // The menu should now be visible
    expect(screen.queryByTestId('slash-menu')).toBeInTheDocument();
  });

  it('should filter commands based on query', () => {
    // Setup
    let updateCallback;
    mockEditor.on.mockImplementation((event, callback) => {
      if (event === 'update') {
        updateCallback = callback;
      }
    });
    
    // Mock text that starts with slash followed by a query
    mockEditor.state.selection.$from.parent.textBetween.mockReturnValue('/head');

    render(<SlashMenu editor={mockEditor} />);
    
    // Simulate update event
    updateCallback({ editor: mockEditor });
    
    // The menu should now be visible with filtered commands
    expect(screen.queryByTestId('slash-menu')).toBeInTheDocument();
    expect(screen.queryByTestId('slash-menu-heading-1')).toBeInTheDocument();
    expect(screen.queryByTestId('slash-menu-heading-2')).toBeInTheDocument();
    expect(screen.queryByTestId('slash-menu-heading-3')).toBeInTheDocument();
    expect(screen.queryByTestId('slash-menu-bullet-list')).not.toBeInTheDocument();
  });

  it('should execute command when menu item is clicked', () => {
    // Setup
    let updateCallback;
    mockEditor.on.mockImplementation((event, callback) => {
      if (event === 'update') {
        updateCallback = callback;
      }
    });
    
    // Mock text that starts with slash
    mockEditor.state.selection.$from.parent.textBetween.mockReturnValue('/');

    render(<SlashMenu editor={mockEditor} />);
    
    // Simulate update event
    updateCallback({ editor: mockEditor });
    
    // Click on the bullet list option
    const bulletListButton = screen.getByTestId('slash-menu-bullet-list');
    fireEvent.click(bulletListButton);
    
    // Verify that the toggleBulletList command was called
    expect(mockEditor.chain().toggleBulletList).toHaveBeenCalled();
    
    // The menu should be hidden after clicking
    expect(screen.queryByTestId('slash-menu')).not.toBeInTheDocument();
  });

  it('should handle keyboard navigation', () => {
    // Setup
    let updateCallback;
    let keydownHandler;
    mockEditor.on.mockImplementation((event, callback) => {
      if (event === 'update') {
        updateCallback = callback;
      }
    });
    
    // Mock text that starts with slash
    mockEditor.state.selection.$from.parent.textBetween.mockReturnValue('/');

    render(<SlashMenu editor={mockEditor} />);
    
    // Simulate update event to show the menu
    updateCallback({ editor: mockEditor });
    
    // Get the keydown handler
    keydownHandler = document.addEventListener.mock.calls.find(
      call => call[0] === 'keydown'
    )[1];
    
    // Simulate arrow down key press
    keydownHandler({ key: 'ArrowDown', preventDefault: vi.fn() });
    
    // Simulate enter key press to select the currently highlighted item
    keydownHandler({ key: 'Enter', preventDefault: vi.fn() });
    
    // Verify that a command was executed
    expect(mockEditor.chain().focus).toHaveBeenCalled();
    
    // The menu should be hidden after selection
    expect(screen.queryByTestId('slash-menu')).not.toBeInTheDocument();
  });
});
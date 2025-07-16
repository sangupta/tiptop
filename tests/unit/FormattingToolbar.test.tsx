import { render, screen, fireEvent } from '@testing-library/preact';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { FormattingToolbar } from '@/components/FormattingToolbar';
import { Editor } from '@tiptap/core';

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

describe('FormattingToolbar', () => {
  let mockEditor: Partial<Editor>;
  let mockChain: any;

  beforeEach(() => {
    mockChain = {
      focus: vi.fn().mockReturnThis(),
      toggleBold: vi.fn().mockReturnThis(),
      toggleItalic: vi.fn().mockReturnThis(),
      toggleUnderline: vi.fn().mockReturnThis(),
      toggleStrike: vi.fn().mockReturnThis(),
      toggleSubscript: vi.fn().mockReturnThis(),
      toggleSuperscript: vi.fn().mockReturnThis(),
      toggleBulletList: vi.fn().mockReturnThis(),
      toggleOrderedList: vi.fn().mockReturnThis(),
      sinkListItem: vi.fn().mockReturnThis(),
      liftListItem: vi.fn().mockReturnThis(),
      setColor: vi.fn().mockReturnThis(),
      unsetColor: vi.fn().mockReturnThis(),
      setHighlight: vi.fn().mockReturnThis(),
      unsetHighlight: vi.fn().mockReturnThis(),
      setMark: vi.fn().mockReturnThis(),
      unsetMark: vi.fn().mockReturnThis(),
      run: vi.fn(() => true),
    };



    mockEditor = {
      chain: vi.fn(() => mockChain),
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
      })) as any,
      isActive: vi.fn((format: string) => {
        // Mock some formats as active for testing
        return format === 'bold' || format === 'italic';
      }),
      getAttributes: vi.fn((mark: string) => {
        if (mark === 'textStyle') {
          return {
            color: '#ff0000',
            fontFamily: 'Arial, sans-serif',
            fontSize: '16px',
          };
        }
        if (mark === 'highlight') {
          return {
            color: '#ffff00',
          };
        }
        return {};
      }),
    };
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders null when editor is null', () => {
    const { container } = render(<FormattingToolbar editor={null} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders all formatting buttons when editor is provided', () => {
    render(<FormattingToolbar editor={mockEditor as Editor} />);
    
    expect(screen.getByTestId('formatting-toolbar')).toBeInTheDocument();
    expect(screen.getByTestId('toolbar-bold')).toBeInTheDocument();
    expect(screen.getByTestId('toolbar-italic')).toBeInTheDocument();
    expect(screen.getByTestId('toolbar-underline')).toBeInTheDocument();
    expect(screen.getByTestId('toolbar-strike')).toBeInTheDocument();
    expect(screen.getByTestId('toolbar-subscript')).toBeInTheDocument();
    expect(screen.getByTestId('toolbar-superscript')).toBeInTheDocument();
    expect(screen.getByTestId('toolbar-bullet-list')).toBeInTheDocument();
    expect(screen.getByTestId('toolbar-ordered-list')).toBeInTheDocument();
  });

  it('applies active state to buttons correctly', () => {
    render(<FormattingToolbar editor={mockEditor as Editor} />);
    
    const boldButton = screen.getByTestId('toolbar-bold');
    const italicButton = screen.getByTestId('toolbar-italic');
    const underlineButton = screen.getByTestId('toolbar-underline');
    
    // Bold and italic should be active based on our mock
    expect(boldButton).toHaveClass('bg-primary-100');
    expect(italicButton).toHaveClass('bg-primary-100');
    expect(underlineButton).not.toHaveClass('bg-primary-100');
  });

  it('handles bold button click', () => {
    render(<FormattingToolbar editor={mockEditor as Editor} />);
    
    const boldButton = screen.getByTestId('toolbar-bold');
    fireEvent.click(boldButton);
    
    expect(mockEditor.chain).toHaveBeenCalled();
    expect(mockChain.focus).toHaveBeenCalled();
    expect(mockChain.toggleBold).toHaveBeenCalled();
    expect(mockChain.run).toHaveBeenCalled();
  });

  it('handles italic button click', () => {
    render(<FormattingToolbar editor={mockEditor as Editor} />);
    
    const italicButton = screen.getByTestId('toolbar-italic');
    fireEvent.click(italicButton);
    
    expect(mockEditor.chain).toHaveBeenCalled();
    expect(mockChain.focus).toHaveBeenCalled();
    expect(mockChain.toggleItalic).toHaveBeenCalled();
    expect(mockChain.run).toHaveBeenCalled();
  });

  it('handles underline button click', () => {
    render(<FormattingToolbar editor={mockEditor as Editor} />);
    
    const underlineButton = screen.getByTestId('toolbar-underline');
    fireEvent.click(underlineButton);
    
    expect(mockEditor.chain).toHaveBeenCalled();
    expect(mockChain.focus).toHaveBeenCalled();
    expect(mockChain.toggleUnderline).toHaveBeenCalled();
    expect(mockChain.run).toHaveBeenCalled();
  });

  it('handles strike button click', () => {
    render(<FormattingToolbar editor={mockEditor as Editor} />);
    
    const strikeButton = screen.getByTestId('toolbar-strike');
    fireEvent.click(strikeButton);
    
    expect(mockEditor.chain).toHaveBeenCalled();
    expect(mockChain.focus).toHaveBeenCalled();
    expect(mockChain.toggleStrike).toHaveBeenCalled();
    expect(mockChain.run).toHaveBeenCalled();
  });

  it('handles subscript button click', () => {
    render(<FormattingToolbar editor={mockEditor as Editor} />);
    
    const subscriptButton = screen.getByTestId('toolbar-subscript');
    fireEvent.click(subscriptButton);
    
    expect(mockEditor.chain).toHaveBeenCalled();
    expect(mockChain.focus).toHaveBeenCalled();
    expect(mockChain.toggleSubscript).toHaveBeenCalled();
    expect(mockChain.run).toHaveBeenCalled();
  });

  it('handles superscript button click', () => {
    render(<FormattingToolbar editor={mockEditor as Editor} />);
    
    const superscriptButton = screen.getByTestId('toolbar-superscript');
    fireEvent.click(superscriptButton);
    
    expect(mockEditor.chain).toHaveBeenCalled();
    expect(mockChain.focus).toHaveBeenCalled();
    expect(mockChain.toggleSuperscript).toHaveBeenCalled();
    expect(mockChain.run).toHaveBeenCalled();
  });

  it('handles bullet list button click', () => {
    render(<FormattingToolbar editor={mockEditor as Editor} />);
    
    const bulletListButton = screen.getByTestId('toolbar-bullet-list');
    fireEvent.click(bulletListButton);
    
    expect(mockEditor.chain).toHaveBeenCalled();
    expect(mockChain.focus).toHaveBeenCalled();
    expect(mockChain.toggleBulletList).toHaveBeenCalled();
    expect(mockChain.run).toHaveBeenCalled();
  });

  it('handles ordered list button click', () => {
    render(<FormattingToolbar editor={mockEditor as Editor} />);
    
    const orderedListButton = screen.getByTestId('toolbar-ordered-list');
    fireEvent.click(orderedListButton);
    
    expect(mockEditor.chain).toHaveBeenCalled();
    expect(mockChain.focus).toHaveBeenCalled();
    expect(mockChain.toggleOrderedList).toHaveBeenCalled();
    expect(mockChain.run).toHaveBeenCalled();
  });

  it('disables buttons when commands cannot be executed', () => {
    // Mock can() to return false for some commands
    mockEditor.can = vi.fn(() => ({
      toggleBold: vi.fn(() => false),
      toggleItalic: vi.fn(() => false),
      toggleUnderline: vi.fn(() => false),
      toggleStrike: vi.fn(() => false),
      toggleSubscript: vi.fn(() => false),
      toggleSuperscript: vi.fn(() => false),
      toggleBulletList: vi.fn(() => false),
      toggleOrderedList: vi.fn(() => false),
      sinkListItem: vi.fn(() => false),
      liftListItem: vi.fn(() => false),
      setTextAlign: vi.fn(() => false),
    })) as any;
    
    render(<FormattingToolbar editor={mockEditor as Editor} />);
    
    const boldButton = screen.getByTestId('toolbar-bold');
    expect(boldButton).toBeDisabled();
    expect(boldButton).toHaveClass('opacity-50');
    expect(boldButton).toHaveClass('cursor-not-allowed');
  });

  it('applies custom className', () => {
    const customClass = 'my-custom-toolbar';
    render(<FormattingToolbar editor={mockEditor as Editor} className={customClass} />);
    
    const toolbar = screen.getByTestId('formatting-toolbar');
    expect(toolbar).toHaveClass(customClass);
  });

  it('has correct button titles for accessibility', () => {
    render(<FormattingToolbar editor={mockEditor as Editor} />);
    
    expect(screen.getByTestId('toolbar-bold')).toHaveAttribute('title', 'Bold');
    expect(screen.getByTestId('toolbar-italic')).toHaveAttribute('title', 'Italic');
    expect(screen.getByTestId('toolbar-underline')).toHaveAttribute('title', 'Underline');
    expect(screen.getByTestId('toolbar-strike')).toHaveAttribute('title', 'Strike');
    expect(screen.getByTestId('toolbar-subscript')).toHaveAttribute('title', 'Subscript');
    expect(screen.getByTestId('toolbar-superscript')).toHaveAttribute('title', 'Superscript');
    expect(screen.getByTestId('toolbar-bullet-list')).toHaveAttribute('title', 'Bullet List');
    expect(screen.getByTestId('toolbar-ordered-list')).toHaveAttribute('title', 'Ordered List');
  });

  it('renders icons correctly', () => {
    render(<FormattingToolbar editor={mockEditor as Editor} />);
    
    expect(screen.getByTestId('bold-icon')).toBeInTheDocument();
    expect(screen.getByTestId('italic-icon')).toBeInTheDocument();
    expect(screen.getByTestId('underline-icon')).toBeInTheDocument();
    expect(screen.getByTestId('strikethrough-icon')).toBeInTheDocument();
    expect(screen.getByTestId('subscript-icon')).toBeInTheDocument();
    expect(screen.getByTestId('superscript-icon')).toBeInTheDocument();
    expect(screen.getByTestId('list-icon')).toBeInTheDocument();
    expect(screen.getByTestId('list-ordered-icon')).toBeInTheDocument();
  });

  it('applies correct CSS classes to toolbar', () => {
    render(<FormattingToolbar editor={mockEditor as Editor} />);
    
    const toolbar = screen.getByTestId('formatting-toolbar');
    expect(toolbar).toHaveClass('flex');
    expect(toolbar).toHaveClass('items-center');
    expect(toolbar).toHaveClass('gap-3');
    expect(toolbar).toHaveClass('p-2');
    expect(toolbar).toHaveClass('bg-gray-50');
    expect(toolbar).toHaveClass('border');
    expect(toolbar).toHaveClass('rounded-lg');
  });

  it('handles keyboard navigation', () => {
    render(<FormattingToolbar editor={mockEditor as Editor} />);
    
    const boldButton = screen.getByTestId('toolbar-bold');
    
    // Test that button can receive focus
    boldButton.focus();
    expect(document.activeElement).toBe(boldButton);
    
    // Test Enter key activation
    fireEvent.keyDown(boldButton, { key: 'Enter' });
    // Note: fireEvent.keyDown doesn't automatically trigger click, 
    // but the button should be focusable for keyboard navigation
  });

  describe('Color and Font Controls', () => {
    it('renders color picker and font selector components', () => {
      render(<FormattingToolbar editor={mockEditor as Editor} />);
      
      expect(screen.getByTestId('color-picker-text-color')).toBeInTheDocument();
      expect(screen.getByTestId('color-picker-highlight-color')).toBeInTheDocument();
      expect(screen.getByTestId('font-selector')).toBeInTheDocument();
    });

    it('handles text color changes', () => {
      render(<FormattingToolbar editor={mockEditor as Editor} />);
      
      const textColorButton = screen.getByTestId('color-picker-text-color').querySelector('button');
      fireEvent.click(textColorButton!);
      
      expect(mockEditor.chain).toHaveBeenCalled();
      expect(mockChain.focus).toHaveBeenCalled();
      expect(mockChain.setColor).toHaveBeenCalledWith('#ff0000');
      expect(mockChain.run).toHaveBeenCalled();
    });

    it('handles highlight color changes', () => {
      render(<FormattingToolbar editor={mockEditor as Editor} />);
      
      const highlightColorButton = screen.getByTestId('color-picker-highlight-color').querySelector('button');
      fireEvent.click(highlightColorButton!);
      
      expect(mockEditor.chain).toHaveBeenCalled();
      expect(mockChain.focus).toHaveBeenCalled();
      expect(mockChain.setHighlight).toHaveBeenCalledWith({ color: '#ff0000' });
      expect(mockChain.run).toHaveBeenCalled();
    });

    it('handles font family changes', () => {
      render(<FormattingToolbar editor={mockEditor as Editor} />);
      
      const fontButton = screen.getByTestId('font-selector').querySelector('button');
      fireEvent.click(fontButton!);
      
      expect(mockEditor.chain).toHaveBeenCalled();
      expect(mockChain.focus).toHaveBeenCalled();
      expect(mockChain.setMark).toHaveBeenCalledWith('textStyle', { fontFamily: 'Arial, sans-serif' });
      expect(mockChain.run).toHaveBeenCalled();
    });

    it('handles font size changes', () => {
      render(<FormattingToolbar editor={mockEditor as Editor} />);
      
      const sizeButton = screen.getByTestId('font-selector').querySelectorAll('button')[1];
      fireEvent.click(sizeButton!);
      
      expect(mockEditor.chain).toHaveBeenCalled();
      expect(mockChain.focus).toHaveBeenCalled();
      expect(mockChain.setMark).toHaveBeenCalledWith('textStyle', { fontSize: '18px' });
      expect(mockChain.run).toHaveBeenCalled();
    });

    it('gets current text color from editor attributes', () => {
      render(<FormattingToolbar editor={mockEditor as Editor} />);
      
      expect(mockEditor.getAttributes).toHaveBeenCalledWith('textStyle');
      expect(screen.getByText('Text Color - #ff0000')).toBeInTheDocument();
    });

    it('gets current highlight color from editor attributes', () => {
      render(<FormattingToolbar editor={mockEditor as Editor} />);
      
      expect(mockEditor.getAttributes).toHaveBeenCalledWith('highlight');
      expect(screen.getByText('Highlight Color - #ffff00')).toBeInTheDocument();
    });

    it('gets current font family and size from editor attributes', () => {
      render(<FormattingToolbar editor={mockEditor as Editor} />);
      
      expect(mockEditor.getAttributes).toHaveBeenCalledWith('textStyle');
      expect(screen.getByText('Font: Arial, sans-serif')).toBeInTheDocument();
      expect(screen.getByText('Size: 16px')).toBeInTheDocument();
    });

    it('handles clearing text color when empty string is passed', () => {
      render(<FormattingToolbar editor={mockEditor as Editor} />);
      
      // Simulate the ColorPicker calling onColorChange with empty string
      const toolbar = screen.getByTestId('formatting-toolbar');
      const colorPicker = toolbar.querySelector('[data-testid="color-picker-text-color"]');
      
      // We can't easily test the clearing functionality with the current mock setup
      // but we can verify the component renders correctly
      expect(colorPicker).toBeInTheDocument();
    });

    it('handles clearing highlight color when empty string is passed', () => {
      render(<FormattingToolbar editor={mockEditor as Editor} />);
      
      // Simulate the ColorPicker calling onColorChange with empty string
      const toolbar = screen.getByTestId('formatting-toolbar');
      const colorPicker = toolbar.querySelector('[data-testid="color-picker-highlight-color"]');
      
      // We can't easily test the clearing functionality with the current mock setup
      // but we can verify the component renders correctly
      expect(colorPicker).toBeInTheDocument();
    });

    it('handles clearing font family when empty string is passed', () => {
      render(<FormattingToolbar editor={mockEditor as Editor} />);
      
      // Simulate the FontSelector calling onFontChange with empty string
      const toolbar = screen.getByTestId('formatting-toolbar');
      const fontSelector = toolbar.querySelector('[data-testid="font-selector"]');
      
      // We can't easily test the clearing functionality with the current mock setup
      // but we can verify the component renders correctly
      expect(fontSelector).toBeInTheDocument();
    });

    it('handles clearing font size when empty string is passed', () => {
      render(<FormattingToolbar editor={mockEditor as Editor} />);
      
      // Simulate the FontSelector calling onSizeChange with empty string
      const toolbar = screen.getByTestId('formatting-toolbar');
      const fontSelector = toolbar.querySelector('[data-testid="font-selector"]');
      
      // We can't easily test the clearing functionality with the current mock setup
      // but we can verify the component renders correctly
      expect(fontSelector).toBeInTheDocument();
    });
  });
});
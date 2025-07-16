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
      run: vi.fn(() => true),
    };

    const mockCanChain = {
      ...mockChain,
      run: vi.fn(() => true),
    };

    mockEditor = {
      chain: vi.fn(() => mockChain),
      can: vi.fn(() => ({
        chain: vi.fn(() => mockCanChain),
      })),
      isActive: vi.fn((format: string) => {
        // Mock some formats as active for testing
        return format === 'bold' || format === 'italic';
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

  it('disables buttons when commands cannot be executed', () => {
    // Mock can() to return false for some commands
    const mockCanChain = {
      ...mockChain,
      run: vi.fn(() => false), // Return false to indicate command cannot be executed
    };
    
    mockEditor.can = vi.fn(() => ({
      chain: vi.fn(() => mockCanChain),
    }));
    
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
  });

  it('renders icons correctly', () => {
    render(<FormattingToolbar editor={mockEditor as Editor} />);
    
    expect(screen.getByTestId('bold-icon')).toBeInTheDocument();
    expect(screen.getByTestId('italic-icon')).toBeInTheDocument();
    expect(screen.getByTestId('underline-icon')).toBeInTheDocument();
    expect(screen.getByTestId('strikethrough-icon')).toBeInTheDocument();
    expect(screen.getByTestId('subscript-icon')).toBeInTheDocument();
    expect(screen.getByTestId('superscript-icon')).toBeInTheDocument();
  });

  it('applies correct CSS classes to toolbar', () => {
    render(<FormattingToolbar editor={mockEditor as Editor} />);
    
    const toolbar = screen.getByTestId('formatting-toolbar');
    expect(toolbar).toHaveClass('flex');
    expect(toolbar).toHaveClass('items-center');
    expect(toolbar).toHaveClass('gap-1');
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
});
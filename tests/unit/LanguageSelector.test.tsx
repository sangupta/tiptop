import { render, screen, fireEvent, waitFor } from '@testing-library/preact';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Editor } from '@tiptap/core';
import { LanguageSelector } from '@/components/LanguageSelector';

// Mock the ChevronDown icon
vi.mock('lucide-preact', () => ({
  ChevronDown: () => <span data-testid="chevron-down-icon">▼</span>,
}));

describe('LanguageSelector', () => {
  const mockEditor = {
    chain: vi.fn().mockReturnThis(),
    focus: vi.fn().mockReturnThis(),
    updateCodeBlockLanguage: vi.fn().mockReturnThis(),
    run: vi.fn(),
  } as unknown as Editor;

  const defaultProps = {
    editor: mockEditor,
    currentLanguage: 'javascript',
    onLanguageChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with current language selected', () => {
    render(<LanguageSelector {...defaultProps} />);
    
    expect(screen.getByText('JavaScript')).toBeInTheDocument();
    expect(screen.getByTestId('language-selector-button')).toBeInTheDocument();
  });

  it('opens dropdown when clicked', async () => {
    render(<LanguageSelector {...defaultProps} />);
    
    const button = screen.getByTestId('language-selector-button');
    fireEvent.click(button);
    
    // Wait for dropdown to appear
    await waitFor(() => {
      expect(screen.getByText('Python')).toBeInTheDocument();
      expect(screen.getByText('TypeScript')).toBeInTheDocument();
      expect(screen.getByText('HTML')).toBeInTheDocument();
    });
  });

  it('calls onLanguageChange when a language is selected', async () => {
    render(<LanguageSelector {...defaultProps} />);
    
    const button = screen.getByTestId('language-selector-button');
    fireEvent.click(button);
    
    // Wait for dropdown to appear and select TypeScript
    await waitFor(() => {
      const typescriptOption = screen.getByText('TypeScript');
      fireEvent.click(typescriptOption);
    });
    
    expect(defaultProps.onLanguageChange).toHaveBeenCalledWith('typescript');
  });

  it('closes dropdown after selection', async () => {
    render(<LanguageSelector {...defaultProps} />);
    
    const button = screen.getByTestId('language-selector-button');
    fireEvent.click(button);
    
    // Wait for dropdown to appear and select TypeScript
    await waitFor(() => {
      const typescriptOption = screen.getByText('TypeScript');
      fireEvent.click(typescriptOption);
    });
    
    // Dropdown should be closed
    await waitFor(() => {
      expect(screen.queryByText('Python')).not.toBeInTheDocument();
    });
  });

  it('shows different language when currentLanguage prop changes', () => {
    const { rerender } = render(<LanguageSelector {...defaultProps} />);
    
    expect(screen.getByText('JavaScript')).toBeInTheDocument();
    
    rerender(<LanguageSelector {...defaultProps} currentLanguage="python" />);
    
    expect(screen.getByText('Python')).toBeInTheDocument();
  });
});
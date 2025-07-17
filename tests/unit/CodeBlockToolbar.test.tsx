import { render, screen, fireEvent, waitFor } from '@testing-library/preact';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CodeBlockToolbar } from '@/components/CodeBlockToolbar';

// Mock the icons
vi.mock('lucide-preact', () => ({
  ChevronDown: () => <span data-testid="chevron-down-icon">▼</span>,
  Copy: () => <span data-testid="copy-icon">Copy</span>,
  Check: () => <span data-testid="check-icon" className="text-green-500">Check</span>,
}));

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn().mockImplementation(() => Promise.resolve()),
  },
});

describe('CodeBlockToolbar', () => {
  const mockEditor = {
    chain: vi.fn().mockReturnThis(),
    focus: vi.fn().mockReturnThis(),
    setNodeSelection: vi.fn().mockReturnThis(),
    updateAttributes: vi.fn().mockReturnThis(),
    run: vi.fn(),
  } as any;

  const defaultProps = {
    editor: mockEditor,
    language: 'javascript',
    onLanguageChange: vi.fn(),
    codeBlockId: 'test-code-block-id',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Create a mock code block element
    const codeBlock = document.createElement('pre');
    codeBlock.id = 'test-code-block-id';
    codeBlock.textContent = 'const x = 1;';
    document.body.appendChild(codeBlock);
  });

  it('renders with current language selected', () => {
    render(<CodeBlockToolbar {...defaultProps} />);
    
    expect(screen.getByText('JavaScript')).toBeInTheDocument();
    expect(screen.getByTestId('code-language-button')).toBeInTheDocument();
    expect(screen.getByTestId('copy-code-button')).toBeInTheDocument();
  });

  it('opens language dropdown when clicked', async () => {
    render(<CodeBlockToolbar {...defaultProps} />);
    
    const button = screen.getByTestId('code-language-button');
    fireEvent.click(button);
    
    // Wait for dropdown to appear
    await waitFor(() => {
      expect(screen.getByText('Python')).toBeInTheDocument();
      expect(screen.getByText('TypeScript')).toBeInTheDocument();
      expect(screen.getByText('HTML')).toBeInTheDocument();
    });
  });

  it('calls onLanguageChange when a language is selected', async () => {
    render(<CodeBlockToolbar {...defaultProps} />);
    
    const button = screen.getByTestId('code-language-button');
    fireEvent.click(button);
    
    // Wait for dropdown to appear and select TypeScript
    await waitFor(() => {
      const typescriptOption = screen.getByText('TypeScript');
      fireEvent.click(typescriptOption);
    });
    
    expect(defaultProps.onLanguageChange).toHaveBeenCalledWith('typescript');
  });

  it('copies code when copy button is clicked', async () => {
    render(<CodeBlockToolbar {...defaultProps} />);
    
    const copyButton = screen.getByTestId('copy-code-button');
    fireEvent.click(copyButton);
    
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('const x = 1;');
    
    // Wait for "Copied!" text to appear
    await waitFor(() => {
      expect(screen.getByText('Copied!')).toBeInTheDocument();
    });
  });

  it('shows different language when language prop changes', () => {
    const { rerender } = render(<CodeBlockToolbar {...defaultProps} />);
    
    expect(screen.getByText('JavaScript')).toBeInTheDocument();
    
    rerender(<CodeBlockToolbar {...defaultProps} language="python" />);
    
    expect(screen.getByText('Python')).toBeInTheDocument();
  });
});
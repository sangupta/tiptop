import { render, screen, fireEvent, waitFor } from '@testing-library/preact';
import { FontSelector } from '@/components/FontSelector';
import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('FontSelector', () => {
  const mockOnFontChange = vi.fn();
  const mockOnSizeChange = vi.fn();

  beforeEach(() => {
    mockOnFontChange.mockClear();
    mockOnSizeChange.mockClear();
  });

  it('renders font family and size selectors', () => {
    render(
      <FontSelector
        currentFont=""
        currentSize=""
        onFontChange={mockOnFontChange}
        onSizeChange={mockOnSizeChange}
      />
    );

    expect(screen.getByTestId('font-family-selector')).toBeInTheDocument();
    expect(screen.getByTestId('font-size-selector')).toBeInTheDocument();
  });

  it('displays current font family correctly', () => {
    render(
      <FontSelector
        currentFont="Arial, sans-serif"
        currentSize="16px"
        onFontChange={mockOnFontChange}
        onSizeChange={mockOnSizeChange}
      />
    );

    expect(screen.getByText('Arial')).toBeInTheDocument();
    expect(screen.getByText('Medium')).toBeInTheDocument();
  });

  it('displays default values when no font is selected', () => {
    render(
      <FontSelector
        currentFont=""
        currentSize=""
        onFontChange={mockOnFontChange}
        onSizeChange={mockOnSizeChange}
      />
    );

    expect(screen.getByText('Default')).toBeInTheDocument();
    expect(screen.getByText('Normal')).toBeInTheDocument();
  });

  it('opens font family dropdown when clicked', async () => {
    render(
      <FontSelector
        currentFont=""
        currentSize=""
        onFontChange={mockOnFontChange}
        onSizeChange={mockOnSizeChange}
      />
    );

    const fontButton = screen.getByTestId('font-family-selector');
    fireEvent.click(fontButton);

    await waitFor(() => {
      expect(screen.getByTestId('font-option-arial')).toBeInTheDocument();
      expect(screen.getByTestId('font-option-helvetica')).toBeInTheDocument();
      expect(screen.getByTestId('font-option-times-new-roman')).toBeInTheDocument();
    });
  });

  it('opens font size dropdown when clicked', async () => {
    render(
      <FontSelector
        currentFont=""
        currentSize=""
        onFontChange={mockOnFontChange}
        onSizeChange={mockOnSizeChange}
      />
    );

    const sizeButton = screen.getByTestId('font-size-selector');
    fireEvent.click(sizeButton);

    await waitFor(() => {
      expect(screen.getByTestId('size-option-small')).toBeInTheDocument();
      expect(screen.getByTestId('size-option-normal')).toBeInTheDocument();
      expect(screen.getByTestId('size-option-large')).toBeInTheDocument();
    });
  });

  it('calls onFontChange when font family is selected', async () => {
    render(
      <FontSelector
        currentFont=""
        currentSize=""
        onFontChange={mockOnFontChange}
        onSizeChange={mockOnSizeChange}
      />
    );

    const fontButton = screen.getByTestId('font-family-selector');
    fireEvent.click(fontButton);

    await waitFor(() => {
      const arialOption = screen.getByTestId('font-option-arial');
      fireEvent.click(arialOption);
    });

    expect(mockOnFontChange).toHaveBeenCalledWith('Arial, sans-serif');
  });

  it('calls onSizeChange when font size is selected', async () => {
    render(
      <FontSelector
        currentFont=""
        currentSize=""
        onFontChange={mockOnFontChange}
        onSizeChange={mockOnSizeChange}
      />
    );

    const sizeButton = screen.getByTestId('font-size-selector');
    fireEvent.click(sizeButton);

    await waitFor(() => {
      const largeOption = screen.getByTestId('size-option-large');
      fireEvent.click(largeOption);
    });

    expect(mockOnSizeChange).toHaveBeenCalledWith('18px');
  });

  it('highlights currently selected font family', async () => {
    render(
      <FontSelector
        currentFont="Arial, sans-serif"
        currentSize=""
        onFontChange={mockOnFontChange}
        onSizeChange={mockOnSizeChange}
      />
    );

    const fontButton = screen.getByTestId('font-family-selector');
    fireEvent.click(fontButton);

    await waitFor(() => {
      const arialOption = screen.getByTestId('font-option-arial');
      expect(arialOption).toHaveClass('bg-primary-50');
    });
  });

  it('highlights currently selected font size', async () => {
    render(
      <FontSelector
        currentFont=""
        currentSize="18px"
        onFontChange={mockOnFontChange}
        onSizeChange={mockOnSizeChange}
      />
    );

    const sizeButton = screen.getByTestId('font-size-selector');
    fireEvent.click(sizeButton);

    await waitFor(() => {
      const largeOption = screen.getByTestId('size-option-large');
      expect(largeOption).toHaveClass('bg-primary-50');
    });
  });

  it('closes dropdowns when clicking outside', async () => {
    render(
      <div>
        <FontSelector
          currentFont=""
          currentSize=""
          onFontChange={mockOnFontChange}
          onSizeChange={mockOnSizeChange}
        />
        <div data-testid="outside">Outside element</div>
      </div>
    );

    const fontButton = screen.getByTestId('font-family-selector');
    fireEvent.click(fontButton);

    await waitFor(() => {
      expect(screen.getByTestId('font-option-arial')).toBeInTheDocument();
    });

    const outsideElement = screen.getByTestId('outside');
    fireEvent.mouseDown(outsideElement);

    await waitFor(() => {
      expect(screen.queryByTestId('font-option-arial')).not.toBeInTheDocument();
    });
  });

  it('applies font family styles to options', async () => {
    render(
      <FontSelector
        currentFont=""
        currentSize=""
        onFontChange={mockOnFontChange}
        onSizeChange={mockOnSizeChange}
      />
    );

    const fontButton = screen.getByTestId('font-family-selector');
    fireEvent.click(fontButton);

    await waitFor(() => {
      const arialOption = screen.getByTestId('font-option-arial');
      expect(arialOption).toHaveStyle({ fontFamily: 'Arial, sans-serif' });
    });
  });

  it('applies font size styles to size options', async () => {
    render(
      <FontSelector
        currentFont=""
        currentSize=""
        onFontChange={mockOnFontChange}
        onSizeChange={mockOnSizeChange}
      />
    );

    const sizeButton = screen.getByTestId('font-size-selector');
    fireEvent.click(sizeButton);

    await waitFor(() => {
      const largeOption = screen.getByTestId('size-option-large');
      expect(largeOption).toHaveStyle({ fontSize: '18px' });
    });
  });
});
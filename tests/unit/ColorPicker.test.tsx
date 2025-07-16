import { render, screen, fireEvent, waitFor } from '@testing-library/preact';
import { ColorPicker } from '@/components/ColorPicker';
import { describe, it, expect, vi } from 'vitest';

describe('ColorPicker', () => {
  const mockOnColorChange = vi.fn();

  beforeEach(() => {
    mockOnColorChange.mockClear();
  });

  it('renders with correct label and initial state', () => {
    render(
      <ColorPicker
        currentColor="#ff0000"
        onColorChange={mockOnColorChange}
        label="Text Color"
      />
    );

    const button = screen.getByTestId('color-picker-text-color');
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('title', 'Text Color');
  });

  it('displays current color in the color indicator', () => {
    render(
      <ColorPicker
        currentColor="#ff0000"
        onColorChange={mockOnColorChange}
        label="Text Color"
      />
    );

    const button = screen.getByTestId('color-picker-text-color');
    // Look for any div with a style attribute that contains backgroundColor
    const colorIndicator = button.querySelector('div[style]');
    expect(colorIndicator).toBeInTheDocument();
    
    // Check if the style attribute contains the expected color (browsers convert hex to rgb)
    if (colorIndicator) {
      const style = colorIndicator.getAttribute('style');
      expect(style).toContain('rgb(255, 0, 0)');
    }
  });

  it('opens dropdown when clicked', async () => {
    render(
      <ColorPicker
        currentColor="#ff0000"
        onColorChange={mockOnColorChange}
        label="Text Color"
      />
    );

    const button = screen.getByTestId('color-picker-text-color');
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('Text Color')).toBeInTheDocument();
      expect(screen.getByTestId('custom-color-input')).toBeInTheDocument();
    });
  });

  it('calls onColorChange when a default color is selected', async () => {
    render(
      <ColorPicker
        currentColor=""
        onColorChange={mockOnColorChange}
        label="Text Color"
      />
    );

    const button = screen.getByTestId('color-picker-text-color');
    fireEvent.click(button);

    await waitFor(() => {
      const colorOption = screen.getByTestId('color-option-#000000');
      fireEvent.click(colorOption);
    });

    expect(mockOnColorChange).toHaveBeenCalledWith('#000000');
  });

  it('calls onColorChange when custom color is changed', async () => {
    render(
      <ColorPicker
        currentColor=""
        onColorChange={mockOnColorChange}
        label="Text Color"
      />
    );

    const button = screen.getByTestId('color-picker-text-color');
    fireEvent.click(button);

    await waitFor(() => {
      const customColorInput = screen.getByTestId('custom-color-input');
      fireEvent.change(customColorInput, { target: { value: '#123456' } });
    });

    expect(mockOnColorChange).toHaveBeenCalledWith('#123456');
  });

  it('calls onColorChange with empty string when clear is clicked', async () => {
    render(
      <ColorPicker
        currentColor="#ff0000"
        onColorChange={mockOnColorChange}
        label="Text Color"
      />
    );

    const button = screen.getByTestId('color-picker-text-color');
    fireEvent.click(button);

    await waitFor(() => {
      const clearButton = screen.getByTestId('clear-color');
      fireEvent.click(clearButton);
    });

    expect(mockOnColorChange).toHaveBeenCalledWith('');
  });

  it('validates hex color input', async () => {
    render(
      <ColorPicker
        currentColor=""
        onColorChange={mockOnColorChange}
        label="Text Color"
      />
    );

    const button = screen.getByTestId('color-picker-text-color');
    fireEvent.click(button);

    await waitFor(() => {
      const textInput = screen.getByTestId('custom-color-text');
      fireEvent.change(textInput, { target: { value: '#abcdef' } });
      fireEvent.blur(textInput);
    });

    expect(mockOnColorChange).toHaveBeenCalledWith('#abcdef');
  });

  it('does not call onColorChange for invalid hex color', async () => {
    render(
      <ColorPicker
        currentColor=""
        onColorChange={mockOnColorChange}
        label="Text Color"
      />
    );

    const button = screen.getByTestId('color-picker-text-color');
    fireEvent.click(button);

    await waitFor(() => {
      const textInput = screen.getByTestId('custom-color-text');
      fireEvent.change(textInput, { target: { value: 'invalid' } });
      fireEvent.blur(textInput);
    });

    expect(mockOnColorChange).not.toHaveBeenCalledWith('invalid');
  });

  it('closes dropdown when clicking outside', async () => {
    render(
      <div>
        <ColorPicker
          currentColor=""
          onColorChange={mockOnColorChange}
          label="Text Color"
        />
        <div data-testid="outside">Outside element</div>
      </div>
    );

    const button = screen.getByTestId('color-picker-text-color');
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('Text Color')).toBeInTheDocument();
    });

    const outsideElement = screen.getByTestId('outside');
    fireEvent.mouseDown(outsideElement);

    await waitFor(() => {
      expect(screen.queryByText('Text Color')).not.toBeInTheDocument();
    });
  });
});
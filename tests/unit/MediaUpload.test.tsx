import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/preact';
import { MediaUpload } from '@/components/MediaUpload';

describe('MediaUpload Component', () => {
  const mockOnUpload = vi.fn();
  const mockOnUrlInsert = vi.fn();
  const mockOnClose = vi.fn();

  const defaultProps = {
    type: 'audio' as const,
    onUpload: mockOnUpload,
    onUrlInsert: mockOnUrlInsert,
    onClose: mockOnClose,
    isOpen: true,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  describe('Rendering', () => {
    it('should not render when isOpen is false', () => {
      render(<MediaUpload {...defaultProps} isOpen={false} />);
      expect(screen.queryByTestId('media-upload-modal')).not.toBeInTheDocument();
    });

    it('should render modal when isOpen is true', () => {
      render(<MediaUpload {...defaultProps} />);
      expect(screen.getByTestId('media-upload-modal')).toBeInTheDocument();
    });

    it('should render correct title for audio type', () => {
      render(<MediaUpload {...defaultProps} type="audio" />);
      expect(screen.getByText('Insert Audio')).toBeInTheDocument();
    });

    it('should render correct title for video type', () => {
      render(<MediaUpload {...defaultProps} type="video" />);
      expect(screen.getByText('Insert Video')).toBeInTheDocument();
    });

    it('should render upload tab as active by default', () => {
      render(<MediaUpload {...defaultProps} />);
      const uploadTab = screen.getByTestId('upload-tab');
      expect(uploadTab).toHaveClass('text-primary-600', 'border-b-2', 'border-primary-600');
    });

    it('should render drop zone in upload tab', () => {
      render(<MediaUpload {...defaultProps} />);
      expect(screen.getByTestId('drop-zone')).toBeInTheDocument();
      expect(screen.getByText('browse files')).toBeInTheDocument();
    });
  });

  describe('Tab Navigation', () => {
    it('should switch to URL tab when clicked', () => {
      render(<MediaUpload {...defaultProps} />);
      
      const urlTab = screen.getByTestId('url-tab');
      fireEvent.click(urlTab);

      expect(urlTab).toHaveClass('text-primary-600', 'border-b-2', 'border-primary-600');
      expect(screen.getByTestId('url-form')).toBeInTheDocument();
    });

    it('should switch back to upload tab when clicked', () => {
      render(<MediaUpload {...defaultProps} />);
      
      // Switch to URL tab first
      fireEvent.click(screen.getByTestId('url-tab'));
      
      // Switch back to upload tab
      const uploadTab = screen.getByTestId('upload-tab');
      fireEvent.click(uploadTab);

      expect(uploadTab).toHaveClass('text-primary-600', 'border-b-2', 'border-primary-600');
      expect(screen.getByTestId('drop-zone')).toBeInTheDocument();
    });
  });

  describe('File Upload', () => {
    it('should show correct file types for audio', () => {
      render(<MediaUpload {...defaultProps} type="audio" />);
      expect(screen.getByText(/MP3, WAV, OGG, M4A, AAC/)).toBeInTheDocument();
    });

    it('should show correct file types for video', () => {
      render(<MediaUpload {...defaultProps} type="video" />);
      expect(screen.getByText(/MP4, WebM, OGG, MOV, AVI/)).toBeInTheDocument();
    });

    it('should trigger file input when browse files is clicked', () => {
      render(<MediaUpload {...defaultProps} />);
      
      const fileInput = screen.getByTestId('file-input') as HTMLInputElement;
      const browseButton = screen.getByTestId('browse-files');
      
      const clickSpy = vi.spyOn(fileInput, 'click');
      fireEvent.click(browseButton);
      
      expect(clickSpy).toHaveBeenCalled();
    });

    it('should call onUpload when valid file is selected', () => {
      render(<MediaUpload {...defaultProps} type="audio" />);
      
      const fileInput = screen.getByTestId('file-input') as HTMLInputElement;
      const file = new File(['audio content'], 'test.mp3', { type: 'audio/mpeg' });
      
      Object.defineProperty(fileInput, 'files', {
        value: [file],
        writable: false,
      });
      
      fireEvent.change(fileInput);
      
      expect(mockOnUpload).toHaveBeenCalledWith(file);
      expect(mockOnClose).toHaveBeenCalled();
    });

    it('should show alert for invalid file type', () => {
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
      
      render(<MediaUpload {...defaultProps} type="audio" />);
      
      const fileInput = screen.getByTestId('file-input') as HTMLInputElement;
      const file = new File(['video content'], 'test.mp4', { type: 'video/mp4' });
      
      Object.defineProperty(fileInput, 'files', {
        value: [file],
        writable: false,
      });
      
      fireEvent.change(fileInput);
      
      expect(alertSpy).toHaveBeenCalledWith('Please select a valid audio file.');
      expect(mockOnUpload).not.toHaveBeenCalled();
      
      alertSpy.mockRestore();
    });

    it('should show alert for file too large', () => {
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
      
      render(<MediaUpload {...defaultProps} type="audio" />);
      
      const fileInput = screen.getByTestId('file-input') as HTMLInputElement;
      // Create a file larger than 100MB
      const largeFile = new File(['x'.repeat(101 * 1024 * 1024)], 'large.mp3', { type: 'audio/mpeg' });
      
      Object.defineProperty(fileInput, 'files', {
        value: [largeFile],
        writable: false,
      });
      
      fireEvent.change(fileInput);
      
      expect(alertSpy).toHaveBeenCalledWith('File size must be less than 100MB.');
      expect(mockOnUpload).not.toHaveBeenCalled();
      
      alertSpy.mockRestore();
    });
  });

  describe('Drag and Drop', () => {
    it('should handle drag over event', () => {
      render(<MediaUpload {...defaultProps} />);
      
      const dropZone = screen.getByTestId('drop-zone');
      
      fireEvent.dragOver(dropZone);
      
      expect(dropZone).toHaveClass('border-primary-500', 'bg-primary-50');
    });

    it('should handle drag leave event', () => {
      render(<MediaUpload {...defaultProps} />);
      
      const dropZone = screen.getByTestId('drop-zone');
      
      fireEvent.dragOver(dropZone);
      fireEvent.dragLeave(dropZone);
      
      expect(dropZone).not.toHaveClass('border-primary-500', 'bg-primary-50');
    });

    it('should handle file drop', () => {
      render(<MediaUpload {...defaultProps} type="audio" />);
      
      const dropZone = screen.getByTestId('drop-zone');
      const file = new File(['audio content'], 'test.mp3', { type: 'audio/mpeg' });
      
      // Create a mock drop event
      const dropEvent = {
        preventDefault: vi.fn(),
        dataTransfer: {
          files: [file],
        },
      };
      
      fireEvent.drop(dropZone, dropEvent);
      
      expect(mockOnUpload).toHaveBeenCalledWith(file);
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  describe('URL Input', () => {
    it('should render URL form in URL tab', () => {
      render(<MediaUpload {...defaultProps} />);
      fireEvent.click(screen.getByTestId('url-tab'));
      
      expect(screen.getByTestId('url-form')).toBeInTheDocument();
      expect(screen.getByTestId('url-input')).toBeInTheDocument();
      expect(screen.getByTestId('title-input')).toBeInTheDocument();
    });

    it('should show correct placeholder for audio', () => {
      render(<MediaUpload {...defaultProps} type="audio" />);
      fireEvent.click(screen.getByTestId('url-tab'));
      
      expect(screen.getByPlaceholderText('Enter audio URL...')).toBeInTheDocument();
    });

    it('should show correct placeholder for video', () => {
      render(<MediaUpload {...defaultProps} type="video" />);
      fireEvent.click(screen.getByTestId('url-tab'));
      
      expect(screen.getByPlaceholderText('Enter video URL...')).toBeInTheDocument();
    });

    it('should update URL input value', () => {
      render(<MediaUpload {...defaultProps} />);
      fireEvent.click(screen.getByTestId('url-tab'));
      
      const urlInput = screen.getByTestId('url-input') as HTMLInputElement;
      fireEvent.input(urlInput, { target: { value: 'https://example.com/audio.mp3' } });
      
      expect(urlInput.value).toBe('https://example.com/audio.mp3');
    });

    it('should update title input value', () => {
      render(<MediaUpload {...defaultProps} />);
      fireEvent.click(screen.getByTestId('url-tab'));
      
      const titleInput = screen.getByTestId('title-input') as HTMLInputElement;
      fireEvent.input(titleInput, { target: { value: 'My Audio Title' } });
      
      expect(titleInput.value).toBe('My Audio Title');
    });

    it('should call onUrlInsert when form is submitted with URL', () => {
      render(<MediaUpload {...defaultProps} />);
      fireEvent.click(screen.getByTestId('url-tab'));
      
      const urlInput = screen.getByTestId('url-input');
      const form = screen.getByTestId('url-form');
      
      fireEvent.change(urlInput, { target: { value: 'https://example.com/audio.mp3' } });
      
      // Create a proper submit event
      const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
      fireEvent(form, submitEvent);
      
      expect(mockOnUrlInsert).toHaveBeenCalledWith('https://example.com/audio.mp3', undefined);
      expect(mockOnClose).toHaveBeenCalled();
    });

    it('should call onUrlInsert with title when both URL and title are provided', () => {
      render(<MediaUpload {...defaultProps} />);
      fireEvent.click(screen.getByTestId('url-tab'));
      
      const urlInput = screen.getByTestId('url-input');
      const titleInput = screen.getByTestId('title-input');
      const form = screen.getByTestId('url-form');
      
      fireEvent.change(urlInput, { target: { value: 'https://example.com/audio.mp3' } });
      fireEvent.change(titleInput, { target: { value: 'My Audio Title' } });
      
      // Create a proper submit event
      const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
      fireEvent(form, submitEvent);
      
      expect(mockOnUrlInsert).toHaveBeenCalledWith('https://example.com/audio.mp3', 'My Audio Title');
      expect(mockOnClose).toHaveBeenCalled();
    });

    it('should trim whitespace from URL and title', () => {
      render(<MediaUpload {...defaultProps} />);
      fireEvent.click(screen.getByTestId('url-tab'));
      
      const urlInput = screen.getByTestId('url-input');
      const titleInput = screen.getByTestId('title-input');
      const form = screen.getByTestId('url-form');
      
      fireEvent.change(urlInput, { target: { value: '  https://example.com/audio.mp3  ' } });
      fireEvent.change(titleInput, { target: { value: '  My Audio Title  ' } });
      
      // Create a proper submit event
      const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
      fireEvent(form, submitEvent);
      
      expect(mockOnUrlInsert).toHaveBeenCalledWith('https://example.com/audio.mp3', 'My Audio Title');
    });
  });

  describe('Modal Controls', () => {
    it('should call onClose when close button is clicked', () => {
      render(<MediaUpload {...defaultProps} />);
      
      const closeButton = screen.getByTestId('close-modal');
      fireEvent.click(closeButton);
      
      expect(mockOnClose).toHaveBeenCalled();
    });

    it('should call onClose when cancel button is clicked', () => {
      render(<MediaUpload {...defaultProps} />);
      fireEvent.click(screen.getByTestId('url-tab'));
      
      const cancelButton = screen.getByTestId('cancel-button');
      fireEvent.click(cancelButton);
      
      expect(mockOnClose).toHaveBeenCalled();
    });

    it('should show correct insert button text for audio', () => {
      render(<MediaUpload {...defaultProps} type="audio" />);
      fireEvent.click(screen.getByTestId('url-tab'));
      
      const insertButton = screen.getByTestId('insert-button');
      expect(insertButton).toHaveTextContent('Insert Audio');
    });

    it('should show correct insert button text for video', () => {
      render(<MediaUpload {...defaultProps} type="video" />);
      fireEvent.click(screen.getByTestId('url-tab'));
      
      const insertButton = screen.getByTestId('insert-button');
      expect(insertButton).toHaveTextContent('Insert Video');
    });
  });
});
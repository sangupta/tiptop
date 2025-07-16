import { useState, useRef } from 'preact/hooks';
import { Upload, Link, X } from 'lucide-preact';

export interface MediaUploadProps {
  type: 'audio' | 'video';
  onUpload: (file: File) => void;
  onUrlInsert: (url: string, title?: string) => void;
  onClose: () => void;
  isOpen: boolean;
}

export const MediaUpload = ({ type, onUpload, onUrlInsert, onClose, isOpen }: MediaUploadProps) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'url'>('upload');
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const acceptedTypes = type === 'audio' 
    ? 'audio/*,.mp3,.wav,.ogg,.m4a,.aac'
    : 'video/*,.mp4,.webm,.ogg,.mov,.avi';

  const handleFileSelect = (files: FileList | null) => {
    if (files && files.length > 0) {
      const file = files[0];
      if (validateFile(file)) {
        onUpload(file);
        onClose();
      }
    }
  };

  const validateFile = (file: File): boolean => {
    const isValidType = type === 'audio' 
      ? file.type.startsWith('audio/')
      : file.type.startsWith('video/');
    
    if (!isValidType) {
      alert(`Please select a valid ${type} file.`);
      return false;
    }

    // 100MB limit
    const maxSize = 100 * 1024 * 1024;
    if (file.size > maxSize) {
      alert(`File size must be less than 100MB.`);
      return false;
    }

    return true;
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer?.files || null);
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleUrlSubmit = (e: Event) => {
    e.preventDefault();
    if (url.trim()) {
      onUrlInsert(url.trim(), title.trim() || undefined);
      setUrl('');
      setTitle('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" data-testid="media-upload-modal">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Insert {type === 'audio' ? 'Audio' : 'Video'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            data-testid="close-modal"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex border-b border-gray-200 dark:border-gray-700 mb-4">
          <button
            onClick={() => setActiveTab('upload')}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'upload'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
            data-testid="upload-tab"
          >
            Upload File
          </button>
          <button
            onClick={() => setActiveTab('url')}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'url'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
            data-testid="url-tab"
          >
            From URL
          </button>
        </div>

        {activeTab === 'upload' && (
          <div>
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                isDragOver
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              data-testid="drop-zone"
            >
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Drag and drop your {type} file here, or
              </p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-primary-600 hover:text-primary-700 font-medium"
                data-testid="browse-files"
              >
                browse files
              </button>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Supported formats: {type === 'audio' ? 'MP3, WAV, OGG, M4A, AAC' : 'MP4, WebM, OGG, MOV, AVI'}
                <br />
                Maximum size: 100MB
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept={acceptedTypes}
              onChange={(e) => handleFileSelect((e.target as HTMLInputElement).files)}
              className="hidden"
              data-testid="file-input"
            />
          </div>
        )}

        {activeTab === 'url' && (
          <form onSubmit={handleUrlSubmit} data-testid="url-form">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {type === 'audio' ? 'Audio' : 'Video'} URL
              </label>
              <div className="relative">
                <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl((e.target as HTMLInputElement).value)}
                  placeholder={`Enter ${type} URL...`}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                  required
                  data-testid="url-input"
                />
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Title (optional)
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle((e.target as HTMLInputElement).value)}
                placeholder="Enter title..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                data-testid="title-input"
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md"
                data-testid="cancel-button"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md"
                data-testid="insert-button"
              >
                Insert {type === 'audio' ? 'Audio' : 'Video'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default MediaUpload;
import { useState, useRef, useEffect } from 'preact/hooks';
import { Palette, ChevronDown } from 'lucide-preact';

interface ColorPickerProps {
  currentColor?: string;
  onColorChange: (color: string) => void;
  label: string;
  className?: string;
}

const DEFAULT_COLORS = [
  '#000000', '#374151', '#6B7280', '#9CA3AF', '#D1D5DB', '#F3F4F6', '#FFFFFF',
  '#DC2626', '#EA580C', '#D97706', '#CA8A04', '#65A30D', '#16A34A', '#059669',
  '#0891B2', '#0284C7', '#2563EB', '#4F46E5', '#7C3AED', '#9333EA', '#C026D3',
  '#DB2777', '#E11D48'
];

export const ColorPicker = ({ currentColor, onColorChange, label, className = '' }: ColorPickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customColor, setCustomColor] = useState(currentColor || '#000000');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleColorSelect = (color: string) => {
    onColorChange(color);
    setCustomColor(color);
    setIsOpen(false);
  };

  const handleCustomColorChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const color = target.value;
    setCustomColor(color);
    onColorChange(color);
  };

  const clearColor = () => {
    onColorChange('');
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 rounded-md border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        title={label}
        data-testid={`color-picker-${label.toLowerCase().replace(/\s+/g, '-')}`}
      >
        <div className="flex items-center gap-1">
          <Palette size={16} />
          <div 
            className="w-4 h-4 rounded border border-gray-300 dark:border-gray-500"
            style={{ backgroundColor: currentColor || 'transparent' }}
          />
        </div>
        <ChevronDown size={14} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-50 min-w-[200px]">
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {label}
            </label>
            
            {/* Default colors grid */}
            <div className="grid grid-cols-7 gap-1 mb-3">
              {DEFAULT_COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => handleColorSelect(color)}
                  className={`w-6 h-6 rounded border-2 hover:scale-110 transition-transform ${
                    currentColor === color 
                      ? 'border-primary-500 ring-2 ring-primary-200' 
                      : 'border-gray-300 dark:border-gray-500'
                  }`}
                  style={{ backgroundColor: color }}
                  title={color}
                  data-testid={`color-option-${color}`}
                />
              ))}
            </div>

            {/* Custom color input */}
            <div className="flex items-center gap-2 mb-2">
              <input
                type="color"
                value={customColor}
                onChange={handleCustomColorChange}
                className="w-8 h-8 rounded border border-gray-300 dark:border-gray-500 cursor-pointer"
                data-testid="custom-color-input"
              />
              <input
                type="text"
                value={customColor}
                onChange={(e) => {
                  const target = e.target as HTMLInputElement;
                  setCustomColor(target.value);
                }}
                onBlur={(e) => {
                  const target = e.target as HTMLInputElement;
                  if (/^#[0-9A-Fa-f]{6}$/.test(target.value)) {
                    onColorChange(target.value);
                  }
                }}
                className="flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-500 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="#000000"
                data-testid="custom-color-text"
              />
            </div>

            {/* Clear color button */}
            <button
              onClick={clearColor}
              className="w-full px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 border border-gray-300 dark:border-gray-500 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              data-testid="clear-color"
            >
              Clear Color
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
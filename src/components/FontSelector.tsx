import { useState, useRef, useEffect } from 'preact/hooks';
import { Type, ChevronDown } from 'lucide-preact';

interface FontSelectorProps {
  currentFont?: string;
  currentSize?: string;
  onFontChange: (font: string) => void;
  onSizeChange: (size: string) => void;
  className?: string;
}

const FONT_FAMILIES = [
  { name: 'Default', value: '' },
  { name: 'Arial', value: 'Arial, sans-serif' },
  { name: 'Helvetica', value: 'Helvetica, sans-serif' },
  { name: 'Times New Roman', value: 'Times New Roman, serif' },
  { name: 'Georgia', value: 'Georgia, serif' },
  { name: 'Courier New', value: 'Courier New, monospace' },
  { name: 'Verdana', value: 'Verdana, sans-serif' },
  { name: 'Trebuchet MS', value: 'Trebuchet MS, sans-serif' },
  { name: 'Impact', value: 'Impact, sans-serif' },
  { name: 'Comic Sans MS', value: 'Comic Sans MS, cursive' },
];

const FONT_SIZES = [
  { name: 'Small', value: '12px' },
  { name: 'Normal', value: '14px' },
  { name: 'Medium', value: '16px' },
  { name: 'Large', value: '18px' },
  { name: 'X-Large', value: '24px' },
  { name: 'XX-Large', value: '32px' },
];

export const FontSelector = ({ 
  currentFont, 
  currentSize, 
  onFontChange, 
  onSizeChange, 
  className = '' 
}: FontSelectorProps) => {
  const [isFontOpen, setIsFontOpen] = useState(false);
  const [isSizeOpen, setIsSizeOpen] = useState(false);
  const fontDropdownRef = useRef<HTMLDivElement>(null);
  const sizeDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (fontDropdownRef.current && !fontDropdownRef.current.contains(event.target as Node)) {
        setIsFontOpen(false);
      }
      if (sizeDropdownRef.current && !sizeDropdownRef.current.contains(event.target as Node)) {
        setIsSizeOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getCurrentFontName = () => {
    const font = FONT_FAMILIES.find(f => f.value === currentFont);
    return font ? font.name : 'Default';
  };

  const getCurrentSizeName = () => {
    const size = FONT_SIZES.find(s => s.value === currentSize);
    return size ? size.name : 'Normal';
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Font Family Selector */}
      <div className="relative" ref={fontDropdownRef}>
        <button
          onClick={() => setIsFontOpen(!isFontOpen)}
          className="flex items-center gap-2 px-3 py-2 rounded-md border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors min-w-[120px]"
          title="Font Family"
          data-testid="font-family-selector"
        >
          <Type size={16} />
          <span className="text-sm truncate">{getCurrentFontName()}</span>
          <ChevronDown size={14} />
        </button>

        {isFontOpen && (
          <div className="absolute top-full left-0 mt-1 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-50 min-w-[160px] max-h-60 overflow-y-auto">
            {FONT_FAMILIES.map((font) => (
              <button
                key={font.value}
                onClick={() => {
                  onFontChange(font.value);
                  setIsFontOpen(false);
                }}
                className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                  currentFont === font.value 
                    ? 'bg-primary-50 dark:bg-primary-900 text-primary-700 dark:text-primary-300' 
                    : 'text-gray-700 dark:text-gray-300'
                }`}
                style={{ fontFamily: font.value || 'inherit' }}
                data-testid={`font-option-${font.name.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {font.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Font Size Selector */}
      <div className="relative" ref={sizeDropdownRef}>
        <button
          onClick={() => setIsSizeOpen(!isSizeOpen)}
          className="flex items-center gap-2 px-3 py-2 rounded-md border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors min-w-[100px]"
          title="Font Size"
          data-testid="font-size-selector"
        >
          <span className="text-sm truncate">{getCurrentSizeName()}</span>
          <ChevronDown size={14} />
        </button>

        {isSizeOpen && (
          <div className="absolute top-full left-0 mt-1 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-50 min-w-[120px]">
            {FONT_SIZES.map((size) => (
              <button
                key={size.value}
                onClick={() => {
                  onSizeChange(size.value);
                  setIsSizeOpen(false);
                }}
                className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                  currentSize === size.value 
                    ? 'bg-primary-50 dark:bg-primary-900 text-primary-700 dark:text-primary-300' 
                    : 'text-gray-700 dark:text-gray-300'
                }`}
                style={{ fontSize: size.value }}
                data-testid={`size-option-${size.name.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {size.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
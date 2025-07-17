import { useState, useRef, useEffect } from 'preact/hooks';
import { Editor } from '@tiptap/core';
import { ChevronDown } from 'lucide-preact';

interface LanguageSelectorProps {
  editor: Editor;
  currentLanguage: string;
  onLanguageChange: (language: string) => void;
}

interface Language {
  name: string;
  value: string;
}

const LANGUAGES: Language[] = [
  { name: 'Plain Text', value: 'plaintext' },
  { name: 'JavaScript', value: 'javascript' },
  { name: 'TypeScript', value: 'typescript' },
  { name: 'JSX', value: 'jsx' },
  { name: 'TSX', value: 'tsx' },
  { name: 'HTML', value: 'html' },
  { name: 'CSS', value: 'css' },
  { name: 'SCSS', value: 'scss' },
  { name: 'Python', value: 'python' },
  { name: 'Java', value: 'java' },
  { name: 'C', value: 'c' },
  { name: 'C++', value: 'cpp' },
  { name: 'C#', value: 'csharp' },
  { name: 'Go', value: 'go' },
  { name: 'Rust', value: 'rust' },
  { name: 'JSON', value: 'json' },
  { name: 'YAML', value: 'yaml' },
  { name: 'Markdown', value: 'markdown' },
  { name: 'Bash', value: 'bash' },
  { name: 'SQL', value: 'sql' },
  { name: 'PHP', value: 'php' },
  { name: 'Ruby', value: 'ruby' },
  { name: 'Swift', value: 'swift' },
];

export const LanguageSelector = ({ editor, currentLanguage, onLanguageChange }: LanguageSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLanguageObj = LANGUAGES.find(lang => lang.value === currentLanguage) || LANGUAGES[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLanguageSelect = (language: string) => {
    onLanguageChange(language);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block" ref={dropdownRef} data-testid="language-selector">
      <button
        type="button"
        className="flex items-center gap-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        data-testid="language-selector-button"
      >
        <span>{currentLanguageObj.name}</span>
        <ChevronDown size={14} />
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 max-h-60 w-48 overflow-auto rounded-md bg-white dark:bg-gray-800 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <ul className="py-1 text-sm" role="listbox">
            {LANGUAGES.map((language) => (
              <li
                key={language.value}
                className={`cursor-pointer select-none px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  currentLanguage === language.value
                    ? 'bg-primary-50 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                    : 'text-gray-900 dark:text-gray-100'
                }`}
                onClick={() => handleLanguageSelect(language.value)}
                role="option"
                aria-selected={currentLanguage === language.value}
                data-testid={`language-option-${language.value}`}
              >
                {language.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
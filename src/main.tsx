import { render } from 'preact';
import './styles/index.css';

// Main entry point for the Tiptop editor
// This will be expanded in subsequent tasks

function App() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Tiptop Rich Text Editor
        </h1>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <p className="text-gray-600 dark:text-gray-300">
            Editor will be initialized here in the next task.
          </p>
        </div>
      </div>
    </div>
  );
}

render(<App />, document.getElementById('app')!);

// Export main components for library usage
export { App };
export * from './types';
export * from './components';
export * from './extensions';
export * from './services';
export * from './utils';

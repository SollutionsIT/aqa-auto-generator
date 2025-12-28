import React from 'react';
import TestGenerator from './components/TestGenerator';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-qa-dark text-white selection:bg-qa-accent selection:text-qa-dark">
      {/* Header */}
      <header className="border-b border-gray-800 bg-qa-dark/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-blue-600 to-qa-accent p-2 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white">
              QA <span className="text-qa-accent">GenAI</span> Writer
            </h1>
          </div>
          <div className="hidden md:flex items-center gap-4 text-sm font-medium text-gray-400">
            <span>Powered by Gemini 3</span>
            <div className="h-4 w-px bg-gray-700"></div>
            <span className="text-qa-accent">v1.0.0</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        <TestGenerator />
      </main>
    </div>
  );
};

export default App;
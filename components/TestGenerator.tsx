import React, { useState } from 'react';
import { Framework, Language, TestConfig, GeneratedResult } from '../types';
import { generateTestCode } from '../services/geminiService';
import { Button } from './Button';
import { Play, Copy, RefreshCw, Terminal, CheckCircle2, Code2 } from 'lucide-react';

const TestGenerator: React.FC = () => {
  const [config, setConfig] = useState<TestConfig>({
    framework: Framework.Playwright,
    language: Language.TypeScript,
    scenario: 'Login successfully with valid username and password, then verify the dashboard header is visible.'
  });

  const [result, setResult] = useState<GeneratedResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!config.scenario.trim()) {
      setError("Please enter a test scenario.");
      return;
    }
    
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      const generated = await generateTestCode(config);
      setResult(generated);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (result?.code) {
      navigator.clipboard.writeText(result.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-full gap-6 p-6 max-w-7xl mx-auto">
      
      {/* LEFT PANEL: CONFIGURATION */}
      <div className="w-full lg:w-1/3 flex flex-col gap-6">
        <div className="bg-qa-panel p-6 rounded-xl border border-gray-700 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-qa-accent/10 rounded-lg">
              <Terminal className="w-6 h-6 text-qa-accent" />
            </div>
            <h2 className="text-xl font-bold text-white">Test Configuration</h2>
          </div>

          <div className="space-y-4">
            {/* Framework Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Testing Framework</label>
              <select 
                className="w-full bg-qa-dark border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-qa-accent focus:border-transparent outline-none"
                value={config.framework}
                onChange={(e) => setConfig({ ...config, framework: e.target.value as Framework })}
              >
                {Object.values(Framework).map((fw) => (
                  <option key={fw} value={fw}>{fw}</option>
                ))}
              </select>
            </div>

            {/* Language Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Programming Language</label>
              <select 
                className="w-full bg-qa-dark border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-qa-accent focus:border-transparent outline-none"
                value={config.language}
                onChange={(e) => setConfig({ ...config, language: e.target.value as Language })}
              >
                {Object.values(Language).map((lang) => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>

            {/* Scenario Input */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Test Scenario
                <span className="text-xs text-gray-500 ml-2">(English or Russian)</span>
              </label>
              <textarea 
                className="w-full h-40 bg-qa-dark border border-gray-600 rounded-lg p-4 text-white focus:ring-2 focus:ring-qa-accent focus:border-transparent outline-none resize-none font-mono text-sm"
                placeholder="Example: User logs in, adds an item to cart, and proceeds to checkout."
                value={config.scenario}
                onChange={(e) => setConfig({ ...config, scenario: e.target.value })}
              />
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm">
                {error}
              </div>
            )}

            <Button 
              onClick={handleGenerate} 
              isLoading={loading} 
              className="w-full mt-2"
              icon={<Play size={18} />}
            >
              Generate Test
            </Button>
          </div>
        </div>

        {/* Tips Section */}
        <div className="bg-qa-panel p-6 rounded-xl border border-gray-700/50">
          <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
            <CheckCircle2 size={16} className="text-qa-success" />
            Pro Tips
          </h3>
          <ul className="text-sm text-gray-400 space-y-2 list-disc list-inside">
            <li>Be specific about element IDs or classes.</li>
            <li>Mention assertions (e.g., "Check text is visible").</li>
            <li>Specify if you need helper functions.</li>
          </ul>
        </div>
      </div>

      {/* RIGHT PANEL: OUTPUT */}
      <div className="w-full lg:w-2/3 flex flex-col h-[600px] lg:h-auto">
        <div className="bg-qa-panel flex-1 rounded-xl border border-gray-700 shadow-xl overflow-hidden flex flex-col">
          
          {/* Output Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700 bg-gray-900/50">
            <div className="flex items-center gap-2">
              <Code2 className="text-gray-400" size={20} />
              <span className="font-mono text-sm text-gray-300">
                {result ? 'generated_test.spec.ts' : 'No code generated'}
              </span>
            </div>
            {result && (
              <div className="flex gap-2">
                <Button variant="secondary" onClick={handleGenerate} className="!px-3 !py-1 text-xs">
                  <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
                </Button>
                <Button variant="secondary" onClick={handleCopy} className="!px-3 !py-1 text-xs">
                  {copied ? <CheckCircle2 size={14} className="text-qa-success"/> : <Copy size={14} />}
                  <span className="ml-2">{copied ? 'Copied!' : 'Copy'}</span>
                </Button>
              </div>
            )}
          </div>

          {/* Code Area */}
          <div className="flex-1 overflow-auto bg-[#0d1117] p-6 relative group">
            {loading ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 gap-4">
                <div className="w-16 h-16 border-4 border-qa-accent/30 border-t-qa-accent rounded-full animate-spin"></div>
                <p className="animate-pulse">Thinking like a QA Lead...</p>
              </div>
            ) : result ? (
              <>
                <div className="mb-4 pb-4 border-b border-gray-800">
                   <h4 className="text-qa-accent text-sm font-bold uppercase tracking-wider mb-1">Explanation</h4>
                   <p className="text-gray-400 text-sm leading-relaxed">{result.explanation}</p>
                </div>
                <pre className="font-mono text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">
                  <code>{result.code}</code>
                </pre>
              </>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-600 gap-4">
                <Code2 size={64} className="opacity-20" />
                <p>Configure your test scenario on the left to generate code.</p>
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};

export default TestGenerator;
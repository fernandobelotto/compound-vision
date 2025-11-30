import React, { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Scenario } from '../types';
import { getInvestmentAnalysis } from '../services/geminiService';

interface AIInsightProps {
  scenarios: Scenario[];
}

const AIInsight: React.FC<AIInsightProps> = ({ scenarios }) => {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    const result = await getInvestmentAnalysis(scenarios);
    setAnalysis(result);
    setLoading(false);
  };

  return (
    <div className="mt-8 bg-gradient-to-br from-indigo-900/30 to-purple-900/30 rounded-xl border border-indigo-500/30 p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-indigo-500 rounded-full blur-3xl opacity-20 pointer-events-none"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="text-amber-400" size={24} />
            <h2 className="text-xl font-bold text-white">AI Financial Insight</h2>
          </div>
          {!analysis && !loading && (
             <button
             onClick={handleAnalyze}
             className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-colors flex items-center gap-2 shadow-lg shadow-indigo-900/20"
           >
             <Sparkles size={16} />
             Analyze Scenarios
           </button>
          )}
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-8 text-slate-300">
            <Loader2 className="animate-spin mb-2 text-indigo-400" size={32} />
            <p>Consulting the algorithm...</p>
          </div>
        )}

        {analysis && !loading && (
          <div className="prose prose-invert prose-slate max-w-none">
            <ReactMarkdown
              components={{
                p: ({node, ...props}) => <p className="mb-4 text-slate-300 leading-relaxed" {...props} />,
                ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-4 text-slate-300" {...props} />,
                li: ({node, ...props}) => <li className="mb-2" {...props} />,
                strong: ({node, ...props}) => <strong className="text-white font-semibold" {...props} />,
              }}
            >
              {analysis}
            </ReactMarkdown>
            <div className="mt-6 flex justify-end">
                 <button
                 onClick={handleAnalyze}
                 className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
               >
                 <Sparkles size={14} />
                 Refresh Analysis
               </button>
            </div>
          </div>
        )}
        
        {!analysis && !loading && (
            <p className="text-slate-400">
                Tap the button to get a personalized comparison of your investment scenarios powered by Gemini AI. Understand which strategy maximizes your wealth.
            </p>
        )}
      </div>
    </div>
  );
};

export default AIInsight;
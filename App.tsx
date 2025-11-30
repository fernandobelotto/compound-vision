import React, { useState, useMemo } from 'react';
import { Plus, TrendingUp } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { Scenario, CHART_COLORS } from './types';
import { generateChartData } from './utils/calculations';
import ScenarioCard from './components/ScenarioCard';
import ComparisonChart from './components/ComparisonChart';
import AIInsight from './components/AIInsight';

const DEFAULT_SCENARIOS: Scenario[] = [
  {
    id: '1',
    name: 'Conservative Saver',
    initialAmount: 5000,
    monthlyContribution: 200,
    interestRate: 4,
    years: 20,
    color: CHART_COLORS[0],
  },
  {
    id: '2',
    name: 'Aggressive Investor',
    initialAmount: 5000,
    monthlyContribution: 500,
    interestRate: 8,
    years: 20,
    color: CHART_COLORS[1],
  }
];

const App: React.FC = () => {
  const [scenarios, setScenarios] = useState<Scenario[]>(DEFAULT_SCENARIOS);

  const chartData = useMemo(() => generateChartData(scenarios), [scenarios]);

  const addScenario = () => {
    if (scenarios.length >= 4) return; // Limit for UI sanity
    const nextColorIndex = scenarios.length % CHART_COLORS.length;
    const newScenario: Scenario = {
      id: uuidv4(),
      name: `Scenario ${scenarios.length + 1}`,
      initialAmount: 1000,
      monthlyContribution: 100,
      interestRate: 5,
      years: 10,
      color: CHART_COLORS[nextColorIndex],
    };
    setScenarios([...scenarios, newScenario]);
  };

  const removeScenario = (id: string) => {
    setScenarios(scenarios.filter(s => s.id !== id));
  };

  const updateScenario = (id: string, field: keyof Scenario, value: any) => {
    setScenarios(scenarios.map(s => 
      s.id === id ? { ...s, [field]: value } : s
    ));
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6 md:p-12">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-600 rounded-lg">
                    <TrendingUp className="text-white" size={24} />
                </div>
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
                Compound Vision
                </h1>
            </div>
            <p className="text-slate-400 max-w-xl">
              Compare investment strategies side-by-side. See how small changes in contributions or interest rates compound over time.
            </p>
          </div>
          
          <button
            onClick={addScenario}
            disabled={scenarios.length >= 4}
            className={`flex items-center gap-2 px-5 py-3 rounded-lg font-semibold transition-all ${
              scenarios.length >= 4 
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/20'
            }`}
          >
            <Plus size={20} />
            Add Scenario
          </button>
        </div>

        {/* Chart Section */}
        <ComparisonChart data={chartData} scenarios={scenarios} />

        {/* Inputs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {scenarios.map((scenario) => (
            <ScenarioCard
              key={scenario.id}
              scenario={scenario}
              onUpdate={updateScenario}
              onRemove={removeScenario}
              canRemove={scenarios.length > 1}
            />
          ))}
          
          {/* Empty State / Add CTA if less than max */}
          {scenarios.length < 4 && (
             <button 
                onClick={addScenario}
                className="group flex flex-col items-center justify-center min-h-[300px] border-2 border-dashed border-slate-700 rounded-xl hover:border-slate-500 hover:bg-slate-800/30 transition-all"
             >
                <div className="p-4 rounded-full bg-slate-800 group-hover:bg-slate-700 transition-colors mb-3">
                    <Plus className="text-slate-400 group-hover:text-slate-200" size={24} />
                </div>
                <span className="text-slate-500 font-medium group-hover:text-slate-300">Add Comparison</span>
             </button>
          )}
        </div>

        {/* AI Section */}
        <AIInsight scenarios={scenarios} />
        
        {/* Footer */}
        <footer className="text-center text-slate-600 text-sm pt-8 border-t border-slate-800">
            <p>Calculations assume monthly compounding and end-of-month contributions. For educational purposes only.</p>
        </footer>

      </div>
    </div>
  );
};

export default App;
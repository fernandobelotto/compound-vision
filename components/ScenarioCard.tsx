import React from 'react';
import { Scenario } from '../types';
import { formatCurrency, calculateScenario } from '../utils/calculations';
import { Trash2 } from 'lucide-react';

interface ScenarioCardProps {
  scenario: Scenario;
  onUpdate: (id: string, field: keyof Scenario, value: any) => void;
  onRemove: (id: string) => void;
  canRemove: boolean;
}

const ScenarioCard: React.FC<ScenarioCardProps> = ({ scenario, onUpdate, onRemove, canRemove }) => {
  const result = calculateScenario(scenario);

  const handleChange = (field: keyof Scenario, value: string) => {
    let numValue = parseFloat(value);
    if (isNaN(numValue)) numValue = 0;
    
    // Validations
    if (field === 'name') {
        onUpdate(scenario.id, field, value);
        return;
    }
    onUpdate(scenario.id, field, numValue);
  };

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 shadow-xl overflow-hidden flex flex-col h-full transition-transform duration-300 hover:scale-[1.01]">
      {/* Header */}
      <div className="p-4 flex items-center justify-between" style={{ borderTop: `4px solid ${scenario.color}` }}>
        <input 
          type="text" 
          value={scenario.name} 
          onChange={(e) => handleChange('name', e.target.value)}
          className="bg-transparent text-lg font-bold text-white focus:outline-none focus:border-b border-slate-500 w-2/3"
        />
        {canRemove && (
          <button 
            onClick={() => onRemove(scenario.id)}
            className="text-slate-400 hover:text-red-400 transition-colors p-1"
            title="Remove Scenario"
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>

      {/* Inputs */}
      <div className="p-4 space-y-4 flex-grow">
        <div className="grid grid-cols-1 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Initial Amount</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
              <input
                type="number"
                min="0"
                value={scenario.initialAmount}
                onChange={(e) => handleChange('initialAmount', e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 pl-8 pr-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Monthly Contribution</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
              <input
                type="number"
                min="0"
                value={scenario.monthlyContribution}
                onChange={(e) => handleChange('monthlyContribution', e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 pl-8 pr-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Interest Rate (%)</label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={scenario.interestRate}
                onChange={(e) => handleChange('interestRate', e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 px-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Duration (Years)</label>
              <input
                type="number"
                min="1"
                max="100"
                value={scenario.years}
                onChange={(e) => handleChange('years', e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 px-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Footer */}
      <div className="bg-slate-900/50 p-4 space-y-2 border-t border-slate-700">
        <div className="flex justify-between items-center text-sm">
          <span className="text-slate-400">Total Invested</span>
          <span className="font-medium text-slate-200">{formatCurrency(result.totalInvested)}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-emerald-400">Interest Earned</span>
          <span className="font-medium text-emerald-400">+{formatCurrency(result.totalInterest)}</span>
        </div>
        <div className="pt-2 border-t border-slate-700 flex justify-between items-end">
           <span className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Total Value</span>
           <span className="text-xl font-bold text-white">{formatCurrency(result.finalBalance)}</span>
        </div>
      </div>
    </div>
  );
};

export default ScenarioCard;
import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Scenario, ChartDataPoint } from '../types';
import { formatCurrency } from '../utils/calculations';

interface ComparisonChartProps {
  data: ChartDataPoint[];
  scenarios: Scenario[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800 border border-slate-700 p-4 rounded-lg shadow-xl">
        <p className="text-slate-300 font-medium mb-2">Year {label}</p>
        {payload.map((entry: any) => (
          <div key={entry.name} className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></div>
            <span className="text-sm text-slate-400" style={{ minWidth: '80px' }}>{entry.name}:</span>
            <span className="text-sm font-bold text-white">{formatCurrency(entry.value)}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const ComparisonChart: React.FC<ComparisonChartProps> = ({ data, scenarios }) => {
  return (
    <div className="h-[400px] w-full bg-slate-800/50 rounded-xl border border-slate-700 p-4">
      <h3 className="text-slate-300 font-semibold mb-4 ml-2">Wealth Growth Over Time</h3>
      <ResponsiveContainer width="100%" height="90%">
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <defs>
            {scenarios.map((scenario) => (
              <linearGradient key={`grad-${scenario.id}`} id={`color-${scenario.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={scenario.color} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={scenario.color} stopOpacity={0}/>
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
          <XAxis 
            dataKey="year" 
            stroke="#94a3b8" 
            tick={{ fill: '#94a3b8' }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            stroke="#94a3b8"
            tick={{ fill: '#94a3b8' }}
            tickFormatter={(value) => `$${value / 1000}k`}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend iconType="circle" />
          {scenarios.map((scenario) => (
            <Area
              key={scenario.id}
              type="monotone"
              dataKey={scenario.id}
              name={scenario.name}
              stroke={scenario.color}
              strokeWidth={3}
              fillOpacity={1}
              fill={`url(#color-${scenario.id})`}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ComparisonChart;
export interface Scenario {
  id: string;
  name: string;
  initialAmount: number;
  monthlyContribution: number;
  interestRate: number; // Percentage (e.g., 7 for 7%)
  years: number;
  color: string;
}

export interface YearDataPoint {
  year: number;
  [scenarioId: string]: number;
}

export interface CalculationResult {
  totalInvested: number;
  totalInterest: number;
  finalBalance: number;
  dataPoints: number[]; // Yearly balances
}

export interface ChartDataPoint {
  year: number;
  [key: string]: number;
}

export const CHART_COLORS = [
  '#3b82f6', // Blue 500
  '#10b981', // Emerald 500
  '#f59e0b', // Amber 500
  '#ef4444', // Red 500
  '#8b5cf6', // Violet 500
  '#ec4899', // Pink 500
  '#06b6d4', // Cyan 500
];
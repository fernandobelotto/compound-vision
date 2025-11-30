import { Scenario, CalculationResult, ChartDataPoint } from '../types';

/**
 * Calculates compound interest with monthly contributions.
 * Formula: Future Value = P * (1 + r/n)^(nt) + PMT * ((1 + r/n)^(nt) - 1) / (r/n)
 */
export const calculateScenario = (scenario: Scenario): CalculationResult => {
  const { initialAmount, monthlyContribution, interestRate, years } = scenario;
  const r = interestRate / 100;
  const n = 12; // Monthly compounding
  const totalMonths = years * 12;
  
  const dataPoints: number[] = [];
  let currentBalance = initialAmount;

  // We want yearly data points for the chart, starting from Year 0
  dataPoints.push(Math.round(currentBalance));

  for (let y = 1; y <= years; y++) {
    // Calculate compound for this specific year
    // We can iterate months to be precise with contributions
    for (let m = 0; m < 12; m++) {
      currentBalance = currentBalance * (1 + r / n) + monthlyContribution;
    }
    dataPoints.push(Math.round(currentBalance));
  }

  const totalInvested = initialAmount + (monthlyContribution * totalMonths);
  const finalBalance = currentBalance;
  const totalInterest = finalBalance - totalInvested;

  return {
    totalInvested: Math.round(totalInvested),
    totalInterest: Math.round(totalInterest),
    finalBalance: Math.round(finalBalance),
    dataPoints,
  };
};

export const generateChartData = (scenarios: Scenario[]): ChartDataPoint[] => {
  if (scenarios.length === 0) return [];

  // Find max years to ensure chart covers the longest scenario
  const maxYears = Math.max(...scenarios.map(s => s.years));
  const chartData: ChartDataPoint[] = [];

  // Pre-calculate all scenarios
  const results = scenarios.map(s => ({
    id: s.id,
    data: calculateScenario(s).dataPoints
  }));

  for (let year = 0; year <= maxYears; year++) {
    const point: ChartDataPoint = { year };
    
    results.forEach(res => {
      // If the scenario is shorter than the max years, hold the last value constant
      // or stop plotting? Holding constant usually makes more sense for comparison
      // effectively showing the money sitting there without new contributions/growth 
      // OR we can continue compounding without contributions. 
      // For simplicity, we just take the last known value if index out of bounds, 
      // or effectively the value at that year index.
      const val = res.data[year] !== undefined 
        ? res.data[year] 
        : res.data[res.data.length - 1]; // Flat line after maturity if purely strict
      
      // Better approach: If a scenario is 10 years and another is 20, 
      // the 10 year one stops compounding actively in this calc logic, 
      // but usually users want to compare equal timeframes.
      // However, if the user explicitly set 10 years, we show up to 10.
      // If the loop goes to 20 (because of another scenario), the 10-year one 
      // either stops (undefined) or flatlines. Let's return undefined so the line stops.
      
      if (year < res.data.length) {
        point[res.id] = val;
      }
    });
    chartData.push(point);
  }

  return chartData;
};

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
};
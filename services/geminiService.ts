import { GoogleGenAI } from "@google/genai";
import { Scenario, CalculationResult } from '../types';
import { calculateScenario, formatCurrency } from '../utils/calculations';

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getInvestmentAnalysis = async (scenarios: Scenario[]): Promise<string> => {
  if (!scenarios || scenarios.length === 0) {
    return "Please add at least one scenario to analyze.";
  }

  // Prepare data context for the AI
  const analysisData = scenarios.map(s => {
    const result = calculateScenario(s);
    return {
      name: s.name,
      inputs: {
        initial: formatCurrency(s.initialAmount),
        monthly: formatCurrency(s.monthlyContribution),
        rate: `${s.interestRate}%`,
        years: `${s.years} years`
      },
      results: {
        totalInvested: formatCurrency(result.totalInvested),
        totalInterest: formatCurrency(result.totalInterest),
        finalBalance: formatCurrency(result.finalBalance),
        interestRatio: `${((result.totalInterest / result.finalBalance) * 100).toFixed(1)}% of total`
      }
    };
  });

  const prompt = `
    You are a financial expert. Analyze these investment scenarios side-by-side.
    
    Data:
    ${JSON.stringify(analysisData, null, 2)}
    
    Please provide:
    1. A brief comparison of the final outcomes.
    2. An explanation of how the specific variables (interest rate, time, contributions) drove the difference in results (e.g., "Scenario A won because of the higher rate despite lower contributions").
    3. A specific insight about the power of compound interest observed here.
    
    Keep the tone encouraging, professional, and educational. Format with clean paragraphs or bullet points. Avoid complex jargon where simple terms work.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Unable to generate analysis at this time.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "An error occurred while communicating with the AI. Please check your API key or try again later.";
  }
};
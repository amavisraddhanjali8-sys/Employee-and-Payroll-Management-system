import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const detectAnomalies = async (attendanceData: any[]) => {
  const model = "gemini-3-flash-preview";
  const prompt = `
    Analyze the following construction site attendance data for anomalies. 
    Look for:
    1. Buddy punching (multiple check-ins from same location/time).
    2. Impossible travel (check-ins at distant sites within short time).
    3. Geofence violations (check-ins far from site coordinates).
    
    Data: ${JSON.stringify(attendanceData)}
    
    Return a JSON array of objects with { attendance_id, reason, severity }.
  `;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            attendance_id: { type: Type.INTEGER },
            reason: { type: Type.STRING },
            severity: { type: Type.STRING }
          },
          required: ["attendance_id", "reason", "severity"]
        }
      }
    }
  });

  return JSON.parse(response.text || "[]");
};

export const forecastLaborCosts = async (historicalCosts: any[], projectBudget: number) => {
  const model = "gemini-3-flash-preview";
  const prompt = `
    Based on the historical labor costs for this project, forecast the costs for the next 3 months.
    Project Budget: ${projectBudget}
    Historical Data: ${JSON.stringify(historicalCosts)}
    
    Return a JSON object with { forecast: [{ month, estimated_cost }], risk_level, suggestions }.
  `;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          forecast: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                month: { type: Type.STRING },
                estimated_cost: { type: Type.NUMBER }
              }
            }
          },
          risk_level: { type: Type.STRING },
          suggestions: { type: Type.ARRAY, items: { type: Type.STRING } }
        }
      }
    }
  });

  return JSON.parse(response.text || "{}");
};

export const predictOverrunRisks = async (projectData: any) => {
  const model = "gemini-3-flash-preview";
  const prompt = `
    Analyze the following project labor cost data and predict the risk of budget overrun.
    Project: ${projectData.name}
    Labor Budget: ${projectData.labor_budget}
    Actual Labor Cost to Date: ${projectData.actual_labor_cost}
    Completion Percentage: ${projectData.completion_percentage}%
    
    Data: ${JSON.stringify(projectData)}
    
    Return a JSON object with { risk_score (0-100), predicted_final_cost, warning_message, mitigation_steps }.
  `;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          risk_score: { type: Type.NUMBER },
          predicted_final_cost: { type: Type.NUMBER },
          warning_message: { type: Type.STRING },
          mitigation_steps: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["risk_score", "predicted_final_cost", "warning_message", "mitigation_steps"]
      }
    }
  });

  return JSON.parse(response.text || "{}");
};

export const analyzeBehavioralPatterns = async (employeeHistory: any[]) => {
  const model = "gemini-3-flash-preview";
  const prompt = `
    Analyze the following attendance history for a construction worker to detect behavioral fraud patterns.
    Look for:
    1. GPS Spoofing (suspiciously precise or impossible coordinates).
    2. Same device used by multiple workers (Buddy Punching).
    3. Repeated short-duration check-ins (gaming the system).
    4. Suspicious overtime patterns (unusually long shifts).
    5. Attendance outside working hours.
    
    Data: ${JSON.stringify(employeeHistory)}
    
    Return a JSON object with { fraud_probability (0-100), pattern_description, risk_factors: [], recommendation }.
  `;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          fraud_probability: { type: Type.NUMBER },
          pattern_description: { type: Type.STRING },
          risk_factors: { type: Type.ARRAY, items: { type: Type.STRING } },
          recommendation: { type: Type.STRING }
        },
        required: ["fraud_probability", "pattern_description", "risk_factors", "recommendation"]
      }
    }
  });

  return JSON.parse(response.text || "{}");
};

export const analyzeProductivity = async (productivityData: any[]) => {
  const model = "gemini-3-flash-preview";
  const prompt = `
    Analyze the following construction productivity data.
    Data includes work completed quantity vs labor hours used across different sites and categories.
    
    Data: ${JSON.stringify(productivityData)}
    
    Return a JSON object with:
    {
      performance_score: number (0-100),
      efficiency_trends: string,
      site_comparisons: [{ site_name, productivity_ratio, status }],
      optimization_actions: string[],
      inefficiency_alerts: string[]
    }
  `;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          performance_score: { type: Type.NUMBER },
          efficiency_trends: { type: Type.STRING },
          site_comparisons: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                site_name: { type: Type.STRING },
                productivity_ratio: { type: Type.NUMBER },
                status: { type: Type.STRING }
              }
            }
          },
          optimization_actions: { type: Type.ARRAY, items: { type: Type.STRING } },
          inefficiency_alerts: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["performance_score", "efficiency_trends", "site_comparisons", "optimization_actions", "inefficiency_alerts"]
      }
    }
  });

  return JSON.parse(response.text || "{}");
};

export const analyzeExecutiveDashboard = async (dashboardData: any) => {
  const model = "gemini-3-flash-preview";
  const prompt = `
    You are a CFO-level AI financial advisor for a construction company.
    Analyze the following executive dashboard data:
    ${JSON.stringify(dashboardData)}
    
    Tasks:
    1. Provide smart, high-level financial insights.
    2. Detect "profit leakage" (e.g., excessive OT, ghost workers, milestone delays).
    3. Predict margin risks for active projects.
    4. Recommend corrective actions for the executive team.
    
    Return a JSON object with:
    {
      insights: string[],
      leakageAlerts: { area: string, impact: string, description: string }[],
      marginRisk: { project: string, riskLevel: string, reason: string }[],
      correctiveActions: string[],
      financialHealthScore: number (0-100)
    }
  `;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          insights: { type: Type.ARRAY, items: { type: Type.STRING } },
          leakageAlerts: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                area: { type: Type.STRING },
                impact: { type: Type.STRING },
                description: { type: Type.STRING }
              }
            }
          },
          marginRisk: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                project: { type: Type.STRING },
                riskLevel: { type: Type.STRING },
                reason: { type: Type.STRING }
              }
            }
          },
          correctiveActions: { type: Type.ARRAY, items: { type: Type.STRING } },
          financialHealthScore: { type: Type.NUMBER }
        },
        required: ["insights", "leakageAlerts", "marginRisk", "correctiveActions", "financialHealthScore"]
      }
    }
  });
  return JSON.parse(response.text || "{}");
};

export const calculateAttendanceRisk = async (attendanceData: any) => {
  const model = "gemini-3-flash-preview";
  const prompt = `
    You are an Attendance Verification AI Agent.
    Calculate the risk score for this attendance entry.
    
    Weights:
    - Time anomaly (unusual pattern): 0.25
    - Device anomaly (ID mismatch, multiple users): 0.25
    - Location anomaly (GPS drift, cluster): 0.20
    - Selfie mismatch (biometric confidence): 0.20
    - QR misuse (reuse, expired): 0.10
    
    Data: ${JSON.stringify(attendanceData)}
    
    Return a JSON object:
    {
      "risk_score": number (0-100),
      "risk_level": "Low" | "Medium" | "High",
      "flag_reason": string,
      "biometric_confidence": number (0-100)
    }
  `;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          risk_score: { type: Type.NUMBER },
          risk_level: { type: Type.STRING },
          flag_reason: { type: Type.STRING },
          biometric_confidence: { type: Type.NUMBER }
        },
        required: ["risk_score", "risk_level", "flag_reason", "biometric_confidence"]
      }
    }
  });
  return JSON.parse(response.text || "{}");
};

export const generateAttendanceInsights = async (history: any[]) => {
  const model = "gemini-3-flash-preview";
  const prompt = `
    Analyze this attendance history and provide supervisor insights.
    Data: ${JSON.stringify(history)}
    
    Tasks:
    1. Detect daily attendance anomalies.
    2. Identify frequent suspicious employees.
    3. Rate site risk.
    4. Predict absenteeism probability.
    5. Summarize workforce punctuality trends.
    
    Return a JSON object with:
    {
      "dailyAnomalies": string[],
      "suspiciousEmployees": { name: string, reason: string }[],
      "siteRiskRating": string,
      "absenteeismPrediction": string,
      "summary": string
    }
  `;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          dailyAnomalies: { type: Type.ARRAY, items: { type: Type.STRING } },
          suspiciousEmployees: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                reason: { type: Type.STRING }
              }
            }
          },
          siteRiskRating: { type: Type.STRING },
          absenteeismPrediction: { type: Type.STRING },
          summary: { type: Type.STRING }
        },
        required: ["dailyAnomalies", "suspiciousEmployees", "siteRiskRating", "absenteeismPrediction", "summary"]
      }
    }
  });
  return JSON.parse(response.text || "{}");
};

export const analyzeContractPayment = async (contractData: any) => {
  const model = "gemini-3-flash-preview";
  const prompt = `
    Analyze this contract payment request. 
    Contract: ${JSON.stringify(contractData.contract)}
    Milestone: ${JSON.stringify(contractData.milestone)}
    Inspections: ${JSON.stringify(contractData.inspections)}
    
    Tasks:
    1. Validate milestone completion based on inspections.
    2. Detect abnormal cost spikes or deviations.
    3. Predict delay risk for future milestones.
    4. Recommend payment approval or hold.
    5. Calculate risk score (0-100).
    
    Return a JSON object with:
    {
      isValid: boolean,
      riskScore: number,
      detectedAnomalies: string[],
      delayRisk: string,
      recommendation: string,
      reasoning: string,
      suggestedPayment: number
    }
  `;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          isValid: { type: Type.BOOLEAN },
          riskScore: { type: Type.NUMBER },
          detectedAnomalies: { type: Type.ARRAY, items: { type: Type.STRING } },
          delayRisk: { type: Type.STRING },
          recommendation: { type: Type.STRING },
          reasoning: { type: Type.STRING },
          suggestedPayment: { type: Type.NUMBER }
        },
        required: ["isValid", "riskScore", "detectedAnomalies", "delayRisk", "recommendation", "reasoning", "suggestedPayment"]
      }
    }
  });
  return JSON.parse(response.text || "{}");
};

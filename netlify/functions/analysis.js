export async function handler(event) {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { payload, options } = JSON.parse(event.body);
    
    // For now, return a mock response
    // In production, this would process the concept note and generate analysis
    const mockAnalysis = `
# Concept Note Analysis

## Project Overview
**Title:** ${payload.title}
**Organization:** ${payload.organization}
**Region:** ${payload.countryRegion}
**Budget:** ${payload.budget}
**Duration:** ${payload.duration}
**Sector:** ${payload.sector}

## Problem Statement
${payload.problemStatement}

## Objectives
${payload.objectives}

## Implementation Plan
**Beneficiaries:** ${payload.beneficiaries}
**Activities:** ${payload.activities}
**Expected Results:** ${payload.expected}

## Risk Management
**Risks:** ${payload.risks}
**Mitigations:** ${payload.mitigations}

---
*Analysis generated automatically. Review and refine as needed.*
    `.trim();

    // Encode the analysis for URL
    const encodedAnalysis = encodeURIComponent(mockAnalysis);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        status: 'ok',
        analysisUrl: `/results?text=${encodedAnalysis}`
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
}
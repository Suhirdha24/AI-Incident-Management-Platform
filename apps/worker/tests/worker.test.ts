import { analyzeIncidentContext, generateAIPostmortemContent } from '../src/services/ai/aiService';

describe('Worker AI Engine Fallback & Validation Tests', () => {
  test('analyzeIncidentContext produces valid IncidentAnalysis schema output', async () => {
    const analysis = await analyzeIncidentContext({
      incidentId: 'INC-2026-TEST',
      title: 'Payment API DB connection saturation',
      description: 'Database connection pool reached capacity',
      serviceName: 'Payment API',
      serviceKey: 'payment-api',
      severity: 'SEV-1',
      alerts: [
        { alertId: 'ALERT-001', metric: 'DB Connections', value: 96, threshold: 80 }
      ],
      recentDeployments: [
        { version: 'v2.8.4', deployedAt: new Date().toISOString(), changes: 'Updated pool settings' }
      ],
      metricsSummary: { maxErrorRate: 18.7, p99Latency: 1650, maxDbConnections: 96 }
    });

    expect(analysis).toBeDefined();
    expect(analysis.probableCause).toContain('Database connection pool');
    expect(analysis.confidence).toBeGreaterThan(0.5);
    expect(Array.isArray(analysis.confirmedEvidence)).toBe(true);
    expect(Array.isArray(analysis.hypotheses)).toBe(true);
    expect(Array.isArray(analysis.recommendedInvestigation)).toBe(true);
    expect(Array.isArray(analysis.recommendedMitigation)).toBe(true);
  });

  test('generateAIPostmortemContent produces structured Postmortem content', async () => {
    const postmortem = await generateAIPostmortemContent({
      incidentId: 'INC-2026-TEST',
      title: 'Payment API DB connection saturation',
      serviceName: 'Payment API',
      durationMinutes: 42,
      rootCause: 'Database connection pool limit exceeded',
      resolutionSummary: 'Increased connection pool limit from 50 to 100'
    });

    expect(postmortem).toBeDefined();
    expect(postmortem.title).toContain('Payment API');
    expect(postmortem.rootCauseAnalysis).toBeDefined();
    expect(Array.isArray(postmortem.timelineSummary)).toBe(true);
    expect(Array.isArray(postmortem.correctiveActions)).toBe(true);
  });
});

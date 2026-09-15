import { IncidentSeverity, AlertSeverity } from '@opsai/shared';

export function calculateIncidentSeverity(
  serviceKey: string,
  metric: string,
  value: number,
  threshold: number,
  alertSeverity: AlertSeverity
): IncidentSeverity {
  // SEV-1: Critical service with error rate > 20% or latency > 2000ms or database connections > 90%
  const isCriticalService = ['payment-api', 'auth-service', 'database'].includes(serviceKey);

  if (isCriticalService) {
    if (metric.toLowerCase().includes('error') && value > 20) return IncidentSeverity.SEV_1;
    if (metric.toLowerCase().includes('connection') && value > 90) return IncidentSeverity.SEV_1;
    if (alertSeverity === AlertSeverity.CRITICAL) return IncidentSeverity.SEV_1;
  }

  if (value >= threshold * 2 || alertSeverity === AlertSeverity.HIGH) {
    return IncidentSeverity.SEV_2;
  }

  if (value > threshold || alertSeverity === AlertSeverity.MEDIUM) {
    return IncidentSeverity.SEV_3;
  }

  return IncidentSeverity.SEV_4;
}

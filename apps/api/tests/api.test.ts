import { validateStateTransition, transitionIncidentState, StateMachineError } from '../src/services/stateMachine';
import { calculateIncidentSeverity } from '../src/services/severityEngine';
import { IncidentStatus, IncidentSeverity, AlertSeverity } from '@opsai/shared';

describe('OpsAI Core Engine Unit Tests', () => {
  describe('Incident State Machine', () => {
    it('allows valid sequential state transitions', () => {
      expect(validateStateTransition(IncidentStatus.DETECTED, IncidentStatus.ACKNOWLEDGED)).toBe(true);
      expect(validateStateTransition(IncidentStatus.ACKNOWLEDGED, IncidentStatus.INVESTIGATING)).toBe(true);
      expect(validateStateTransition(IncidentStatus.INVESTIGATING, IncidentStatus.MITIGATING)).toBe(true);
      expect(validateStateTransition(IncidentStatus.MITIGATING, IncidentStatus.RESOLVED)).toBe(true);
      expect(validateStateTransition(IncidentStatus.RESOLVED, IncidentStatus.CLOSED)).toBe(true);
    });

    it('rejects invalid state skips or backwards transitions', () => {
      expect(validateStateTransition(IncidentStatus.CLOSED, IncidentStatus.INVESTIGATING)).toBe(false);
      expect(validateStateTransition(IncidentStatus.DETECTED, IncidentStatus.RESOLVED)).toBe(false);
    });

    it('throws StateMachineError on illegal transition', () => {
      expect(() => {
        transitionIncidentState(IncidentStatus.CLOSED, IncidentStatus.INVESTIGATING);
      }).toThrow(StateMachineError);
    });
  });

  describe('Deterministic Severity Engine', () => {
    it('calculates SEV-1 for critical service with DB connection surge', () => {
      const sev = calculateIncidentSeverity(
        'payment-api',
        'DB Active Connections',
        96,
        80,
        AlertSeverity.CRITICAL
      );
      expect(sev).toBe(IncidentSeverity.SEV_1);
    });

    it('calculates SEV-2 for high metric breach', () => {
      const sev = calculateIncidentSeverity(
        'order-service',
        'Latency',
        1200,
        500,
        AlertSeverity.HIGH
      );
      expect(sev).toBe(IncidentSeverity.SEV_2);
    });
  });
});

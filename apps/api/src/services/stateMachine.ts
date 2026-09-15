import { IncidentStatus, VALID_STATUS_TRANSITIONS } from '@opsai/shared';

export class StateMachineError extends Error {
  constructor(public currentStatus: IncidentStatus, public targetStatus: IncidentStatus) {
    super(`Invalid state transition from ${currentStatus} to ${targetStatus}`);
    this.name = 'StateMachineError';
  }
}

export function validateStateTransition(currentStatus: IncidentStatus, targetStatus: IncidentStatus): boolean {
  if (currentStatus === targetStatus) return true;
  const allowed = VALID_STATUS_TRANSITIONS[currentStatus] || [];
  return allowed.includes(targetStatus);
}

export function transitionIncidentState(currentStatus: IncidentStatus, targetStatus: IncidentStatus): IncidentStatus {
  if (!validateStateTransition(currentStatus, targetStatus)) {
    throw new StateMachineError(currentStatus, targetStatus);
  }
  return targetStatus;
}

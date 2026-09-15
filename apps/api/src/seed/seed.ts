import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { config } from '../config';
import { User } from '../models/User';
import { Service } from '../models/Service';
import { Alert } from '../models/Alert';
import { Incident } from '../models/Incident';
import { IncidentEvent } from '../models/IncidentEvent';
import { IncidentComment } from '../models/IncidentComment';
import { Deployment } from '../models/Deployment';
import { Metric } from '../models/Metric';
import { AuditLog } from '../models/AuditLog';
import { Postmortem } from '../models/Postmortem';
import { Notification } from '../models/Notification';
import { UserRole, IncidentSeverity, IncidentStatus, AlertSeverity, AlertStatus, ServiceStatus, PostmortemStatus, AuditAction } from '@opsai/shared';

async function seed() {
  console.log('Connecting to MongoDB for seeding...');
  await mongoose.connect(config.mongoUri);

  console.log('Clearing existing database collections...');
  await Promise.all([
    User.deleteMany({}),
    Service.deleteMany({}),
    Alert.deleteMany({}),
    Incident.deleteMany({}),
    IncidentEvent.deleteMany({}),
    IncidentComment.deleteMany({}),
    Deployment.deleteMany({}),
    Metric.deleteMany({}),
    AuditLog.deleteMany({}),
    Postmortem.deleteMany({}),
    Notification.deleteMany({})
  ]);

  console.log('Creating users...');
  const passwordHash = await bcrypt.hash('password123', 10);

  const engineer = await User.create({
    name: 'Vishal (Engineer)',
    email: 'engineer@opsai.com',
    passwordHash,
    role: UserRole.ENGINEER,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    status: 'ACTIVE'
  });

  const manager = await User.create({
    name: 'Joshua (Incident Manager)',
    email: 'manager@opsai.com',
    passwordHash,
    role: UserRole.INCIDENT_MANAGER,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
    status: 'ACTIVE'
  });

  const admin = await User.create({
    name: 'Elena (Admin)',
    email: 'admin@opsai.com',
    passwordHash,
    role: UserRole.ADMIN,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80',
    status: 'ACTIVE'
  });

  console.log('Creating services...');
  const paymentService = await Service.create({
    name: 'Payment API',
    key: 'payment-api',
    description: 'Handles credit card processing, checkout flows, and gateway webhooks.',
    status: ServiceStatus.CRITICAL,
    environment: 'Production',
    ownerTeam: 'Payments Core',
    repository: 'github.com/opsai/payment-api',
    techStack: 'Node.js, Express, Redis, PostgreSQL',
    openIncidentsCount: 1
  });

  const authService = await Service.create({
    name: 'Auth Service',
    key: 'auth-service',
    description: 'Manages user identity, JWT tokens, OAuth, and RBAC authorization.',
    status: ServiceStatus.HEALTHY,
    environment: 'Production',
    ownerTeam: 'Identity & Security',
    repository: 'github.com/opsai/auth-service',
    techStack: 'Go, Redis, MongoDB',
    openIncidentsCount: 0
  });

  const orderService = await Service.create({
    name: 'Order Service',
    key: 'order-service',
    description: 'Processes ecommerce cart checkouts, fulfillment routing, and order state.',
    status: ServiceStatus.HEALTHY,
    environment: 'Production',
    ownerTeam: 'Fulfillment & Logistics',
    repository: 'github.com/opsai/order-service',
    techStack: 'Java, Spring Boot, Kafka',
    openIncidentsCount: 0
  });

  const databaseService = await Service.create({
    name: 'Customer Database',
    key: 'database',
    description: 'Primary PostgreSQL cluster hosting transactional user and order records.',
    status: ServiceStatus.DEGRADED,
    environment: 'Production',
    ownerTeam: 'Data Reliability Engineering',
    repository: 'infra/postgres-cluster-prod',
    techStack: 'PostgreSQL 15, PgBouncer',
    openIncidentsCount: 1
  });

  const notificationService = await Service.create({
    name: 'Notification Service',
    key: 'notification-service',
    description: 'Delivers customer transactional emails, SMS alerts, and web push.',
    status: ServiceStatus.HEALTHY,
    environment: 'Production',
    ownerTeam: 'Communications',
    repository: 'github.com/opsai/notification-service',
    techStack: 'Python, FastAPI, RabbitMQ',
    openIncidentsCount: 0
  });

  console.log('Creating deployments...');
  const paymentDeployment = await Deployment.create({
    serviceId: paymentService._id,
    serviceKey: paymentService.key,
    version: 'v2.8.4',
    environment: 'Production',
    deployedAt: new Date(Date.now() - 32 * 60 * 1000), // 32 mins ago
    deployedBy: 'ci-cd-bot@opsai.com',
    commitHash: 'a7b9f12c',
    changes: 'Updated DB pool manager and updated checkout transaction logging.'
  });

  console.log('Creating metric points...');
  const now = Date.now();
  for (let i = 60; i >= 0; i--) {
    const time = new Date(now - i * 60 * 1000);
    // Spike around 32 mins ago
    const isAnomalous = i <= 35 && i >= 10;
    await Metric.create({
      serviceId: paymentService._id,
      timestamp: time,
      errorRate: isAnomalous ? 18.7 + Math.random() * 4 : 0.8 + Math.random() * 0.5,
      latencyMs: isAnomalous ? 1450 + Math.random() * 300 : 120 + Math.random() * 30,
      cpuPercent: isAnomalous ? 78 + Math.random() * 10 : 35 + Math.random() * 5,
      memoryPercent: isAnomalous ? 84 + Math.random() * 5 : 45 + Math.random() * 3,
      dbConnectionsPercent: isAnomalous ? 96 + Math.random() * 3 : 42 + Math.random() * 4
    });
  }

  console.log('Creating demo incident INC-2026-0192...');
  const demoIncident = await Incident.create({
    incidentId: 'INC-2026-0192',
    title: 'Payment API experiencing elevated error rates',
    description: 'Automated detection triggered by Datadog webhook. Payment API HTTP 500 error rate surged to 18.7% with latency spiking to 1650ms. Payment transactions failing for checkout requests.',
    serviceId: paymentService._id,
    environment: 'Production',
    severity: IncidentSeverity.SEV_1,
    status: IncidentStatus.INVESTIGATING,
    assignedEngineerId: engineer._id,
    correlatedAlertIds: ['ALERT-1001', 'ALERT-1002', 'ALERT-1003', 'ALERT-1004'],
    recentDeploymentId: paymentDeployment._id,
    analysisStatus: 'COMPLETED',
    analysis: {
      probableCause: 'Database connection pool exhaustion',
      confidence: 0.87,
      confirmedEvidence: [
        'Database connection utilization reached 96%',
        'Payment API HTTP 500 error rate increased to 18.7%',
        'Database query response latency spiked by 450%',
        'Similar connection pool incident INC-2026-0071 occurred previously'
      ],
      hypotheses: [
        'Database connection pool exhaustion is the primary cause of checkout query timeouts.',
        'Deployment v2.8.4 introduced connection leak or reduced max pool size configuration.'
      ],
      potentialImpact: 'Estimated 12,483 payment checkout requests affected causing transactional degradation.',
      recommendedInvestigation: [
        'Inspect PgBouncer database connection utilization metrics',
        'Review recent deployment v2.8.4 config changes to connection pool limits',
        'Check PostgreSQL slow query logs for unindexed locks',
        'Review connection pool configuration parameter (default: 50)'
      ],
      recommendedMitigation: [
        'Increase PgBouncer connection pool limit from 50 to 100',
        'Restart payment-api pods to clear stale connection leaks',
        'Rollback deployment v2.8.4 if pool expansion fails to stabilize error rates'
      ]
    },
    createdAt: new Date(Date.now() - 32 * 60 * 1000)
  });

  console.log('Creating correlated alerts...');
  const alert1 = await Alert.create({
    alertId: 'ALERT-1001',
    serviceId: paymentService._id,
    serviceKey: paymentService.key,
    metric: 'HTTP Error Rate',
    value: 18.7,
    threshold: 5.0,
    severity: AlertSeverity.CRITICAL,
    status: AlertStatus.TRIGGERED,
    incidentId: demoIncident._id,
    source: 'Datadog',
    environment: 'Production',
    timestamp: new Date(Date.now() - 31 * 60 * 1000)
  });

  const alert2 = await Alert.create({
    alertId: 'ALERT-1002',
    serviceId: paymentService._id,
    serviceKey: paymentService.key,
    metric: 'p99 API Latency',
    value: 1650,
    threshold: 500,
    severity: AlertSeverity.HIGH,
    status: AlertStatus.TRIGGERED,
    incidentId: demoIncident._id,
    source: 'Datadog',
    environment: 'Production',
    timestamp: new Date(Date.now() - 30 * 60 * 1000)
  });

  const alert3 = await Alert.create({
    alertId: 'ALERT-1003',
    serviceId: databaseService._id,
    serviceKey: databaseService.key,
    metric: 'DB Active Connections',
    value: 96,
    threshold: 80,
    severity: AlertSeverity.CRITICAL,
    status: AlertStatus.TRIGGERED,
    incidentId: demoIncident._id,
    source: 'Prometheus',
    environment: 'Production',
    timestamp: new Date(Date.now() - 29 * 60 * 1000)
  });

  const alert4 = await Alert.create({
    alertId: 'ALERT-1004',
    serviceId: paymentService._id,
    serviceKey: paymentService.key,
    metric: 'Failed Checkouts/min',
    value: 340,
    threshold: 50,
    severity: AlertSeverity.CRITICAL,
    status: AlertStatus.TRIGGERED,
    incidentId: demoIncident._id,
    source: 'PagerDuty',
    environment: 'Production',
    timestamp: new Date(Date.now() - 28 * 60 * 1000)
  });

  console.log('Creating incident timeline events...');
  await IncidentEvent.create({
    incidentId: demoIncident._id,
    eventType: 'DEPLOYMENT_COMPLETED',
    title: 'Deployment v2.8.4 Completed',
    description: 'payment-api v2.8.4 deployed by ci-cd-bot.',
    timestamp: new Date(Date.now() - 34 * 60 * 1000)
  });

  await IncidentEvent.create({
    incidentId: demoIncident._id,
    eventType: 'METRIC_ANOMALY',
    title: 'Error Rate Spike Detected',
    description: 'Payment API error rate breached 5% threshold, reaching 18.7%.',
    timestamp: new Date(Date.now() - 32 * 60 * 1000)
  });

  await IncidentEvent.create({
    incidentId: demoIncident._id,
    eventType: 'ALERT_CORRELATED',
    title: '4 Alerts Correlated',
    description: 'Alerts ALERT-1001, 1002, 1003, 1004 correlated into SEV-1 incident INC-2026-0192.',
    timestamp: new Date(Date.now() - 31 * 60 * 1000)
  });

  await IncidentEvent.create({
    incidentId: demoIncident._id,
    eventType: 'AI_ANALYSIS_COMPLETED',
    title: 'AI Analysis Completed',
    description: 'OpsAI Investigation Engine completed analysis. Cause: DB connection pool exhaustion (87% confidence).',
    timestamp: new Date(Date.now() - 29 * 60 * 1000)
  });

  await IncidentEvent.create({
    incidentId: demoIncident._id,
    eventType: 'ENGINEER_ASSIGNED',
    title: 'Engineer Assigned',
    description: 'Vishal (Engineer) assigned to lead incident investigation.',
    createdBy: manager._id,
    timestamp: new Date(Date.now() - 25 * 60 * 1000)
  });

  console.log('Creating incident investigation comments...');
  await IncidentComment.create({
    incidentId: demoIncident._id,
    userId: engineer._id,
    text: 'I checked PgBouncer metrics. Connection pool utilization reached 96% right after deployment v2.8.4 went live.',
    isNote: false,
    createdAt: new Date(Date.now() - 20 * 60 * 1000)
  });

  await IncidentComment.create({
    incidentId: demoIncident._id,
    userId: manager._id,
    text: 'Check whether the latest deployment v2.8.4 modified max DB connection pool settings or introduced unindexed queries.',
    isNote: true,
    createdAt: new Date(Date.now() - 15 * 60 * 1000)
  });

  console.log('Creating historical incidents & postmortems...');
  const pastIncident1 = await Incident.create({
    incidentId: 'INC-2026-0071',
    title: 'Database connection pool depletion under peak traffic',
    description: 'PgBouncer connection limits were exceeded during flash sale traffic.',
    serviceId: paymentService._id,
    environment: 'Production',
    severity: IncidentSeverity.SEV_2,
    status: IncidentStatus.RESOLVED,
    assignedEngineerId: engineer._id,
    resolvedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    durationMinutes: 45,
    impactSummary: '4,200 requests delayed',
    resolution: {
      rootCause: 'Database connection pool exhaustion',
      resolutionSummary: 'Connection pool limit increased from 50 to 100 connections.',
      actionsTaken: 'Updated PgBouncer config and restarted checkout pods.',
      impact: '4,200 requests affected.',
      resolvedBy: engineer._id,
      resolvedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
    },
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000 - 45 * 60 * 1000)
  });

  await Postmortem.create({
    incidentId: pastIncident1._id,
    title: 'Postmortem: INC-2026-0071 Database connection pool depletion',
    authorId: manager._id,
    status: PostmortemStatus.PUBLISHED,
    aiGenerated: true,
    content: {
      title: 'Postmortem: INC-2026-0071 Database connection pool depletion',
      incidentOverview: 'Connection limits were exceeded during peak traffic causing API latency.',
      impactSummary: '4,200 checkout requests delayed over 45 minutes.',
      timelineSummary: ['10:00 Latency alert', '10:15 Pool scaled', '10:45 Metrics normalized'],
      rootCauseAnalysis: 'Connection pool default limit of 50 was inadequate for concurrent checkout surges.',
      contributingFactors: ['Static connection pool sizing', 'High peak traffic'],
      detectionDetails: 'Alertmanager triggered high latency alert.',
      resolutionDetails: 'Increased connection pool limit to 100.',
      correctiveActions: ['Set pool max limits dynamically'],
      preventiveActions: ['Add automated pool saturation alerting']
    }
  });

  // Additional 8 historical incidents for analytics
  const statuses = [IncidentStatus.RESOLVED, IncidentStatus.CLOSED];
  const severities = [IncidentSeverity.SEV_2, IncidentSeverity.SEV_3, IncidentSeverity.SEV_4];
  const servicesList = [authService, orderService, databaseService, notificationService];

  for (let k = 1; k <= 8; k++) {
    const s = servicesList[k % servicesList.length];
    const sev = severities[k % severities.length];
    const st = statuses[k % statuses.length];
    const pastTime = new Date(Date.now() - (k * 2 + 1) * 24 * 60 * 60 * 1000);

    await Incident.create({
      incidentId: `INC-2026-010${k}`,
      title: `${s.name} ${sev} latency deviation`,
      description: `Automated detection triggered by elevated latency metric on ${s.name}.`,
      serviceId: s._id,
      environment: 'Production',
      severity: sev,
      status: st,
      assignedEngineerId: engineer._id,
      resolvedAt: new Date(pastTime.getTime() + 30 * 60 * 1000),
      durationMinutes: 30 + (k * 5),
      impactSummary: `${1000 * k} users affected`,
      resolution: {
        rootCause: 'Cache cache-miss surge following deployment',
        resolutionSummary: 'Warmed Redis cache cluster and restarted worker instances.',
        actionsTaken: 'Ran cache pre-warm script.',
        impact: `${1000 * k} users affected`,
        resolvedBy: engineer._id,
        resolvedAt: new Date(pastTime.getTime() + 30 * 60 * 1000)
      },
      createdAt: pastTime
    });
  }

  console.log('Creating initial audit logs...');
  await AuditLog.create({
    timestamp: new Date(Date.now() - 35 * 60 * 1000),
    action: AuditAction.INCIDENT_CREATED,
    resourceType: 'Incident',
    resourceId: 'INC-2026-0192',
    userName: 'Datadog System Webhook',
    metadata: { title: demoIncident.title, severity: demoIncident.severity }
  });

  await AuditLog.create({
    timestamp: new Date(Date.now() - 29 * 60 * 1000),
    action: AuditAction.AI_ANALYSIS_COMPLETED,
    resourceType: 'Incident',
    resourceId: 'INC-2026-0192',
    userName: 'OpsAI Worker Engine',
    metadata: { confidence: 0.87, probableCause: 'Database connection pool exhaustion' }
  });

  await AuditLog.create({
    timestamp: new Date(Date.now() - 25 * 60 * 1000),
    action: AuditAction.INCIDENT_ASSIGNED,
    resourceType: 'Incident',
    resourceId: 'INC-2026-0192',
    userId: manager._id,
    userName: manager.name,
    metadata: { assignedEngineer: engineer.name }
  });

  console.log('Creating notifications...');
  await Notification.create({
    userId: engineer._id,
    title: 'Critical Incident Assigned',
    message: 'You have been assigned to SEV-1 incident INC-2026-0192 (Payment API).',
    type: 'CRITICAL',
    read: false,
    link: `/incidents/${demoIncident._id}`
  });

  await Notification.create({
    userId: manager._id,
    title: 'AI Analysis Complete',
    message: 'AI investigation complete for INC-2026-0192 with 87% confidence.',
    type: 'INFO',
    read: true,
    link: `/incidents/${demoIncident._id}`
  });

  console.log('Database seeding complete successfully!');
  await mongoose.disconnect();
}

seed().catch(err => {
  console.error('Seeding failed:', err);
  process.exit(1);
});

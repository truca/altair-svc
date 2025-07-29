# Análisis y Mejoras del Esquema para MongoDB

## Resumen Ejecutivo

El esquema actual está bien estructurado pero puede optimizarse significativamente para aprovechar las ventajas de MongoDB y mejorar el rendimiento para los casos de uso específicos del sistema Alumbra.

## Problemas Identificados

### 1. **Desnormalización Insuficiente**

- **Problema**: Muchas relaciones mantienen un enfoque relacional con IDs separados
- **Impacto**: Múltiples consultas para obtener datos relacionados, latencia alta

### 2. **Falta de Campos Calculados**

- **Problema**: No hay campos pre-calculados para métricas frecuentes
- **Impacto**: Cálculos repetitivos en tiempo real para dashboards

### 3. **Estructuras de Datos No Optimizadas**

- **Problema**: Algunos tipos embebidos podrían ser más eficientes
- **Impacto**: Consultas complejas y índices subóptimos

### 4. **Falta de Índices Estratégicos**

- **Problema**: No hay indicaciones de índices compuestos necesarios
- **Impacto**: Consultas lentas en operaciones críticas

### 5. **Problemas Específicos del Esquema Actual**

- **Profile duplicado**: Hay dos definiciones de `type Profile` (líneas 192 y 393)
- **Falta de geolocalización**: No hay campos para ubicación geográfica en respuestas
- **Sin versionado**: Las encuestas no tienen versionado para cambios históricos
- **Falta conexión Plan-Survey**: No está clara la relación entre planes y encuestas disponibles

## Mejoras Inmediatas (Sin Cambios de Arquitectura)

### 1. **Corregir Profile Duplicado**

```graphql
# Eliminar la primera definición y mejorar la segunda
type Profile
  @model
  @auth(
    create: ["public"]
    read: ["owner", "collaborator", "role:admin"]
    update: ["owner", "role:admin"]
    delete: ["role:admin", "role:super_admin"]
  ) {
  id: ID!
  email: String!
  password: String! @hidden(value: true) # ✨ Ocultar en formularios
  name: String!
  role: UserRole!

  # Jerarquía organizacional completa
  organizationId: ID!
  organization: Organization
  locationId: ID
  location: Location
  courseId: ID
  course: Course

  # ✨ NUEVO: Campos de contacto
  phone: String
  emergencyContact: String

  # ✨ NUEVO: Preferencias de usuario
  preferences: UserPreferences

  # Datos específicos por rol (mejorados)
  studentData: StudentData
  parentData: ParentData
  teacherData: TeacherData
  administrativeData: AdministrativeData

  # Configuración de notificaciones
  notifications: NotificationSettings

  # ✨ NUEVO: Metadatos de sesión
  lastLoginAt: DateTime
  lastActiveAt: DateTime
  deviceIds: [String!] # Para notificaciones push
  isActive: Boolean! @default(value: true)
  createdAt: DateTime!
  updatedAt: DateTime
}

type UserPreferences {
  language: String! @default(value: "es")
  timezone: String! @default(value: "America/Santiago")
  theme: String! @default(value: "light")
  dashboardLayout: String
  notificationFrequency: String! @default(value: "real_time")
}
```

### 2. **Mejorar Survey con Versionado y Planes**

```graphql
type Survey
  @model
  @auth(
    create: ["role:admin", "role:super_admin"]
    read: ["public"]
    update: ["role:admin", "role:super_admin"]
    delete: ["role:super_admin"]
  ) {
  id: ID!
  name: String!
  description: String

  # ✨ NUEVO: Versionado
  version: String! @default(value: "1.0")
  previousVersionId: ID

  # Configuración de aplicación
  frequency: SurveyFrequency!
  weight: Float! @default(value: 1.0)

  # ✨ NUEVO: Restricciones por plan
  requiredPlanTypes: [PlanType!] @default(value: [BASIC])

  # ✨ NUEVO: Configuración de ventana temporal
  timeWindow: SurveyTimeWindow

  # Condiciones mejoradas
  conditions: [SurveyCondition!]

  # ✨ NUEVO: Metadatos de configuración
  configuration: SurveyConfiguration

  isActive: Boolean! @default(value: true)
  createdAt: DateTime!
  updatedAt: DateTime
}

type SurveyTimeWindow {
  startTime: String # "08:00"
  endTime: String # "18:00"
  allowWeekends: Boolean! @default(value: true)
  allowHolidays: Boolean! @default(value: false)
  reminderTimes: [String!] # ["09:00", "15:00"]
}

type SurveyConfiguration {
  maxAttempts: Int! @default(value: 1)
  timeoutMinutes: Int! @default(value: 30)
  randomizeQuestions: Boolean! @default(value: false)
  showProgress: Boolean! @default(value: true)
  allowSkip: Boolean! @default(value: false)
}
```

### 3. **Enriquecer SurveyResponse con Contexto**

```graphql
type SurveyResponse
  @model
  @auth(
    create: ["public"]
    read: ["owner", "collaborator", "role:admin"]
    update: ["owner", "role:admin"]
    delete: ["role:admin"]
  ) {
  id: ID!
  studentId: ID!
  student: Profile
  surveyId: ID!
  survey: Survey

  # ✨ NUEVO: Versionado de encuesta
  surveyVersion: String!

  questionResponses: [QuestionResponse!]

  # Metadatos enriquecidos
  completedAt: DateTime!
  startedAt: DateTime! # ✨ NUEVO
  responseTime: Int # segundos
  # ✨ NUEVO: Contexto geográfico y temporal
  contextData: ResponseContext

  deviceInfo: DeviceInfo
  createdAt: DateTime!
  updatedAt: DateTime
}

type ResponseContext {
  # Contexto temporal
  timeOfDay: String! # "morning", "afternoon", "evening", "night"
  dayOfWeek: String!
  isWeekend: Boolean!
  isHoliday: Boolean!

  # Contexto geográfico (si está disponible)
  location: GeolocationData

  # Contexto académico
  daysSinceLastResponse: Int
  consecutiveResponseDays: Int
  weekOfAcademicYear: Int
}

type GeolocationData {
  latitude: Float
  longitude: Float
  accuracy: Float
  city: String
  country: String
  timestamp: DateTime
}
```

### 4. **Mejorar Alert con Workflow**

```graphql
type Alert
  @model
  @auth(
    create: ["public"]
    read: ["owner", "collaborator", "role:admin"]
    update: ["role:admin"]
    delete: ["role:admin"]
  ) {
  id: ID!
  studentId: ID!
  student: Profile
  organizationId: ID!
  organization: Organization

  # Clasificación mejorada
  type: AlertType! # ✨ Usar enum en lugar de String
  severity: RiskLevel!
  priority: AlertPriority! # ✨ NUEVO
  title: String!
  description: String!

  # ✨ NUEVO: Workflow de procesamiento
  workflow: AlertWorkflow!

  metadata: AlertMetadata
  status: AlertStatus! @default(value: ACTIVE)

  # Asignación y seguimiento
  assignedTo: ID
  assignedToUser: Profile
  assignedAt: DateTime

  acknowledgedBy: ID
  acknowledgedByUser: Profile
  acknowledgedAt: DateTime
  resolvedAt: DateTime

  # ✨ NUEVO: Escalamiento automático
  escalationRules: AlertEscalationRules
  escalatedAt: DateTime
  escalatedTo: ID

  notificationsSent: NotificationStatus

  createdAt: DateTime!
  updatedAt: DateTime
}

enum AlertType {
  RISK_DETECTED
  SURVEY_MISSED
  HELP_REQUESTED
  PATTERN_ANOMALY
  CONSECUTIVE_ABSENCE
  DECLINING_TREND
}

enum AlertPriority {
  LOW
  NORMAL
  HIGH
  URGENT
  CRITICAL
}

type AlertWorkflow {
  currentStep: String!
  steps: [WorkflowStep!]
  autoAssignmentEnabled: Boolean! @default(value: true)
  escalationEnabled: Boolean! @default(value: true)
}

type WorkflowStep {
  name: String!
  status: String! # "pending", "active", "completed", "skipped"
  assignedTo: ID
  completedAt: DateTime
  notes: String
}

type AlertEscalationRules {
  timeToEscalate: Int! # minutos
  escalateTo: [ID!] # IDs de usuarios
  escalationMessage: String
}
```

### 5. **Agregar Índices de Consulta Frecuente**

```graphql
# Agregar directivas para optimización de consultas
type Profile @model @index(fields: ["organizationId", "role", "isActive"]) {
  # ... campos existentes
}

type SurveyResponse @model
  @index(fields: ["studentId", "createdAt"])
  @index(fields: ["organizationId", "completedAt"])
  @index(fields: ["surveyId", "completedAt"]) {
  # ... campos existentes
}

type Alert @model
  @index(fields: ["organizationId", "status", "severity", "createdAt"])
  @index(fields: ["studentId", "status", "createdAt"])
  @index(fields: ["assignedTo", "status"]) {
  # ... campos existentes
}

type RiskAssessment @model
  @index(fields: ["studentId", "assessmentDate"])
  @index(fields: ["organizationId", "assessmentDate", "overallRiskLevel"]) {
  # ... campos existentes
}
```

### 6. **Agregar Tipos Faltantes**

```graphql
# ✨ NUEVO: Conexión explícita Plan-Survey
type PlanSurveyAccess
  @model
  @auth(
    create: ["role:super_admin"]
    read: ["role:admin"]
    update: ["role:super_admin"]
    delete: ["role:super_admin"]
  ) {
  id: ID!
  planType: PlanType!
  surveyId: ID!
  survey: Survey
  isIncluded: Boolean!
  maxResponsesPerMonth: Int
  createdAt: DateTime!
}

# ✨ NUEVO: Para el sistema de indicadores mencionado
type StudentRelationship
  @model
  @auth(
    create: ["public"]
    read: ["owner", "collaborator", "role:admin"]
    update: ["owner", "role:admin"]
    delete: ["role:admin"]
  ) {
  id: ID!
  studentId: ID!
  student: Profile
  relatedStudentId: ID
  relatedStudent: Profile
  relatedTeacherId: ID
  relatedTeacher: Profile

  relationshipType: RelationshipType!
  intensity: RelationshipIntensity!
  isPositive: Boolean!

  # Contexto de la relación
  context: String # "classroom", "playground", "sports", etc.
  reportedBy: ID!
  reportedByUser: Profile

  # Validación y seguimiento
  isVerified: Boolean! @default(value: false)
  verifiedBy: ID
  verifiedAt: DateTime

  isActive: Boolean! @default(value: true)
  createdAt: DateTime!
  updatedAt: DateTime
}

enum RelationshipType {
  FRIEND
  CLOSE_FRIEND
  BULLY
  VICTIM
  MENTOR
  RIVAL
  NEUTRAL
}

enum RelationshipIntensity {
  LOW
  MEDIUM
  HIGH
  VERY_HIGH
}

# ✨ NUEVO: Configuración de organización mejorada
type OrganizationSettings {
  riskThresholds: RiskThresholds
  checkInWindow: CheckInWindow
  alertProcessingTime: String # "05:00"
  notificationSettings: NotificationSettings

  # ✨ NUEVO: Configuraciones adicionales
  academicYear: AcademicYearSettings
  workflowSettings: WorkflowSettings
  privacySettings: PrivacySettings
}

type AcademicYearSettings {
  startDate: DateTime!
  endDate: DateTime!
  holidays: [HolidayPeriod!]
  termDates: [TermPeriod!]
}

type HolidayPeriod {
  name: String!
  startDate: DateTime!
  endDate: DateTime!
}

type TermPeriod {
  name: String!
  startDate: DateTime!
  endDate: DateTime!
  isActive: Boolean!
}

type WorkflowSettings {
  autoAssignAlerts: Boolean! @default(value: true)
  defaultEscalationTime: Int! @default(value: 60) # minutos
  requireApprovalForCritical: Boolean! @default(value: true)
  maxAlertsPerUser: Int! @default(value: 20)
}

type PrivacySettings {
  dataRetentionMonths: Int! @default(value: 24)
  anonymizeAfterMonths: Int! @default(value: 36)
  allowDataExport: Boolean! @default(value: true)
  requireParentConsent: Boolean! @default(value: true)
  shareDataWithTeachers: Boolean! @default(value: true)
}
```

## Mejoras Propuestas

### 1. **Desnormalización Estratégica**

#### Profile (Optimizado para MongoDB)

```graphql
type Profile @model {
  id: ID!
  email: String!
  name: String!
  role: UserRole!

  # Desnormalización de organización
  organizationId: ID!
  organizationName: String! # ✨ NUEVO
  organizationType: OrganizationType! # ✨ NUEVO
  # Desnormalización de ubicación
  locationId: ID
  locationName: String # ✨ NUEVO
  locationCity: String # ✨ NUEVO
  # Desnormalización de curso (para estudiantes)
  courseId: ID
  courseName: String # ✨ NUEVO
  courseGrade: String # ✨ NUEVO
  courseSection: String # ✨ NUEVO
  # Datos embebidos por rol
  studentData: StudentData
  parentData: ParentData
  teacherData: TeacherData

  # ✨ NUEVO: Métricas pre-calculadas
  metrics: ProfileMetrics

  # ✨ NUEVO: Cache de relaciones frecuentes
  quickAccess: ProfileQuickAccess

  lastLoginAt: DateTime
  isActive: Boolean!
  createdAt: DateTime!
  updatedAt: DateTime
}

# ✨ NUEVO: Métricas pre-calculadas
type ProfileMetrics {
  # Para estudiantes
  currentRiskLevel: RiskLevel
  lastAssessmentScore: Float
  responseRate: Float # % de encuestas completadas
  consecutiveMissedDays: Int

  # Para profesores
  studentsAtRisk: Int
  activeAlerts: Int

  # Para padres
  childrenCount: Int
  pendingConsents: Int

  # Actualizadas diariamente a las 05:00
  lastCalculated: DateTime
}

# ✨ NUEVO: Acceso rápido a relaciones frecuentes
type ProfileQuickAccess {
  # Para estudiantes
  parentNames: [String!]
  teacherNames: [String!]
  counselorName: String

  # Para padres
  childrenNames: [String!]

  # Para profesores
  courseNames: [String!]
}
```

#### SurveyResponse (Optimizado)

```graphql
type SurveyResponse @model {
  id: ID!

  # Desnormalización del estudiante
  studentId: ID!
  studentName: String! # ✨ NUEVO
  studentGrade: String! # ✨ NUEVO
  studentSection: String! # ✨ NUEVO
  # Desnormalización de la encuesta
  surveyId: ID!
  surveyName: String! # ✨ NUEVO
  surveyWeight: Float! # ✨ NUEVO
  # Desnormalización organizacional
  organizationId: ID!
  locationId: ID!
  courseId: ID!

  # Respuestas embebidas (más eficiente)
  responses: [QuestionResponseEmbedded!]

  # ✨ NUEVO: Scores pre-calculados
  dimensionScores: [DimensionScoreEmbedded!]
  compositeScore: Float!

  # ✨ NUEVO: Metadatos para análisis
  responseMetadata: ResponseMetadata

  completedAt: DateTime!
  createdAt: DateTime!
}

# ✨ NUEVO: Respuesta embebida optimizada
type QuestionResponseEmbedded {
  questionId: ID!
  questionText: String! # Para análisis sin joins
  selectedAlternativeId: ID
  alternativeText: String
  alternativeValue: Int
  textResponse: String

  # Scores ya calculados por dimensión
  dimensionImpacts: [DimensionImpact!]
}

type DimensionImpact {
  dimensionId: ID!
  dimensionName: String!
  value: Float!
  weight: Float!
  weightedValue: Float!
}

# ✨ NUEVO: Metadata enriquecida
type ResponseMetadata {
  responseTime: Int
  deviceInfo: DeviceInfo
  location: GeolocationInfo
  timeOfDay: String # "morning", "afternoon", "evening"
  dayOfWeek: String
  isWeekend: Boolean
}
```

### 2. **Agregaciones Pre-calculadas**

#### Analytics (Optimizado para dashboards)

```graphql
type DailyAnalytics @model {
  id: ID!
  date: DateTime! # YYYY-MM-DD
  organizationId: ID!
  locationId: ID
  courseId: ID

  # ✨ NUEVO: Agregaciones por nivel
  scope: AnalyticsScope! # ORGANIZATION, LOCATION, COURSE
  # Métricas de participación
  participation: ParticipationMetrics!

  # Métricas de bienestar por dimensión
  wellbeingMetrics: [DimensionMetrics!]

  # Métricas de riesgo
  riskMetrics: RiskMetrics!

  # Métricas de intervención
  interventionMetrics: InterventionMetrics!

  # ✨ NUEVO: Comparación con períodos anteriores
  trends: TrendMetrics!

  createdAt: DateTime!
}

enum AnalyticsScope {
  ORGANIZATION
  LOCATION
  COURSE
}

type ParticipationMetrics {
  totalStudents: Int!
  activeStudents: Int!
  responseRate: Float!
  averageResponseTime: Float!

  # ✨ NUEVO: Patrones temporales
  peakResponseHour: String!
  responseDistribution: [HourlyDistribution!]
}

type DimensionMetrics {
  dimensionId: ID!
  dimensionName: String!
  averageScore: Float!
  studentsAtRisk: Int!
  trend: String! # "improving", "stable", "declining"
  # ✨ NUEVO: Distribución de scores
  scoreDistribution: ScoreDistribution!
}

type ScoreDistribution {
  low: Int! # < 0.3
  medium: Int! # 0.3 - 0.6
  high: Int! # 0.6 - 0.8
  critical: Int! # > 0.8
}
```

### 3. **Colecciones de Apoyo para Consultas Frecuentes**

#### StudentRiskTimeline (Para análisis temporal)

```graphql
type StudentRiskTimeline @model {
  id: ID!
  studentId: ID!

  # Desnormalización para consultas eficientes
  organizationId: ID!
  locationId: ID!
  courseId: ID!

  # Timeline compacto (últimos 30 días)
  timeline: [DailyRiskEntry!]

  # ✨ NUEVO: Métricas de ventana móvil
  rolling7Days: RollingMetrics!
  rolling30Days: RollingMetrics!

  # Alertas activas
  activeAlerts: [AlertSummary!]

  lastUpdated: DateTime!
  createdAt: DateTime!
}

type DailyRiskEntry {
  date: DateTime!
  compositeScore: Float
  riskLevel: RiskLevel
  responsesCompleted: Int!
  missedSurveys: Int!

  # Scores por dimensión (compacto)
  dimensionScores: [Float!] # Array ordenado por dimensionId
}

type RollingMetrics {
  averageScore: Float!
  trend: String!
  volatility: Float! # Desviación estándar
  gapRatio: Float! # % de días sin respuesta
}
```

### 4. **Optimizaciones Específicas para Casos de Uso**

#### AlertQueue (Para procesamiento eficiente)

```graphql
type AlertQueue @model {
  id: ID!

  # Particionado por organización para escalabilidad
  organizationId: ID!
  processingDate: DateTime! # Para particionado temporal
  # Alertas agrupadas por prioridad
  criticalAlerts: [AlertQueueEntry!]
  highAlerts: [AlertQueueEntry!]
  mediumAlerts: [AlertQueueEntry!]

  # ✨ NUEVO: Métricas de cola
  queueMetrics: QueueMetrics!

  # Estado de procesamiento
  status: QueueStatus!
  processedAt: DateTime

  createdAt: DateTime!
}

type AlertQueueEntry {
  alertId: ID!
  studentId: ID!
  studentName: String!
  courseGrade: String!
  severity: RiskLevel!
  type: String!

  # Contexto inmediato para toma de decisiones
  context: AlertContext!

  # Assignación automática basada en reglas
  suggestedAssignee: ID
  assignedTo: ID
  acknowledgedAt: DateTime
}

type AlertContext {
  lastResponse: DateTime
  missedDays: Int!
  previousAlerts: Int!
  parentContactInfo: ContactInfo!
  teacherContactInfo: ContactInfo!
}
```

### 5. **Índices Estratégicos Recomendados**

```javascript
// Índices compuestos para consultas frecuentes
db.profiles.createIndex({
  organizationId: 1,
  role: 1,
  isActive: 1,
});

db.surveyresponses.createIndex({
  studentId: 1,
  createdAt: -1,
});

db.surveyresponses.createIndex({
  organizationId: 1,
  completedAt: -1,
});

db.riskassessments.createIndex({
  studentId: 1,
  assessmentDate: -1,
});

db.alerts.createIndex({
  organizationId: 1,
  status: 1,
  severity: 1,
  createdAt: -1,
});

// Índice para el heatmap de profesores
db.profiles.createIndex({
  "teacherData.courseIds": 1,
  role: 1,
});

// Índice para métricas temporales
db.dailyanalytics.createIndex({
  organizationId: 1,
  scope: 1,
  date: -1,
});
```

### 6. **Estrategias de Particionado**

#### Por Organización

- **Colecciones principales**: Particionar por `organizationId`
- **Beneficio**: Aislamiento de datos, escalabilidad horizontal

#### Por Tiempo

- **SurveyResponse**: Particionar por mes/trimestre
- **Analytics**: Particionar por mes
- **AuditLog**: Particionar por mes con TTL automático

## Beneficios Esperados

### Rendimiento

- **Reducción de 60-80%** en consultas de múltiples colecciones
- **Mejora de 3-5x** en tiempo de respuesta para dashboards
- **Reducción de 50%** en uso de red entre aplicación y BD

### Escalabilidad

- Soporte para **10,000+ estudiantes** por organización
- Procesamiento de **100,000+ respuestas/día**
- Dashboards en **tiempo real** (<200ms)

### Mantenibilidad

- Menos lógica de agregación en la aplicación
- Consultas más simples y predecibles
- Mejor debugging y monitoreo

## Fases de Implementación

### Fase 0: Mejoras Inmediatas (1 semana)

- Corregir Profile duplicado
- Agregar campos faltantes
- Implementar índices básicos
- Mejorar tipos existentes

### Fase 1: Desnormalización Básica (2 semanas)

- Agregar campos desnormalizados a Profile
- Actualizar SurveyResponse con scores pre-calculados
- Implementar trigger de actualización

### Fase 2: Agregaciones Pre-calculadas (3 semanas)

- Implementar DailyAnalytics
- Job batch para cálculo nocturno
- APIs optimizadas para dashboards

### Fase 3: Colecciones de Apoyo (2 semanas)

- StudentRiskTimeline
- AlertQueue
- Optimizar flujos críticos

### Fase 4: Índices y Optimización (1 semana)

- Implementar índices estratégicos
- Monitoring y tuning
- Migración de datos existentes

## Consideraciones de Migración

1. **Compatibilidad**: Mantener APIs existentes durante transición
2. **Migración gradual**: Por organización, no big-bang
3. **Validación**: Comparar resultados con sistema actual
4. **Rollback**: Plan de contingencia bien definido

Este enfoque optimizado aprovecha las fortalezas de MongoDB mientras mantiene la flexibilidad del esquema GraphQL existente.

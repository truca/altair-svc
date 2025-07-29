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

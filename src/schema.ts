import { makeSchema } from "../lib/utils";

const typeDefinitions = /* GraphQL */ `
  scalar ID
  scalar File
  scalar DateTime
  scalar DefaultValue
  type Option {
    label: String
    value: String
  }
  input OptionInput {
    label: String
    value: String
  }
  type StringOptions {
    values: [String]
  }
  type ObjectOptions {
    values: [Option]
  }
  union SelectOption = StringOptions | ObjectOptions
  type SelectOptions {
    values: SelectOption
  }
  # Directives
  directive @model(db: String, table: String) on OBJECT
  directive @file(maxSize: Float!, types: [String!]!) on FIELD_DEFINITION
  directive @auth(
    create: [String]
    read: [String]
    update: [String]
    delete: [String]
  ) on OBJECT | FIELD_DEFINITION
  directive @connection(type: String) on FIELD_DEFINITION
  directive @subscribe(on: [String], topic: String) on OBJECT
  directive @default(value: DefaultValue) on FIELD_DEFINITION
  input HiddenCondition {
    field: String
    valueString: String
    valueBoolean: Boolean
    valueNumber: Float
  }
  directive @hidden(value: Boolean, cond: [HiddenCondition]) on FIELD_DEFINITION
  directive @type(value: FieldType) on FIELD_DEFINITION
  directive @selectFrom(
    values: [String]
    optionValues: [OptionInput]
    table: String
    labelAttribute: String
    valueAttribute: String
    dependentField: String
    where: String
    queryVariables: String
  ) on FIELD_DEFINITION
  directive @selectManyFrom(
    values: [String]
    optionValues: [OptionInput]
    table: String
    labelAttribute: String
    valueAttribute: String
    dependentField: String
    where: String
    queryVariables: String
  ) on FIELD_DEFINITION
  directive @defaultFrom(parentAttribute: String) on FIELD_DEFINITION
  directive @from(
    parentAttribute: String
    queryParam: String
  ) on FIELD_DEFINITION
  directive @position(step: Float, row: Float) on FIELD_DEFINITION
  directive @meta(label: String, placeholder: String) on FIELD_DEFINITION

  # Subform directives for complex nested objects
  enum SubformLayout {
    CARDS
    TABS
  }
  directive @subform(layout: SubformLayout = CARDS) on FIELD_DEFINITION
  directive @polymorphicSubform(
    types: [String!]
    optionTypes: [OptionInput!]
    layout: SubformLayout = CARDS
  ) on FIELD_DEFINITION
  directive @polymorphicArray(
    types: [String!]
    optionTypes: [OptionInput!]
    addButtonText: String = "Agregar"
    layout: SubformLayout = CARDS
  ) on FIELD_DEFINITION

  enum FieldType {
    TEXT
    TEXTAREA
    NUMBER
    EMAIL
    PASSWORD
    CHECKBOX
    RADIO
    SELECT
    MULTISELECT
    SMART_SELECT
    DATE
    TIME
    DATETIME
    FILE
    IMAGE
    URL
    TEL
    COLOR
    RANGE
    SEARCH
    HIDDEN
    SUBMIT
    RESET
    BUTTON
    # Subform types for complex nested objects
    SUBFORM
    POLYMORPHIC_SUBFORM
    POLYMORPHIC_ARRAY
  }

  enum ValueType {
    STRING
    BOOLEAN
    NUMBER
    FILE
    MIXED
  }

  type FieldValidation {
    label: String!
    value: String
    valueType: ValueType
    errorMessage: String
  }

  type FieldOption {
    label: String
    value: String
  }

  type PolymorphicSubformFieldBundle {
    type: String
    fields: [Field]
  }

  type Field {
    id: String
    label: String
    field: String
    type: FieldType
    defaultValue: String
    options: [FieldOption]
    validation: [FieldValidation]
    # From @meta directive
    placeholder: String
    # Smart select properties
    entity: String
    labelAttribute: String
    valueAttribute: String
    dependentField: String
    isMulti: Boolean
    # Position properties for multistep forms
    step: Float
    row: Float
    # Conditional visibility - stringified condition object from @hidden(cond: ...)
    hidden: String
    # Subform properties
    subformType: String # Target GraphQL type for SUBFORM
    subformTypes: [String] # Available types for POLYMORPHIC_SUBFORM/POLYMORPHIC_ARRAY
    subformFields: [Field] # Nested fields for SUBFORM (recursive)
    subformLayout: String # Layout style: "cards" or "tabs"
    addButtonText: String # Text for add button in POLYMORPHIC_ARRAY
    typeOptions: [FieldOption] # User-friendly type options for polymorphic fields
    polymorphicSubformFields: [PolymorphicSubformFieldBundle] # Bundles for polymorphic types
  }

  type FormStep {
    stepNumber: Float
    gridTemplateAreas: String
    gridTemplateColumns: String
    # fields: [Field]
  }

  type Form {
    fields: [Field]
    steps: [FormStep]
  }

  input ObjectId {
    id: ID!
  }

  input ProfileInputType2 {
    email: String
    password: String
    username: String
    profilePicture: String
    createdAt: DateTime
    updatedAt: DateTime
  }

  type Image
    @model(db: "cep")
    @auth(read: ["public"], update: ["public"], delete: ["public"]) {
    externalId: ID!
    url: String!
    createdAt: DateTime
    updatedAt: DateTime
  }

  # ===== SISTEMA ALUMBRA =====

  # ✨ NUEVO: Directiva para índices MongoDB (múltiples índices)
  input MongoIndexConfig {
    fields: [String!]!
    unique: Boolean = false
    sparse: Boolean = false
    ttl: Float # segundos para TTL
  }

  directive @mongoIndexes(indexes: [MongoIndexConfig!]!) on OBJECT

  # Enums para el sistema
  enum UserRole {
    STUDENT
    PARENT
    TEACHER
    ADMINISTRATIVE
    ADMIN
    SUPER_ADMIN
  }

  enum OrganizationType {
    SCHOOL
    DISTRICT
    UNIVERSITY
    NETWORK
  }

  enum PlanType {
    BASIC
    STANDARD
    PREMIUM
    ENTERPRISE
  }

  enum SurveyFrequency {
    DAILY
    WEEKLY
    MONTHLY
    QUARTERLY
    ON_DEMAND
  }

  enum RiskLevel {
    LOW
    MEDIUM
    HIGH
    CRITICAL
  }

  enum AlertStatus {
    ACTIVE
    ACKNOWLEDGED
    RESOLVED
    ESCALATED
  }

  enum InterventionType {
    CONVERSATION
    MEETING
    REFERRAL
    MONITORING
    OTHER
  }

  enum InterventionStatus {
    PLANNED
    IN_PROGRESS
    COMPLETED
    CANCELLED
  }

  enum ConsentStatus {
    PENDING
    GRANTED
    REVOKED
    EXPIRED
  }

  enum ConsentType {
    DATA_COLLECTION
    INTERVENTION
    COMMUNICATION
    RESEARCH
  }

  # ===== ORGANIZACIONES Y UBICACIONES =====

  type Organization
    @model
    @auth(
      create: ["role:admin", "role:super_admin"]
      read: ["public"]
      update: ["role:admin", "role:super_admin"]
      delete: ["role:super_admin"]
    ) {
    id: ID!
    name: String!
    type: OrganizationType!
    description: String
    settings: OrganizationSettings
    plan: PlanType!
    planExpiresAt: DateTime
    isActive: Boolean! @default(value: true)
    createdAt: DateTime!
    updatedAt: DateTime
  }

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
    defaultEscalationTime: Float! @default(value: 60) # minutos
    requireApprovalForCritical: Boolean! @default(value: true)
    maxAlertsPerUser: Float! @default(value: 20)
  }

  type PrivacySettings {
    dataRetentionMonths: Float! @default(value: 24)
    anonymizeAfterMonths: Float! @default(value: 36)
    allowDataExport: Boolean! @default(value: true)
    requireParentConsent: Boolean! @default(value: true)
    shareDataWithTeachers: Boolean! @default(value: true)
  }

  type RiskThresholds {
    low: Float! @default(value: 0.3)
    medium: Float! @default(value: 0.6)
    high: Float! @default(value: 0.8)
  }

  type CheckInWindow {
    startTime: String! # "08:00"
    endTime: String! # "18:00"
    timezone: String! @default(value: "America/Santiago")
  }

  type NotificationSettings {
    emailEnabled: Boolean! @default(value: true)
    pushEnabled: Boolean! @default(value: true)
    smsEnabled: Boolean! @default(value: false)
  }

  type Location
    @model
    @auth(
      create: ["role:admin", "role:super_admin"]
      read: ["public"]
      update: ["role:admin", "role:super_admin"]
      delete: ["role:super_admin"]
    ) {
    id: ID!
    name: String!
    organizationId: ID!
    organization: Organization
    address: String
    city: String
    country: String
    isActive: Boolean! @default(value: true)
    createdAt: DateTime!
    updatedAt: DateTime
  }

  # ===== CURSOS Y USUARIOS =====

  type Course
    @model
    @auth(
      create: ["role:admin", "role:super_admin"]
      read: ["public"]
      update: ["role:admin", "role:super_admin"]
      delete: ["role:super_admin"]
    ) {
    id: ID!
    name: String!
    organizationId: ID!
    organization: Organization
    locationId: ID!
    location: Location
    grade: String
    section: String
    academicYear: String
    isActive: Boolean! @default(value: true)
    createdAt: DateTime!
    updatedAt: DateTime
  }

  type Profile
    @model
    @mongoIndexes(
      indexes: [
        { fields: ["organizationId", "role", "isActive"] }
        { fields: ["email"], unique: true }
        { fields: ["courseId", "role"] }
      ]
    )
    @auth(
      create: ["public"]
      read: ["owner", "collaborator", "role:admin"]
      update: ["owner", "role:admin"]
      delete: ["role:admin", "role:super_admin"]
    ) {
    id: ID!
    email: String!
    password: String! @hidden(value: true)
    name: String!
    role: UserRole!
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

    # ✨ NUEVO: Cache desnormalizado para consultas rápidas
    quickAccess: ProfileQuickAccess
    metrics: ProfileMetrics

    # ✨ NUEVO: Datos embebidos para evitar joins
    courseInfo: EmbeddedCourseInfo
    organizationInfo: EmbeddedOrganizationInfo

    # Datos específicos por rol
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

  # ✨ NUEVO: Tipos embebidos para desnormalización
  type EmbeddedCourseInfo {
    courseId: ID!
    courseName: String!
    grade: String!
    section: String!
    teacherName: String!
  }

  type EmbeddedOrganizationInfo {
    organizationId: ID!
    organizationName: String!
    planType: PlanType!
    settings: OrganizationSettings
  }

  type StudentData {
    grade: String
    section: String
    parentIds: [ID!]
    parents: [Profile!]
    teacherIds: [ID!]
    teachers: [Profile!]
    counselorId: ID
    counselor: Profile
    enrollmentDate: DateTime
    graduationDate: DateTime
  }

  type ParentData {
    childIds: [ID!]
    children: [Profile!]
    relationship: String # "father", "mother", "guardian"
    emergencyContact: String
  }

  type TeacherData {
    courseIds: [ID!]
    courses: [Course!]
    sectionIds: [String!]
    specialization: String
    yearsOfExperience: Float
  }

  type AdministrativeData {
    department: String
    permissions: [String!]
    supervisorId: ID
    supervisor: Profile
  }

  # ===== ENCUESTAS Y PREGUNTAS =====

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
    maxAttempts: Float! @default(value: 1)
    timeoutMinutes: Float! @default(value: 30)
    randomizeQuestions: Boolean! @default(value: false)
    showProgress: Boolean! @default(value: true)
    allowSkip: Boolean! @default(value: false)
  }

  type SurveyCondition {
    field: String!
    operator: String! # "equals", "not_equals", "greater_than", etc.
    value: String!
  }

  type Question
    @model
    @auth(
      create: ["role:admin", "role:super_admin"]
      read: ["public"]
      update: ["role:admin", "role:super_admin"]
      delete: ["role:super_admin"]
    ) {
    id: ID!
    surveyId: ID!
    survey: Survey
    text: String!
    type: String! # "multiple_choice", "likert", "text", "emoji"
    order: Float!
    isRequired: Boolean! @default(value: true)
    alternatives: [QuestionAlternative!]
    conditions: [QuestionCondition!]
    createdAt: DateTime!
    updatedAt: DateTime
  }

  type QuestionAlternative {
    id: ID!
    text: String!
    value: Float!
    dimensionValues: [DimensionValue!]
    isCorrect: Boolean @default(value: false)
  }

  type QuestionCondition {
    field: String!
    operator: String!
    value: String!
  }

  # ===== DIMENSIONES Y PONDERACIONES =====

  type Dimension
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
    color: String # HEX color
    isActive: Boolean! @default(value: true)
    createdAt: DateTime!
    updatedAt: DateTime
  }

  type DimensionValue {
    dimensionId: ID!
    dimension: Dimension
    value: Float!
    weight: Float! @default(value: 1.0)
  }

  # ===== RESPUESTAS Y EVALUACIONES =====

  type SurveyResponse
    @model
    @mongoIndexes(
      indexes: [
        { fields: ["studentId", "completedAt"] }
        { fields: ["organizationId", "completedAt"] }
        { fields: ["surveyId", "completedAt"] }
      ]
    )
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
    responseTime: Float # segundos
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
    daysSinceLastResponse: Float
    consecutiveResponseDays: Float
    weekOfAcademicYear: Float
  }

  type GeolocationData {
    latitude: Float
    longitude: Float
    accuracy: Float
    city: String
    country: String
    timestamp: DateTime
  }

  type QuestionResponse {
    questionId: ID!
    question: Question
    selectedAlternativeId: ID
    selectedAlternative: QuestionAlternative
    textResponse: String
    numericResponse: Float
    dimensionScores: [DimensionScore!]
  }

  type DimensionScore {
    dimensionId: ID!
    dimension: Dimension
    score: Float!
    weightedScore: Float!
  }

  type DeviceInfo {
    platform: String
    browser: String
    appVersion: String
    ipAddress: String
  }

  # ===== EVALUACIONES DE RIESGO =====

  type RiskAssessment
    @model
    @mongoIndexes(
      indexes: [
        { fields: ["studentId", "assessmentDate"] }
        { fields: ["organizationId", "assessmentDate"] }
        { fields: ["overallRiskLevel", "assessmentDate"] }
      ]
    )
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
    assessmentDate: DateTime!
    dimensionAssessments: [DimensionAssessment!]
    compositeScore: Float!
    overallRiskLevel: RiskLevel!
    trend: String # "improving", "stable", "declining"
    createdAt: DateTime!
    updatedAt: DateTime
  }

  type DimensionAssessment {
    dimensionId: ID!
    dimension: Dimension
    score: Float!
    riskLevel: RiskLevel!
    trend: String
    threshold: Float!
  }

  # ===== ALERTAS Y INTERVENCIONES =====

  type Alert
    @model
    @mongoIndexes(
      indexes: [
        { fields: ["organizationId", "createdAt"] }
        { fields: ["studentId", "status"] }
        { fields: ["assignedTo", "status"] }
        { fields: ["status", "priority", "createdAt"] }
      ]
    )
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
    timeToEscalate: Float! # minutos
    escalateTo: [ID!] # IDs de usuarios
    escalationMessage: String
  }

  type AlertMetadata {
    dimensionId: ID
    dimension: Dimension
    surveyId: ID
    survey: Survey
    riskAssessmentId: ID
    riskAssessment: RiskAssessment
    trendData: TrendData
  }

  type TrendData {
    days: Float!
    averageScore: Float!
    decline: Float!
  }

  type NotificationStatus {
    email: Boolean! @default(value: false)
    push: Boolean! @default(value: false)
    sms: Boolean! @default(value: false)
  }

  type Intervention
    @model
    @auth(
      create: ["role:admin"]
      read: ["owner", "collaborator", "role:admin"]
      update: ["role:admin"]
      delete: ["role:admin"]
    ) {
    id: ID!
    alertId: ID!
    alert: Alert
    studentId: ID!
    student: Profile
    counselorId: ID!
    counselor: Profile
    organizationId: ID!
    organization: Organization
    type: InterventionType!
    title: String!
    description: String!
    status: InterventionStatus! @default(value: PLANNED)
    plannedAt: DateTime
    startedAt: DateTime
    completedAt: DateTime
    outcome: InterventionOutcome
    attachments: [Attachment!]
    createdAt: DateTime!
    updatedAt: DateTime
  }

  type InterventionOutcome {
    success: Boolean!
    notes: String!
    followUpRequired: Boolean! @default(value: false)
    followUpDate: DateTime
  }

  type Attachment {
    id: ID!
    filename: String!
    url: String!
    type: String!
    size: Float!
  }

  # ===== CONEXIÓN PLAN-ENCUESTA =====

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
    maxResponsesPerMonth: Float
    createdAt: DateTime!
  }

  # ===== CONSENTIMIENTOS =====

  type ConsentLog
    @model
    @auth(
      create: ["public"]
      read: ["owner", "role:admin"]
      update: ["role:admin"]
      delete: ["role:admin"]
    ) {
    id: ID!
    studentId: ID!
    student: Profile
    parentId: ID!
    parent: Profile
    type: ConsentType!
    status: ConsentStatus!
    grantedAt: DateTime
    revokedAt: DateTime
    expiresAt: DateTime
    metadata: ConsentMetadata
    createdAt: DateTime!
    updatedAt: DateTime
  }

  type ConsentMetadata {
    reason: String
    ipAddress: String
    userAgent: String
    version: String
  }

  # ===== INDICADORES Y RELACIONES =====

  type Indicator
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
    indicatorType: String! # "friend", "bully", "mentor", "conflict"
    targetStudentId: ID
    targetStudent: Profile
    targetTeacherId: ID
    targetTeacher: Profile
    description: String
    isPositive: Boolean! @default(value: true)
    isActive: Boolean! @default(value: true)
    createdAt: DateTime!
    updatedAt: DateTime
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

  # ===== ANALÍTICAS Y REPORTES =====

  type Analytics
    @model
    @auth(
      create: ["public"]
      read: ["role:admin"]
      update: ["role:admin"]
      delete: ["role:admin"]
    ) {
    id: ID!
    organizationId: ID!
    organization: Organization
    date: DateTime!

    # Métricas de participación
    totalStudents: Float!
    activeStudents: Float!
    surveyResponseRate: Float!
    checkInRate: Float!

    # Métricas de bienestar
    averageScores: [DimensionAverage!]
    averageCompositeScore: Float!

    # Métricas de riesgo
    studentsAtRisk: Float!
    studentsHighRisk: Float!
    newAlerts: Float!
    resolvedAlerts: Float!

    # Métricas de intervención
    interventionsPlanned: Float!
    interventionsCompleted: Float!
    averageResponseTime: Float! # minutos
    # Gap analysis
    gapRatio: Float!
    consecutiveMissedDays: Float!

    createdAt: DateTime!
  }

  type DimensionAverage {
    dimensionId: ID!
    dimension: Dimension
    averageScore: Float!
    riskLevel: RiskLevel!
  }

  # ✨ NUEVO: Analytics optimizado para dashboards
  type DailyAnalytics
    @model
    @auth(
      create: ["public"]
      read: ["role:admin"]
      update: ["role:admin"]
      delete: ["role:admin"]
    ) {
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
    totalStudents: Float!
    activeStudents: Float!
    responseRate: Float!
    averageResponseTime: Float!

    # ✨ NUEVO: Patrones temporales
    peakResponseHour: String!
    responseDistribution: [HourlyDistribution!]
  }

  type HourlyDistribution {
    hour: String!
    responseCount: Float!
    percentage: Float!
  }

  type DimensionMetrics {
    dimensionId: ID!
    dimensionName: String!
    averageScore: Float!
    studentsAtRisk: Float!
    trend: String! # "improving", "stable", "declining"
    # ✨ NUEVO: Distribución de scores
    scoreDistribution: ScoreDistribution!
  }

  type ScoreDistribution {
    low: Float! # < 0.3
    medium: Float! # 0.3 - 0.6
    high: Float! # 0.6 - 0.8
    critical: Float! # > 0.8
  }

  type RiskMetrics {
    totalAtRisk: Float!
    newAlerts: Float!
    resolvedAlerts: Float!
    averageRiskScore: Float!
    riskTrend: String!
  }

  type InterventionMetrics {
    planned: Float!
    inProgress: Float!
    completed: Float!
    averageResponseTime: Float!
    successRate: Float!
  }

  type TrendMetrics {
    weekOverWeek: Float!
    monthOverMonth: Float!
    quarterOverQuarter: Float!
    trendDirection: String! # "up", "down", "stable"
  }
  #   dimensionId: ID!
  #   dimension: Dimension
  #   averageScore: Float!
  #   riskLevel: RiskLevel!
  # }

  # ===== COLECCIONES DE APOYO PARA CONSULTAS FRECUENTES =====

  # ✨ NUEVO: Timeline de riesgo para análisis temporal
  type StudentRiskTimeline
    @model
    @auth(
      create: ["public"]
      read: ["owner", "collaborator", "role:admin"]
      update: ["role:admin"]
      delete: ["role:admin"]
    ) {
    id: ID!
    studentId: ID!

    # Desnormalización para consultas eficientes
    organizationId: ID!
    locationId: ID!
    courseId: ID!

    # Timeline compacto (últimos 30 días)
    timeline: [DailyRiskEntry!]

    # ✨ NUEVO: Timeline ultra-compacto para MongoDB
    timelineCompact: [DailyRiskCompact!]

    # ✨ NUEVO: Métricas de ventana móvil
    rolling7Days: RollingMetrics!
    rolling30Days: RollingMetrics!

    # ✨ NUEVO: Índices pre-calculados
    riskIndexes: RiskIndexes!

    # Alertas activas
    activeAlerts: [AlertSummary!]

    lastUpdated: DateTime!
    createdAt: DateTime!
  }

  type DailyRiskEntry {
    date: DateTime!
    compositeScore: Float
    riskLevel: RiskLevel
    responsesCompleted: Float!
    missedSurveys: Float!

    # Scores por dimensión (compacto)
    dimensionScores: [Float!] # Array ordenado por dimensionId
  }

  # ✨ NUEVO: Versión compacta para MongoDB
  type DailyRiskCompact {
    d: String! # "2024-01-15" formato compacto
    s: Float # score compacto
    l: Float # risk level (0,1,2,3)
    r: Float # responses count
    m: Float # missed surveys
    # Array de scores por dimensión [0.1, 0.3, 0.8] ordenado
    ds: [Float!]
  }

  type RollingMetrics {
    averageScore: Float!
    trend: String!
    volatility: Float! # Desviación estándar
    gapRatio: Float! # % de días sin respuesta
  }

  # ✨ NUEVO: Índices pre-calculados
  type RiskIndexes {
    # Ventanas móviles pre-calculadas
    avg7d: Float!
    avg30d: Float!
    trend7d: String!
    trend30d: String!
    volatility: Float!
  }

  type AlertSummary {
    alertId: ID!
    type: AlertType!
    severity: RiskLevel!
    status: AlertStatus!
    createdAt: DateTime!
  }

  # ✨ NUEVO: Cola de alertas para procesamiento eficiente
  type AlertQueue
    @model
    @auth(
      create: ["public"]
      read: ["role:admin"]
      update: ["role:admin"]
      delete: ["role:admin"]
    ) {
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
    type: AlertType!

    # Contexto inmediato para toma de decisiones
    context: AlertContext!

    # Assignación automática basada en reglas
    suggestedAssignee: ID
    assignedTo: ID
    acknowledgedAt: DateTime
  }

  type AlertContext {
    lastResponse: DateTime
    missedDays: Float!
    previousAlerts: Float!
    parentContactInfo: ContactInfo!
    teacherContactInfo: ContactInfo!
  }

  type ContactInfo {
    name: String!
    phone: String
    email: String
    relationship: String
  }

  type QueueMetrics {
    totalAlerts: Float!
    criticalCount: Float!
    highCount: Float!
    mediumCount: Float!
    averageProcessingTime: Float!
  }

  enum QueueStatus {
    PENDING
    PROCESSING
    COMPLETED
    FAILED
  }

  # ✨ NUEVO: Vista materializada para dashboards optimizados
  type DashboardSnapshot
    @model
    @mongoIndexes(
      indexes: [
        { fields: ["organizationId", "userId", "snapshotDate"] }
        { fields: ["courseId", "snapshotDate"] }
        { fields: ["expiresAt"], ttl: 86400 }
      ]
    )
    @auth(read: ["role:teacher", "role:admin"]) {
    id: ID!

    # Particionado por contexto
    organizationId: ID!
    locationId: ID
    courseId: ID
    userId: ID! # Profesor que ve el dashboard
    # Snapshot de datos por fecha
    snapshotDate: DateTime!

    # ✨ NUEVO: Arrays embebidos para rendimiento
    studentsData: [StudentDashboardData!]!
    classMetrics: ClassMetrics!

    # TTL para auto-limpieza
    expiresAt: DateTime!
    createdAt: DateTime!
  }

  type StudentDashboardData {
    studentId: ID!
    name: String!

    # Datos compactos para lista
    currentRisk: Float! # 0-3
    lastResponse: DateTime
    missedDays: Float!
    trend: Float! # -1, 0, 1
    # Alertas activas
    activeAlerts: [AlertSummaryCompact!]
  }

  type AlertSummaryCompact {
    id: ID!
    type: Float! # AlertType como número
    severity: Float! # RiskLevel como número
    age: Float! # horas desde creación
  }

  type ClassMetrics {
    totalStudents: Float!
    studentsAtRisk: Float!
    averageScore: Float!
    responseRate: Float!
    trendDirection: String! # "up", "down", "stable"
    riskDistribution: RiskDistribution!
  }

  type RiskDistribution {
    low: Float!
    medium: Float!
    high: Float!
    critical: Float!
  }

  # ===== SISTEMA DE CHAT (F8) =====

  # ✨ NUEVO: Sistema de chat para consultas y check-ins
  type ChatSession
    @model
    @mongoIndexes(
      indexes: [
        { fields: ["userId", "isActive", "lastActivity"] }
        { fields: ["organizationId", "chatType", "createdAt"] }
      ]
    )
    @auth(
      create: ["public"]
      read: ["owner", "collaborator", "role:admin"]
      update: ["owner", "role:admin"]
      delete: ["role:admin"]
    ) {
    id: ID!
    userId: ID!
    user: Profile

    # Tipo de chat
    chatType: ChatType!
    context: ChatContext

    # Mensajes embebidos para consultas rápidas
    messages: [ChatMessage!]!

    # Estado
    isActive: Boolean! @default(value: true)
    lastActivity: DateTime!

    createdAt: DateTime!
  }

  enum ChatType {
    STUDENT_CHECKIN
    PARENT_CONSULTATION
    TEACHER_QUERY
    HELP_REQUEST
    ANONYMOUS_ALERT
  }

  type ChatMessage {
    id: ID!
    content: String!
    isBot: Boolean!
    timestamp: DateTime!

    # Metadatos del mensaje
    metadata: ChatMessageMetadata
  }

  type ChatMessageMetadata {
    intent: String # "greeting", "risk_query", "help_request"
    confidence: Float
    entities: [ChatEntity!]
  }

  type ChatEntity {
    type: String! # "student_name", "date_range", "emotion"
    value: String!
    confidence: Float!
  }

  type ChatContext {
    studentId: ID
    courseId: ID
    alertId: ID
    parentId: ID
  }

  input ChatContextInput {
    studentId: ID
    courseId: ID
    alertId: ID
    parentId: ID
  }

  # ===== ALERTAS ANÓNIMAS (F13) =====

  # ✨ NUEVO: Sistema de alertas anónimas mejorado
  type AnonymousAlert
    @model
    @mongoIndexes(
      indexes: [
        { fields: ["organizationId", "status", "createdAt"] }
        { fields: ["emergencyType", "status"] }
      ]
    )
    @auth(
      create: ["public"]
      read: ["role:admin"]
      update: ["role:admin"]
      delete: ["role:admin"]
    ) {
    id: ID!

    # Contexto mínimo sin identificación
    organizationId: ID # Inferido por dominio/IP
    location: GeolocationData

    # Tipo de emergencia
    emergencyType: EmergencyType!
    description: String!

    # Contexto opcional
    approximateLocation: String
    emergencyContact: String

    # Procesamiento
    status: AnonymousAlertStatus!
    assignedTo: ID
    processedAt: DateTime

    # Metadatos técnicos (sin identificación personal)
    metadata: AnonymousAlertMetadata

    createdAt: DateTime!
  }

  enum EmergencyType {
    BULLYING
    EMOTIONAL_CRISIS
    VIOLENCE_THREAT
    ABUSE_NEGLECT
    OTHER_URGENT
  }

  enum AnonymousAlertStatus {
    REPORTED
    REVIEWING
    ESCALATED
    RESOLVED
  }

  type AnonymousAlertMetadata {
    ipHash: String # Hash para evitar spam
    userAgent: String
    timestamp: DateTime!
  }

  # ===== AUDITORÍA =====

  type AuditLog
    @model
    @auth(
      create: ["public"]
      read: ["role:admin"]
      update: ["role:admin"]
      delete: ["role:admin"]
    ) {
    id: ID!
    organizationId: ID!
    organization: Organization
    userId: ID
    user: Profile

    # Datos del evento
    action: String!
    resource: String!
    resourceId: ID

    # Datos del cambio
    oldValues: String # JSON stringified
    newValues: String # JSON stringified
    # Metadatos
    ipAddress: String
    userAgent: String
    sessionId: String

    createdAt: DateTime!
  }

  # ===== TIPOS DE ENTRADA EXISTENTES =====

  type AuthPayload {
    token: String!
    country: String
  }

  type Query {
    _: Boolean
    me(uid: String): Profile
    form(type: String): Form

    # ✨ NUEVO: Queries optimizadas por contexto de usuario

    # Para estudiantes - datos personales únicamente
    myWellbeingData(timeRange: TimeRange = WEEK): StudentWellbeingData

    # Para padres - datos de hijos únicamente
    myChildrenStatus: [ChildStatusSummary!]!

    # Para profesores - datos de sus clases
    myClassDashboard(courseId: ID!, timeRange: TimeRange = WEEK): ClassDashboard

    # Para orientadores - cola priorizada
    myAlertQueue(priority: AlertPriority, limit: Float = 20): AlertQueuePage

    # Para admins - vista consolidada
    organizationDashboard(
      organizationId: ID!
      timeRange: TimeRange = MONTH
    ): OrganizationDashboard

    # Para chat system
    myChatSessions(
      chatType: ChatType
      isActive: Boolean = true
    ): [ChatSession!]!

    # Para alertas anónimas
    anonymousAlerts(
      status: AnonymousAlertStatus
      emergencyType: EmergencyType
      limit: Float = 50
    ): [AnonymousAlert!]!
  }

  # ✨ NUEVO: Tipos adicionales para optimizaciones

  # Métricas pre-calculadas para perfiles
  type ProfileMetrics
    @model
    @auth(
      create: ["public"]
      read: ["owner", "collaborator", "role:admin"]
      update: ["role:admin"]
      delete: ["role:admin"]
    ) {
    id: ID!
    profileId: ID!
    profile: Profile

    # Para estudiantes
    currentRiskLevel: RiskLevel
    lastAssessmentScore: Float
    responseRate: Float # % de encuestas completadas
    consecutiveMissedDays: Float

    # Para profesores
    studentsAtRisk: Float
    activeAlerts: Float

    # Para padres
    childrenCount: Float
    pendingConsents: Float

    # Actualizadas diariamente a las 05:00
    lastCalculated: DateTime
    createdAt: DateTime!
  }

  # Cache de relaciones frecuentes
  type ProfileQuickAccess
    @model
    @auth(
      create: ["public"]
      read: ["owner", "collaborator", "role:admin"]
      update: ["role:admin"]
      delete: ["role:admin"]
    ) {
    id: ID!
    profileId: ID!
    profile: Profile

    # Para estudiantes
    parentNames: [String!]
    teacherNames: [String!]
    counselorName: String

    # Para padres
    childrenNames: [String!]

    # Para profesores
    courseNames: [String!]

    lastUpdated: DateTime!
    createdAt: DateTime!
  }

  # ✨ NUEVO: Tipos de retorno para queries optimizadas por rol

  enum TimeRange {
    DAY
    WEEK
    MONTH
    QUARTER
    YEAR
  }

  type StudentWellbeingData {
    currentScore: Float!
    trend: TrendDirection!
    recentResponses: [CompactResponse!]!
    personalInsights: [WellbeingInsight!]!
  }

  enum TrendDirection {
    IMPROVING
    STABLE
    DECLINING
  }

  type CompactResponse {
    date: DateTime!
    score: Float!
    mood: String
  }

  type WellbeingInsight {
    type: String!
    message: String!
    confidence: Float!
  }

  type ChildStatusSummary {
    childId: ID!
    childName: String!
    currentRisk: RiskLevel!
    lastResponse: DateTime
    activeAlerts: Float!
    trend: TrendDirection!
  }

  type ClassDashboard {
    classInfo: ClassInfo!
    studentsStatus: [StudentStatusSummary!]!
    riskDistribution: RiskDistribution!
    alertsSummary: AlertsSummary!
    participationMetrics: ParticipationMetrics!
  }

  type ClassInfo {
    courseId: ID!
    courseName: String!
    grade: String!
    section: String!
    totalStudents: Float!
  }

  type StudentStatusSummary {
    studentId: ID!
    name: String!
    currentRisk: RiskLevel!
    trend: TrendDirection!
    lastResponse: DateTime
    missedDays: Float!
    activeAlerts: Float!
  }

  type AlertsSummary {
    total: Float!
    critical: Float!
    high: Float!
    unassigned: Float!
  }

  type AlertQueuePage {
    alerts: [AlertQueueItem!]!
    totalCount: Float!
    hasNextPage: Boolean!
  }

  type AlertQueueItem {
    alertId: ID!
    studentName: String!
    severity: RiskLevel!
    type: AlertType!
    age: Float! # horas
    context: AlertContext!
  }

  type OrganizationDashboard {
    organizationInfo: Organization!
    globalMetrics: GlobalMetrics!
    riskTrends: [RiskTrendPoint!]!
    locationBreakdown: [LocationMetrics!]!
  }

  type GlobalMetrics {
    totalStudents: Float!
    activeStudents: Float!
    studentsAtRisk: Float!
    responseRate: Float!
    alertsLast24h: Float!
  }

  type RiskTrendPoint {
    date: DateTime!
    averageRisk: Float!
    alertCount: Float!
  }

  type LocationMetrics {
    locationId: ID!
    locationName: String!
    studentCount: Float!
    riskLevel: RiskLevel!
    responseRate: Float!
  }

  # ✨ NUEVO: Tipos para mutación de cálculo de RiskAssessments
  type RiskAssessmentCalculationResult {
    success: Boolean!
    results: [RiskAssessmentCalculationItem!]
    errors: [String!]
  }

  type RiskAssessmentCalculationItem {
    studentId: ID!
    assessmentDate: DateTime!
    dimensionAssessments: [DimensionAssessmentCalculation!]
    compositeScore: Float!
    overallRiskLevel: RiskLevel!
    trend: String!
    timeWindow: Float!
  }

  type DimensionAssessmentCalculation {
    dimensionId: ID!
    score: Float!
    riskLevel: RiskLevel!
    trend: String!
    threshold: Float!
  }

  type Mutation {
    _: Boolean
    readTextFile(file: File!): String!
    saveFile(file: File!): Boolean!
    login(email: String!, password: String!): AuthPayload
    register(
      email: String!
      password: String!
      username: String
      profilePicture: String
      country: String
    ): AuthPayload
    updateMe(id: String, profile: ProfileInputType2): Profile

    # ✨ NUEVO: Mutación para calcular RiskAssessments
    calculateRiskAssessments(
      organizationId: ID
      studentId: ID
      timeWindows: [Float!]
      forceRecalculate: Boolean
    ): RiskAssessmentCalculationResult!

    # ✨ NUEVO: Mutaciones para sistema de chat
    createChatSession(
      chatType: ChatType!
      context: ChatContextInput
    ): ChatSession!

    addChatMessage(
      sessionId: ID!
      content: String!
      isBot: Boolean = false
    ): ChatMessage!

    # ✨ NUEVO: Mutaciones para alertas anónimas
    createAnonymousAlert(
      emergencyType: EmergencyType!
      description: String!
      approximateLocation: String
      emergencyContact: String
      organizationId: ID
    ): AnonymousAlert!

    processAnonymousAlert(
      alertId: ID!
      status: AnonymousAlertStatus!
      assignedTo: ID
    ): AnonymousAlert!
  }
`;

import { calculateRiskAssessmentsResolver } from "./resolvers/calculateRiskAssessments";

export const schema = makeSchema({
  typeDefs: typeDefinitions,
  formTypes: {},
  queries: {},
  mutations: {
    calculateRiskAssessments: () =>
      calculateRiskAssessmentsResolver.Mutation.calculateRiskAssessments,
  },
});

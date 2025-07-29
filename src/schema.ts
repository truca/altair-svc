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
    @auth(
      create: ["public"]
      read: ["owner", "collaborator", "role:admin"]
      update: ["owner", "role:admin"]
      delete: ["role:admin", "role:super_admin"]
    ) {
    id: ID!
    email: String!
    password: String!
    name: String!
    roles: [UserRole!]!
    organizationId: ID!
    organization: Organization
    locationId: ID
    location: Location
    courseId: ID
    course: Course

    # Datos específicos por rol
    studentData: StudentData
    parentData: ParentData
    teacherData: TeacherData
    administrativeData: AdministrativeData

    # Configuración de notificaciones
    notifications: NotificationSettings

    # Metadatos
    lastLoginAt: DateTime
    isActive: Boolean! @default(value: true)
    createdAt: DateTime!
    updatedAt: DateTime
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
    yearsOfExperience: Int
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
    frequency: SurveyFrequency!
    weight: Float! @default(value: 1.0)
    isActive: Boolean! @default(value: true)
    conditions: [SurveyCondition!]
    createdAt: DateTime!
    updatedAt: DateTime
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
    order: Int!
    isRequired: Boolean! @default(value: true)
    alternatives: [QuestionAlternative!]
    conditions: [QuestionCondition!]
    createdAt: DateTime!
    updatedAt: DateTime
  }

  type QuestionAlternative {
    id: ID!
    text: String!
    value: Int!
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
    questionResponses: [QuestionResponse!]
    completedAt: DateTime!
    responseTime: Int # segundos
    deviceInfo: DeviceInfo
    createdAt: DateTime!
    updatedAt: DateTime
  }

  type QuestionResponse {
    questionId: ID!
    question: Question
    selectedAlternativeId: ID
    selectedAlternative: QuestionAlternative
    textResponse: String
    numericResponse: Int
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
    type: String! # "risk_detected", "survey_missed", "help_requested"
    severity: RiskLevel!
    title: String!
    description: String!
    metadata: AlertMetadata
    status: AlertStatus! @default(value: ACTIVE)
    acknowledgedBy: ID
    acknowledgedByUser: Profile
    acknowledgedAt: DateTime
    resolvedAt: DateTime
    notificationsSent: NotificationStatus
    createdAt: DateTime!
    updatedAt: DateTime
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
    days: Int!
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
    size: Int!
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
    totalStudents: Int!
    activeStudents: Int!
    surveyResponseRate: Float!
    checkInRate: Float!

    # Métricas de bienestar
    averageScores: [DimensionAverage!]
    averageCompositeScore: Float!

    # Métricas de riesgo
    studentsAtRisk: Int!
    studentsHighRisk: Int!
    newAlerts: Int!
    resolvedAlerts: Int!

    # Métricas de intervención
    interventionsPlanned: Int!
    interventionsCompleted: Int!
    averageResponseTime: Float! # minutos
    # Gap analysis
    gapRatio: Float!
    consecutiveMissedDays: Int!

    createdAt: DateTime!
  }

  type DimensionAverage {
    dimensionId: ID!
    dimension: Dimension
    averageScore: Float!
    riskLevel: RiskLevel!
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
  }
`;

export const schema = makeSchema({
  typeDefs: typeDefinitions,
  formTypes: {},
  queries: {},
  mutations: {},
});

🏢 ENTIDADES ORGANIZACIONALES

1. Organization
   Propósito: Entidad raíz del sistema (colegios, redes educativas)
   Clave: id, type, plan
   Relaciones: Tiene Locations, Courses, Profiles
   Configuración: OrganizationSettings con umbrales de riesgo, ventanas de check-in
2. Location
   Propósito: Ubicaciones físicas dentro de una organización (sucursales, campus)
   Clave: organizationId, name
   Relaciones: Pertenece a Organization, tiene Courses
3. Course
   Propósito: Cursos/clases con estudiantes y profesores
   Clave: organizationId, locationId, name
   Relaciones: Pertenece a Organization y Location, tiene Profiles (estudiantes)
   👥 ENTIDADES DE USUARIOS
4. Profile ⭐ ENTIDAD CENTRAL
   Propósito: Usuarios del sistema (estudiantes, padres, profesores, admin)
   Clave: id, email, role, organizationId
   Tipos de datos específicos:
   StudentData: Datos de estudiante (grado, padres, profesores)
   ParentData: Datos de padre (hijos, relación)
   TeacherData: Datos de profesor (cursos, especialización)
   AdministrativeData: Datos administrativos (departamento, permisos)

📊 ENTIDADES DE ENCUESTAS
5. Survey
   Propósito: Encuestas de bienestar emocional
   Clave: id, name, frequency, weight
   Configuración: SurveyTimeWindow, SurveyConfiguration, requiredPlanTypes
6. Question
   Propósito: Preguntas dentro de las encuestas
   Clave: surveyId, order, type
   Relaciones: Pertenece a Survey, tiene QuestionAlternatives
7. QuestionAlternative
   Propósito: Opciones de respuesta con valores por dimensión
   Clave: questionId, value
   Relaciones: Pertenece a Question, tiene DimensionValues
8. Dimension
   Propósito: Dimensiones de bienestar (ansiedad, depresión, etc.)
   Clave: id, name, color
   Relaciones: Referenciada en QuestionAlternative, DimensionScore
   
�� ENTIDADES DE RESPUESTAS
9. SurveyResponse ⭐ ENTIDAD CRÍTICA
   Propósito: Respuestas de estudiantes a encuestas
   Clave: studentId, surveyId, completedAt
   Contenido: questionResponses con dimensionScores
   Contexto: ResponseContext con datos geográficos y temporales
10. QuestionResponse
    Propósito: Respuesta a una pregunta específica
    Clave: questionId, selectedAlternativeId
    Contenido: dimensionScores calculados
11. DimensionScore
    Propósito: Score calculado para una dimensión específica
    Clave: dimensionId, score, weightedScore
    
⚠️ ENTIDADES DE RIESGO Y ALERTAS
12. RiskAssessment ⭐ ENTIDAD CLAVE
    Propósito: Evaluación de riesgo del estudiante
    Clave: studentId, assessmentDate
    Contenido: dimensionAssessments, compositeScore, overallRiskLevel
    Temporalidad: Generado periódicamente (24h, 48h, etc.)
13. Alert
    Propósito: Alertas generadas por detección de riesgo
    Clave: studentId, type, severity, status
    Workflow: AlertWorkflow, AlertEscalationRules
    Tipos: AlertType (RISK_DETECTED, SURVEY_MISSED, etc.)
14. Intervention
    Propósito: Intervenciones realizadas por orientadores
    Clave: alertId, studentId, counselorId
    Estado: InterventionStatus, InterventionType
    Resultado: InterventionOutcome
    
�� ENTIDADES DE ANALÍTICAS
15. Analytics
    Propósito: Métricas agregadas por organización
    Clave: organizationId, date
    Contenido: Participación, bienestar, riesgo, intervenciones
16. DailyAnalytics ⭐ ENTIDAD OPTIMIZADA
    Propósito: Analytics optimizado para dashboards
    Clave: organizationId, date, scope
    Contenido: ParticipationMetrics, DimensionMetrics, TrendMetrics
17. StudentRiskTimeline
    Propósito: Timeline de riesgo para análisis temporal
    Clave: studentId
    Contenido: timeline (30 días), RollingMetrics
    
�� ENTIDADES DE APOYO
18. AlertQueue
    Propósito: Cola de procesamiento de alertas
    Clave: organizationId, processingDate
    Contenido: Alertas agrupadas por prioridad
19. ProfileMetrics
    Propósito: Métricas pre-calculadas por perfil
    Clave: profileId
    Contenido: Scores actuales, tasas de respuesta
20. ConsentLog
    Propósito: Registro de consentimientos de padres
    Clave: studentId, parentId, type
    Estado: ConsentStatus, ConsentType
    
�� ENTIDADES ESPECIALIZADAS
21. StudentRelationship
    Propósito: Relaciones entre estudiantes (amigos, bullying)
    Clave: studentId, relatedStudentId
    Tipo: RelationshipType, RelationshipIntensity
22. PlanSurveyAccess
    Propósito: Conexión entre planes y encuestas disponibles
    Clave: planType, surveyId
    Contenido: isIncluded, maxResponsesPerMonth

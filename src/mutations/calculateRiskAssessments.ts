import { StaticModelDirective } from "../../lib/StaticModelDirective";
import { GraphQLObjectType } from "graphql";

interface CalculateRiskAssessmentsArgs {
  organizationId?: string;
  studentId?: string;
  timeWindows?: number[]; // [1, 3, 7, 30] días
  forceRecalculate?: boolean;
}

interface DimensionScore {
  dimensionId: string;
  score: number;
  weightedScore: number;
  responseCount: number;
}

interface RiskAssessmentResult {
  studentId: string;
  assessmentDate: Date;
  dimensionAssessments: Array<{
    dimensionId: string;
    score: number;
    riskLevel: string;
    trend: string;
    threshold: number;
  }>;
  compositeScore: number;
  overallRiskLevel: string;
  trend: string;
  timeWindow: number;
}

export class RiskAssessmentCalculator {
  private static readonly DEFAULT_TIME_WINDOWS = [1, 3, 7, 30];
  private static readonly RISK_THRESHOLDS = {
    LOW: 0.3,
    MEDIUM: 0.6,
    HIGH: 0.8,
    CRITICAL: 0.9,
  };

  /**
   * Calcula los RiskAssessments para estudiantes
   */
  public static async calculateRiskAssessments(
    root: any,
    args: CalculateRiskAssessmentsArgs,
    context: any,
    info: any
  ): Promise<{
    success: boolean;
    results: RiskAssessmentResult[];
    errors: string[];
  }> {
    try {
      const {
        organizationId,
        studentId,
        timeWindows = this.DEFAULT_TIME_WINDOWS,
        forceRecalculate = false,
      } = args;

      console.log("🚀 Iniciando cálculo de RiskAssessments:", {
        organizationId,
        studentId,
        timeWindows,
      });

      // 1. Obtener estudiantes a procesar
      const students = await this.getStudentsToProcess(
        organizationId,
        studentId,
        context,
        info
      );

      if (!students || students.length === 0) {
        return {
          success: false,
          results: [],
          errors: ["No se encontraron estudiantes para procesar"],
        };
      }

      const results: RiskAssessmentResult[] = [];
      const errors: string[] = [];

      // 2. Procesar cada estudiante
      for (const student of students) {
        try {
          const studentResults = await this.processStudent(
            student,
            timeWindows,
            forceRecalculate,
            context,
            info
          );
          results.push(...studentResults);
        } catch (error) {
          console.error(`❌ Error procesando estudiante ${student.id}:`, error);
          const errorMessage =
            error instanceof Error ? error.message : "Error desconocido";
          errors.push(
            `Error procesando estudiante ${student.id}: ${errorMessage}`
          );
        }
      }

      console.log(
        `✅ Cálculo completado: ${results.length} assessments generados, ${errors.length} errores`
      );

      return { success: true, results, errors };
    } catch (error) {
      console.error("❌ Error en calculateRiskAssessments:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Error desconocido";
      return { success: false, results: [], errors: [errorMessage] };
    }
  }

  /**
   * Obtiene la lista de estudiantes a procesar
   */
  private static async getStudentsToProcess(
    organizationId?: string,
    studentId?: string,
    context?: any,
    info?: any
  ): Promise<any[]> {
    // Obtener el tipo Profile del schema
    const profileType = this.getProfileType(context);

    if (studentId) {
      // Procesar un estudiante específico
      const student = await StaticModelDirective.findOneQueryResolver(
        profileType
      )(null, { where: { id: studentId, role: "STUDENT" } }, context, info);
      return student ? [student] : [];
    } else {
      // Procesar todos los estudiantes de la organización
      const students = await StaticModelDirective.findQueryResolver(
        profileType
      )(
        null,
        {
          where: {
            organizationId,
            role: "STUDENT",
            isActive: true,
          },
          page: 1,
          pageSize: 1000,
          includeMaxPages: false,
        },
        context,
        info
      );
      return students?.list || [];
    }
  }

  /**
   * Procesa un estudiante específico para todos los timeWindows
   */
  private static async processStudent(
    student: any,
    timeWindows: number[],
    forceRecalculate: boolean,
    context: any,
    info: any
  ): Promise<RiskAssessmentResult[]> {
    const results: RiskAssessmentResult[] = [];

    console.log(`📊 Procesando estudiante: ${student.id} (${student.name})`);

    for (const days of timeWindows) {
      try {
        const assessment = await this.calculateAssessmentForTimeWindow(
          student,
          days,
          forceRecalculate,
          context,
          info
        );

        if (assessment) {
          results.push(assessment);
        }
      } catch (error) {
        console.error(
          `❌ Error calculando assessment para ${days} días:`,
          error
        );
        throw error;
      }
    }

    return results;
  }

  /**
   * Calcula el RiskAssessment para una ventana de tiempo específica
   */
  private static async calculateAssessmentForTimeWindow(
    student: any,
    days: number,
    forceRecalculate: boolean,
    context: any,
    info: any
  ): Promise<RiskAssessmentResult | null> {
    const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const assessmentDate = new Date();

    console.log(
      `📅 Calculando assessment para ${days} días (desde ${cutoffDate.toISOString()})`
    );

    // 1. Obtener respuestas de encuestas del período
    const surveyResponses = await this.getSurveyResponses(
      student.id,
      cutoffDate,
      context,
      info
    );

    if (!surveyResponses || surveyResponses.length === 0) {
      console.log(`⚠️ No hay respuestas para ${days} días`);
      return null;
    }

    // 2. Calcular scores por dimensión
    const dimensionScores = await this.calculateDimensionScores(
      surveyResponses,
      days
    );

    // 3. Calcular score compuesto
    const compositeScore = this.calculateCompositeScore(dimensionScores);

    // 4. Determinar nivel de riesgo
    const overallRiskLevel = this.determineRiskLevel(compositeScore);

    // 5. Calcular tendencia
    const trend = await this.calculateTrend(student.id, days, context, info);

    // 6. Crear dimension assessments
    const dimensionAssessments = dimensionScores.map((dimScore) => ({
      dimensionId: dimScore.dimensionId,
      score: dimScore.averageScore,
      riskLevel: this.determineRiskLevel(dimScore.averageScore),
      trend: dimScore.trend || "stable",
      threshold: this.RISK_THRESHOLDS.MEDIUM,
    }));

    // 7. Crear o actualizar RiskAssessment
    const riskAssessment = await this.createOrUpdateRiskAssessment(
      student,
      assessmentDate,
      dimensionAssessments,
      compositeScore,
      overallRiskLevel,
      trend,
      days,
      context,
      info
    );

    return {
      studentId: student.id,
      assessmentDate,
      dimensionAssessments,
      compositeScore,
      overallRiskLevel,
      trend,
      timeWindow: days,
    };
  }

  /**
   * Obtiene las respuestas de encuestas para un período
   */
  private static async getSurveyResponses(
    studentId: string,
    cutoffDate: Date,
    context: any,
    info: any
  ): Promise<any[]> {
    const surveyResponseType = this.getSurveyResponseType(context);

    const responses = await StaticModelDirective.findQueryResolver(
      surveyResponseType
    )(
      null,
      {
        where: {
          studentId,
          completedAt: { $gte: cutoffDate.toISOString() },
        },
        page: 1,
        pageSize: 1000,
        includeMaxPages: false,
      },
      context,
      info
    );

    return responses?.list || [];
  }

  /**
   * Calcula los scores por dimensión
   */
  private static async calculateDimensionScores(
    surveyResponses: any[],
    days: number
  ): Promise<
    Array<{
      dimensionId: string;
      averageScore: number;
      trend: string;
      responseCount: number;
    }>
  > {
    const dimensionScores: { [key: string]: any[] } = {};

    // Agrupar scores por dimensión
    surveyResponses.forEach((response) => {
      const surveyWeight = response.survey?.weight || 1.0;

      response.questionResponses?.forEach((questionResponse: any) => {
        questionResponse.dimensionScores?.forEach((dimScore: any) => {
          const dimId = dimScore.dimensionId;

          if (!dimensionScores[dimId]) {
            dimensionScores[dimId] = [];
          }

          dimensionScores[dimId].push({
            score: dimScore.score,
            weightedScore: dimScore.weightedScore,
            surveyWeight,
            timestamp: response.completedAt,
          });
        });
      });
    });

    // Calcular promedio ponderado por dimensión
    const results = [];

    for (const [dimensionId, scores] of Object.entries(dimensionScores)) {
      let totalWeightedScore = 0;
      let totalWeight = 0;

      scores.forEach((score) => {
        const finalWeight = score.surveyWeight;
        totalWeightedScore += score.weightedScore * finalWeight;
        totalWeight += finalWeight;
      });

      const averageScore =
        totalWeight > 0 ? totalWeightedScore / totalWeight : 0;

      // Calcular tendencia simple (comparar primera y última respuesta)
      const trend = this.calculateSimpleTrend(scores);

      results.push({
        dimensionId,
        averageScore,
        trend,
        responseCount: scores.length,
      });
    }

    return results;
  }

  /**
   * Calcula el score compuesto
   */
  private static calculateCompositeScore(dimensionScores: any[]): number {
    if (dimensionScores.length === 0) return 0;

    const totalScore = dimensionScores.reduce(
      (sum, dim) => sum + dim.averageScore,
      0
    );
    return totalScore / dimensionScores.length;
  }

  /**
   * Determina el nivel de riesgo basado en el score
   */
  private static determineRiskLevel(score: number): string {
    if (score >= this.RISK_THRESHOLDS.CRITICAL) return "CRITICAL";
    if (score >= this.RISK_THRESHOLDS.HIGH) return "HIGH";
    if (score >= this.RISK_THRESHOLDS.MEDIUM) return "MEDIUM";
    return "LOW";
  }

  /**
   * Calcula la tendencia comparando con períodos anteriores
   */
  private static async calculateTrend(
    studentId: string,
    days: number,
    context: any,
    info: any
  ): Promise<string> {
    // Obtener assessment anterior para comparar
    const previousAssessment = await this.getPreviousAssessment(
      studentId,
      days,
      context,
      info
    );

    if (!previousAssessment) return "stable";

    const currentScore = await this.getCurrentCompositeScore(
      studentId,
      days,
      context,
      info
    );
    const previousScore = previousAssessment.compositeScore;

    const difference = currentScore - previousScore;
    const threshold = 0.1; // 10% de diferencia

    if (Math.abs(difference) < threshold) return "stable";
    return difference > 0 ? "declining" : "improving";
  }

  /**
   * Calcula tendencia simple basada en scores
   */
  private static calculateSimpleTrend(scores: any[]): string {
    if (scores.length < 2) return "stable";

    const sortedScores = scores.sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
    const firstScore = sortedScores[0].score;
    const lastScore = sortedScores[sortedScores.length - 1].score;

    const difference = lastScore - firstScore;
    const threshold = 0.05; // 5% de diferencia

    if (Math.abs(difference) < threshold) return "stable";
    return difference > 0 ? "declining" : "improving";
  }

  /**
   * Crea o actualiza el RiskAssessment en la base de datos
   */
  private static async createOrUpdateRiskAssessment(
    student: any,
    assessmentDate: Date,
    dimensionAssessments: any[],
    compositeScore: number,
    overallRiskLevel: string,
    trend: string,
    timeWindow: number,
    context: any,
    info: any
  ): Promise<any> {
    const riskAssessmentType = this.getRiskAssessmentType(context);

    const assessmentData = {
      studentId: student.id,
      organizationId: student.organizationId,
      assessmentDate: assessmentDate.toISOString(),
      dimensionAssessments,
      compositeScore,
      overallRiskLevel,
      trend,
      timeWindow,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Buscar assessment existente para el mismo período
    const existingAssessment = await StaticModelDirective.findOneQueryResolver(
      riskAssessmentType
    )(
      null,
      {
        where: {
          studentId: student.id,
          timeWindow,
          assessmentDate: {
            $gte: new Date(
              assessmentDate.getTime() - 24 * 60 * 60 * 1000
            ).toISOString(),
          },
        },
      },
      context,
      info
    );

    if (existingAssessment) {
      // Actualizar assessment existente
      return await StaticModelDirective.updateMutationResolver(
        riskAssessmentType
      )(
        null,
        {
          data: assessmentData,
          where: { id: existingAssessment.id },
          upsert: false,
        },
        context,
        info
      );
    } else {
      // Crear nuevo assessment
      return await StaticModelDirective.createMutationResolver(
        riskAssessmentType
      )(null, { data: assessmentData }, context, info);
    }
  }

  /**
   * Obtiene el assessment anterior para comparar tendencias
   */
  private static async getPreviousAssessment(
    studentId: string,
    days: number,
    context: any,
    info: any
  ): Promise<any> {
    const riskAssessmentType = this.getRiskAssessmentType(context);

    const assessments = await StaticModelDirective.findQueryResolver(
      riskAssessmentType
    )(
      null,
      {
        where: {
          studentId,
          timeWindow: days,
        },
        page: 1,
        pageSize: 2,
        includeMaxPages: false,
      },
      context,
      info
    );

    return assessments?.list?.[1]; // El segundo más reciente
  }

  /**
   * Obtiene el score compuesto actual
   */
  private static async getCurrentCompositeScore(
    studentId: string,
    days: number,
    context: any,
    info: any
  ): Promise<number> {
    const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const surveyResponses = await this.getSurveyResponses(
      studentId,
      cutoffDate,
      context,
      info
    );
    const dimensionScores = await this.calculateDimensionScores(
      surveyResponses,
      days
    );
    return this.calculateCompositeScore(dimensionScores);
  }

  /**
   * Obtiene el tipo Profile del schema
   */
  private static getProfileType(context: any): GraphQLObjectType {
    // Esta función debería obtener el tipo Profile del schema
    // Por ahora retornamos null y manejamos el error
    return context.schema.getType("Profile") as GraphQLObjectType;
  }

  /**
   * Obtiene el tipo SurveyResponse del schema
   */
  private static getSurveyResponseType(context: any): GraphQLObjectType {
    return context.schema.getType("SurveyResponse") as GraphQLObjectType;
  }

  /**
   * Obtiene el tipo RiskAssessment del schema
   */
  private static getRiskAssessmentType(context: any): GraphQLObjectType {
    return context.schema.getType("RiskAssessment") as GraphQLObjectType;
  }
}

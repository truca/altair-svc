import { RiskAssessmentCalculator } from "../mutations/calculateRiskAssessments";

export const calculateRiskAssessmentsResolver = {
  Mutation: {
    calculateRiskAssessments: async (
      root: any,
      args: {
        organizationId?: string;
        studentId?: string;
        timeWindows?: number[];
        forceRecalculate?: boolean;
      },
      context: any,
      info: any
    ) => {
      try {
        console.log("🎯 Ejecutando mutación calculateRiskAssessments:", args);

        // Validar argumentos
        if (!args.organizationId && !args.studentId) {
          return {
            success: false,
            results: [],
            errors: ["Se requiere organizationId o studentId"],
          };
        }

        // Ejecutar cálculo
        const result = await RiskAssessmentCalculator.calculateRiskAssessments(
          root,
          args,
          context,
          info
        );

        console.log("✅ Mutación calculateRiskAssessments completada:", {
          success: result.success,
          resultsCount: result.results.length,
          errorsCount: result.errors.length,
        });

        return result;
      } catch (error) {
        console.error("❌ Error en resolver calculateRiskAssessments:", error);
        const errorMessage =
          error instanceof Error ? error.message : "Error desconocido";

        return {
          success: false,
          results: [],
          errors: [errorMessage],
        };
      }
    },
  },
};

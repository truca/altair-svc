import { VisitableSchemaType } from "@graphql-tools/utils";
import { ModelDirective } from "../ModelDirective";

export class StaticModelDirective extends ModelDirective {
  public static findQueryResolver(type: VisitableSchemaType) {
    // Assuming ModelDirective has a static method to handle this
    return ModelDirective.prototype.findQueryResolver.call(this, type);
  }

  public static findOneQueryResolver(type: VisitableSchemaType) {
    // Assuming ModelDirective has a static method to handle this
    return ModelDirective.prototype.findOneQueryResolver.call(this, type);
  }

  public static createMutationResolver(
    type: VisitableSchemaType,
    parentIdsParam = {}
  ) {
    // Assuming ModelDirective has a static method to handle this
    return ModelDirective.prototype.createMutationResolver.call(
      this,
      type,
      parentIdsParam
    );
  }

  public static updateMutationResolver(type: VisitableSchemaType) {
    // Assuming ModelDirective has a static method to handle this
    return ModelDirective.prototype.updateResolver.call(this, type);
  }
}

// Example usage of StaticModelDirective
// const typeExample = {} as any;
// const parentIdsParamExample = {} as any;

// const findQueryResult = StaticModelDirective.findQueryResolver(typeExample);
// const findOneQueryResult =
//   StaticModelDirective.findOneQueryResolver(typeExample);
// const createMutationResult = StaticModelDirective.createMutationResolver(
//   typeExample,
//   parentIdsParamExample
// );
// const updateMutationResult =
//   StaticModelDirective.updateMutationResolver(typeExample);

// console.log({
//   findQueryResult,
//   findOneQueryResult,
//   createMutationResult,
//   updateMutationResult,
// });

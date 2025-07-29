import { makeSchema } from "../lib/utils";
import { FormTypes } from "../lib/types";

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

  # Represents a user.  Supports: User Registration and Login, Profile Customization, In-App Messaging, Integration with Other Platforms, Notifications and Updates.
  type Profile @model @auth(read: ["public"]) {
    country: String!
    email: String!
    password: String!
    username: String
    profilePicture: String
    createdAt: DateTime!
    updatedAt: DateTime
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

  # CampaignGroup
  # CampaignGroup remains unchanged (even though it has @model)
  # but any field that referenced a service type is updated:
  # type Campaign
  #   @model
  #   @auth(read: ["public"], update: ["public"], delete: ["public"]) {
  #   # metadata
  #   campaignGroupId: ID @hidden(value: true)
  #   campaignGroup: CampaignGroup @hidden(value: true)
  #   country: String @from(queryParam: "country") @hidden(value: true)
  #   productManagerId: String! @selectFrom(table: "productManagers", labelAttribute: "name", valueAttribute: "externalId") @position(step: 1, row: 1) @meta(label: "Product Manager", placeholder: "Selecciona una Opción")
  #   businessUnitId: String! @selectFrom(values: ["1P", "3P"]) @position(step: 1, row: 2) @meta(label: "Unidad de Negocio", placeholder: "Selecciona una Opción")
  #   campaignName: String! @position(step: 1, row: 3) @meta(label: "Nombre de campaña", placeholder: "Ingresa el Nombre de la Campaña")
  #   eventTypeId: String! @selectFrom(values: ["Cyber Day", "Black Friday", "14_F", "Escolares", "Black_Week", "DDM", "DDP", "DDN", "Sneaker_Corner", "CD", "CM", "CW", "Días_F", "Navidad", "Otra"]) @position(step: 1, row: 3) @meta(label: "Evento", placeholder: "Selecciona una Opción")
  #   customId: String @hidden(value: true)
  #   nomenclature: String @hidden(value: true)

  #   # filters
  #   campaignSellerId: String @selectFrom(table: "sellers", labelAttribute: "name", valueAttribute: "externalId", dependentField: "businessUnitId") @meta(label: "Seller", placeholder: "Selecciona una Opción") @position(step: 1, row: 4)
  #   campaignBrandId: [String!]! @selectManyFrom(table: "brands", labelAttribute: "name", valueAttribute: "externalId", dependentField: "campaignSellerId") @meta(label: "Marca", placeholder: "Selecciona una Opción") @position(step: 1, row: 5)
  #   campaignCategoryId: [String!]! @selectManyFrom(table: "categories", labelAttribute: "name", valueAttribute: "externalId", dependentField: "campaignBrandId") @meta(label: "Categoría", placeholder: "Selecciona una Opción") @position(step: 1, row: 6)
  #   campaignSubCategoryId: [String!]! @selectManyFrom(table: "subcategories", labelAttribute: "name", valueAttribute: "externalId", dependentField: "campaignCategoryId") @meta(label: "Subcategoría", placeholder: "Selecciona una Opción") @position(step: 1, row: 7)

  #   #dates
  #   startDate: DateTime! @type(value: DATE) @position(step: 1, row: 8) @meta(label: "Fecha de Inicio", placeholder: "Selecciona una fecha")
  #   endDate: DateTime! @type(value: DATE) @position(step: 1, row: 8) @meta(label: "Fecha de Término", placeholder: "Selecciona una fecha")
  #   implementationDate: DateTime! @type(value: DATE) @position(step: 1, row: 9) @meta(label: "Fecha de Implementación", placeholder: "Selecciona una fecha")
  #   campaignType: String @selectFrom(optionValues: [
  #     {label: "Táctico", value: "tactico"}
  #     {label: "Always On", value: "always_on"}
  #   ]) @position(step: 1, row: 10) @meta(label: "Tipo de campaña", placeholder: "Selecciona una Opción")
  #   createdAt: String @type(value: DATETIME) @hidden(value: true)
  #   updatedAt: String @type(value: DATETIME) @hidden(value: true)

  #   bannersEnabled: Boolean! @default(value: false) @position(step: 1, row: 11) @meta(label: "Banners", placeholder: "Selecciona una Opción")
  #   CRMEnabled: Boolean! @default(value: false) @position(step: 1, row: 12) @meta(label: "CRM", placeholder: "Selecciona una Opción")
  #   homeLandingEnabled: Boolean! @default(value: false) @position(step: 1, row: 13) @meta(label: "Home Landing", placeholder: "Selecciona una Opción")
  #   mediaOnEnabled: Boolean! @default(value: false) @position(step: 1, row: 14) @meta(label: "Media On", placeholder: "Selecciona una Opción")
  #   ratingsAndReviewsEnabled: Boolean! @default(value: false) @position(step: 1, row: 15) @meta(label: "Ratings and Reviews", placeholder: "Selecciona una Opción")
  #   sponsoredBrandsEnabled: Boolean! @default(value: false) @position(step: 1, row: 16) @meta(label: "Sponsored Brands", placeholder: "Selecciona una Opción")
  #   sponsoredProductEnabled: Boolean! @default(value: false) @position(step: 1, row: 17) @meta(label: "Sponsored Product", placeholder: "Selecciona una Opción")

  #   mediaOffEnabled: Boolean! @position(step: 1, row: 18) @meta(label: "Media Off", placeholder: "Selecciona una Opción")
  #   mediaOffBudget: Float @position(step: 1, row: 18) @meta(label: "", placeholder: "Presupuesto Media Off") @hidden(cond: [{ field: "mediaOffEnabled", valueBoolean: false}])
  #   storeEnabled: Boolean! @position(step: 1, row: 19) @meta(label: "Tienda", placeholder: "Selecciona una Opción")
  #   storeBudget: Float @position(step: 1, row: 19) @meta(label: "", placeholder: "Presupuesto Tienda") @hidden(cond: [{ field: "storeEnabled", valueBoolean: false}])
  #   graphicsEnabled: Boolean! @position(step: 1, row: 20) @meta(label: "Gráficos", placeholder: "Selecciona una Opción")
  #   graphicsBudget: Float @position(step: 1, row: 20) @meta(label: "", placeholder: "Presupuesto Gráficos") @hidden(cond: [{ field: "graphicsEnabled", valueBoolean: false}])
  #   othersEnabled: Boolean! @position(step: 1, row: 21) @meta(label: "Otros", placeholder: "Selecciona una Opción")
  #   othersBudget: Float @position(step: 1, row: 21) @meta(label: "", placeholder: "Presupuesto Otros") @hidden(cond: [{ field: "othersEnabled", valueBoolean: false}])
  #   mediaPlan: File @position(step: 1, row: 22) @meta(label: "Plan de Medios", placeholder: "Ingresa el Plan de Medios")

  #   # service
  #   sponsoredProduct: SponsoredProduct @hidden(cond: [{ field: "sponsoredProductEnabled", valueBoolean: false}]) @position(step: 2, row: 1) @meta(label: "Productos patrocinados")
  #   sponsoredBrand: SponsoredBrand @hidden(cond: [{ field: "sponsoredBrandsEnabled", valueBoolean: false}]) @position(step: 2, row: 2) @meta(label: "Marcas patrocinadas")
  #   ratingAndReview: RatingAndReview @hidden(cond: [{ field: "ratingsAndReviewsEnabled", valueBoolean: false}]) @position(step: 2, row: 3) @meta(label: "Ratings and Reviews")

  #   # template
  #   banner: Banner @hidden(cond: [{ field: "bannersEnabled", valueBoolean: false}]) @position(step: 2, row: 4) #@position(step: 1, row: 23)
  #   CRM: CRM @hidden(cond: [{ field: "CRMEnabled", valueBoolean: false}]) @position(step: 2, row: 5)
  #   homeLanding: HomeLanding @hidden(cond: [{ field: "homeLandingEnabled", valueBoolean: false}]) @position(step: 2, row: 6)
  #   mediaOn: MediaOn @hidden(cond: [{ field: "mediaOnEnabled", valueBoolean: false}]) @position(step: 2, row: 7)
  # }

  # Specific service form types
  # type SponsoredProduct
  #   @model(table: "Service")
  #   @auth(read: ["public"], update: ["public"], delete: ["public"]) {
  #   country: String @from(queryParam: "country")
  #   campaignId: ID @from(parentAttribute: "id")
  #   campaign: Campaign @hidden(value: true)

  #   # Sponsored Products specific fields
  #   startDate: DateTime! @defaultFrom(parentAttribute: "startDate")
  #   endDate: DateTime! @defaultFrom(parentAttribute: "endDate")
  #   implementationDate: DateTime! @defaultFrom(parentAttribute: "implementationDate")
  #   budgetType: String! @selectFrom(optionValues: [{label: "Total", value: "Total"}, {label: "Diario", value: "Diario"}])
  #   budget: Float!
  #   dailyLimitEnabled: Boolean
  #   dailyBudgetLimit: Float
  #   skus: [String!]
  #   comment: String

  #   # Base campaign fields
  #   campaignSellerId: String! @from(parentAttribute: "campaignSellerId")
  #   campaignBrandId: [String!]! @from(parentAttribute: "campaignBrandId")
  #   categoryId: [String!]! @from(parentAttribute: "campaignCategoryId")
  # }

  # type SponsoredBrand
  #   @model(table: "Service")
  #   @auth(read: ["public"], update: ["public"], delete: ["public"]) {
  #   country: String @from(queryParam: "country")
  #   campaignId: ID @from(parentAttribute: "id")
  #   campaign: Campaign @hidden(value: true)

  #   # Sponsored Brands specific fields
  #   startDate: DateTime! @defaultFrom(parentAttribute: "startDate")
  #   endDate: DateTime! @defaultFrom(parentAttribute: "endDate")
  #   implementationDate: DateTime! @defaultFrom(parentAttribute: "implementationDate")
  #   budgetType: String! @selectFrom(optionValues: [{label: "Total", value: "Total"}, {label: "Diario", value: "Diario"}])
  #   budget: Float!
  #   dailyLimitEnabled: Boolean
  #   dailyBudgetLimit: Float
  #   title: String! # max 42 characters
  #   skus: String!
  #   url: String!
  #   campaignTypeId: String! @selectFrom(optionValues: [{label: "Táctico", value: "tactico"}, {label: "Always On", value: "always_on"}])

  #   # Base campaign fields
  #   campaignSellerId: String! @from(parentAttribute: "campaignSellerId")
  #   campaignBrandId: [String!]! @from(parentAttribute: "campaignBrandId")
  #   categoryId: [String!]! @from(parentAttribute: "campaignCategoryId")
  # }

  # union CRMSubProductUnion = CRMEmail | CRMTrigger | CRMBanner | CRMGeneric

  # type CRM
  #   @model(table: "Template")
  #   @auth(read: ["public"], update: ["public"], delete: ["public"]) {
  #   country: String @from(queryParam: "country") @hidden(value: true)
  #   campaignId: ID @from(parentAttribute: "id") @hidden(value: true)
  #   campaign: Campaign @hidden(value: true)

  #   # CRM specific fields
  #   crmTypeId: String! @selectFrom(values: ["Propenso", "Segmentado"]) @meta(label: "Tipo de CRM")
  #   templateId: String! @selectFrom(values: ["1P", "3P"]) @meta(label: "Template")
  #   numberTouches: Float @meta(label: "Número de toques")
  #   subProducts: [CRMSubProductUnion] @polymorphicArray(types: ["CRMEmail", "CRMTrigger", "CRMBanner", "CRMGeneric"]) @meta(label: "Subproductos")

  #   # Base campaign fields
  #   campaignSellerId: String! @from(parentAttribute: "campaignSellerId")
  #   campaignBrandId: [String!]! @from(parentAttribute: "campaignBrandId")
  #   categoryId: [String!]! @from(parentAttribute: "campaignCategoryId")
  #   createdAt: DateTime @hidden(value: true)
  #   updatedAt: DateTime @hidden(value: true)
  # }

  input ServiceInputType2 {
    nomenclature: String
    campaignGroupCustomId: String
    campaignSellerId: String
    campaignBrandId: [String]
    categoryId: [String]
    country: String
  }

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

const formTypes: FormTypes = {
  CAMPAIGNGROUP: "campaignGroup",
  CAMPAIGN: "campaign",
  SELLER: "seller",
  BRAND: "brand",
  CATEGORY: "category",
  SUBCATEGORY: "subcategory",
  PRODUCTMANAGER: "productManager",
};

export const schema = makeSchema({
  typeDefs: typeDefinitions,
  formTypes,
  queries: {},
  mutations: {},
});

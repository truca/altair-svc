import { makeSchema } from "../lib/utils";
import { FormTypes } from "../lib/types";
import { FORMS } from "./forms";

const typeDefinitions = /* GraphQL */ `
  scalar ID
  scalar File
  scalar DateTime
  directive @model(db: String) on OBJECT
  directive @file(maxSize: Float!, types: [String!]!) on FIELD_DEFINITION
  directive @auth(
    create: [String]
    read: [String]
    update: [String]
    delete: [String]
  ) on OBJECT | FIELD_DEFINITION
  directive @connection(type: String) on FIELD_DEFINITION
  directive @subscribe(on: [String], topic: String) on OBJECT

  enum FieldType {
    TEXT
    TEXTAREA
    NUMBER
    EMAIL
    PASSWORD
    CHECKBOX
    RADIO
    SELECT
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

  type Field {
    label: String
    field: String
    type: FieldType
    defaultValue: String
    options: [FieldOption]
    validation: [FieldValidation]
  }

  type Form {
    fields: [Field]
  }

  enum FormType {
    CAMPAIGNGROUP
    SELLER
    BRAND
    CATEGORY
    SUBCATEGORY
    PRODUCTMANAGER
  }

  # Represents a user.  Supports: User Registration and Login, Profile Customization, In-App Messaging, Integration with Other Platforms, Notifications and Updates.
  type Profile @model @auth(read: ["public"]) {
    uid: String
    username: String
    profilePicture: String
    createdAt: DateTime!
    updatedAt: DateTime
  }

  input ObjectId {
    id: ID!
  }

  input ProfileInputType2 {
    uid: String
    username: String
    profilePicture: String
    lat: Float
    lng: Float
    createdAt: DateTime
    updatedAt: DateTime
    favoriteWarbands: [ObjectId]
    favoriteCards: [ObjectId]
    # collection: Collection
    participatedEvents: [ObjectId] # Events the user participated in
    wonMatches: [ObjectId] # Matches this user won
    wonTournaments: [ObjectId] # Tournaments this user won
  }

  type ProductManager
    @model
    @auth(read: ["public"], update: ["public"], delete: ["public"]) {
    country: String

    externalId: ID!
    name: String!
    email: String!
    createdAt: DateTime
    updatedAt: DateTime
  }

  type Seller
    @model
    @auth(read: ["public"], update: ["public"], delete: ["public"]) {
    country: String

    externalId: ID!
    name: String!
    businessUnitId: String!
    createdAt: DateTime
    updatedAt: DateTime
  }

  type Brand
    @model
    @auth(read: ["public"], update: ["public"], delete: ["public"]) {
    country: String
    parentId: ID

    externalId: ID!
    name: String!
    sellerIds: [String!]!
    createdAt: DateTime
    updatedAt: DateTime
  }

  type Category
    @model
    @auth(read: ["public"], update: ["public"], delete: ["public"]) {
    country: String

    externalId: ID!
    name: String!
    brandIds: [String!]!
    createdAt: DateTime
    updatedAt: DateTime
  }

  type Subcategory
    @model
    @auth(read: ["public"], update: ["public"], delete: ["public"]) {
    country: String
    parentId: ID

    externalId: ID!
    name: String!
    categoryIds: [String!]!
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
  type CampaignGroup
    @model
    @auth(read: ["public"], update: ["public"], delete: ["public"]) {
    country: String
    productManagerId: String!
    businessUnitId: String!
    campaignName: String!
    eventTypeId: String!
    sellerId: String!
    brandId: [String!]!
    categoryId: [String!]!
    subCategoryId: [String!]!
    startDate: String!
    endDate: String!

    # Service flags
    bannersEnabled: Boolean!
    CRMEnabled: Boolean!
    homeLandingEnabled: Boolean!
    mediaOnEnabled: Boolean!
    ratingsAndReviewsEnabled: Boolean!
    sponsoredBrandsEnabled: Boolean!
    sponsoredProductEnabled: Boolean!
    mediaOffEnabled: Boolean!
    mediaOffBudget: Float
    storeEnabled: Boolean!
    storeBudget: Float
    graphicsEnabled: Boolean!
    graphicsBudget: Float
    othersEnabled: Boolean!
    othersBudget: Float
    mediaPlan: String

    # Forms – note:
    # • Forms that were originally services (@model) now use Service
    # • Middleware forms remain but their service fields are updated to Service
    mediaOnForm: MediaOnForm
    sponsoredBrandForm: Service
    sponsoredProductForm: Service
    bannerForm: Service
    CRMForm: CRMForm
    ratingAndReviewForm: Service
    homeLandingForm: HomeLandingForm

    campaignIds: [String!]
    nomenclature: String
  }

  # Middleware types are kept, but if they contained a service type they now reference Service:
  type MediaOnForm {
    country: String
    strategiesId: String!
    budget: Float!
    commission: String!
    totalAmount: Float!
    # Originally [MediosDigitalesStrategy!]! becomes [Service!]!
    strategies: [Service]
  }

  type CRMForm {
    country: String
    crmTypeId: String!
    templateId: String!
    numberTouches: String
    # subProducts was [CRMCampaignSubProduct!]! → [Service!]!
    subProducts: [Service]
  }

  type HomeLandingForm {
    country: String
    totalBudget: Float!
    # strategies was [HomeLandingStrategy!]! → [Service!]!
    strategies: [Service]
  }

  type PlannerComments {
    text: String!
    user: String!
    date: String!
  }

  # A unified Service type that combines all fields from your service (@model) types.
  # All fields (except serviceType) are optional.
  type Service
    @model
    @auth(read: ["public"], update: ["public"], delete: ["public"]) {
    country: String

    #Fields from planner
    userAssigned: [String]
    labels: [String]
    plannerComments: [PlannerComments]
    nomenclature: String
    campaignGroupCustomId: String

    # This discriminator is always provided when creating a Service
    serviceType: String

    # Fields from MediosDigitalesStrategy
    campaignId: ID
    mediumId: String
    objectiveId: String
    strategyId: String
    segmentationId: String
    purchaseTypeId: String
    formatsId: String
    budget: Float
    commission: Float
    startDate: DateTime
    endDate: DateTime

    # Fields from SponsoredBrandForm / SponsoredProductForm
    comment: String
    budgetType: String
    dailyLimitEnabled: Boolean
    dailyBudgetLimit: Float
    title: String
    url: String
    # Note: where one type had skus: String and another had skus: [String!],
    # here we use the more general list form:
    skus: [String]
    images: String

    # Fields from BannerFadsForm
    bannerFadBannerTypeId: String
    bannerFadTotalBudget: Float
    bannerFadStartDate: String
    bannerFadEndDate: String
    bannerFadSegmentationTypeId: String
    bannerFadCategoryId: [String]
    bannerFadAudienceId: [String]
    bannerFadUrl: String
    bannerFadComment: String
    bannerMenuTotalBudget: Float
    bannerMenuStartDate: String
    bannerMenuEndDate: String
    bannerMenuUrl: String
    bannerMenuComment: String
    image: String

    # Fields from CRMCampaignSubProduct
    type: String
    base: Float
    shippingDate: String
    internalCampaignName: String
    comments: String
    quantityMonths: Float
    triggerTypeId: String
    # startDate and endDate already included above
    sku: String
    callToAction: String
    smsText: String
    link: String
    text: String
    storeId: String
    cuponTypeId: String
    benefit: String
    benefitAmount: Float
    trigger: String
    message: String
    typeId: String
    units: Float
    segmentation: String

    # Fields from RatingAndReviewForm
    shippingCost: Float
    agreedShipments: Float
    segmentationTypeId: String
    sellerId: String
    brandId: String

    # Fields from HomeLandingStrategy
    visualKey: String
    totalBudget: Float
  }
  # CampaignGroup

  type Services {
    list: [Service]
    maxPages: Float
  }

  input ServiceInputType2 {
    country: String
  }

  type Query {
    _: Boolean
    me(uid: String): Profile
    form(type: FormType): Form
    getServicesBetweenDates(
      startDate: DateTime
      endDate: DateTime
      serviceType: String
      pageSize: Float
      page: Float
      where: ServiceInputType2
    ): Services
  }

  type Mutation {
    _: Boolean
    readTextFile(file: File!): String!
    saveFile(file: File!): Boolean!
    authenticate(
      uid: String
      displayName: String
      email: String
      photoURL: String
      phoneNumber: String
      emailVerified: Boolean
      isAnonymous: Boolean
      createCookies: Boolean
    ): String
    updateMe(id: String, profile: ProfileInputType2): Profile
  }
`;

const formTypes: FormTypes = {
  CAMPAIGNGROUP: "campaignGroup",
  SELLER: "seller",
  BRAND: "brand",
  CATEGORY: "category",
  SUBCATEGORY: "subcategory",
  PRODUCTMANAGER: "productManager",
};

export const schema = makeSchema({
  typeDefs: typeDefinitions,
  formTypes,
  forms: FORMS,
  queries: {},
  mutations: {},
});

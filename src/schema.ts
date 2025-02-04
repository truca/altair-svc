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
    externalId: ID!
    name: String!
    email: String!
    createdAt: DateTime
    updatedAt: DateTime
  }

  type Seller @model @auth(read: ["public"]) {
    externalId: ID!
    name: String!
    createdAt: DateTime
    updatedAt: DateTime
  }

  type Brand @model(db: "cep-firebase") @auth(read: ["public"]) {
    externalId: ID!
    name: String!
    createdAt: DateTime
    updatedAt: DateTime
  }

  type Category @model @auth(read: ["public"]) {
    externalId: ID!
    name: String!
    createdAt: DateTime
    updatedAt: DateTime
  }

  type Subcategory @model @auth(read: ["public"]) {
    externalId: ID!
    name: String!
    createdAt: DateTime
    updatedAt: DateTime
  }

  type Image @model(db: "cep") @auth(read: ["public"]) {
    externalId: ID!
    url: String!
    createdAt: DateTime
    updatedAt: DateTime
  }

  # CampaignGroup
  type CampaignGroup @model @auth(read: ["public"]) {
    productManagerId: String!
    businessUnitId: String!
    campaignTypeId: String!
    eventTypeId: String!
    sellerId: String!
    brandId: String!
    categoryId: String!
    subCategoryId: String!
    startDate: String!
    endDate: String!

    # Service flags
    bannersFadsEnabled: Boolean!
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

    # Forms
    mediaOnForm: MediaOnForm
    sponsoredBrandForm: SponsoredBrandForm
    sponsoredProductForm: SponsoredProductForm
    bannerForm: BannerFadsForm
    CRMForm: CRMForm
    ratingAndReviewForm: RatingAndReviewForm
    homeLandingForm: HomeLandingForm

    campaignIds: [String!]!
  }

  type MediaOnForm {
    strategiesId: String!
    budget: Float!
    commission: String!
    totalAmount: Float!
    strategies: [MediosDigitalesStrategy!]!
  }

  type MediosDigitalesStrategy {
    mediumId: String!
    objectiveId: String!
    strategyId: String!
    segmentationId: String!
    purchaseTypeId: String!
    formatsId: String!
    budget: Float!
    commission: Float!
    startDate: String!
    endDate: String!
  }

  type SponsoredBrandForm {
    budget: Float!
    startDate: String!
    endDate: String!
    comment: String
    budgetType: String!
    dailyLimitEnabled: Boolean
    dailyBudgetLimit: Float
    title: String!
    url: String!
    skus: String!
    images: String!
  }

  type SponsoredProductForm {
    budget: Float!
    startDate: String!
    endDate: String!
    comment: String
    budgetType: String!
    dailyLimitEnabled: Boolean
    dailyBudgetLimit: Float
    url: String!
    skus: String!
  }

  type BannerFadsForm {
    # Banner Fads
    bannerFadBannerTypeId: String!
    bannerFadTotalBudget: Float!
    bannerFadStartDate: String!
    bannerFadEndDate: String!
    bannerFadSegmentationTypeId: String!
    bannerFadCategoryId: String!
    bannerFadUrl: String!
    bannerFadComment: String!

    # Banner Menu
    bannerMenuTotalBudget: Float!
    bannerMenuStartDate: String!
    bannerMenuEndDate: String!
    bannerMenuUrl: String!
    bannerMenuComment: String!
    image: String!
  }

  type CRMForm {
    crmTypeId: String!
    templateId: String!
    subProducts: [CRMCampaignSubProduct!]!
  }

  type CRMCampaignSubProduct {
    type: String!
    budget: Float!
    base: Float!
    shippingDate: String
    internalCampaignName: String!
    comments: String!
    quantityMonths: Float
    triggerTypeId: String
    startDate: String
    endDate: String
    sku: String
    callToAction: String
    url: String
    smsText: String
    link: String
    title: String
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
    skus: [String!]
  }

  type RatingAndReviewForm {
    budget: Float!
    startDate: String!
    endDate: String!
    comment: String
    shippingCost: Float!
    agreedShipments: Float!
    segmentationTypeId: String!
    sellerId: String
    brandId: String
    skus: String
  }

  type HomeLandingForm {
    totalBudget: Float!
    strategies: [HomeLandingStrategy!]!
  }

  type HomeLandingStrategy {
    type: String!
    budget: Float!
    startDate: String!
    endDate: String!
    comment: String
    visualKey: String
    sku: String
    url: String!
    totalBudget: Float
  }
  # CampaignGroup

  type Query {
    _: Boolean
    me(uid: String): Profile
    form(type: FormType): Form
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
  PRODUCTMANAGER: "productManager",
};

export const schema = makeSchema({
  typeDefs: typeDefinitions,
  formTypes,
  forms: FORMS,
  queries: {},
  mutations: {},
});

import { makeSchema } from "../lib/utils";
import { FormTypes } from "../lib/types";
import { FORMS } from "./forms";

const typeDefinitions = /* GraphQL */ `
  scalar ID
  scalar File
  scalar DateTime
  directive @model on OBJECT
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

  type Brand @model @auth(read: ["public"]) {
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

  # CampaignGroup

  type BaseForm {
    budget: Float!
    startDate: String!
    endDate: String!
    comment: String
  }

  type SponsoredCommonForm {
    budget: Float!
    startDate: String!
    endDate: String!
    comment: String
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
    bannerFadBannerTypeId: String!
    bannerFadTotalBudget: Float!
    bannerFadStartDate: String!
    bannerFadEndDate: String!
    bannerFadSegmentationTypeId: String!
    bannerFadCategoryId: String!
    bannerFadUrl: String!
    bannerFadComment: String!
    bannerMenuTotalBudget: Float!
    bannerMenuStartDate: String!
    bannerMenuEndDate: String!
    bannerMenuFadUrl: String!
    bannerMenuComment: String!
    image: String!
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

  type MediaOnForm {
    strategiesId: String!
    budget: Float!
    commission: String!
    totalAmount: Float!
    strategies: [MediosDigitalesStrategy!]!
  }

  type CRMCommonForm {
    budget: Float!
    base: Float!
    shippingDate: String!
    internalCampaignName: String!
    comments: String!
  }

  type CRMEmailForm {
    budget: Float!
    base: Float!
    shippingDate: String!
    internalCampaignName: String!
    comments: String!
    type: String!
  }

  type CRMTriggersForm {
    budget: Float!
    base: Float!
    shippingDate: String!
    internalCampaignName: String!
    comments: String!
    type: String!
    quantityMonths: Float!
    triggerTypeId: String!
  }

  type CRMBannerForm {
    budget: Float!
    base: Float!
    startDate: String!
    endDate: String!
    sku: String!
    callToAction: String!
    url: String!
    internalCampaignName: String!
    comments: String!
    type: String!
  }

  type CRMSmsForm {
    budget: Float!
    base: Float!
    shippingDate: String!
    internalCampaignName: String!
    comments: String!
    type: String!
    smsText: String!
    url: String!
  }

  type CRMWhatsappForm {
    budget: Float!
    base: Float!
    shippingDate: String!
    internalCampaignName: String!
    comments: String!
    type: String!
    smsText: String!
    url: String!
  }

  type CRMPushForm {
    budget: Float!
    base: Float!
    shippingDate: String!
    internalCampaignName: String!
    comments: String!
    type: String!
    link: String!
    title: String!
    callToAction: String!
    url: String!
  }

  type CRMPushSmsNrtForm {
    budget: Float!
    base: Float!
    startDate: String!
    endDate: String!
    text: String!
    storeId: String!
    internalCampaignName: String!
    comments: String!
    type: String!
  }

  type CRMPreheaderForm {
    budget: Float!
    base: Float!
    startDate: String!
    endDate: String!
    sku: String!
    callToAction: String!
    url: String!
    internalCampaignName: String!
    comments: String!
    type: String!
  }

  type CRMCuponForm {
    budget: Float!
    base: Float!
    startDate: String!
    endDate: String!
    cuponTypeId: String!
    benefit: String!
    benefitAmount: Float!
    trigger: String!
    message: String!
    storeId: String!
    internalCampaignName: String!
    comments: String!
    type: String!
  }

  type CRMSamplingForm {
    budget: Float!
    base: Float!
    shippingDate: String!
    internalCampaignName: String!
    comments: String!
    typeId: String!
    units: Float!
    storeId: String!
    segmentation: String!
    type: String!
  }

  type CRMWhatsappCarrouselForm {
    budget: Float!
    base: Float!
    shippingDate: String!
    internalCampaignName: String!
    comments: String!
    type: String!
    skus: [String!]!
    text: String!
    url: String!
  }

  union CRMFormSubProduct =
      CRMEmailForm
    | CRMWhatsappForm
    | CRMPushForm
    | CRMSmsForm
    | CRMTriggersForm
    | CRMBannerForm
    | CRMSamplingForm
    | CRMCuponForm
    | CRMPushSmsNrtForm
    | CRMPreheaderForm
    | CRMWhatsappCarrouselForm

  type CRMForm {
    crmTypeId: String!
    templateId: String!
    subProducts: [CRMFormSubProduct!]!
  }

  type RatingAndReviewForm {
    budget: Float!
    startDate: String!
    endDate: String!
    comment: String
    shippingCost: Float!
    agreedShipments: Float!
    segmentationId: String!
    sellerId: String
    brandId: String
    sku: String
  }

  type HomeLandingCommonForm {
    budget: Float!
    visualKey: String!
    sku: String!
    startDate: String!
    endDate: String!
    url: String!
    comment: String!
  }

  type HomeLandingShowcase6Form {
    budget: Float!
    visualKey: String!
    sku: String!
    startDate: String!
    endDate: String!
    url: String!
    comment: String!
  }

  type HomeLandingTheLastForm {
    budget: Float!
    visualKey: String!
    sku: String!
    startDate: String!
    endDate: String!
    url: String!
    comment: String!
  }

  type HomeLandingTapeForm {
    budget: Float!
    visualKey: String!
    sku: String!
    startDate: String!
    endDate: String!
    url: String!
    comment: String!
  }

  type HomeOtherBannerForm {
    budget: Float!
    visualKey: String!
    sku: String!
    startDate: String!
    endDate: String!
    url: String!
    comment: String!
  }

  union HomeLandingStrategy =
      HomeLandingShowcase6Form
    | HomeLandingTheLastForm
    | HomeLandingTapeForm
    | HomeOtherBannerForm

  type HomeLandingForm {
    totalBudget: Float!
    strategies: [HomeLandingStrategy!]!
  }

  type CampaignGroup {
    productManagerId: String!
    businessUnitId: String!
    campaignTypeId: String!
    eventType: String!
    sellerId: String!
    brandId: String!
    categoryId: String!
    subCategoryId: String!
    startDate: String!
    endDate: String!

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

    mediaOnForm: MediaOnForm
    sponsoredBrandForm: SponsoredBrandForm
    sponsoredProductForm: SponsoredProductForm
    bannerForm: BannerFadsForm
    CRMForm: CRMCommonForm
    ratingAndReviewForm: RatingAndReviewForm
    homeLanding: HomeLandingForm
    campaignIds: [String!]!
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

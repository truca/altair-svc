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

  # Redis directive for caching and Redis-only entities
  # Time-to-live in seconds
  # Default: 3600 (1 hour) - balances freshness with reduced database load
  # 0 means no expiration
  # 
  # Caching strategy when used with @model
  # Default: CACHE_FIRST - optimal balance of performance and data consistency
  # Values:
  #   CACHE_FIRST - Check cache first, then database if not found
  #   CACHE_ONLY - Only check cache, return null if not found
  #   WRITE_THROUGH - Update cache and database simultaneously
  #   WRITE_BEHIND - Update cache immediately, database asynchronously
  #   REFRESH_AHEAD - Proactively refresh cache before expiration
  #   READ_THROUGH - Always fetch from database and update cache
  #
  # Redis data structure to use
  # Default: STRING - most versatile for storing serialized JS objects and arrays
  # Values:
  #   STRING - Simple key-value string storage (JSON serialized objects/arrays)
  #   HASH - Field-value pairs, good for objects with partial updates
  #   LIST - Ordered collection, useful for feeds or timelines
  #   SET - Unordered collection of unique items (e.g., tags, categories)
  #   SORTED_SET - Ordered collection with score-based ranking (leaderboards)
  #   GEO - Geospatial data with radius queries
  #   HYPERLOGLOG - Probabilistic data structure for cardinality
  #   STREAM - Append-only log structure for messaging
  #
  # Events that trigger cache invalidation
  # Default: ["CREATE", "UPDATE", "DELETE"] - ensures cache consistency
  # Common values:
  #   CREATE - When entity is created
  #   UPDATE - When entity is updated
  #   DELETE - When entity is deleted
  #   RELATED_UPDATE - When related entities are modified
  #   SCHEDULED - Time-based invalidation independent of TTL
  #   CUSTOM_EVENT - Application-specific events
  directive @redis(
    ttl: Int
    strategy: RedisCacheStrategy
    structure: RedisStructure
    invalidateOn: [String]
  ) on OBJECT | FIELD_DEFINITION

  enum RedisCacheStrategy {
    CACHE_FIRST
    CACHE_ONLY
    WRITE_THROUGH
    WRITE_BEHIND
    REFRESH_AHEAD
    READ_THROUGH
  }

  enum RedisStructure {
    STRING
    HASH
    LIST
    SET
    SORTED_SET
    GEO
    HYPERLOGLOG
    STREAM
  }

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

  # Example of a Redis-only entity for session management
  # type Session @redis(ttl: 3600, structure: HASH) {
  #   id: ID!
  #   userId: String!
  #   ipAddress: String
  #   userAgent: String
  #   lastActive: DateTime!
  # }

  # Example of a model entity with Redis caching
  # type Product @model @redis(ttl: 86400, strategy: CACHE_FIRST) {
  #   id: ID!
  #   name: String!
  #   description: String
  #   price: Float!
  #   inventory: Int!
  # }

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

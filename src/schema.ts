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
    AUTHOR
    BOOK
    PROFILE
    CHAT
  }

  # Represents a user.  Supports: User Registration and Login, Profile Customization, In-App Messaging, Integration with Other Platforms, Notifications and Updates.
  type Profile @model @auth(read: ["public"]) {
    uid: String
    username: String
    profilePicture: String
    lat: Float
    lng: Float
    createdAt: DateTime!
    updatedAt: DateTime
    favoriteWarbands: [Warband]
    favoriteCards: [Card]
    collection: Collection
    participatedEvents: [Event] # Events the user participated in
    wonMatches: [Match] # Matches this user won
    wonTournaments: [Tournament] # Tournaments this user won
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

  # Represents a warband. Supports: Warband Creation, Warband Sharing, Warband Comparison, Cost Management, Export Feature, Management, Feedback and Rating System.
  type Warband @model {
    userId: ID!
    name: String!
    totalCost: Float!
    isPublic: Boolean
    isFinished: Boolean
    guildUpgradePoints: Float
    guildUpgrades: [WarbandGuildUpgrade]
    isDraftWarband: Boolean! # If the warband was created through the draft system
    clonedFrom: ID # ID of the warband this one was cloned from
    createdAt: DateTime!
    updatedAt: DateTime
    cards: [WarbandCard] # Cards in the warband
    favoritedCount: Float! # Number of times favorited
    playedCount: Float! # Number of times played
    comments: [Comment] # Comments about this warband
  }

  type WarbandCard {
    card: Card
    count: Float
  }

  type GuildUpgrade @model {
    name: String!
    isUnique: Boolean
    allowsTags: [String] # Tags that can be added to the warband
    allowsTagsLimited: Boolean # If it can add a single card with the tag or infinite
    description: String
    cost: Float!
    image: String @file(maxSize: 1000000, types: ["image/jpeg", "image/png"]) # URL to the upgrade image
  }

  type WarbandGuildUpgrade {
    guildUpgrade: GuildUpgrade
    count: Float
  }

  # Represents a single card. Supports: Card Database, Card Filtering and Search, Cost-Building Suggestions, Card Rarity System, Feedback and Rating System.
  type Card @model @auth(read: ["public"]) {
    name: String!
    description: String
    faction: String
    tags: [String] # Tags for filtering: cavalry, hero, glorious hero, beast, spell, spell type and rank ("animancy 3") etc.
    cost: Float!
    image: String @file(maxSize: 1000000, types: ["image/jpeg", "image/png"]) # URL to the card image
    frequency: Float! # How often added to warbands
    favoritedCount: Float! # Number of times favorited
    comments: [Comment]
  }

  # Represents a comment, used for feedback on cards and warbands. Supports: Feedback and Rating System, In-App Messaging.
  type Comment @model @auth(create: ["public"], read: ["public"]) {
    userId: ID!
    warbandId: ID
    cardId: ID
    content: String!
    createdAt: DateTime!
  }

  # Represents a collection of cards owned by a user. Supports: Management.
  type Collection @model {
    userId: ID!
    name: String!
    cards: [Card]
    warbands: [Warband] # To support adding warbands to collections
    createdAt: DateTime!
  }

  # Represents a match (single game). Supports: Event Management, Event Scheduling.
  type Match @model {
    eventId: ID!
    warband1Id: ID!
    warband2Id: ID!
    player1Id: ID!
    player2Id: ID!
    winnerId: ID!
    createdAt: DateTime!
    previousMatches: [ID!] # IDs of matches leading to this match
    nextMatch: ID # ID of the match this one leads to
  }

  # Represents a tournament. Supports: Event Management, Event Scheduling.
  type Tournament @model {
    name: String!
    matches: [Match] # Keep this for easy access to all matches
    firstRoundMatches: [ID!] # IDs of the matches in the first round
    winnerId: ID!
    createdAt: DateTime!
  }

  # Represents an event, which can be a single match or a tournament. Supports: Event Management, Event Scheduling, Integration with Other Platforms.
  type Event @model {
    name: String!
    date: DateTime!
    location: String!
    latitude: Float!
    longitude: Float!
    createdBy: ID!
    participants: [Profile] # Participants in the event
    matches: [Match] # If it's a tournament
    tournament: Tournament # If it's a tournament
    createdAt: DateTime!
  }

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
  AUTHOR: "author",
  BOOK: "book",
  PROFILE: "profile",
};

export const schema = makeSchema({
  typeDefs: typeDefinitions,
  formTypes,
  forms: FORMS,
  queries: {},
  mutations: {},
});

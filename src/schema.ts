import { makeSchema } from "../lib/utils";
import { FormTypes } from "../lib/types";
import { FORMS } from "./forms";

const typeDefinitions = /* GraphQL */ `
  scalar ID
  scalar File
  scalar DateTime
  type Option {
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
  directive @default(value: String) on FIELD_DEFINITION
  union HiddenValue = String | Boolean
  type HiddenCondition {
    field: String
    value: HiddenValue
  }
  directive @hidden(value: Boolean, cond: [HiddenCondition]) on FIELD_DEFINITION
  directive @selectFrom(values: SelectOptions, table: String, filter: [String]) on FIELD_DEFINITION
  directive @defaultFrom(parentAttribute: String) on FIELD_DEFINITION
  directive @from(parentAttribute: String, queryParam: String) on FIELD_DEFINITION

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

  # Media On Cascade Types
  type MediaOnMedium
    @model
    @auth(read: ["public"], update: ["public"], delete: ["public"]) {
    country: String
    name: String!
    availableObjectives: [String!]
    externalId: ID!
    createdAt: DateTime
    updatedAt: DateTime
  }

  type MediaOnObjective
    @model
    @auth(read: ["public"], update: ["public"], delete: ["public"]) {
    country: String
    name: String!
    externalId: ID!
    availableObjectives: [String!]
    createdAt: DateTime
    updatedAt: DateTime
  }

  type MediaOnStrategy
    @model
    @auth(read: ["public"], update: ["public"], delete: ["public"]) {
    country: String
    name: String!
    externalId: ID!
    availableObjectives: [String!]
    createdAt: DateTime
    updatedAt: DateTime
  }

  type MediaOnSegmentation
    @model
    @auth(read: ["public"], update: ["public"], delete: ["public"]) {
    country: String
    name: String!
    externalId: ID!
    availableObjectives: [String!]
    createdAt: DateTime
    updatedAt: DateTime
  }

  type MediaOnPurchaseType
    @model
    @auth(read: ["public"], update: ["public"], delete: ["public"]) {
    country: String
    name: String!
    externalId: ID!
    availableObjectives: [String!]
    createdAt: DateTime
    updatedAt: DateTime
  }

  type MediaOnFormat
    @model
    @auth(read: ["public"], update: ["public"], delete: ["public"]) {
    country: String
    name: String!
    externalId: ID!
    availableObjectives: [String!]
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

  type CampaignGroup
    @model
    @auth(read: ["public"], update: ["public"], delete: ["public"]) {
    externalId: ID!
    country: String!
    campaigns: [Campaign]
  }

  # CampaignGroup
  # CampaignGroup remains unchanged (even though it has @model)
  # but any field that referenced a service type is updated:
  type Campaign
    @model
    @auth(read: ["public"], update: ["public"], delete: ["public"]) {
    # metadata
    campaignGroupId: ID
    campaignGroup: CampaignGroup
    country: String @from(queryParam: "country")
    productManagerId: String! @selectFrom(table: "ProductManager")
    businessUnitId: String! @selectFrom(values: ["1P", "3P"])
    campaignName: String!
    eventTypeId: String! @selectFrom(values: ["Cyber Day","Black Friday","14_F","Escolares","Black_Week","DDM","DDP","DDN","Sneaker_Corner","CD","CM","CW","Días_F","Navidad","Otra"])
    campaignTypeId: String! @selectFrom(values: [{label: "Táctico", value: "tactico"},{label: "Always On", value: "always_on"}])
    customId: String
    nomenclature: String

    # filters
    sellerId: String! @selectFrom(table: "Seller", filter: ["country", "businessUnitId"])
    brandId: [String!]! @selectFrom(table: "Brand", filter: ["country", "sellerIds"])
    categoryId: [String!]! @selectFrom(table: "Category", filter: ["country", "brandIds"])
    subCategoryId: [String!]! @selectFrom(table: "Subcategory", filter: ["country", "categoryIds"])
    
    #dates
    startDate: String!
    endDate: String!
    implementationDate: String!

    
    mediaOffEnabled: Boolean!
    mediaOffBudget: Float
    storeEnabled: Boolean!
    storeBudget: Float
    graphicsEnabled: Boolean!
    graphicsBudget: Float
    othersEnabled: Boolean!
    othersBudget: Float
    mediaPlan: String


    # template
    # mediaOnEnabled: Boolean! @default(value: false)
    # mediaOn: MediaOn @hidden(mediaOnEnabled: false)
    # bannersEnabled: Boolean! @default(value: false)
    # banner: Banner @hidden(bannersEnabled: false)
    # CRMEnabled: Boolean! @default(value: false)
    # CRM: CRM @hidden(CRMEnabled: false)
    # homeLandingEnabled: Boolean! @default(value: false)
    # homeLanding: HomeLanding @hidden(homeLandingEnabled: false)
    
    # service
    sponsoredBrandsEnabled: Boolean! @default(value: false)
    sponsoredBrand: SponsoredBrand @hidden(cond: [{ field: "sponsoredBrandsEnabled", value: false}])
    sponsoredProductEnabled: Boolean! @default(value: false)
    sponsoredProduct: SponsoredProduct @hidden(cond: [{ field: "sponsoredProductEnabled", value: false}])
    ratingsAndReviewsEnabled: Boolean! @default(value: false)
    ratingAndReview: RatingAndReview @hidden(cond: [{ field: "ratingsAndReviewsEnabled", value: false}])
  }

  type PlannerComments {
    text: String!
    user: String!
    date: String!
  }

  # This should have everything from: 
  # type ServiceTemplate {
  #   type: String! @values(["banners", "CRM", "homeLanding", "mediaOn", "ratingsAndReviews", "sponsoredBrands", "sponsoredProduct"])
  #   country: String @from(queryParam: "country")
  #   startDate: DateTime @defaultFrom(parentAttribute: "startDate")
  #   endDate: DateTime @defaultFrom(parentAttribute: "endDate")
  #   implementationDate: DateTime @defaultFrom(parentAttribute: "implementationDate")
  #   campaignSellerId: String! @from(parentAttribute: "sellerId")
  #   campaignBrandId: [String!]! @from(parentAttribute: "brandId")
  #   categoryId: [String!]! @from(parentAttribute: "categoryId")
  #   budget: Float

  #   # Categories where this template applies
  #   categoryIds: [String!]

  #   services: [Service]
    
  #   # Fields from HomeLandingForm
  #   # country: String
  #   # budget: Float!
  #   # strategies was [HomeLandingStrategy!]! → [Service!]!
  #   # strategies: [Service]
  #   # campaignSellerId: String
  #   # campaignBrandId: [String!]
  #   # categoryId: [String!]

  #   # Fields from MediaCampaignStrategy
  #   mediumId: String @selectFrom(["Facebook & Instagram","Google Ads","Criteo","RTB House","DV 360","Bing","Tik Tok","Huawei"])
  #   objectiveId: String @selectFrom(["Alcance","Reconocimiento de marca","Tráfico","Instalaciones","Reproducciones","Generación de leads","Mensaje","Conversión","Ventas","Tráfico en el negocio","Alcance & Reconocimiento de marca","Clientes potenciales","Tráfico al sitio web","Visitas a tienda","Promoción de aplicación","Consideración de la marca y producto","Venta por catálogo"])
  #   strategyId: String @selectFrom(["Facebook & Instagram - Alcance","Facebook & Instagram - Reconocimiento de marca","Facebook & Instagram - Tráfico","Facebook & Instagram - Instalaciones","Facebook & Instagram - Reproducciones","Facebook & Instagram - Generación de leads","Facebook & Instagram - Mensaje","Facebook & Instagram - Conversión","Facebook & Instagram - DPA","Facebook & Instagram - DABA","Facebook & Instagram - Tráfico en el negocio","Google Display","Google YouTube","Google Search","Google Shopping","Google Performance Max","Google Display DRA","Google Display DRA-Prospecting","Google Discovery","Google Leads","Google Discovery - Feed","Google YouTube for Action","Google Local Campaign","Google UAC","Google UACe","Criteo Alcance","Criteo Tráfico","Criteo Ventas","Criteo Conversión","RTB Alcance","RTB Tráfico","RTB Ventas","RTB Conversión","DV360 Alcance-YouTube","DV360 Alcance-Display","DV360 Alcance-Audio","DV360 Tráfico-YouTube","DV360 Tráfico-Display","DV360 Tráfico-Audio","Bing Alcance","Bing Tráfico","Bing Venta","Bing Conversión","Tik Tok Alcance","Tik Tok Tráfico","Tik Tok Installs","Tik Tok Video","Tik Tok Conversión","Tik Tok DPA","Tik Tok DABA","Huawei Alcance","Huawei Tráfico","Huawei Ventas","Huawei Conversión","Facebook & Instagram - Advantage+SC"])
  #   segmentationId: String @selectFrom(["Intereses","Remarketing","Prospecting","Geolocalización","Afines","Palabras clave","Feed de productos","Smart","In Market","Commerce Audience","Deep Learning","Lookalike","1st Paty","Palabra clave","Intereses y comportamiento","Remarketing & Prospecting"])
  #   purchaseTypeId: String 
  #   formatsId: String
  #   # budget: Float
  #   # commission: String
  #   # startDate: DateTime
  #   # endDate: DateTime
  #   # implementationDate: DateTime
  #   # campaignSellerId: String!
  #   # campaignBrandId: [String!]!
  #   # categoryId: [String!]!

  #   # Fields from BannerForm
  #   bannerTypeId: String
  #   # budget: Float
  #   # startDate: DateTime
  #   # endDate: DateTime
  #   # implementationDate: DateTime
  #   segmentationTypeId: String @selectFrom(["ROS (abierta)", "Por categoría (Gs)", "Audiencias"])
  #   # categoryId: [String]
  #   categoryIds: [String] @selectManyFrom([{ label: "G01 - Almacenamiento", value: "G01" },{ label: "G02 - Jardinería", value: "G02" },{ label: "G03 - Combustibles", value: "G03" },{ label: "G04 - Limpieza", value: "G04" },{ label: "G05 - Artesanías", value: "G05" },{ label: "G06 - Mascotas", value: "G06" },{ label: "G07 - Música y películas", value: "G07" },{ label: "G08 - Ropa y accesorios", value: "G08" },{ label: "G09 - Automotriz", value: "G09" },{ label: "G10 - Suministros eléctricos", value: "G10" },{ label: "G11 - Alimentos y bebidas", value: "G11" },{ label: "G12 - Libros", value: "G12" },{ label: "G13 - Deportes", value: "G13" },{ label: "G14 - Electrodomésticos", value: "G14" },{ label: "G15 - Protección", value: "G15" },{ label: "G16 - Belleza", value: "G16" },{ label: "G17 - Juguetes y juegos", value: "G17" },{ label: "G18 - Calzado", value: "G18" },{ label: "G19 - Electrónica", value: "G19" },{ label: "G20 - Construcción y ferretería", value: "G20" },{ label: "G21 - Hogar", value: "G21" },{ label: "G22 - Bebés", value: "G22" },{ label: "G23 - Servicios e Intangibles", value: "G23" },{ label: "J00 - SIN JOTA", value: "J00" },{ label: "J01 - HOMBRE", value: "J01" },{ label: "J02 - JUV HOMBRE", value: "J02" },{ label: "J03 - DEPORTE", value: "J03" },{ label: "J04 - DAMAS", value: "J04" },{ label: "J05 - JUV.DAMAS", value: "J05" },{ label: "J06 - ROPA INT.", value: "J06" },{ label: "J07 - ACC MUJER", value: "J07" },{ label: "J08 - PERFUMERIA", value: "J08" },{ label: "J09 - NIÑOS", value: "J09" },{ label: "J10 - CALZADO", value: "J10" },{ label: "J11 - ELECTRO", value: "J11" },{ label: "J12 - BLANCO", value: "J12" },{ label: "J13 - MUEBLES", value: "J13" },{ label: "J14 - DORMITORIO", value: "J14" },{ label: "J15 - MENAJE", value: "J15" },{ label: "J16 - DECORACION", value: "J16" },{ label: "J17 - REGALOS", value: "J17" },{ label: "J18 - GOURMET", value: "J18" },{ label: "J99 - EXTERNA", value: "J99" },{ label: "J32 - CRATE & BARREL", value: "J32" },{ label: "J21 - BIENESTAR SEXUAL", value: "J21" }])
  #   audienceId: [String] @selectManyFrom(["Compra - Compradores de Ticket > $150.000 CLP","Compra - FACL-RMKT-Analytics_60D_Compradores_Ticket_Alto>$300.000CLP","Compra - FACL-RMKT-Analytics_60D_Compradores_Ticket_Alto>$500.000CLP","Compra - GUA-FCCL-Compradores60D-L7D-(ago2022)","Compra - GUA-FCCL-Compradores90D-L7D-(ago2022)","Compra - GUA-FCCL-CompradoresSIS-D90-(ago2022)-Falabella.com","Compra - GUA-FCCL-CompradoresSIS-D90-(ago2022)-Sodimac","Compra - GUA-FCCL-CompradoresSIS-D90-(ago2022)-Tottus","Consideración - GUA-FCCL-VisitantesSIS-D30-(ago2022)-Falabella.com","Consideración - GUA-FCCL-VisitantesSIS-D30-(ago2022)-Sodimac","Consideración - GUA-FCCL-VisitantesSIS-D30-(ago2022)-Tottus","Consideración - GUA-FCCL-VisitantesSIS-D60-(ago2022)-Falabella.com","Consideración - GUA-FCCL-VisitantesSIS-D60-(ago2022)-Sodimac","Consideración - GUA-FCCL-VisitantesSIS-D60-(ago2022)-Tottus","Consideración - GUA-FCCL-Behaviour_Mix-Users-L14D90-(ago2022)-Zapatillas","Consideración - GUA-FCCL-Behaviour_Mix-Users-L14D90-(ago2022)-Tecnologia","Consideración - GUA-FCCL-Behaviour_Mix-Users-L14D90-(ago2022)-Mujer","Consideración - GUA-FCCL-Behaviour_Mix-Users-L14D90-(ago2022)-Moda","Consideración - GUA-FCCL-Behaviour_Mix-Users-L14D90-(ago2022)-Mascotas","Consideración - GUA-FCCL-Behaviour_Mix-Users-L14D90-(ago2022)-Hombre","Consideración - GUA-FCCL-Behaviour_Mix-Users-L14D90-(ago2022)-Hogar&Muebles","Consideración - GUA-FCCL-Behaviour_Mix-Users-L14D90-(ago2022)-Gamers","Consideración - GUA-FCCL-Behaviour_Mix-Users-L14D90-(ago2022)-Electrohogar","Consideración - GUA-FCCL-Behaviour_Mix-Users-L14D90-(ago2022)-Dormitorio","Consideración - GUA-FCCL-Behaviour_Mix-Users-L14D90-(ago2022)-Deportes","Consideración - GUA-FCCL-Behaviour_Mix-Users-L14D90-(ago2022)-Decoración","Consideración - GUA-FCCL-Behaviour_Mix-Users-L14D90-(ago2022)-Construcción","Consideración - GUA-FCCL-Behaviour_Mix-Users-L14D90-(ago2022)-Comida y Bebidas","Consideración - GUA-FCCL-Behaviour_Mix-Users--L14D90-(ago2022)-Niños","Consideración - GUA-FCCL-Visitantes_Marcas_Premium-D180-(ene2023)","Consideración - GUA-FCCL-Intención_Compra_Marcas_Premium-D180-(ene2023)","Consideración - GUA-FCCL-Behaviour_Mix_Users-L14D90-(ago2022)-Belleza","Consideración - GUA-FCCL-No_Shopping_Activity-D30-(ago2022)","Compra - GUA-FCCL-Cart_Abandonment-30D-(ago2022)","Compra - GUA-FCCL-Abandonment_Checkout-D30-(ago2022)","Compra - GUA-FCCL-Compradores_Marcas_Premium-D180-(ene2023)","Consideración - FCCL-RMKT-Gamers-P5R30D90-(Ago2022)","Consideración - FCCL-RMKT-Amantes_Tecnología-P5R30D90-(Ago2022)","Consideración - FCCL-RMKT-Milenials-P5R30D90-(Ago2022)","Consideración - FCCL-RMKT-Deportistas-P5R30D90-(Ago2022)","Consideración - FCCL-RMKT-Promotores-de-vida-fit-P5R30D90-(Ago2022)","Consideración - FCCL-RMKT-Belleza-P5R30D90-(Ago2022)","Consideración - FCCL-RMKT-Aventureros-Viajeros-P5R30D90-(Ago2022)","Consideración - FCCL-RMKT-Constructores-P5R30D90-(Ago2022)","Consideración - FCCL-RMKT-Amantes-de-la-música-P5R30D90-(Ago2022)","Consideración - FCCL-RMKT-Decoradores-P5R30D90-(Ago2022)","Consideración - FCCL-RMKT-Hogar-P5R30D90-(Ago2022)","Consideración - FCCL-RMKT-Foodies-P5R30D90-(Ago2022)","Consideración - FCCL-RMKT-Amantes_de_las_mascotas-P5R30D90-(Ago2022)","Consideración - FCCL-RMKT-Aficionados_a_la_fotografía-P5R30D90-(Ago2022)","Consideración - FCCL-RMKT-Amantes_de_la_TV-P5R30D90-(Ago2022)","Consideración - FCCL-RMKT-Aficionados_al_arte-P5R30D90-(Ago2022)","Consideración - FCCL-RMKT-Fashionistas-P5R30D90-(Ago2022)","Consideración - FCCL-RMKT-Autos_y_Vehiculos-P5R30D90-(Ago2022)","Consideración - FCCL-RMKT-Padres-P5R30D90-(Ago2022)","Consideración - FCCL-RMKT-Trabajadores_remotos-P5R30D90-(Ago2022)","Consideración - FCCL-RMKT-Hobbies-P5R30D90-(Ago2022)","Consideración - FCCL-RMKT-J1000-P5R7D90-(ene2022)-Calzado","Consideración - FCCL-RMKT-J1100-P5R7D90-(ene2022)-Electro","Consideración - FCCL-RMKT-J0400-P5R7D90-(ene2022)-Damas","Consideración - FCCL-RMKT-J0900-P5R7D90-(ene2022)-Niños","Consideración - FCCL-RMKT-J0700-P5R7D90-(ene2022)-AccesoriosMujer","Consideración - FCCL-RMKT-J0800-P5R7D90-(ene2022)-Perfumeria","Consideración - FCCL-RMKT-J0300-P5R7D90-(ene2022)-Deportes","Consideración - FCCL-RMKT-J0500-P5R7D90-(ene2022)-JuvenilMujer","Consideración - FCCL-RMKT-J0100-P5R7D90-(Ene2022)-Hombre","Consideración - FCCL-RMKT-J0200-P5R7D90-(Ene2022)-JuvenilHombre","Consideración - FCCL-RMKT-J0600-P5R7D90-(ene2022)-RopaInterior","Consideración - FCCL-RMKT-J1300-P5R7D90-(ene2022)-Muebles","Consideración - FCCL-RMKT-J1200-P5R7D90-(ene2022)-Blanco","Consideración - FCCL-RMKT-J1400-P5R7D90-(ene2022)-Dormitorio","Consideración - FCCL-RMKT-J1600-P5R7D90-(ene2022)-Decoracion","Consideración - FCCL-RMKT-MULTI-P10R7D60-(ene2022)-Primerapropiedad","Consideración - FCCL-RMKT-MULTI-D12R7D90-(ene2022)-HombreJoven","Consideración - FCCL-RMKT-MULTI-P7R7D90-(ene2022)-Veraneantes","Consideración - FCCL-RMKT-MULTI-P10R7D30-(ene2022)-Fashion","Consideración - FCCL-RMKT-J1500-P5R7D90-(ene2022)-Menaje","Consideración - FCCL-RMKT-J1100-P7R7D90-(abr2022)-Linea_Blanca","Consideración - FCCL-RMKT-MULTI-P10R7D60-(ene2022)-Tecnofilos","Consideración - FCCL-RMKT-MULTI-P7R7D60-(ene2022)-Outdoor Enthusiasts","Consideración - FCCL-RMKT-J1800-P5R7D90-(ene2022)-Gourmet","Consideración - FCCL-RMKT-MULTI-P10R7D60-(ene2022)-Wellness","Consideración - FCCL-RMKT-MULTI-P8R5D45-(ene2022)-FuturaMama","Consideración - FCCL-RMKT-MULTI-P10R7D60-(ene2022)-Deportistas","Consideración - FCCL-RMKT-J1700-P5R7D90-(ene2022)-Regalos","Consideración - FCCL-RMKT-MULTI-P10R7D60-(ene2022)-Gamers","Consideración - FCCL-RMKT-J1110-P5R30D90-(abr2022)-Climatización","Consideración - FCCL-RMKT-J3200-P5R7D90-(ene2022)-CreateBarrel","Consideración - FCCL-RMKT-MULTI-P10R7D60-(ene2022)-Musica","Consideración - FCCL-RMKT-MULTI-P7R7D30-(ene2022)-Soccer Fans","Consideración - FCCL-RMKT-MULTI-P7R7D90-(feb2022)-Alimentos","Consideración - FCCL-RMKT-MULTI-P10R7D60-(ene2022)-Chef"])
  #   url: String
  #   comment: String
  #   image: String
  #   # campaignSellerId: String!
  #   # campaignBrandId: [String!]!
  #   # categoryId: [String!]!

  #   # Fields from CRMForm
  #   # country: String
  #   # crmTypeId: String
  #   # templateId: String
  #   # numberTouches: String
  #   # subProducts was [CRMCampaignSubProduct!]! → [Service!]!
  #   # subProducts: [Service]

  #   # Fields from Service
  #   # country: String
  #   # campaignSellerId: String!
  #   # campaignBrandId: [String!]!
  #   # categoryId: [String!]!
  #   campaignId: ID @from(parentAttribute: "id")
  #   campaign: Campaign
  #   # budget: Float
  #   # startDate: DateTime
  #   # endDate: DateTime
  #   # implementationDate: DateTime
  #   userAssigned: [String]
  #   labels: [String]
  #   plannerComments: [PlannerComments]
  #   nomenclature: String
  #   campaignGroupCustomId: String
  #   serviceType: String
  #   strategiesId: String
  #   commission: String
  #   totalAmount: Float
  #   crmTypeId: String
  #   templateId: String
  #   numberTouches: String
  #   comment: String
  #   budgetType: String
  #   dailyLimitEnabled: Boolean
  #   dailyBudgetLimit: Float
  #   title: String
  #   url: String
  #   skus: [String]
  #   images: String
  #   type: String
  #   base: Float
  #   shippingDate: String
  #   internalCampaignName: String
  #   comments: String
  #   quantityMonths: Float
  #   triggerTypeId: String
  #   sku: String
  #   callToAction: String
  #   smsText: String
  #   link: String
  #   text: String
  #   storeId: String
  #   cuponTypeId: String
  #   benefit: String
  #   benefitAmount: Float
  #   trigger: String
  #   message: String
  #   typeId: String
  #   units: Float
  #   segmentation: String
  #   shippingCost: Float
  #   agreedShipments: Float
  #   segmentationTypeId: String
  #   sellerId: String
  #   brandId: String
  #   visualKey: String
  #   totalBudget: Float
  # }

  # Specific service form types
  type SponsoredProduct
    @model(table: "Service")
    @auth(read: ["public"], update: ["public"], delete: ["public"]) {
    country: String @from(queryParam: "country")
    campaignId: ID @from(parentAttribute: "id")
    campaign: Campaign
    
    # Sponsored Products specific fields
    startDate: DateTime! @defaultFrom(parentAttribute: "startDate")
    endDate: DateTime! @defaultFrom(parentAttribute: "endDate")
    implementationDate: DateTime! @defaultFrom(parentAttribute: "implementationDate")
    budgetType: String! @selectFrom(values: [{label: "Total", value: "Total"}, {label: "Diario", value: "Diario"}])
    budget: Float!
    dailyLimitEnabled: Boolean
    dailyBudgetLimit: Float
    skus: [String!]
    comment: String
    
    # Base campaign fields
    campaignSellerId: String! @from(parentAttribute: "sellerId")
    campaignBrandId: [String!]! @from(parentAttribute: "brandId")
    categoryId: [String!]! @from(parentAttribute: "categoryId")
  }

  type SponsoredBrand
    @model(table: "Service")
    @auth(read: ["public"], update: ["public"], delete: ["public"]) {
    country: String @from(queryParam: "country")
    campaignId: ID @from(parentAttribute: "id")
    campaign: Campaign
    
    # Sponsored Brands specific fields
    startDate: DateTime! @defaultFrom(parentAttribute: "startDate")
    endDate: DateTime! @defaultFrom(parentAttribute: "endDate")
    implementationDate: DateTime! @defaultFrom(parentAttribute: "implementationDate")
    budgetType: String! @selectFrom(values: [{label: "Total", value: "Total"}, {label: "Diario", value: "Diario"}])
    budget: Float!
    dailyLimitEnabled: Boolean
    dailyBudgetLimit: Float
    title: String! # max 42 characters
    skus: String!
    url: String!
    campaignTypeId: String! @selectFrom(values: [{label: "Táctico", value: "tactico"}, {label: "Always On", value: "always_on"}])
    
    # Base campaign fields
    campaignSellerId: String! @from(parentAttribute: "sellerId")
    campaignBrandId: [String!]! @from(parentAttribute: "brandId")
    categoryId: [String!]! @from(parentAttribute: "categoryId")
  }

  # type CRMSubProduct
  #   @model(table: "Service")
  #   @auth(read: ["public"], update: ["public"], delete: ["public"]) {
  #   country: String @from(queryParam: "country")
  #   crmFormId: ID @from(parentAttribute: "id")
    
  #   # Common fields for all CRM subproducts
  #   type: String! @selectFrom(["email", "trigger", "banner", "sms", "whatsapp", "push", "pushSmsNrt", "preheader", "cupon", "sampling", "whatsappCarrousel"])
  #   budget: Float!
  #   base: Float!
  #   internalCampaignName: String!
  #   comments: String
  #   implementationDate: DateTime! @defaultFrom(parentAttribute: "implementationDate")
    
  #   # Email specific
  #   shippingDate: DateTime
    
  #   # Trigger specific
  #   quantityMonths: Int
  #   triggerTypeId: String
    
  #   # Banner specific
  #   startDate: DateTime @defaultFrom(parentAttribute: "startDate")
  #   endDate: DateTime @defaultFrom(parentAttribute: "endDate")
  #   sku: String
  #   callToAction: String
  #   url: String
    
  #   # SMS/WhatsApp specific
  #   smsText: String
    
  #   # Push specific
  #   link: String
  #   title: String
    
  #   # Push SMS NRT specific
  #   text: String
  #   storeId: String
    
  #   # Cupon specific
  #   cuponTypeId: String
  #   benefit: String
  #   benefitAmount: Float
  #   trigger: String
  #   message: String
    
  #   # Sampling specific
  #   typeId: String
  #   units: Int
  #   segmentation: String
    
  #   # WhatsApp Carousel specific
  #   skus: [String]
    
  #   # Base campaign fields
  #   campaignSellerId: String! @from(parentAttribute: "campaignSellerId")
  #   campaignBrandId: [String!]! @from(parentAttribute: "campaignBrandId")
  #   categoryId: [String!]! @from(parentAttribute: "categoryId")
  #   createdAt: DateTime
  #   updatedAt: DateTime
  # }

  # type CRM
  #   @model(table: "Template")
  #   @auth(read: ["public"], update: ["public"], delete: ["public"]) {
  #   country: String @from(queryParam: "country")
  #   campaignId: ID @from(parentAttribute: "id")
  #   campaign: Campaign
    
  #   # CRM specific fields
  #   crmTypeId: String! @selectFrom([{label: "Propenso", value: "Propenso"}, {label: "Segmentado", value: "Segmentado"}])
  #   templateId: String!
  #   numberTouches: Int
  #   subProducts: [CRMSubProduct]
    
  #   # Base campaign fields
  #   campaignSellerId: String! @from(parentAttribute: "sellerId")
  #   campaignBrandId: [String!]! @from(parentAttribute: "brandId")
  #   categoryId: [String!]! @from(parentAttribute: "categoryId")
  #   createdAt: DateTime
  #   updatedAt: DateTime
  # }

  # type MediaOnStrategy
  #   @model(table: "Service")
  #   @auth(read: ["public"], update: ["public"], delete: ["public"]) {
  #   country: String @from(queryParam: "country")
  #   mediaOnFormId: ID @from(parentAttribute: "id")
    
  #   # Media On Strategy fields
  #   mediumId: String! @selectFrom(["DIGITAL", "SOCIAL", "SEARCH"])
  #   objectiveId: String! @selectFrom(["AWARENESS", "CONVERSION", "TRAFFIC"])
  #   strategyId: String! @selectFrom(["DISPLAY", "VIDEO", "SEM"])
  #   segmentationId: String! @selectFrom(["DEMOGRAPHIC", "BEHAVIORAL", "KEYWORD"])
  #   purchaseTypeId: String! @selectFrom(["PROGRAMMATIC", "DIRECT", "AUCTION"])
  #   formatsId: String! @selectFrom(["BANNER_300x250", "VIDEO_16x9", "TEXT_AD"])
  #   budget: Float!
  #   commission: String! @selectFrom([{label: "20%", value: "20%"}, {label: "30%", value: "30%"}])
  #   startDate: DateTime! @defaultFrom(parentAttribute: "startDate")
  #   endDate: DateTime! @defaultFrom(parentAttribute: "endDate")
  #   implementationDate: DateTime! @defaultFrom(parentAttribute: "implementationDate")
    
  #   # Base campaign fields
  #   campaignSellerId: String! @from(parentAttribute: "campaignSellerId")
  #   campaignBrandId: [String!]! @from(parentAttribute: "campaignBrandId")
  #   categoryId: [String!]! @from(parentAttribute: "categoryId")
  #   createdAt: DateTime
  #   updatedAt: DateTime
  # }

  # type MediaOn
  #   @model(table: "Template")
  #   @auth(read: ["public"], update: ["public"], delete: ["public"]) {
  #   country: String @from(queryParam: "country")
  #   campaignId: ID @from(parentAttribute: "id")
  #   campaign: Campaign
    
  #   # Media On specific fields
  #   strategiesId: String
  #   budget: Float # Calculated automatically
  #   commission: String # Default "20%"
  #   totalAmount: Float # Calculated automatically
  #   strategies: [MediaOnStrategy]
    
  #   # Base campaign fields
  #   campaignSellerId: String! @from(parentAttribute: "sellerId")
  #   campaignBrandId: [String!]! @from(parentAttribute: "brandId")
  #   categoryId: [String!]! @from(parentAttribute: "categoryId")
  #   createdAt: DateTime
  #   updatedAt: DateTime
  # }

  # type Banner
  #   @model(table: "Template")
  #   @auth(read: ["public"], update: ["public"], delete: ["public"]) {
  #   country: String @from(queryParam: "country")
  #   campaignId: ID @from(parentAttribute: "id")
  #   campaign: Campaign
    
  #   # Banner specific fields
  #   bannerTypesId: [String!]! @selectManyFrom([{label: "Banners Fads", value: "FADS"}, {label: "Banners Menú", value: "MENU"}])
    
  #   # Banner Fads fields
  #   startDate: DateTime @defaultFrom(parentAttribute: "startDate")
  #   endDate: DateTime @defaultFrom(parentAttribute: "endDate")
  #   implementationDate: DateTime! @defaultFrom(parentAttribute: "implementationDate")
  #   segmentationTypeId: String @selectFrom(["ROS (abierta)", "Por categoría (Gs)", "Audiencias"])
  #   categoryIds: [String] @selectManyFrom([{ label: "J01 - MODA", value: "J01" }, { label: "J04 - DAMAS", value: "J04" }, { label: "J08 - PERFUMERIA", value: "J08" }, { label: "J10 - CALZADO", value: "J10" }, { label: "J11 - ELECTRO", value: "J11" }, { label: "J12 - BLANCO", value: "J12" }, { label: "J13 - MUEBLES", value: "J13" }, { label: "J14 - DORMITORIO", value: "J14" }, { label: "J15 - MENAJE", value: "J15" }, { label: "J16 - DECORACION", value: "J16" }, { label: "J17 - REGALOS", value: "J17" }, { label: "J18 - GOURMET", value: "J18" }, { label: "J99 - EXTERNA", value: "J99" }, { label: "J32 - CRATE & BARREL", value: "J32" }, { label: "J21 - BIENESTAR SEXUAL", value: "J21" }])
  #   budget: Float
  #   url: String!
  #   comment: String
    
  #   # Base campaign fields
  #   campaignSellerId: String! @from(parentAttribute: "sellerId")
  #   campaignBrandId: [String!]! @from(parentAttribute: "brandId")
  #   categoryId: [String!]! @from(parentAttribute: "categoryId")
  #   createdAt: DateTime
  #   updatedAt: DateTime
  # }

  type RatingAndReview
    @model(table: "Service")
    @auth(read: ["public"], update: ["public"], delete: ["public"]) {
    country: String @from(queryParam: "country")
    campaignId: ID @from(parentAttribute: "id")
    campaign: Campaign
    
    # Rating and Reviews specific fields
    budget: Float
    shippingCost: Float
    agreedShipments: Int
    startDate: DateTime! @defaultFrom(parentAttribute: "startDate")
    endDate: DateTime! @defaultFrom(parentAttribute: "endDate")
    implementationDate: DateTime! @defaultFrom(parentAttribute: "implementationDate")
    segmentationTypeId: String! @selectFrom(values: ["Total Seller/Proveedor", "Total Marca", "Categoría", "SKU"])
    sellerId: String! @selectFrom(values: [{label: "1P", value: "1P"}, {label: "3P", value: "3P"}])
    brandId: String!
    skus: String!
    comment: String
    
    # Base campaign fields
    campaignSellerId: String! @from(parentAttribute: "sellerId")
    campaignBrandId: [String!]! @from(parentAttribute: "brandId")
    categoryId: [String!]! @from(parentAttribute: "categoryId")
    createdAt: DateTime
    updatedAt: DateTime
  }

  type HomeLanding
    @model(table: "Template")
    @auth(read: ["public"], update: ["public"], delete: ["public"]) {
    # metadata
    country: String @from(queryParam: "country") @hidden
    campaignSellerId: String! @from(parentAttribute: "sellerId") @hidden
    campaignBrandId: [String!]! @from(parentAttribute: "brandId") @hidden
    categoryId: [String!]! @from(parentAttribute: "categoryId") @hidden
    campaignId: ID @from(parentAttribute: "id") @hidden
    
    # parent
    campaign: Campaign
    
    # Home Landing specific fields
    budget: Float
    services: [HomeLandingStrategy]
  }

  type HomeLandingLanding
    @model(table: "Service")
    @auth(read: ["public"], update: ["public"], delete: ["public"]) {
    # metadata
    type: String! @default(value: "landing") @hidden
    country: String @from(queryParam: "country") @hidden
    homeLandingId: ID @from(parentAttribute: "id") @hidden
    campaignSellerId: String! @from(parentAttribute: "campaignSellerId") @hidden
    campaignBrandId: [String!]! @from(parentAttribute: "campaignBrandId") @hidden
    categoryId: [String!]! @from(parentAttribute: "categoryId") @hidden
    campaignId: ID @from(parentAttribute: "campaignId") @hidden

    campaign: Campaign

    # Home Landing Strategy fields
    budget: Float!
    visualKey: String! # Call to action text
    skus: String!
    comment: String!
    implementationDate: DateTime! @defaultFrom(parentAttribute: "implementationDate")
  }

  type HomeLandingService
    @model(table: "Service")
    @auth(read: ["public"], update: ["public"], delete: ["public"]) {
    # metadata
    type: String! @selectFrom(values: ["vitrina6", "loUltimo", "huincha", "otros"])
    country: String @from(queryParam: "country") @hidden
    homeLandingId: ID @from(parentAttribute: "id") @hidden
    campaignSellerId: String! @from(parentAttribute: "campaignSellerId") @hidden
    campaignBrandId: [String!]! @from(parentAttribute: "campaignBrandId") @hidden
    categoryId: [String!]! @from(parentAttribute: "categoryId") @hidden
    campaignId: ID @from(parentAttribute: "campaignId") @hidden

    campaign: Campaign

    # Home Landing Strategy fields
    budget: Float!
    visualKey: String! # Call to action text
    skus: String!
    url: String!
    comment: String!
    implementationDate: DateTime! @defaultFrom(parentAttribute: "implementationDate")
  }

  union HomeLandingStrategy = HomeLandingLanding | HomeLandingService

  # A unified Service type that combines all fields from your service (@model) types.
  # All fields (except serviceType) are optional.
  type Service
    @model
    @auth(read: ["public"], update: ["public"], delete: ["public"]) {
    country: String @from(queryParam: "country")

    # For filtering
    campaignSellerId: String! @from(parentAttribute: "campaignSellerId")
    campaignBrandId: [String!]! @from(parentAttribute: "campaignBrandId")
    campaignCategoryId: [String!]! @from(parentAttribute: "campaignCategoryId")

    # Common fields
    campaignId: ID @from(parentAttribute: "campaignId")
    campaign: Campaign
    budget: Float
    startDate: DateTime
    endDate: DateTime
    implementationDate: DateTime

    #Fields from planner
    userAssigned: [String]
    labels: [String]
    plannerComments: [PlannerComments]
    nomenclature: String
    campaignGroupCustomId: String

    # This discriminator is always provided when creating a Service
    serviceType: String

    # Fields from MediosDigitalesStrategy
    strategiesId: String
    commission: String
    totalAmount: Float
    # strategies: [MediaCampaignStrategy]

    # Fields from CRM
    crmTypeId: String
    templateId: String
    numberTouches: String
    # subProducts: [Service]

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
    # bannerTypesId: [String]
    # bannerForms: [BannerForm]

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
    form(type: FormType): Form
    getServicesBetweenDates(
      startDate: DateTime
      endDate: DateTime
      serviceType: [String]
      pageSize: Float
      page: Float
      where: ServiceInputType2
    ): Services
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

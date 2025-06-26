/**
 * Application constants
 *
 * This file contains all the constants used across the application
 */

export const constants = {
  DB_ENGINES: {
    FIRESTORE: "firestore",
  },
  COLLECTIONS_DATABASES: {
    SERVICE: "Service",
    BRAND: "Brand",
    CAMPAIGN_GROUP: "CampaignGroup",
    CATEGORY: "Category",
    PRODUCT_MANAGER: "ProductManager",
    PROFILE: "Profile",
    SELLER: "Seller",
    SUBCATEGORY: "Subcategory",
  },
};

export const MODEL_TYPES = Object.values(constants.COLLECTIONS_DATABASES);

export const SERVICE_TYPE_TO_FIELD: Record<string, [string, string]> = {
  "homeLandingForm.strategies": ["homeLandingForm", "strategies"],
  "mediaOnForm.strategies": ["mediaOnForm", "strategies"],
  "CRMForm.subProducts": ["CRMForm", "subProducts"],
};

export const SINGLE_SERVICE_TYPES = [
  "sponsoredProductForm",
  "sponsoredBrandForm",
  "ratingAndReviewForm",
];

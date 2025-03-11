import { Timestamp } from "@google-cloud/firestore";
import admin from "firebase-admin";

// Define interfaces for clarity (adjust as needed)
interface Service {
  serviceType?: string;
  [key: string]: any;
}

interface MediaOnForm {
  strategies?: Service[];
  [key: string]: any;
}

interface CRMForm {
  subProducts?: Service[];
  [key: string]: any;
}

interface HomeLandingForm {
  strategies?: Service[];
  [key: string]: any;
}

interface CampaignGroup {
  // Top-level service fields (of type Service)
  sponsoredBrandForm?: Service;
  sponsoredProductForm?: Service;
  bannerForm?: Service;
  ratingAndReviewForm?: Service;

  // Middleware forms that include service arrays
  mediaOnForm?: MediaOnForm;
  CRMForm?: CRMForm;
  homeLandingForm?: HomeLandingForm;

  // Other fields (flags, IDs, etc.)
  [key: string]: any;
}

interface Service {
  bannerFadStartDate: string;
  bannerMenuStartDate: string;
  startDate: string | Timestamp;
  bannerFadEndDate: string;
  bannerMenuEndDate: string;
  endDate: string | Timestamp;
}

function mapServiceDates(service: Service): Service {
  const startDateKeys: (keyof Service)[] = [
    "startDate",
    "bannerFadStartDate",
    "bannerMenuStartDate",
  ];

  startDateKeys.forEach((key) => {
    if (service[key]) {
      const date = new Date(service[key]);
      date.setHours(0, 0, 0, 0);
      service.startDate = admin.firestore.Timestamp.fromDate(date);
    }
  });

  // endDate
  const endDateKeys: (keyof Service)[] = [
    "endDate",
    "bannerFadEndDate",
    "bannerMenuEndDate",
  ];

  endDateKeys.forEach((key) => {
    if (service[key]) {
      const date = new Date(service[key]);
      date.setHours(23, 59, 59, 999);
      service.endDate = admin.firestore.Timestamp.fromDate(date);
    }
  });

  return service;
}

function generateCustomId(): string {
  const timePart = Date.now().toString().slice(-3);
  const randomPart = Math.floor(100 + Math.random() * 900);

  return `FM${timePart}${randomPart}`;
}

const generateNomenclature = (campaignGroup: CampaignGroup): string => {
  const {
    businessUnitId,
    country,
    eventTypeId,
    subCategoryId,
    customId,
    brandId,
    campaignName,
  } = campaignGroup;

  const businessUnitMap: Record<string, string> = {
    "1P": "FA",
    "3P": "FC",
  };

  const countryMap: Record<string, string> = {
    CL: "CL",
    CO: "CO",
    PE: "PE",
  };

  const tacticalEvents = new Set([
    "14_f",
    "Escolares",
    "DDM",
    "DDP",
    "DDN",
    "Sneaker_Corner",
    "Navidad",
    "Otra",
  ]);

  const businessUnitCode = businessUnitMap[businessUnitId?.toUpperCase()] || "";
  const countryCode = countryMap[country?.toUpperCase()] || "CL";
  const eventTypePrefix = tacticalEvents.has(eventTypeId?.toUpperCase())
    ? "TC"
    : "HS";

  return `${businessUnitCode}${countryCode}-LAB-${eventTypePrefix}-${subCategoryId}-${customId}-(${brandId})-${campaignName}`;
};

function addServiceTypesAndDates(campaignGroup: CampaignGroup): CampaignGroup {
  const customId = generateCustomId();
  campaignGroup.customId = customId;

  const nomemclature = generateNomenclature(campaignGroup);
  campaignGroup.nomemclature = nomemclature;
  // List of top-level keys that are of type Service.
  const topLevelServiceKeys: (keyof CampaignGroup)[] = [
    "sponsoredBrandForm",
    "sponsoredProductForm",
    "bannerForm",
    "ratingAndReviewForm",
  ];

  // Process top-level service fields
  topLevelServiceKeys.forEach((key) => {
    const service = campaignGroup[key];
    if (service && typeof service === "object") {
      service.serviceType = key;
      service.campaignGroupCustomId = customId;
      service.nomenclature = nomemclature;
      mapServiceDates(service);
    }
  });

  // Process nested services in mediaOnForm.strategies
  if (
    campaignGroup.mediaOnForm?.strategies &&
    Array.isArray(campaignGroup.mediaOnForm.strategies)
  ) {
    campaignGroup.mediaOnForm.strategies.forEach((service) => {
      if (service && typeof service === "object") {
        service.serviceType = "mediaOnForm.strategies";
        service.campaignGroupCustomId = customId;
        service.nomenclature = nomemclature;
        mapServiceDates(service);
      }
    });
  }

  // Process nested services in CRMForm.subProducts
  if (
    campaignGroup.CRMForm?.subProducts &&
    Array.isArray(campaignGroup.CRMForm.subProducts)
  ) {
    campaignGroup.CRMForm.subProducts.forEach((service) => {
      if (service && typeof service === "object") {
        service.serviceType = "CRMForm.subProducts";
        service.campaignGroupCustomId = customId;
        service.nomenclature = nomemclature;
        mapServiceDates(service);
      }
    });
  }

  // Process nested services in homeLandingForm.strategies
  if (
    campaignGroup.homeLandingForm?.strategies &&
    Array.isArray(campaignGroup.homeLandingForm.strategies)
  ) {
    campaignGroup.homeLandingForm.strategies.forEach((service) => {
      if (service && typeof service === "object") {
        service.serviceType = "homeLandingForm.strategies";
        service.campaignGroupCustomId = customId;
        service.nomenclature = nomemclature;
        mapServiceDates(service);
      }
    });
  }

  return campaignGroup;
}

export function mapCampaignGroup(entity: any): any {
  const campaignGroup = entity as CampaignGroup;
  const result = addServiceTypesAndDates(campaignGroup);
  return result;
}

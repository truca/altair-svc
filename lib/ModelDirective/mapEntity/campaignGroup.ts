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

function addServiceTypesAndDates(campaignGroup: CampaignGroup): CampaignGroup {
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

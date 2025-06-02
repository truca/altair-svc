import { Timestamp } from "@google-cloud/firestore";
import admin from "firebase-admin";
import { constants } from "../../../src/constants";

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

async function generateCustomId(): Promise<string> {
  try {
    const serviceCollection = admin
      .firestore()
      .collection(constants.COLLECTIONS_DATABASES.SERVICE);

    const snapshot = await serviceCollection
      .where("campaignGroupCustomId", ">=", "FM")
      .orderBy("campaignGroupCustomId", "desc")
      .limit(1)
      .get();

    if (snapshot.empty) {
      return "FM000001";
    }

    const lastDocument = snapshot.docs[0];
    const lastCustomId = lastDocument.data().campaignGroupCustomId || "";

    let lastNumber = 0;
    if (lastCustomId.startsWith("FM") && lastCustomId.length >= 8) {
      lastNumber = parseInt(lastCustomId.substring(2)) || 0;
    }

    const nextNumber = lastNumber + 1;
    const formattedNextNumber = String(nextNumber).padStart(6, "0");

    return `FM${formattedNextNumber}`;
  } catch (error) {
    const timePart = Date.now().toString().slice(-3);
    const randomPart = Math.floor(100 + Math.random() * 900);

    return `FM${timePart}${randomPart}`;
  }
}

const formatDateToNomenclature = (dateString: string): string => {
  if (!dateString) return "";

  const monthNames: { [key: string]: string } = {
    "01": "ene",
    "02": "feb",
    "03": "mar",
    "04": "abr",
    "05": "may",
    "06": "jun",
    "07": "jul",
    "08": "ago",
    "09": "sep",
    "10": "oct",
    "11": "nov",
    "12": "dic",
  };

  const dateObj = new Date(dateString);
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const year = String(dateObj.getFullYear()).slice(-2);
  return `${monthNames[month]}${year}`;
};

const getCampaignType = (campaignTypeId: string): string => {
  if (campaignTypeId === "tactico") {
    return "TC";
  }

  if (campaignTypeId === "always_on") {
    return "AO";
  }

  return "";
};

const generateNomenclature = async (
  campaignGroup: CampaignGroup,
  service: any = {}
): Promise<string> => {
  const {
    businessUnitId,
    country,
    // eventTypeId,
    subCategoryId,
    customId,
    brandId,
    sellerId,
    campaignName,
    campaignTypeId,
    startDate,
  } = campaignGroup;

  const { serviceType } = service;

  const businessUnitMap: Record<string, string> = {
    "1P": "FA",
    "3P": "FC",
  };

  const countryMap: Record<string, string> = {
    CL: "CL",
    CO: "CO",
    PE: "PE",
  };

  // const tacticalEvents = new Set([
  //   "14_f",
  //   "Escolares",
  //   "DDM",
  //   "DDP",
  //   "DDN",
  //   "Sneaker_Corner",
  //   "Navidad",
  //   "Otra",
  // ]);

  const businessUnitCode = businessUnitMap[businessUnitId?.toUpperCase()] || "";
  const countryCode = countryMap[country?.toUpperCase()] || "CL";

  const sellerCollection = admin
    .firestore()
    .collection(constants.COLLECTIONS_DATABASES.SELLER);
  const snapshotSeller = await sellerCollection
    .where("externalId", "==", sellerId)
    .limit(1)
    .get();

  let sellerName = "";
  if (!snapshotSeller.empty) {
    sellerName = snapshotSeller.docs[0].data().name || "";
  }

  const brandCollection = admin
    .firestore()
    .collection(constants.COLLECTIONS_DATABASES.BRAND);

  const snapshotBrand = await brandCollection
    .where("externalId", "==", brandId[0])
    .limit(1)
    .get();

  let brandName = "";
  if (!snapshotBrand.empty) {
    brandName = snapshotBrand.docs[0].data().name || "";
  }

  const date = formatDateToNomenclature(startDate as string);

  if (["CRMForm"].includes(serviceType)) {
    const subProducts = service.subProducts || [];
    const numberTouches = service.numberTouches || 0;

    const contratedServices = [
      ...new Set(subProducts.map((subProduct: any) => subProduct.type)),
    ].join(",");

    return `${businessUnitCode}-${subCategoryId[0]}-${customId}-(${brandName})-${campaignName.replace(/ /g, "_")}-${date}-${contratedServices}-${numberTouches}`;
  }

  const campaignType = getCampaignType(campaignTypeId);

  return `${businessUnitCode}${countryCode}-LAB-${campaignType}-${
    subCategoryId[0]
  }-${customId}-(${sellerName}-${brandName})-${campaignName.replace(/ /g, "_")}_${date}-${sellerId}`;
};

function calculateDates(strategies: Service[]): {
  startDate: string | Timestamp;
  endDate: string | Timestamp;
} {
  if (!strategies || !Array.isArray(strategies) || strategies.length === 0) {
    return { startDate: "", endDate: "" };
  }

  const startDate = strategies
    .map((s: Service) => s.startDate)
    .reduce((min: string | Timestamp, curr: string | Timestamp) =>
      curr < min ? curr : min
    );

  const endDate = strategies
    .map((s: Service) => s.endDate)
    .reduce((max: string | Timestamp, curr: string | Timestamp) =>
      curr > max ? curr : max
    );

  return { startDate, endDate };
}

async function addServiceTypesAndDates(
  campaignGroup: CampaignGroup
): Promise<CampaignGroup> {
  const customId = await generateCustomId();
  campaignGroup.customId = customId;

  const country = campaignGroup.country;

  // List of top-level keys that are of type Service.
  const topLevelServiceKeys: (keyof CampaignGroup)[] = [
    "sponsoredBrandForm",
    "sponsoredProductForm",
    "bannerForm",
    "ratingAndReviewForm",
    "mediaOnForm",
    "CRMForm",
  ];

  const serviceWithoutDatesKeys: (keyof CampaignGroup)[] = [
    "mediaOnForm",
    "homeLandingForm",
  ];

  // Process top-level service fields - usar Promise.all para manejar los async en paralelo
  const servicePromises = topLevelServiceKeys.map(async (key) => {
    const service = campaignGroup[key];
    if (service && typeof service === "object") {
      service.serviceType = key;
      service.campaignGroupCustomId = customId;
      service.country = country;

      if (serviceWithoutDatesKeys.includes(key)) {
        const { startDate, endDate } = calculateDates(service.strategies);

        service.startDate = startDate;
        service.endDate = endDate;
      }

      const serviceNomemclature = await generateNomenclature(
        campaignGroup,
        service
      );
      service.nomenclature = serviceNomemclature;

      mapServiceDates(service);
    }
  });

  // Esperamos a que todas las promesas se resuelvan
  await Promise.all(servicePromises);

  // Process nested services in homeLandingForm.strategies
  if (
    campaignGroup.homeLandingForm?.strategies &&
    Array.isArray(campaignGroup.homeLandingForm.strategies)
  ) {
    const strategyPromises = campaignGroup.homeLandingForm.strategies.map(
      async (service) => {
        if (service && typeof service === "object") {
          service.serviceType = "homeLandingForm.strategies";
          service.campaignGroupCustomId = customId;
          service.country = country;

          // También necesitamos generar nomenclatura para las estrategias
          const serviceNomemclature = await generateNomenclature(
            campaignGroup,
            service
          );
          service.nomenclature = serviceNomemclature;

          mapServiceDates(service);
        }
      }
    );

    // Esperamos a que todas las promesas de estrategias se resuelvan
    await Promise.all(strategyPromises);
  }

  return campaignGroup;
}

export async function mapCampaignGroup(entity: any): Promise<any> {
  const campaignGroup = entity as CampaignGroup;
  const result = await addServiceTypesAndDates(campaignGroup);
  return result;
}

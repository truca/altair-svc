import { Timestamp } from "@google-cloud/firestore";
import admin from "firebase-admin";
import { constants, SERVICE_TYPE_TO_FIELD, SINGLE_SERVICE_TYPES } from '../../../src/constants';
import { generateUUID } from '../../../lib/utils';

// Define interfaces for clarity (adjust as needed)
interface Service {
  serviceType?: string;
  campaignId?: string;
  campaignSellerId?: string;
  campaignBrandId?: string[] | string;
  categoryId?: string[] | string;
  campaignGroupCustomId?: string;
  country?: string;
  nomenclature?: string;
  
  // Dates - make them optional
  bannerFadStartDate?: string | Timestamp;
  bannerMenuStartDate?: string | Timestamp;
  startDate?: string | Timestamp;
  bannerFadEndDate?: string | Timestamp;
  bannerMenuEndDate?: string | Timestamp;
  endDate?: string | Timestamp;
  implementationDate?: string | Timestamp;
  
  // Other fields
  budget?: number;
  visualKey?: string;
  sku?: string;
  url?: string;
  comments?: string;
  type?: string;
  
  // References to nested objects
  strategies?: any[];
  bannerForms?: any[];
  subProducts?: any[];
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

export const topLevelServiceKeys: (keyof CampaignGroup)[] = [
  "sponsoredBrandForm",
  "sponsoredProductForm",
  "ratingAndReviewForm",
  "mediaOnForm",
  "CRMForm",
  "bannerForm",
];

function mapServiceDates(service: Service): Service {
  const startDateKeys: (keyof Service)[] = [
    "startDate",
    "bannerFadStartDate",
    "bannerMenuStartDate",
  ];

  startDateKeys.forEach((key) => {
    if (service[key] && typeof service[key] === 'string') {
      const date = new Date(service[key] as string);
      date.setHours(0, 0, 0, 0);
      (service as any)[key] = admin.firestore.Timestamp.fromDate(date);
    }
  });

  // endDate
  const endDateKeys: (keyof Service)[] = [
    "endDate",
    "bannerFadEndDate",
    "bannerMenuEndDate",
  ];

  endDateKeys.forEach((key) => {
    if (service[key] && typeof service[key] === 'string') {
      const date = new Date(service[key] as string);
      date.setHours(23, 59, 59, 999);
      (service as any)[key] = admin.firestore.Timestamp.fromDate(date);
    }
  });

  // implementationDate SOLO se procesa en su propio campo
  if (service.implementationDate && typeof service.implementationDate === 'string') {
    const date = new Date(service.implementationDate);
    date.setHours(12, 0, 0, 0); // Set to noon for implementation date
    service.implementationDate = admin.firestore.Timestamp.fromDate(date);
  }

  // Process dates in bannerForms array if it exists
  if (service.bannerForms && Array.isArray(service.bannerForms)) {
    service.bannerForms = service.bannerForms.map(banner => {
      if (!banner) return banner;
      
      // Process start date
      if (banner.startDate && typeof banner.startDate === 'string') {
        const date = new Date(banner.startDate);
        date.setHours(0, 0, 0, 0);
        banner.startDate = admin.firestore.Timestamp.fromDate(date);
      }

      // Process end date
      if (banner.endDate && typeof banner.endDate === 'string') {
        const date = new Date(banner.endDate);
        date.setHours(23, 59, 59, 999);
        banner.endDate = admin.firestore.Timestamp.fromDate(date);
      }

      // Process implementation date
      if (banner.implementationDate && typeof banner.implementationDate === 'string') {
        const date = new Date(banner.implementationDate);
        date.setHours(12, 0, 0, 0);
        banner.implementationDate = admin.firestore.Timestamp.fromDate(date);
      }

      return banner;
    });
  }

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

  const validStartDates = strategies
    .map((s: Service) => s.startDate)
    .filter((date): date is string | Timestamp => date !== undefined && date !== "");

  const validEndDates = strategies
    .map((s: Service) => s.endDate)
    .filter((date): date is string | Timestamp => date !== undefined && date !== "");

  if (validStartDates.length === 0) {
    return { startDate: "", endDate: "" };
  }

  const startDate = validStartDates.reduce((min: string | Timestamp, curr: string | Timestamp) =>
    curr < min ? curr : min
  );

  const endDate = validEndDates.length > 0 
    ? validEndDates.reduce((max: string | Timestamp, curr: string | Timestamp) =>
        curr > max ? curr : max
      )
    : "";

  return { startDate, endDate };
}

async function addServiceTypesAndDates(
  campaignGroup: CampaignGroup
): Promise<CampaignGroup> {
  // Generar ID de campaña
  const campaignId = generateUUID();
  campaignGroup.id = campaignId;
  const customId = await generateCustomId();
  campaignGroup.customId = customId;
  const country = campaignGroup.country;
  const servicesToCreate: any[] = [];
  const serviceIdsMap: Record<string, string> = {};
  const serviceWithoutDatesKeys: (keyof CampaignGroup)[] = [
    "mediaOnForm",
    "homeLandingForm",
    "sponsoredProductForm",
    "sponsoredBrandForm",
  ];
  await Promise.all(serviceWithoutDatesKeys.map(async (key) => {
    const service = campaignGroup[key];
    if (service && typeof service === "object") {
      const serviceId = generateUUID();
      service.id = serviceId;
      serviceIdsMap[`${key}`] = serviceId;
      service.serviceType = key;
      service.campaignGroupCustomId = customId;
      service.country = country;
      service.campaignId = campaignId;
      service.deletedAt = null;
      if (serviceWithoutDatesKeys.includes(key)) {
        const { startDate, endDate } = calculateDates(
          service.strategies || service.bannerForms
        );
        service.startDate = startDate;
        service.endDate = endDate;
      }
      const serviceNomemclature = await generateNomenclature(
        campaignGroup,
        service
      );
      service.nomenclature = serviceNomemclature;
      mapServiceDates(service);
      servicesToCreate.push({ ...service });
    }
  }));
  // Nested services: homeLandingForm.strategies
  if (
    campaignGroup.homeLandingForm?.strategies &&
    Array.isArray(campaignGroup.homeLandingForm.strategies)
  ) {
    campaignGroup.homeLandingForm.strategies = await Promise.all(campaignGroup.homeLandingForm.strategies.map(async (strategy, idx) => {
      if (strategy && typeof strategy === "object") {
        const serviceId = generateUUID();
        (strategy as any).id = serviceId;
        serviceIdsMap[`homeLandingForm.strategies.${idx}`] = serviceId;
        strategy.serviceType = "homeLandingForm.strategies";
        strategy.campaignGroupCustomId = customId;
        strategy.country = country;
        strategy.campaignId = campaignId;
        if (!strategy.campaignSellerId || strategy.campaignSellerId === "") {
          strategy.campaignSellerId = campaignGroup.sellerId;
        }
        if ((!strategy.campaignBrandId || strategy.campaignBrandId.length === 0) && campaignGroup.brandId) {
          strategy.campaignBrandId = campaignGroup.brandId;
        }
        if ((!strategy.categoryId || strategy.categoryId.length === 0) && campaignGroup.categoryId) {
          strategy.categoryId = campaignGroup.categoryId;
        }
        const serviceNomemclature = await generateNomenclature(
          campaignGroup,
          strategy
        );
        strategy.nomenclature = serviceNomemclature;
        mapServiceDates(strategy);
        (strategy as any).deletedAt = null;
        servicesToCreate.push({ ...strategy, _originalRef: `homeLandingForm.strategies.${idx}`, _originalIndex: idx });
      }
      return strategy;
    }));
  }
  // Nested services: mediaOnForm.strategies
  if (
    campaignGroup.mediaOnForm?.strategies &&
    Array.isArray(campaignGroup.mediaOnForm.strategies)
  ) {
    campaignGroup.mediaOnForm.strategies = await Promise.all(campaignGroup.mediaOnForm.strategies.map(async (strategy, idx) => {
      if (strategy && typeof strategy === "object") {
        const serviceId = generateUUID();
        (strategy as any).id = serviceId;
        serviceIdsMap[`mediaOnForm.strategies.${idx}`] = serviceId;
        strategy.serviceType = "mediaOnForm.strategies";
        strategy.campaignGroupCustomId = customId;
        strategy.country = country;
        strategy.campaignId = campaignId;
        if (!strategy.campaignSellerId || strategy.campaignSellerId === "") {
          strategy.campaignSellerId = campaignGroup.sellerId;
        }
        if ((!strategy.campaignBrandId || strategy.campaignBrandId.length === 0) && campaignGroup.brandId) {
          strategy.campaignBrandId = campaignGroup.brandId;
        }
        if ((!strategy.categoryId || strategy.categoryId.length === 0) && campaignGroup.categoryId) {
          strategy.categoryId = campaignGroup.categoryId;
        }
        const serviceNomemclature = await generateNomenclature(
          campaignGroup,
          strategy
        );
        strategy.nomenclature = serviceNomemclature;
        mapServiceDates(strategy);
        (strategy as any).deletedAt = null;
        servicesToCreate.push({ ...strategy, _originalRef: `mediaOnForm.strategies.${idx}`, _originalIndex: idx });
      }
      return strategy;
    }));
  }
  // Nested services: CRMForm.subProducts
  if (
    campaignGroup.CRMForm?.subProducts &&
    Array.isArray(campaignGroup.CRMForm.subProducts)
  ) {
    campaignGroup.CRMForm.subProducts = await Promise.all(campaignGroup.CRMForm.subProducts.map(async (subProduct, idx) => {
      if (subProduct && typeof subProduct === "object") {
        const serviceId = generateUUID();
        (subProduct as any).id = serviceId;
        serviceIdsMap[`CRMForm.subProducts.${idx}`] = serviceId;
        subProduct.serviceType = "CRMForm.subProducts";
        subProduct.campaignGroupCustomId = customId;
        subProduct.country = country;
        subProduct.campaignId = campaignId;
        if (!subProduct.campaignSellerId || subProduct.campaignSellerId === "") {
          subProduct.campaignSellerId = campaignGroup.sellerId;
        }
        if ((!subProduct.campaignBrandId || subProduct.campaignBrandId.length === 0) && campaignGroup.brandId) {
          subProduct.campaignBrandId = campaignGroup.brandId;
        }
        if ((!subProduct.categoryId || subProduct.categoryId.length === 0) && campaignGroup.categoryId) {
          subProduct.categoryId = campaignGroup.categoryId;
        }
        const serviceNomemclature = await generateNomenclature(
          campaignGroup,
          subProduct
        );
        subProduct.nomenclature = serviceNomemclature;
        mapServiceDates(subProduct);
        (subProduct as any).deletedAt = null;
        servicesToCreate.push({ ...subProduct, _originalRef: `CRMForm.subProducts.${idx}`, _originalIndex: idx });
      }
      return subProduct;
    }));
  }
  // Nested services: bannerForm.bannerForms
  if (
    campaignGroup.bannerForm &&
    Array.isArray(campaignGroup.bannerForm.bannerForms)
  ) {
    campaignGroup.bannerForm.bannerForms = await Promise.all(campaignGroup.bannerForm.bannerForms.map(async (banner, idx) => {
      if (banner && typeof banner === "object") {
        const serviceId = generateUUID();
        (banner as any).id = serviceId;
        serviceIdsMap[`bannerForm.bannerForms.${idx}`] = serviceId;
        banner.serviceType = `bannerForm.${banner.bannerTypeId || "UNKNOWN"}`;
        banner.campaignGroupCustomId = customId;
        banner.country = country;
        banner.campaignId = campaignId;
        if (!banner.campaignSellerId || banner.campaignSellerId === "") {
          banner.campaignSellerId = campaignGroup.sellerId;
        }
        if ((!banner.campaignBrandId || banner.campaignBrandId.length === 0) && campaignGroup.brandId) {
          banner.campaignBrandId = campaignGroup.brandId;
        }
        if ((!banner.categoryId || banner.categoryId.length === 0) && campaignGroup.categoryId) {
          banner.categoryId = campaignGroup.categoryId;
        }
        const serviceNomemclature = await generateNomenclature(
          campaignGroup,
          banner
        );
        banner.nomenclature = serviceNomemclature;
        mapServiceDates(banner);
        (banner as any).deletedAt = null;
        servicesToCreate.push({ ...banner, _originalRef: `bannerForm.bannerForms.${idx}`, _originalIndex: idx });
      }
      return banner;
    }));
  }
  // create service with ids generated
  const serviceCollection = admin.firestore().collection(constants.COLLECTIONS_DATABASES.SERVICE);
  await Promise.all(servicesToCreate.map(async (serviceData) => {
    const { id, ...rest } = serviceData;
    await serviceCollection.doc(id).set({ ...rest, id });
  }));
  // campaignIds campaignGroup
  campaignGroup.campaignIds = servicesToCreate.map(s => s.id);
  return campaignGroup;
}

export async function updateServicesWithCampaignId(campaignGroupId: string, customId: string): Promise<void> {
  try {
    console.log(`Updating services with campaignId ${campaignGroupId} for customId ${customId}`);
    
    const serviceCollection = admin
      .firestore()
      .collection(constants.COLLECTIONS_DATABASES.SERVICE);
      
    const snapshot = await serviceCollection
      .where("campaignGroupCustomId", "==", customId)
      .get();
      
    if (snapshot.empty) {
      console.log(`No services found with campaignGroupCustomId ${customId}`);
      return;
    }
    
    console.log(`Found ${snapshot.docs.length} services to update with campaignId ${campaignGroupId}`);
    
    const updatePromises = snapshot.docs.map(async (doc) => {
      try {
        await doc.ref.update({
          campaignId: campaignGroupId
        });
        console.log(`Updated service ${doc.id} with campaignId ${campaignGroupId}`);
      } catch (err) {
        console.error(`Error updating service ${doc.id}:`, err);
      }
    });
    
    await Promise.all(updatePromises);
    console.log(`Successfully updated all services with campaignId ${campaignGroupId}`);
  } catch (error) {
    console.error("Error updating services with campaignId:", error);
  }
}

export async function mapCampaignGroup(entity: any): Promise<any> {
  const campaignGroup = entity as CampaignGroup;
  const result = await addServiceTypesAndDates(campaignGroup);
  
  // Store the customId for post-processing
  result._customIdForPostProcessing = result.customId;
  
  return result;
}

export async function updateServiceInCampaignGroup(
  campaignGroupId: any,
  serviceId: any,
  serviceType: any,
  newServiceData: any
) {
  const campaignGroupCollection = admin.firestore().collection(constants.COLLECTIONS_DATABASES.CAMPAIGN_GROUP);
  const campaignGroupDoc = await campaignGroupCollection.doc(campaignGroupId).get();
  console.log({campaignGroupId, serviceId, serviceType, newServiceData})

  if (!campaignGroupDoc.exists) {
    return;
  }

  const campaignGroupData: any = campaignGroupDoc.data() || {};
  const updateData: any = {};

 

  if (SERVICE_TYPE_TO_FIELD[serviceType]) {
    const [formField, arrayField] = SERVICE_TYPE_TO_FIELD[serviceType];
    if (campaignGroupData[formField]?.[arrayField]) {
      const arr = [...campaignGroupData[formField][arrayField]];
      const idx = arr.findIndex((s: any) => s.id === serviceId);
      if (idx !== -1) {
        arr[idx] = { ...newServiceData };
        updateData[formField] = {
          ...campaignGroupData[formField],
          [arrayField]: arr
        };
      }
    }
  } else if (SINGLE_SERVICE_TYPES.includes(serviceType)) {
    console.log(`Updating single service type: ${serviceType}`);
    console.log(`New service data:`, newServiceData);
    updateData[serviceType] = { ...newServiceData };
  } else if (serviceType && serviceType.startsWith("bannerForm.")) {
    if (campaignGroupData.bannerForm?.bannerForms) {
      const arr = [...campaignGroupData.bannerForm.bannerForms];
      const idx = arr.findIndex((b: any) => b.id === serviceId);
      if (idx !== -1) {
        arr[idx] = { ...newServiceData };
        updateData.bannerForm = {
          ...campaignGroupData.bannerForm,
          bannerForms: arr
        };
      }
    }
  }

  if (Object.keys(updateData).length > 0) {
    await campaignGroupDoc.ref.update(updateData);
  } 
}

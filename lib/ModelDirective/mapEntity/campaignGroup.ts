import { Timestamp } from "@google-cloud/firestore";
import admin from "firebase-admin";
import { constants } from "../../../src/constants";

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
  const customId = await generateCustomId();
  campaignGroup.customId = customId;

  const country = campaignGroup.country;
  
  // Create a list to track all service entities that need to be created
  const servicesToCreate: any[] = [];

  // List of top-level keys that are of type Service.
  const topLevelServiceKeys: (keyof CampaignGroup)[] = [
    "sponsoredBrandForm",
    "sponsoredProductForm",
    "ratingAndReviewForm",
    "mediaOnForm",
    "CRMForm",
  ];

  const serviceWithoutDatesKeys: (keyof CampaignGroup)[] = [
    "mediaOnForm",
    "homeLandingForm",
  ];

  const servicePromises = topLevelServiceKeys.map(async (key) => {
    const service = campaignGroup[key];
    if (service && typeof service === "object") {
      service.serviceType = key;
      service.campaignGroupCustomId = customId;
      service.country = country;

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
      
      // Add top-level service to our creation list
      servicesToCreate.push({...service});
    }
  });

  // Esperamos a que todas las promesas se resuelvan
  await Promise.all(servicePromises);

  // Process nested services in homeLandingForm.strategies
  if (
    campaignGroup.homeLandingForm?.strategies &&
    Array.isArray(campaignGroup.homeLandingForm.strategies)
  ) {
    const originalStrategies = JSON.parse(JSON.stringify(campaignGroup.homeLandingForm.strategies));
    
    const strategyPromises = originalStrategies.map(
      async (originalService: any, index: number) => {
        if (originalService && typeof originalService === "object") {
          const serviceToCreate = { ...originalService };
          
          serviceToCreate.serviceType = "homeLandingForm.strategies";
          serviceToCreate.campaignGroupCustomId = customId;
          serviceToCreate.country = country;
          
          if (!serviceToCreate.campaignSellerId && campaignGroup.sellerId) {
            serviceToCreate.campaignSellerId = campaignGroup.sellerId;
          }
          
          if ((!serviceToCreate.campaignBrandId || serviceToCreate.campaignBrandId.length === 0) && campaignGroup.brandId) {
            serviceToCreate.campaignBrandId = campaignGroup.brandId;
          }
          
          if ((!serviceToCreate.categoryId || serviceToCreate.categoryId.length === 0) && campaignGroup.categoryId) {
            serviceToCreate.categoryId = campaignGroup.categoryId;
          }

          // Generate nomenclature
          const serviceNomemclature = await generateNomenclature(
            campaignGroup,
            serviceToCreate
          );
          serviceToCreate.nomenclature = serviceNomemclature;

          mapServiceDates(serviceToCreate);
          
          const refId = `homeLandingForm.strategies.${index}`;
          servicesToCreate.push({
            ...serviceToCreate,
            _originalRef: refId,
            _originalIndex: index
          });
        }
      }
    );

    await Promise.all(strategyPromises);
  }
  
  if (
    campaignGroup.mediaOnForm?.strategies &&
    Array.isArray(campaignGroup.mediaOnForm.strategies)
  ) {
    const originalStrategies = JSON.parse(JSON.stringify(campaignGroup.mediaOnForm.strategies));
    
    const strategyPromises = originalStrategies.map(
      async (originalService: any, index: number) => {
        if (originalService && typeof originalService === "object") {
          const serviceToCreate = { ...originalService };
          
          serviceToCreate.serviceType = "mediaOnForm.strategies";
          serviceToCreate.campaignGroupCustomId = customId;
          serviceToCreate.country = country;
          
          if (!serviceToCreate.campaignSellerId && campaignGroup.sellerId) {
            serviceToCreate.campaignSellerId = campaignGroup.sellerId;
          }
          
          if ((!serviceToCreate.campaignBrandId || serviceToCreate.campaignBrandId.length === 0) && campaignGroup.brandId) {
            serviceToCreate.campaignBrandId = campaignGroup.brandId;
          }
          
          if ((!serviceToCreate.categoryId || serviceToCreate.categoryId.length === 0) && campaignGroup.categoryId) {
            serviceToCreate.categoryId = campaignGroup.categoryId;
          }
          
          // Generate nomenclature
          const serviceNomemclature = await generateNomenclature(
            campaignGroup,
            serviceToCreate
          );
          serviceToCreate.nomenclature = serviceNomemclature;

          mapServiceDates(serviceToCreate);
          
          const refId = `mediaOnForm.strategies.${index}`;
          servicesToCreate.push({
            ...serviceToCreate,
            _originalRef: refId,
            _originalIndex: index
          });
        }
      }
    );

    await Promise.all(strategyPromises);
  }

  if (
    campaignGroup.CRMForm?.subProducts &&
    Array.isArray(campaignGroup.CRMForm.subProducts)
  ) {
    const originalSubProducts = JSON.parse(JSON.stringify(campaignGroup.CRMForm.subProducts));
    
    const subProductPromises = originalSubProducts.map(
      async (originalService: any, index: number) => {
        if (originalService && typeof originalService === "object") {
          const serviceToCreate = { ...originalService };
          
          serviceToCreate.serviceType = "CRMForm.subProducts";
          serviceToCreate.campaignGroupCustomId = customId;
          serviceToCreate.country = country;
          
          if (!serviceToCreate.campaignSellerId || serviceToCreate.campaignSellerId === "") {
            serviceToCreate.campaignSellerId = campaignGroup.sellerId;
          }
          
          if ((!serviceToCreate.campaignBrandId || serviceToCreate.campaignBrandId.length === 0) && campaignGroup.brandId) {
            serviceToCreate.campaignBrandId = campaignGroup.brandId;
          }
          
          if ((!serviceToCreate.categoryId || serviceToCreate.categoryId.length === 0) && campaignGroup.categoryId) {
            serviceToCreate.categoryId = campaignGroup.categoryId;
          }

          // Generate nomenclature
          const serviceNomemclature = await generateNomenclature(
            campaignGroup,
            serviceToCreate
          );
          serviceToCreate.nomenclature = serviceNomemclature;

          mapServiceDates(serviceToCreate);
          
          const refId = `CRMForm.subProducts.${index}`;
          servicesToCreate.push({
            ...serviceToCreate,
            _originalRef: refId,
            _originalIndex: index
          });
        }
      }
    );

    await Promise.all(subProductPromises);
  }
  
  // Procesar banners en bannerForm.bannerForms
  if (
    campaignGroup.bannerForm?.bannerForms &&
    Array.isArray(campaignGroup.bannerForm.bannerForms)
  ) {
    const originalBanners = JSON.parse(JSON.stringify(campaignGroup.bannerForm.bannerForms));
    const bannerPromises = originalBanners.map(
      async (originalBanner: any, index: number) => {
        if (originalBanner && typeof originalBanner === "object") {
          const serviceToCreate = { ...originalBanner };
          // Heredar datos del campaignGroup
          serviceToCreate.campaignGroupCustomId = customId;
          serviceToCreate.country = country;
          if (campaignGroup.id) {
            serviceToCreate.campaignId = campaignGroup.id;
          }
          if (!serviceToCreate.campaignSellerId && campaignGroup.sellerId) {
            serviceToCreate.campaignSellerId = campaignGroup.sellerId;
          }
          if ((!serviceToCreate.campaignBrandId || serviceToCreate.campaignBrandId.length === 0) && campaignGroup.brandId) {
            serviceToCreate.campaignBrandId = campaignGroup.brandId;
          }
          if ((!serviceToCreate.categoryId || serviceToCreate.categoryId.length === 0) && campaignGroup.categoryId) {
            serviceToCreate.categoryId = campaignGroup.categoryId;
          }
          // Asignar serviceType dinámico
          const bannerTypeId = serviceToCreate.bannerTypeId || "UNKNOWN";
          serviceToCreate.serviceType = `bannerForm.${bannerTypeId}`;
          // Guardar bannerTypeId explícitamente
          serviceToCreate.bannerTypeId = bannerTypeId;
          // Nomenclatura
          const serviceNomemclature = await generateNomenclature(
            campaignGroup,
            serviceToCreate
          );
          serviceToCreate.nomenclature = serviceNomemclature;
          mapServiceDates(serviceToCreate);
          // Eliminar bannerForms si existe en el objeto individual
          if (serviceToCreate.bannerForms) {
            delete serviceToCreate.bannerForms;
          }
          const refId = `bannerForm.bannerForms.${index}`;
          servicesToCreate.push({
            ...serviceToCreate,
            _originalRef: refId,
            _originalIndex: index
          });
        }
      }
    );
    await Promise.all(bannerPromises);
  }
  
  const serviceReferenceMap = new Map();
  
  console.log(`Creating ${servicesToCreate.length} service entities...`);
  
  const serviceCreationPromises = servicesToCreate.map(async (serviceData, index) => {
    try {
      console.log(`Creating service ${index + 1}/${servicesToCreate.length}, type: ${serviceData.serviceType}`);
      
      const originalRef = serviceData._originalRef;
      const originalIndex = serviceData._originalIndex;
      delete serviceData._originalRef;
      delete serviceData._originalIndex;
      
      serviceData.createdAt = new Date();
      
      const serviceCollection = admin
        .firestore()
        .collection(constants.COLLECTIONS_DATABASES.SERVICE);
      
      const docRef = await serviceCollection.add(serviceData);
      const serviceId = docRef.id;
      console.log(`Service created with ID: ${serviceId}`);
      if (originalRef) {
        serviceReferenceMap.set(originalRef, { id: serviceId, type: serviceData.serviceType, originalIndex });
      }
      
      return { id: serviceId, type: serviceData.serviceType, originalRef, originalIndex };
    } catch (error) {
      console.error("Error creating service:", error);
      console.error(error);
      return null;
    }
  });
  
  const createdServices = await Promise.all(serviceCreationPromises);
  const validServices = createdServices.filter((s) => s !== null) as Array<{
    id: string;
    type: string;
    originalRef?: string;
    originalIndex?: number;
  }>;
  
  console.log(`Successfully created ${validServices.length} services`);
  
  if (!campaignGroup.campaignIds) {
    campaignGroup.campaignIds = [];
  }
  
  campaignGroup.campaignIds = [
    ...campaignGroup.campaignIds, 
    ...validServices.map(s => s.id)
  ];
  

  
  if (campaignGroup.homeLandingForm?.strategies) {
    const homeLandingStrategies = validServices.filter(s => s.type === "homeLandingForm.strategies");
    const orderedStrategies = homeLandingStrategies
      .sort((a, b) => (a.originalIndex || 0) - (b.originalIndex || 0))
      .map(s => {
        const originalStrategy = campaignGroup.homeLandingForm?.strategies?.[s.originalIndex || 0];
        return {
          ...originalStrategy,
          id: s.id
        };
      });
      
    console.log(`Updating ${homeLandingStrategies.length} homeLandingForm strategies with IDs`);
    campaignGroup.homeLandingForm.strategies = orderedStrategies;
  }
  
  if (campaignGroup.mediaOnForm?.strategies) {
    const mediaOnStrategies = validServices.filter(s => s.type === "mediaOnForm.strategies");
    
    const orderedStrategies = mediaOnStrategies
      .sort((a, b) => (a.originalIndex || 0) - (b.originalIndex || 0))
      .map(s => {
        const originalStrategy = campaignGroup.mediaOnForm?.strategies?.[s.originalIndex || 0];
        return {
          ...originalStrategy,
          id: s.id
        };
      });
      
    console.log(`Updating ${mediaOnStrategies.length} mediaOnForm strategies with IDs`);
    campaignGroup.mediaOnForm.strategies = orderedStrategies;
  }
  
  if (campaignGroup.CRMForm?.subProducts) {
    const crmSubProducts = validServices.filter(s => s.type === "CRMForm.subProducts");
    
    const orderedSubProducts = crmSubProducts
      .sort((a, b) => (a.originalIndex || 0) - (b.originalIndex || 0))
      .map(s => {
        const originalSubProduct = campaignGroup.CRMForm?.subProducts?.[s.originalIndex || 0];
        return {
          ...originalSubProduct,
          id: s.id
        };
      });
      
    console.log(`Updating ${crmSubProducts.length} CRM subProducts with IDs`);
    campaignGroup.CRMForm.subProducts = orderedSubProducts;
  }

  if (campaignGroup.bannerForm) {
    delete campaignGroup.bannerForm;
  }

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

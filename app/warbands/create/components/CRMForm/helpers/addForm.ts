import { UseFieldArrayAppend } from "react-hook-form";

const addForm = (formType: string, append: UseFieldArrayAppend<{}>) => {
  console.log("entree!!!");
  const commonFields = {
    budget: 0,
    base: 0,
    internalCampaignName: "",
    comments: "",
  };

  let newForm: any = {};

  switch (formType) {
    case "email":
      newForm = { ...commonFields, type: "email", shippingDate: "" };
      break;
    case "trigger":
      newForm = {
        ...commonFields,
        type: "trigger",
        quantityMonths: 0,
        triggerTypeId: "",
      };
      break;
    case "banner":
      newForm = {
        ...commonFields,
        type: "banner",
        startDate: "",
        endDate: "",
        sku: "",
        callToAction: "",
        url: "",
      };
      break;
    case "sms":
      newForm = { ...commonFields, type: "sms", smsText: "", url: "" };
      break;
    case "whatsapp":
      newForm = { ...commonFields, type: "whatsapp", smsText: "", url: "" };
      break;
    case "push":
      newForm = {
        ...commonFields,
        type: "push",
        link: "",
        title: "",
        callToAction: "",
        url: "",
      };
      break;
    case "pushSmsNrt":
      newForm = {
        ...commonFields,
        type: "pushSmsNrt",
        startDate: "",
        endDate: "",
        text: "",
        storeId: "",
      };
      break;
    case "preheader":
      newForm = {
        ...commonFields,
        type: "preheader",
        startDate: "",
        endDate: "",
        sku: "",
        callToAction: "",
        url: "",
      };
      break;
    case "cupon":
      newForm = {
        ...commonFields,
        type: "cupon",
        cuponTypeId: "",
        benefit: "",
        benefitAmount: 0,
        trigger: "",
        message: "",
        storeId: "",
      };
      break;
    case "sampling":
      newForm = {
        ...commonFields,
        type: "sampling",
        typeId: "",
        units: 0,
        storeId: "",
        segmentation: "",
      };
      break;
    case "whatsappCarrousel":
      newForm = {
        ...commonFields,
        type: "whatsappCarrousel",
        skus: [],
        text: "",
        url: "",
      };
      break;
    default:
      console.error("Unknown form type:", formType);
      break;
  }

  append(newForm);
};

export default addForm;

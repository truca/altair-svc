"use client";

import { PageState, usePageContextReducer } from "../../contexts/PageContext";
import { sidebarCtx } from "../../constants";
import { gql, useMutation } from "@apollo/client";
import { useState } from "react";
import getQueryFieldsForSponsoredForm from "./helpers/getFieldsForSponsoredForm";
import { MultiStepForm } from "@/app/stories/Form/MultiStepForm";
const initialState = (
  createCampaignGroup: any,
  fieldsForm: any,
  setFieldsForm?: any
): PageState<"sidebar" | "logo" | "user" | "content"> => ({
  page: { type: "" },
  slots: {
    sidebar: {
      type: "LinkSidebar",
      ctx: sidebarCtx,
    },
    logo: { type: "Logo" },
    user: { type: "User" },
    content: {
      type: "Form",
      ctx: {
        formSx: {
          padding: "32px",
          borderWidth: "1px",
          borderRadius: "8px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          width: "848px",
          top: "155px",
          left: "296px",
          paddingTop: "57px",
          paddingBottom: "57px",
          paddingLeft: "80px",
          paddingRight: "80px",
          gap: "10px",
        },
        fields: fieldsForm,
        // initialValues: {
        //   name: "Wild",
        //   faction: "wild",
        //   glory_points: 80,
        //   guild_upgrade_points: 6,
        //   guild_upgrades: ["Guildhall:1:hero:1"],
        // },
        // steps: [
        //   {
        //     title: "Información General",
        //     description: "Define warband general info",
        //   },
        //   { title: "Servicios", description: "Select guild upgrades" },
        //   { title: "dasd", description: "Select guild upgrades" },
        //   { title: "Serviasdsacios", description: "Select guild upgrades" },
        //   { title: "Resumen", description: "Select Units" },
        //   { title: "Resumen", description: "Select Units" },
        //   { title: "Resumen", description: "Select Units" },
        // ],
        onSubmit: (values: FormValue) => {
          console.log("Form submitted:", values);
          const campaignGroupInput = getMutationInputFromFormValues(values);
          createCampaignGroup({ variables: { data: campaignGroupInput } });
        },
        setFieldsForm,
        handleNext: (goToNext: VoidFunction) => (values: any) => {
          goToNext();
        },
      },
    },
  },
  modals: [],
  sidebars: [],
});

interface FormValue {}

interface CreateCampaignGroupInput {
  productManagerId: string;
  businessUnitId: string;
  sellerId: string;
  brandId: string;
  categoryId: string;
  subCategoryId: string;
  campaignTypeId: string;
  startDate: string;
  endDate: string;
  bannersFadsEnabled: boolean;
  CRMEnabled: boolean;
  homeLandingEnabled: boolean;
  mediaOnEnabled: boolean;
  ratingsAndReviewsEnabled: boolean;
  sponsoredBrandsEnabled: boolean;
  sponsoredProductEnabled: boolean;
  mediaOffEnabled: boolean;
  storeEnabled: boolean;
  graphicsEnabled: boolean;
  othersEnabled: boolean;
  sponsoredProductForm?: any;
  bannerForm?: any;
  sponsoredBrandForm?: any;
  ratingAndReviewForm?: any;
  CRMForm?: any;
  HomeLandingForm?: any;
  MediaOnForm?: any;
}

interface FormValue {
  [key: string]: any;
}

function getMutationInputFromFormValues(
  values: FormValue
): CreateCampaignGroupInput {
  return {
    productManagerId: values.productManagerId,
    businessUnitId: values.businessUnitId,
    sellerId: values.sellerId,
    brandId: values.brandId,
    categoryId: values.categoryId,
    subCategoryId: values.subCategoryId,
    campaignTypeId: values.campaignTypeId,
    startDate: values.startDate,
    endDate: values.endDate,
    bannersFadsEnabled: values.bannersFadsEnabled,
    CRMEnabled: values.CRMEnabled,
    homeLandingEnabled: values.homeLandingEnabled,
    mediaOnEnabled: values.mediaOnEnabled,
    ratingsAndReviewsEnabled: values.ratingsAndReviewsEnabled,
    sponsoredBrandsEnabled: values.sponsoredBrandsEnabled,
    sponsoredProductEnabled: values.sponsoredProductEnabled,
    mediaOffEnabled: values.mediaOffEnabled,
    storeEnabled: values.storeEnabled,
    graphicsEnabled: values.graphicsEnabled,
    othersEnabled: values.othersEnabled,
    sponsoredProductForm: values.sponsoredProductForm,
    bannerForm: {
      image: "www.google.com",
      ...values.bannerForm,
    },
    sponsoredBrandForm: {
      images: "www.google.com",
      ...values.sponsoredBrandForm,
    },
    ratingAndReviewForm: values.ratingAndReviewForm,
    CRMForm: values.CRMForm,
    HomeLandingForm: values.HomeLandingForm,
    MediaOnForm: values.MediaOnForm,
  };
}

const createCampaignGroupMutation = gql`
  mutation CreateCampaignGroup($data: CampaignGroupInputType!) {
    createCampaignGroup(data: $data) {
      id
    }
  }
`;

export default function Page() {
  const [createCampaignGroup] = useMutation(createCampaignGroupMutation);
  const [fields, setFields] = useState(getQueryFieldsForSponsoredForm());

  const state = usePageContextReducer(
    initialState(createCampaignGroup, fields, setFields)
  );

  return (
    <MultiStepForm
      {...{ ...state.page.ctx, ...state.slots.content.ctx }}
      fields={fields}
    />
  );
}

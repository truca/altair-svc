import {
  baseFieldSponsoredForm,
  getFieldBannerFadForm,
  getFieldRatingAndReviewsForm,
  getFieldsCRMForm,
  getFieldsHomeLandingForm,
  getFieldsMediaOnForm,
  getFieldSponsoredBrandsForm,
  getFieldSponsoredProductForm,
  SponsoredFormField,
} from "./fieldsForSponsoredForm";

const getFieldFieldsForSponsoredForm = (
  formData: any = {},
  optionsFields: any = {}
) => {
  let querySponsoredForm: SponsoredFormField[] = [
    ...baseFieldSponsoredForm(optionsFields),
  ];

  //   if (!sponsoredFormActives.length) {
  //     return baseFieldSponsoredForm;
  //   }

  const formConfig: Record<string, (step: number) => SponsoredFormField[]> = {
    sponsoredProductEnabled: getFieldSponsoredProductForm,
    bannersFadsEnabled: getFieldBannerFadForm,
    sponsoredBrandsEnabled: getFieldSponsoredBrandsForm,
    ratingsAndReviewsEnabled: getFieldRatingAndReviewsForm,
    CRMEnabled: getFieldsCRMForm,
    homeLandingEnabled: getFieldsHomeLandingForm,
    mediaOnEnabled: getFieldsMediaOnForm,
  };

  let stepNumberPosition = 1;
  for (const key in formConfig) {
    if (formData[key]) {
      const generateFields = formConfig[key];

      querySponsoredForm = [
        ...querySponsoredForm,
        ...generateFields(stepNumberPosition),
      ];
      stepNumberPosition++;
    }
  }

  return querySponsoredForm;
};

export default getFieldFieldsForSponsoredForm;

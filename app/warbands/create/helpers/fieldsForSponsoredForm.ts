import { FieldType } from "@/app/stories/Form/types";
import BudgetType from "../components/SponsoredBrandsForm/BudgetType";
import RadioGroupComponent from "../components/SponsoredBrandsForm/RadioGroup";
import CampaignTypes from "../components/SponsoredBrandsForm/CampaignTypes";
import DateComponent from "../components/SponsoredBrandsForm/DateComponent";
import CheckboxServices from "../components/SponsoredBrandsForm/CheckboxServices";
import CRMForm from "../components/CRMForm";
import HomeLandingForm from "../components/HomeLanding";
import ProductManagerField from "../components/BaseForm/ProductManagerField";
import TitleComponent from "../components/TitleComponent";
import DailyLimitComponent from "../components/SponsoredBrandsForm/DailyLimitComponent";
import MediaOnForm from "../components/MediaOn";

export type SponsoredFormField = {
  id: string;
  label?: string;
  type?: FieldType;
  placeholder?: string;
  options?: any;
  validation?: {
    type: string[];
    required: (string | boolean)[];
    min?: (string | number)[];
    maxLength?: (string | number)[];
  };
  entity?: string | undefined;
  valueAttribute?: string | undefined;
  labelAttribute?: string | undefined;
  formName?: any;
  component?: any;
  step: number;
  defaultValue?: any;
  inputProps?: any;
  labelProps?: any;
  sx?: any;
  startDateFieldName?: string | undefined;
  endDateFieldName?: string | undefined;
};

const baseFieldSponsoredForm = (
  optionsFields: any = {}
): SponsoredFormField[] => {
  const { subcategoriesData = [] } = optionsFields;

  return [
    // // countryId
    // productManagerId
    {
      id: "productManagerId",
      label: "Product Manager",
      // type: FieldType.SMART_SELECT,
      component: ProductManagerField,
      entity: "productManagers",
      labelAttribute: "name",
      valueAttribute: "externalId",
      placeholder: "Selecciona una opción",
      validation: {
        type: ["string", "Product Manager debe ser un texto"],
        required: [false],
      },
      sx: {
        paddingTop: "8px",
      },
      inputProps: {
        variant: "flushed",
        sx: {
          "::placeholder": {
            color: "#A6A6A6",
            fontFamily: "Lato, sans-serif",
          },
          color: "#A6A6A6",
          fontFamily: "Lato, sans-serif",
        },
      },
      labelProps: {
        sx: {
          color: "#333333",
          fontFamily: "Lato, sans-serif",
        },
      },
      step: 0,
    },
    // businessUnitId
    {
      id: "businessUnitId",
      label: "Unidad de negocio",
      component: RadioGroupComponent,
      defaultValue: false,
      options: [
        { label: "1P", value: "1P" },
        { label: "3P", value: "3P" },
      ],
      sx: {
        paddingTop: "8px",
      },
      inputProps: {
        fontFamily: "Lato, sans-serif",
      },
      labelProps: {
        sx: {
          color: "#333333",
          fontFamily: "Lato, sans-serif",
        },
      },
      step: 0,
    },
    // campaignTypeId
    // {
    //   id: "campaignTypeId",
    //   label: "Tipo de campaña",
    //   type: FieldType.SELECT,
    //   placeholder: "Selecciona una opción",
    //   options: [
    //     { label: "1P", value: "1P" },
    //     { label: "3P", value: "3P" },
    //   ],
    //   validation: {
    //     type: ["string"],
    //     required: [false],
    //   },
    //   sx: {
    //     paddingTop: "8px",
    //   },
    //   inputProps: {
    //     variant: "flushed",
    //     sx: {
    //       color: "#A6A6A6",
    //       fontFamily: "Lato, sans-serif",
    //     },
    //   },
    //   labelProps: {
    //     sx: {
    //       color: "#333333",
    //       fontFamily: "Lato, sans-serif",
    //     },
    //   },
    //   step: 0,
    // },

    // campaignComponent
    {
      id: "campaignComponent",
      label: "Unidad de negocio",
      component: CampaignTypes,
      defaultValue: false,
      options: [
        { label: "1P", value: "1P" },
        { label: "3P", value: "3P" },
      ],
      sx: {
        paddingTop: "8px",
      },
      inputProps: {
        variant: "flushed",
        sx: {
          "::placeholder": {
            color: "#A6A6A6",
            fontFamily: "Lato, sans-serif",
          },
          color: "#A6A6A6",
          fontFamily: "Lato, sans-serif",
        },
      },
      labelProps: {
        sx: {
          color: "#333333",
          fontFamily: "Lato, sans-serif",
        },
      },
      step: 0,
    },

    // sellerId
    {
      id: "sellerId",
      label: "Provedor/Seller",
      type: FieldType.SMART_SELECT,
      entity: "sellers",
      labelAttribute: "name",
      valueAttribute: "id",
      placeholder: "Selecciona una opción",
      options: [
        { label: "1P", value: "1P" },
        { label: "3P", value: "3P" },
      ],
      validation: {
        type: ["string"],
        required: [true, "Este campo es obligatorio"],
      },
      sx: {
        paddingTop: "8px",
      },
      inputProps: {
        variant: "flushed",
        sx: {
          "::placeholder": {
            color: "#A6A6A6",
            fontFamily: "Lato, sans-serif",
          },
          color: "#A6A6A6",
          fontFamily: "Lato, sans-serif",
        },
      },
      labelProps: {
        sx: {
          color: "#333333",
          fontFamily: "Lato, sans-serif",
        },
      },
      step: 0,
    },
    // brandId
    {
      id: "brandId",
      label: "Marca",
      type: FieldType.SMART_SELECT,
      entity: "brands",
      labelAttribute: "name",
      valueAttribute: "id",
      placeholder: "Selecciona una opción",
      validation: {
        type: ["string"],
        required: [true, "Este campo es obligatorio"],
      },
      sx: {
        paddingTop: "8px",
      },
      inputProps: {
        variant: "flushed",
        sx: {
          "::placeholder": {
            color: "#A6A6A6",
            fontFamily: "Lato, sans-serif",
          },
          color: "#A6A6A6",
          fontFamily: "Lato, sans-serif",
        },
      },
      labelProps: {
        sx: {
          color: "#333333",
          fontFamily: "Lato, sans-serif",
        },
      },
      step: 0,
    },
    // categoryId
    {
      id: "categoryId",
      label: "Categoría",
      type: FieldType.SMART_SELECT,
      entity: "categories",
      labelAttribute: "name",
      valueAttribute: "id",
      placeholder: "Selecciona una opción",
      validation: {
        type: ["string"],
        required: [true, "Este campo es obligatorio"],
      },
      sx: {
        paddingTop: "8px",
      },
      inputProps: {
        variant: "flushed",
        sx: {
          "::placeholder": {
            color: "#A6A6A6",
            fontFamily: "Lato, sans-serif",
          },
          color: "#A6A6A6",
          fontFamily: "Lato, sans-serif",
        },
      },
      labelProps: {
        sx: {
          color: "#333333",
          fontFamily: "Lato, sans-serif",
        },
      },
      step: 0,
    },
    // subCategoryId
    {
      id: "subCategoryId",
      label: "Subcategoría",
      type: FieldType.SMART_SELECT,
      entity: "subcategories",
      labelAttribute: "name",
      valueAttribute: "id",
      placeholder: "Selecciona una opción",
      options: subcategoriesData.map((subcategoryData: any) => ({
        label: subcategoryData.name,
        value: subcategoryData.id,
      })),
      // [
      //   { label: "1P", value: "1P" },
      //   { label: "3P", value: "3P" },
      // ],
      validation: {
        type: ["string"],
        required: [false],
      },
      sx: {
        paddingTop: "8px",
      },
      inputProps: {
        variant: "flushed",
        sx: {
          "::placeholder": {
            color: "#A6A6A6",
            fontFamily: "Lato, sans-serif",
          },
          color: "#A6A6A6",
          fontFamily: "Lato, sans-serif",
        },
      },
      labelProps: {
        sx: {
          color: "#333333",
          fontFamily: "Lato, sans-serif",
        },
      },
      step: 0,
    },
    // {
    //   id: "totalBudget",
    //   label: "Presupuesto",
    //   type: FieldType.TEXT,
    //   placeholder: "0 CLP",
    //   validation: {
    //     type: ["number"],
    //     required: [false],
    //   },
    //   sx: {
    //     paddingTop: "8px",
    //     width: "50%",
    //   },
    //   inputProps: {
    //     variant: "flushed",
    //     sx: {
    //       "::placeholder": {
    //         color: "#A6A6A6",
    //         fontFamily: "Lato, sans-serif",
    //       },
    //     },
    //   },
    //   labelProps: {
    //     sx: {
    //       color: "#333333",
    //       fontFamily: "Lato, sans-serif",
    //     },
    //   },
    //   step: 0,
    // },
    {
      id: "dates",
      component: DateComponent,
      defaultValue: false,
      sx: {},
      inputProps: {
        variant: "flushed",
        color: "#A6A6A6",
      },
      labelProps: {
        sx: {
          color: "#333333",
          fontFamily: "Lato, sans-serif",
        },
      },
      step: 0,
    },
    {
      id: "services",
      component: CheckboxServices,
      defaultValue: false,
      sx: {
        position: "relative",
      },
      inputProps: {
        variant: "flushed",
        color: "#333333",
        fontFamily: "Lato, sans-serif",
      },
      labelProps: {
        marginBottom: "0px",
        marginTop: "20px",
        sx: {
          color: "#333333",
          fontFamily: "Lato, sans-serif",
        },
      },
      step: 0,
    },
  ];
};

const getFieldSponsoredBrandsForm = (step: number): SponsoredFormField[] => [
  //Title
  {
    id: "title",
    label: "Sponsored Brands",
    component: TitleComponent,
    defaultValue: false,
    sx: {},
    inputProps: {
      variant: "flushed",
      color: "#A6A6A6",
    },
    labelProps: {
      fontFamily: "Lato, sans-serif",
      fontSize: "lg",
      fontWeight: "bold",
      marginBottom: "20px",
    },
    step,
  },
  // date
  {
    id: "date",
    label: "Fecha Inicio",
    formName: "sponsoredBrandForm",
    component: DateComponent,
    startDateFieldName: "sponsoredBrandForm.startDate",
    endDateFieldName: "sponsoredBrandForm.endDate",
    defaultValue: false,
    sx: {},
    inputProps: {
      variant: "flushed",
      color: "#A6A6A6",
    },
    labelProps: {
      sx: {
        color: "#333333",
        fontFamily: "Lato, sans-serif",
      },
    },
    step,
  },
  //budgetType
  {
    id: "sponsoredBrandForm.budgetType",
    label: "Tipo presupuesto",
    component: RadioGroupComponent,
    defaultValue: false,
    options: [
      { label: "Total", value: "Total" },
      { label: "Diario", value: "Diario" },
    ],
    sx: {
      paddingTop: "8px",
    },
    inputProps: {
      fontFamily: "Lato, sans-serif",
    },
    labelProps: {
      sx: {
        color: "#333333",
        fontFamily: "Lato, sans-serif",
      },
    },
    step,
  },

  // budget
  {
    id: "sponsoredBrandForm.budget",
    // fieldRegister: "sponsoredBrandForm.budget",
    label: "Presupuesto",
    type: FieldType.NUMBER,
    placeholder: "0 CLP",
    validation: {
      type: ["number"],
      required: [true, "Este campo es obligatorio"],
    },
    inputProps: {
      variant: "flushed",
      sx: {
        "::placeholder": {
          color: "#A6A6A6",
          fontFamily: "Lato, sans-serif",
        },
      },
    },
    labelProps: {
      sx: {
        color: "#333333",
        fontFamily: "Lato, sans-serif",
      },
    },
    step,
  },
  {
    id: "dailyLimit",
    label: "Limite Diario",
    formName: "sponsoredBrandForm",
    component: DailyLimitComponent,
    defaultValue: false,
    options: [
      { label: "Total", value: "Total" },
      { label: "Diario", value: "Diario" },
    ],
    sx: {
      paddingTop: "8px",
    },
    inputProps: {
      fontFamily: "Lato, sans-serif",
    },
    labelProps: {
      sx: {
        color: "#333333",
        fontFamily: "Lato, sans-serif",
      },
    },
    step,
  },
  // title
  {
    id: "sponsoredBrandForm.title",
    label: "Título",
    type: FieldType.TEXT,
    placeholder: "máximo 42 caracteres",
    validation: {
      type: ["string"],
      required: [true, "Este campo es obligatorio"],
      maxLength: [42, "Máximo 42 caracteres"],
    },
    inputProps: {
      variant: "flushed",
      sx: {
        "::placeholder": {
          color: "#A6A6A6",
          fontFamily: "Lato, sans-serif",
        },
      },
    },
    labelProps: {
      sx: {
        color: "#333333",
        fontFamily: "Lato, sans-serif",
      },
    },
    step,
  },
  // skus
  {
    id: "sponsoredBrandForm.skus",
    label: "SKUS",
    type: FieldType.TEXT,
    placeholder: "Ingrese SKUS",
    validation: {
      type: ["string"],
      required: [true, "Este campo es obligatorio"],
    },
    inputProps: {
      variant: "flushed",
      sx: {
        "::placeholder": {
          color: "#A6A6A6",
          fontFamily: "Lato, sans-serif",
        },
      },
    },
    labelProps: {
      sx: {
        color: "#333333",
        fontFamily: "Lato, sans-serif",
      },
    },
    step,
  },
  // url
  {
    id: "sponsoredBrandForm.url",
    label: "URL",
    type: FieldType.TEXT,
    placeholder: "Ingrese URL",
    validation: {
      type: ["string"],
      required: [true, "Este campo es obligatorio"],
    },
    inputProps: {
      variant: "flushed",
      sx: {
        "::placeholder": {
          color: "#A6A6A6",
          fontFamily: "Lato, sans-serif",
        },
      },
    },
    labelProps: {
      sx: {
        color: "#333333",
        fontFamily: "Lato, sans-serif",
      },
    },
    step,
  },
  // comments
  {
    id: "sponsoredBrandForm.comment",
    label: "Comentarios",
    type: FieldType.TEXT,
    placeholder: "Ingrese comentarios",
    validation: {
      type: ["string"],
      required: [false],
    },
    inputProps: {
      variant: "flushed",
      sx: {
        "::placeholder": {
          color: "#A6A6A6",
          fontFamily: "Lato, sans-serif",
        },
      },
    },
    labelProps: {
      sx: {
        color: "#333333",
        fontFamily: "Lato, sans-serif",
      },
    },
    step,
  },
];

const getFieldSponsoredProductForm = (step: number): SponsoredFormField[] => [
  //Title
  {
    id: "title",
    label: "Sponsored Products",
    component: TitleComponent,
    defaultValue: false,
    sx: {},
    inputProps: {
      variant: "flushed",
      color: "#A6A6A6",
    },
    labelProps: {
      fontFamily: "Lato, sans-serif",
      fontSize: "lg",
      fontWeight: "bold",
      marginBottom: "20px",
    },
    step,
  },
  // date
  {
    id: "date",
    label: "Fecha Inicio",
    formName: "sponsoredProductForm",
    component: DateComponent,
    startDateFieldName: "sponsoredProductForm.startDate",
    endDateFieldName: "sponsoredProductForm.endDate",
    defaultValue: false,
    sx: {},
    inputProps: {
      variant: "flushed",
      color: "#A6A6A6",
    },
    labelProps: {
      sx: {
        color: "#333333",
        fontFamily: "Lato, sans-serif",
      },
    },
    step,
  },
  //budgetType
  {
    id: "sponsoredProductForm.budgetType",
    label: "Tipo presupuesto",
    component: RadioGroupComponent,
    defaultValue: false,
    options: [
      { label: "Total", value: "Total" },
      { label: "Diario", value: "Diario" },
    ],
    sx: {
      paddingTop: "8px",
    },
    inputProps: {
      fontFamily: "Lato, sans-serif",
    },
    labelProps: {
      sx: {
        color: "#333333",
        fontFamily: "Lato, sans-serif",
      },
    },
    step,
  },
  // Presupuesto
  {
    id: "sponsoredProductForm.budget",
    label: "Presupuesto",
    type: FieldType.NUMBER,
    placeholder: "Ingresa Presupuesto",
    validation: {
      type: ["number"],
      required: [true, "Este campo es obligatorio"],
    },
    inputProps: {
      variant: "flushed",
      sx: {
        "::placeholder": {
          color: "#A6A6A6",
          fontFamily: "Lato, sans-serif",
        },
      },
    },
    labelProps: {
      sx: {
        color: "#333333",
        fontFamily: "Lato, sans-serif",
      },
    },
    step,
  },
  {
    id: "dailyLimit",
    label: "Limite Diario",
    formName: "sponsoredProductForm",
    component: DailyLimitComponent,
    defaultValue: false,
    options: [
      { label: "Total", value: "Total" },
      { label: "Diario", value: "Diario" },
    ],
    sx: {
      paddingTop: "8px",
    },
    inputProps: {
      fontFamily: "Lato, sans-serif",
    },
    labelProps: {
      sx: {
        color: "#333333",
        fontFamily: "Lato, sans-serif",
      },
    },
    step,
  },

  // skus
  {
    id: "sponsoredProductForm.skus",
    label: "SKUS",
    type: FieldType.TEXT,
    placeholder: "Ingrese SKU",
    validation: {
      type: ["string"],
      required: [true, "Este campo es obligatorio"],
    },
    inputProps: {
      variant: "flushed",
      sx: {
        "::placeholder": {
          color: "#A6A6A6",
          fontFamily: "Lato, sans-serif",
        },
      },
    },
    labelProps: {
      sx: {
        color: "#333333",
        fontFamily: "Lato, sans-serif",
      },
    },
    step,
  },
  // url
  {
    id: "sponsoredProductForm.url",
    label: "URL",
    type: FieldType.TEXT,
    placeholder: "Ingrese URL",
    validation: {
      type: ["string"],
      required: [true, "Este campo es obligatorio"],
    },
    inputProps: {
      variant: "flushed",
      sx: {
        "::placeholder": {
          color: "#A6A6A6",
          fontFamily: "Lato, sans-serif",
        },
      },
    },
    labelProps: {
      sx: {
        color: "#333333",
        fontFamily: "Lato, sans-serif",
      },
    },
    step,
  },
  // comments
  {
    id: "sponsoredProductForm.comment",
    label: "Comentarios",
    type: FieldType.TEXT,
    placeholder: "Ingrese comentarios",
    validation: {
      type: ["string"],
      required: [false],
    },
    inputProps: {
      variant: "flushed",
      sx: {
        "::placeholder": {
          color: "#A6A6A6",
          fontFamily: "Lato, sans-serif",
        },
      },
    },
    labelProps: {
      sx: {
        color: "#333333",
        fontFamily: "Lato, sans-serif",
      },
    },
    step,
  },
];

const getFieldBannerFadForm = (step: number): SponsoredFormField[] => [
  // Banners Fads

  //Title
  {
    id: "title",
    label: "Banners",
    component: TitleComponent,
    defaultValue: false,
    sx: {},
    inputProps: {
      variant: "flushed",
      color: "#A6A6A6",
    },
    labelProps: {
      fontFamily: "Lato, sans-serif",
      fontSize: "lg",
      fontWeight: "bold",
      marginBottom: "20px",
    },
    step,
  },
  // bannerTypeId
  {
    id: "bannerForm.bannerFadBannerTypeId",
    label: "Tipo de Banner",
    type: FieldType.SELECT,
    placeholder: "Selecciona una opción",
    options: [
      { label: "Chile", value: "Chile" },
      { label: "Peru", value: "Peru" },
      { label: "Colombia", value: "Colombia" },
    ],
    validation: {
      type: ["string"],
      required: [true, "Este campo es obligatorio"],
    },
    inputProps: {
      variant: "flushed",
      sx: {
        color: "#A6A6A6",
        fontFamily: "Lato, sans-serif",
      },
    },
    labelProps: {
      sx: {
        color: "#333333",
        fontFamily: "Lato, sans-serif",
        marginBottom: "0px",
      },
    },
    step,
  },

  //Title
  {
    id: "title_fads",
    label: "Banners Fads",
    component: TitleComponent,
    defaultValue: false,
    sx: {},
    inputProps: {
      variant: "flushed",
      color: "#A6A6A6",
    },
    labelProps: {
      fontFamily: "Lato, sans-serif",
      fontSize: "lg",
      fontWeight: "bold",

      marginTop: "40px",
    },
    step,
  },
  // budget
  {
    id: "bannerForm.bannerFadTotalBudget",
    label: "Presupuesto",
    type: FieldType.NUMBER,
    placeholder: "0 CLP",
    validation: {
      type: ["number"],
      required: [false],
    },
    sx: {
      paddingTop: "8px",
      width: "50%",
    },
    inputProps: {
      variant: "flushed",
      sx: {
        "::placeholder": {
          color: "#A6A6A6",
          fontFamily: "Lato, sans-serif",
        },
      },
    },
    labelProps: {
      sx: {
        color: "#333333",
        fontFamily: "Lato, sans-serif",
      },
    },
    step,
  },
  // dates
  {
    id: "bannersFadsdates",
    formName: "bannerForm",
    component: DateComponent,
    startDateFieldName: "bannerForm.bannerFadStartDate",
    endDateFieldName: "bannerForm.bannerFadEndDate",
    defaultValue: false,
    sx: {},
    inputProps: {
      variant: "flushed",
      color: "#A6A6A6",
    },
    labelProps: {
      sx: {
        color: "#333333",
        fontFamily: "Lato, sans-serif",
      },
    },
    step,
  },
  // segmentationTypeId
  {
    id: "bannerForm.bannerFadSegmentationTypeId",
    label: "Tipo Segmentación",
    type: FieldType.SELECT,
    placeholder: "Selecciona una opción",
    options: [
      { label: "Chile", value: "Chile" },
      { label: "Peru", value: "Peru" },
      { label: "Colombia", value: "Colombia" },
    ],
    validation: {
      type: ["string"],
      required: [true, "Este campo es obligatorio"],
    },
    inputProps: {
      variant: "flushed",
      sx: {
        color: "#A6A6A6",
        fontFamily: "Lato, sans-serif",
      },
    },
    labelProps: {
      sx: {
        color: "#333333",
        fontFamily: "Lato, sans-serif",
        marginBottom: "0px",
      },
    },
    step,
  },
  // categoryId
  {
    id: "bannerForm.bannerFadCategoryId",
    label: "Tipo Segmentación",
    type: FieldType.SELECT,
    placeholder: "Selecciona una opción",
    options: [
      { label: "Chile", value: "Chile" },
      { label: "Peru", value: "Peru" },
      { label: "Colombia", value: "Colombia" },
    ],
    validation: {
      type: ["string"],
      required: [true, "Este campo es obligatorio"],
    },
    inputProps: {
      variant: "flushed",
      sx: {
        color: "#A6A6A6",
        fontFamily: "Lato, sans-serif",
      },
    },
    labelProps: {
      sx: {
        color: "#333333",
        fontFamily: "Lato, sans-serif",
        marginBottom: "0px",
      },
    },
    step,
  },
  // url
  {
    id: "bannerForm.bannerFadUrl",
    label: "URL",
    type: FieldType.TEXT,
    placeholder: "Ingrese URL",
    validation: {
      type: ["string"],
      required: [true, "Este campo es obligatorio"],
    },
    inputProps: {
      variant: "flushed",
      sx: {
        "::placeholder": {
          color: "#A6A6A6",
          fontFamily: "Lato, sans-serif",
        },
      },
    },
    labelProps: {
      sx: {
        color: "#333333",
        fontFamily: "Lato, sans-serif",
      },
    },
    step,
  },
  // comments
  {
    id: "bannerForm.bannerFadComment",
    label: "Comentarios",
    type: FieldType.TEXT,
    placeholder: "Ingrese comentarios",
    validation: {
      type: ["string"],
      required: [false],
    },
    inputProps: {
      variant: "flushed",
      sx: {
        "::placeholder": {
          color: "#A6A6A6",
          fontFamily: "Lato, sans-serif",
        },
      },
    },
    labelProps: {
      sx: {
        color: "#333333",
        fontFamily: "Lato, sans-serif",
      },
    },
    step,
  },

  // Banners Menu

  //Title
  {
    id: "title_menu",
    label: "Banners Menú",
    component: TitleComponent,
    defaultValue: false,
    sx: {},
    inputProps: {
      variant: "flushed",
      color: "#A6A6A6",
    },
    labelProps: {
      fontFamily: "Lato, sans-serif",
      fontSize: "lg",
      fontWeight: "bold",
      marginBottom: "20px",
    },
    step,
  },

  // budget
  {
    id: "bannerForm.bannerMenuTotalBudget",
    label: "Presupuesto",
    type: FieldType.NUMBER,
    placeholder: "0 CLP",
    validation: {
      type: ["number"],
      required: [false],
    },
    sx: {
      paddingTop: "8px",
      width: "50%",
    },
    inputProps: {
      variant: "flushed",
      sx: {
        "::placeholder": {
          color: "#A6A6A6",
          fontFamily: "Lato, sans-serif",
        },
      },
    },
    labelProps: {
      sx: {
        color: "#333333",
        fontFamily: "Lato, sans-serif",
      },
    },
    step,
  },
  // dates
  {
    id: "bannersMenuDates",
    formName: "bannerForm",
    component: DateComponent,
    startDateFieldName: "bannerForm.bannerMenuStartDate",
    endDateFieldName: "bannerForm.bannerMenuEndDate",
    defaultValue: false,
    sx: {},
    inputProps: {
      variant: "flushed",
      color: "#A6A6A6",
    },
    labelProps: {
      sx: {
        color: "#333333",
        fontFamily: "Lato, sans-serif",
      },
    },
    step,
  },
  // url
  {
    id: "bannerForm.bannerMenuUrl",
    label: "URL",
    type: FieldType.TEXT,
    placeholder: "Ingrese URL",
    validation: {
      type: ["string"],
      required: [true, "Este campo es obligatorio"],
    },
    inputProps: {
      variant: "flushed",
      sx: {
        "::placeholder": {
          color: "#A6A6A6",
          fontFamily: "Lato, sans-serif",
        },
      },
    },
    labelProps: {
      sx: {
        color: "#333333",
        fontFamily: "Lato, sans-serif",
      },
    },
    step,
  },
  // comments
  {
    id: "bannerForm.bannerMenuComment",
    label: "Comentarios",
    type: FieldType.TEXT,
    placeholder: "Ingrese comentarios",
    validation: {
      type: ["string"],
      required: [false],
    },
    inputProps: {
      variant: "flushed",
      sx: {
        "::placeholder": {
          color: "#A6A6A6",
          fontFamily: "Lato, sans-serif",
        },
      },
    },
    labelProps: {
      sx: {
        color: "#333333",
        fontFamily: "Lato, sans-serif",
      },
    },
    step,
  },
];

const getFieldRatingAndReviewsForm = (step: number): SponsoredFormField[] => [
  //Title
  {
    id: "title",
    label: "Rating & Reviews",
    component: TitleComponent,
    defaultValue: false,
    sx: {},
    inputProps: {
      variant: "flushed",
      color: "#A6A6A6",
    },
    labelProps: {
      fontFamily: "Lato, sans-serif",
      fontSize: "lg",
      fontWeight: "bold",
      marginBottom: "20px",
    },
    step,
  },
  // budget
  {
    id: "ratingAndReviewForm.budget",
    label: "Presupesto",
    type: FieldType.NUMBER,
    placeholder: "0 CLP",
    validation: {
      type: ["number"],
      required: [false],
    },
    sx: {
      paddingTop: "8px",
      width: "50%",
    },
    inputProps: {
      variant: "flushed",
      sx: {
        "::placeholder": {
          color: "#A6A6A6",
          fontFamily: "Lato, sans-serif",
        },
      },
    },
    labelProps: {
      sx: {
        color: "#333333",
        fontFamily: "Lato, sans-serif",
      },
    },
    step,
  },
  // shippingCost
  {
    id: "ratingAndReviewForm.shippingCost",
    label: "Costo por envío",
    type: FieldType.NUMBER,
    placeholder: "0 CLP",
    validation: {
      type: ["number"],
      required: [false],
    },
    sx: {
      paddingTop: "8px",
      width: "50%",
    },
    inputProps: {
      variant: "flushed",
      sx: {
        "::placeholder": {
          color: "#A6A6A6",
          fontFamily: "Lato, sans-serif",
        },
      },
    },
    labelProps: {
      sx: {
        color: "#333333",
        fontFamily: "Lato, sans-serif",
      },
    },
    step,
  },
  // agreedShipments
  {
    id: "ratingAndReviewForm.agreedShipments",
    label: "Envíos pactados",
    type: FieldType.NUMBER,
    placeholder: "0 CLP",
    validation: {
      type: ["number"],
      required: [false],
    },
    sx: {
      paddingTop: "8px",
      width: "50%",
    },
    inputProps: {
      variant: "flushed",
      sx: {
        "::placeholder": {
          color: "#A6A6A6",
          fontFamily: "Lato, sans-serif",
        },
      },
    },
    labelProps: {
      sx: {
        color: "#333333",
        fontFamily: "Lato, sans-serif",
      },
    },
    step,
  },
  // dates
  {
    id: "bannersFadsdates",
    formName: "ratingAndReviewForm",
    component: DateComponent,
    startDateFieldName: "ratingAndReviewForm.startDate",
    endDateFieldName: "ratingAndReviewForm.endDate",
    defaultValue: false,
    sx: {},
    inputProps: {
      variant: "flushed",
      color: "#A6A6A6",
    },
    labelProps: {
      sx: {
        color: "#333333",
        fontFamily: "Lato, sans-serif",
      },
    },
    step,
  },

  // segmentationTypeId
  {
    id: "ratingAndReviewForm.segmentationTypeId",
    label: "Tipo Segmentación",
    type: FieldType.SELECT,
    placeholder: "Selecciona una opción",
    options: [
      { label: "Chile", value: "Chile" },
      { label: "Peru", value: "Peru" },
      { label: "Colombia", value: "Colombia" },
    ],
    validation: {
      type: ["string"],
      required: [true, "Este campo es obligatorio"],
    },
    inputProps: {
      variant: "flushed",
      sx: {
        color: "#A6A6A6",
        fontFamily: "Lato, sans-serif",
      },
    },
    labelProps: {
      sx: {
        color: "#333333",
        fontFamily: "Lato, sans-serif",
        marginBottom: "0px",
      },
    },
    step,
  },
  // sellerId
  {
    id: "ratingAndReviewForm.sellerId",
    label: "Provedor/Seller",
    type: FieldType.SELECT,
    placeholder: "Selecciona una opción",
    options: [
      { label: "1P", value: "1P" },
      { label: "3P", value: "3P" },
    ],
    validation: {
      type: ["string"],
      required: [true, "Este campo es obligatorio"],
    },
    sx: {
      paddingTop: "8px",
    },
    inputProps: {
      variant: "flushed",
      sx: {
        "::placeholder": {
          color: "#A6A6A6",
          fontFamily: "Lato, sans-serif",
        },
        color: "#A6A6A6",
        fontFamily: "Lato, sans-serif",
      },
    },
    labelProps: {
      sx: {
        color: "#333333",
        fontFamily: "Lato, sans-serif",
      },
    },
    step,
  },
  // brandId
  {
    id: "ratingAndReviewForm.brandId",
    label: "Marca",
    type: FieldType.SELECT,
    placeholder: "Selecciona una opción",
    options: [
      { label: "1P", value: "1P" },
      { label: "3P", value: "3P" },
    ],
    validation: {
      type: ["string"],
      required: [true, "Este campo es obligatorio"],
    },
    sx: {
      paddingTop: "8px",
    },
    inputProps: {
      variant: "flushed",
      sx: {
        "::placeholder": {
          color: "#A6A6A6",
          fontFamily: "Lato, sans-serif",
        },
        color: "#A6A6A6",
        fontFamily: "Lato, sans-serif",
      },
    },
    labelProps: {
      sx: {
        color: "#333333",
        fontFamily: "Lato, sans-serif",
      },
    },
    step,
  },
  // sku
  {
    id: "ratingAndReviewForm.skus",
    label: "SKUS",
    type: FieldType.TEXT,
    placeholder: "Ingrese SKUS",
    validation: {
      type: ["string"],
      required: [true, "Este campo es obligatorio"],
    },
    inputProps: {
      variant: "flushed",
      sx: {
        "::placeholder": {
          color: "#A6A6A6",
          fontFamily: "Lato, sans-serif",
        },
      },
    },
    labelProps: {
      sx: {
        color: "#333333",
        fontFamily: "Lato, sans-serif",
      },
    },
    step,
  },
  // comments
  {
    id: "ratingAndReviewForm.comment",
    label: "Comentarios",
    type: FieldType.TEXT,
    placeholder: "Ingrese comentarios",
    validation: {
      type: ["string"],
      required: [false],
    },
    inputProps: {
      variant: "flushed",
      sx: {
        "::placeholder": {
          color: "#A6A6A6",
          fontFamily: "Lato, sans-serif",
        },
      },
    },
    labelProps: {
      sx: {
        color: "#333333",
        fontFamily: "Lato, sans-serif",
      },
    },
    step,
  },
];

const getFieldsCRMForm = (step: number) => [
  //Title
  {
    id: "title",
    label: "CRM",
    component: TitleComponent,
    defaultValue: false,
    sx: {},
    inputProps: {
      variant: "flushed",
      color: "#A6A6A6",
    },
    labelProps: {
      fontFamily: "Lato, sans-serif",
      fontSize: "lg",
      fontWeight: "bold",
      marginBottom: "20px",
    },
    step,
  },
  // crmTypeId
  {
    id: "CRMForm.crmTypeId",
    label: "Tipo de CRM",
    type: FieldType.SELECT,
    placeholder: "Selecciona una opción",
    options: [
      { label: "1P", value: "1P" },
      { label: "3P", value: "3P" },
    ],
    validation: {
      type: ["string"],
      required: [true, "Este campo es obligatorio"],
    },
    sx: {
      paddingTop: "8px",
    },
    inputProps: {
      variant: "flushed",
      sx: {
        "::placeholder": {
          color: "#A6A6A6",
          fontFamily: "Lato, sans-serif",
        },
        color: "#A6A6A6",
        fontFamily: "Lato, sans-serif",
      },
    },
    labelProps: {
      sx: {
        color: "#333333",
        fontFamily: "Lato, sans-serif",
      },
    },
    step,
  },
  // templateId
  {
    id: "CRMForm.templateId",
    label: "Selecciona una opción",
    type: FieldType.SELECT,
    placeholder: "Selecciona una opción",
    options: [
      { label: "1P", value: "1P" },
      { label: "3P", value: "3P" },
    ],
    validation: {
      type: ["string"],
      required: [true, "Este campo es obligatorio"],
    },
    sx: {
      paddingTop: "8px",
    },
    inputProps: {
      variant: "flushed",
      sx: {
        "::placeholder": {
          color: "#A6A6A6",
          fontFamily: "Lato, sans-serif",
        },
        color: "#A6A6A6",
        fontFamily: "Lato, sans-serif",
      },
    },
    labelProps: {
      sx: {
        color: "#333333",
        fontFamily: "Lato, sans-serif",
      },
    },
    step,
  },
  // CRM multi Form
  {
    id: "CRMMultiForm",
    formName: "CRMForm",
    component: CRMForm,
    defaultValue: false,
    sx: {},
    inputProps: {
      variant: "flushed",
      color: "#A6A6A6",
    },
    labelProps: {
      sx: {
        color: "#333333",
        fontFamily: "Lato, sans-serif",
      },
    },
    step,
  },
];

const getFieldsHomeLandingForm = (step: number) => [
  //Title
  {
    id: "title",
    label: "Home Landing",
    component: TitleComponent,
    defaultValue: false,
    sx: {},
    inputProps: {
      variant: "flushed",
      color: "#A6A6A6",
    },
    labelProps: {
      fontFamily: "Lato, sans-serif",
      fontSize: "lg",
      fontWeight: "bold",
      marginBottom: "20px",
    },
    step,
  },
  // budget
  {
    id: "homeLandingForm.budget",
    label: "Presupuesto",
    type: FieldType.NUMBER,
    placeholder: "0 CLP",
    validation: {
      type: ["number"],
      required: [true, "Este campo es obligatorio"],
    },
    inputProps: {
      variant: "flushed",
      sx: {
        "::placeholder": {
          color: "#A6A6A6",
          fontFamily: "Lato, sans-serif",
        },
      },
    },
    labelProps: {
      sx: {
        color: "#333333",
        fontFamily: "Lato, sans-serif",
      },
    },
    step,
  },
  // Home Landing Multi Form
  {
    id: "CRMMultiForm",
    formName: "homeLandingForm",
    component: HomeLandingForm,
    defaultValue: false,
    sx: {},
    inputProps: {
      variant: "flushed",
      color: "#A6A6A6",
    },
    labelProps: {
      sx: {
        color: "#333333",
        fontFamily: "Lato, sans-serif",
      },
    },
    step,
  },
];

const getFieldsMediaOnForm = (step: number) => [
  //Title
  {
    id: "title",
    label: "Medios Digitales",
    component: TitleComponent,
    defaultValue: false,
    sx: {},
    inputProps: {
      variant: "flushed",
      color: "#A6A6A6",
    },
    labelProps: {
      fontFamily: "Lato, sans-serif",
      fontSize: "lg",
      fontWeight: "bold",
      marginBottom: "20px",
    },
    step,
  },
  // strategiesId
  {
    id: "mediaOnForm.strategiesId",
    label: "Selecciona una opción",
    type: FieldType.SELECT,
    placeholder: "Selecciona una opción",
    options: [
      { label: "1P", value: "1P" },
      { label: "3P", value: "3P" },
    ],
    validation: {
      type: ["string"],
      required: [true, "Este campo es obligatorio"],
    },
    sx: {
      paddingTop: "8px",
    },
    inputProps: {
      variant: "flushed",
      sx: {
        "::placeholder": {
          color: "#A6A6A6",
          fontFamily: "Lato, sans-serif",
        },
        color: "#A6A6A6",
        fontFamily: "Lato, sans-serif",
      },
    },
    labelProps: {
      sx: {
        color: "#333333",
        fontFamily: "Lato, sans-serif",
      },
    },
    step,
  },
  // budget
  {
    id: "mediaOnForm.budget",
    label: "Presupuesto",
    type: FieldType.NUMBER,
    placeholder: "0 CLP",
    validation: {
      type: ["number"],
      required: [true, "Este campo es obligatorio"],
    },
    inputProps: {
      variant: "flushed",
      sx: {
        "::placeholder": {
          color: "#A6A6A6",
          fontFamily: "Lato, sans-serif",
        },
      },
    },
    labelProps: {
      sx: {
        color: "#333333",
        fontFamily: "Lato, sans-serif",
      },
    },
    step,
  },
  // commission
  {
    id: "mediaOnForm.commission",
    label: "Comisión",
    type: FieldType.NUMBER,
    placeholder: "0 CLP",
    validation: {
      type: ["number"],
      required: [true, "Este campo es obligatorio"],
    },
    inputProps: {
      variant: "flushed",
      sx: {
        "::placeholder": {
          color: "#A6A6A6",
          fontFamily: "Lato, sans-serif",
        },
      },
    },
    labelProps: {
      sx: {
        color: "#333333",
        fontFamily: "Lato, sans-serif",
      },
    },
    step,
  },
  // totalAmount
  {
    id: "mediaOnForm.totalAmount",
    label: "Monto Total",
    type: FieldType.NUMBER,
    placeholder: "0 CLP",
    validation: {
      type: ["number"],
      required: [true, "Este campo es obligatorio"],
    },
    inputProps: {
      variant: "flushed",
      sx: {
        "::placeholder": {
          color: "#A6A6A6",
          fontFamily: "Lato, sans-serif",
        },
      },
    },
    labelProps: {
      sx: {
        color: "#333333",
        fontFamily: "Lato, sans-serif",
      },
    },
    step,
  },
  // Home Landing Multi Form
  {
    id: "MediaOnMultiForm",
    formName: "mediaOnForm",
    component: MediaOnForm,
    defaultValue: false,
    sx: {},
    inputProps: {
      variant: "flushed",
      color: "#A6A6A6",
    },
    labelProps: {
      sx: {
        color: "#333333",
        fontFamily: "Lato, sans-serif",
      },
    },
    step,
  },
];

export {
  baseFieldSponsoredForm,
  getFieldSponsoredBrandsForm,
  getFieldSponsoredProductForm,
  getFieldBannerFadForm,
  getFieldRatingAndReviewsForm,
  getFieldsCRMForm,
  getFieldsHomeLandingForm,
  getFieldsMediaOnForm,
};

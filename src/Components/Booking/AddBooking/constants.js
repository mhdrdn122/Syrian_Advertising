import * as Yup from "yup";

export const validationSchema = Yup.object({
  customer_id: Yup.string().required("حقل الزبون مطلوب"),
  type: Yup.string().required("حقل نوع الحجز مطلوب"),
  start_date: Yup.string().required("حقل تاريخ البداية مطلوب"),
  end_date: Yup.string().required("حقل تاريخ النهاية مطلوب"),
  product_type: Yup.string().required("حقل نوع المنتج مطلوب"),
});

export const typeOptions = [
  { value: 1, label: "دائم" },
  { value: 2, label: "مؤقت" },
];

export const productTypeOptions = [
  { value: 1, label: "محلي" },
  { value: 2, label: "أجنبي" },
  { value: 3, label: "كلاهما" },
];
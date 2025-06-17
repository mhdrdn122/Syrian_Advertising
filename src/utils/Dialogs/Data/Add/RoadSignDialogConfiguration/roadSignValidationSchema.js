import * as Yup from "yup";

export const roadSignValidationSchema = Yup.object({
  city_id: Yup.number().required("المدينة مطلوبة"),
  region_id: Yup.number().required("المنطقة مطلوبة"),
  place: Yup.string().required("مكان التموضع مطلوب"),
  directions: Yup.string().required("الاتجاه مطلوب"),
  // number: Yup.string().required("رقم اللوحة مطلوب"),
  faces_number: Yup.number()
    .required("عدد الوجوه مطلوب")
    .min(1, "يجب أن يكون عدد الوجوه أكبر من 0")
    .max(2, "يجب أن يكون عدد الوجوه أصغر او يساوي من 2"),
  advertising_meters: Yup.number()
    .required("عدد أمتار الإعلان مطلوب")
    .min(0, "يجب أن يكون عدد أمتار الإعلان 0 أو أكثر"),
  printing_meters: Yup.number()
    .required("عدد أمتار الطباعة مطلوب")
    .min(0, "يجب أن يكون عدد أمتار الطباعة 0 أو أكثر"),
  template_id: Yup.number().required("نوع المنتج مطلوب"),
  is_available: Yup.number().required("الحالة مطلوبة"),
});

import * as Yup from "yup";

export const CustomersValidationSchema = Yup.object({
  full_name: Yup.string().required("Required"),
  company_name: Yup.string().required("Required"),
  address: Yup.string().required("Required"),
  phone_number: Yup.number().required("Required"),
  commercial_registration_number:Yup.number().required("Required")
  // discount: Yup.string().required("Required"),

});
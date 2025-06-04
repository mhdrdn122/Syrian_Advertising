import * as Yup from "yup";

export const BrokerValidationSchema = Yup.object({
  full_name: Yup.string().required("Required"),
  number: Yup.number().required("Required"),
  discount: Yup.string().required("Required"),

});
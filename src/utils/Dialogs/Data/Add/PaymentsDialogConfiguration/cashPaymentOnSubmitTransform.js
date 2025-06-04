export const cashPaymentOnSubmitTransform = (values) => {
  const formData = new FormData();
  formData.append("amount_paid", values.amount_paid);
  if (values.image) {
    formData.append("image", values.image);
  }
  formData.append("code", values.code);
  return formData;
};
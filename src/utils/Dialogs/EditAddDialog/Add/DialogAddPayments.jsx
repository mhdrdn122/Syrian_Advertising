import { useAddNewPaymentMutation } from "../../../../RtkQuery/Slice/Payments/PaymentsSlice";
import { useGetCustomersQuery } from "../../../../RtkQuery/Slice/Customers/CustomersSlice";
import { PaymentFields } from "../../Data/Add/PaymentsDialogConfiguration/PaymentFields";
import { PaymentInitialValues } from "../../Data/Add/PaymentsDialogConfiguration/PaymentInitialValues";
import { PaymentValidationSchema } from "../../Data/Add/PaymentsDialogConfiguration/PaymentValidationSchema";
import DynamicDialog from "../../DynamicDialog";

export const DialogAddPayments = ({ show, handleClose }) => {
  const { data, isSuccess: isCustomersSuccess } = useGetCustomersQuery();

  const selectData = {
    customers: {
      data: isCustomersSuccess
        ? data.map((customer) => ({
            id: String(customer.id),
            name: customer.full_name,
          }))
        : [],
    },
  };

  const onSubmitTransform = (values) => {
    const formData = new FormData();
    formData.append("paid", values.paid);
    formData.append("payment_number", values.payment_number);
    formData.append("customer_id", values.customer_id);
    if (values.payment_image) {
      formData.append("payment_image", values.payment_image);
    }
    return formData;
  };

  return (
    <DynamicDialog
      show={show}
      handleClose={handleClose}
      title="إضافة دفعة"
      fields={PaymentFields}
      validationSchema={PaymentValidationSchema}
      mutationHook={useAddNewPaymentMutation}
      initialValues={PaymentInitialValues}
      selectData={selectData}
      onSubmitTransform={onSubmitTransform}
    />
  );
};
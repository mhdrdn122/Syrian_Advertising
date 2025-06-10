import {  useUpdateCustomerMutation } from "../../../../RtkQuery/Slice/Customers/CustomersApi";
import { CustomerFields } from "../../Data/Add/CustomerDialogConfiguration/CustomerFields";
import { CustomerInitialValues } from "../../Data/Add/CustomerDialogConfiguration/CustomerInitialValues";
import { CustomersValidationSchema } from "../../Data/Add/CustomerDialogConfiguration/CustomerValidationSchema";
import DynamicDialog from "../../DynamicDialog";

export const DialogEditCustomer = ({ show, handleClose , initData }) => {
  return (
    <DynamicDialog
      show={show}
      handleClose={handleClose}
      title="إضافة زبون"
      fields={CustomerFields}
      validationSchema={CustomersValidationSchema}
      mutationHook={useUpdateCustomerMutation}
      initialValues={initData}

    />
  );
};
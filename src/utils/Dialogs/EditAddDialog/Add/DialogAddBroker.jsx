import { useAddNewBrokerMutation } from "../../../../RtkQuery/Slice/Brokers/BrokersSlice";
import { BrokerFields } from "../../Data/Add/BrokerDialogConfiguration/BrokerFields";
import { BrokerInitialValues } from "../../Data/Add/BrokerDialogConfiguration/BrokerInitialValues";
import { BrokerValidationSchema } from "../../Data/Add/BrokerDialogConfiguration/BrokerValidationSchema";
import DynamicDialog from "../../DynamicDialog";

export const DialogAddBroker = ({ show, handleClose }) => {
  return (
    <DynamicDialog
      show={show}
      handleClose={handleClose}
      title="إضافة وسيط"
      fields={BrokerFields}
      validationSchema={BrokerValidationSchema}
      mutationHook={useAddNewBrokerMutation}
      initialValues={BrokerInitialValues}
    />
  );
};
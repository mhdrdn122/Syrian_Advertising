import { useUpdateOrderMutation } from "../../../../RtkQuery/Slice/Orders/OrdersApi";
import { orderFields } from "../../Data/Edit/OrderDialogConfiguration/orderFields";
import { orderValidationSchema } from "../../Data/Edit/OrderDialogConfiguration/orderValidationSchema";
import DynamicDialog from "../../DynamicDialog";

export const DialogEditOrders = ({ show, handleClose , initData }) => {
  return (
    <DynamicDialog
      show={show}
      handleClose={handleClose}
      title="تعديل الطلب"
      fields={orderFields}
      validationSchema={orderValidationSchema}
      mutationHook={useUpdateOrderMutation}
      initialValues={initData}
      id={initData?.id}
    />
  );
};
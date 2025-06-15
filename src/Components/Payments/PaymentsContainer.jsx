import { useState } from "react";
import { DynamicTable } from "../../utils/Tables/DynamicTable";
import HeaderComponent from "../../utils/HeaderComponent";
import { PaymentsColumns } from "../../utils/Tables/ColumnsTable/PaymentsColumns";
import { DialogAddPayments } from "../../utils/Dialogs/EditAddDialog/Add/DialogAddPayments";
import { useGetPaymentsQuery } from "../../RtkQuery/Slice/Payments/PaymentsApi";
import { ViewImageDialog } from "./ViewImageDialog"; 

const PaymentsContainer = () => {
  const [openAdd, setOpenAdd] = useState(false); 
  const [openViewImage, setOpenViewImage] = useState(false); 

  const [selectedPayment, setSelectedPayment] = useState(null);
  const { data, isLoading } = useGetPaymentsQuery();

  const onShow = (row) => {
    setSelectedPayment(row);
    setOpenViewImage(true); 

  };

  return (
    <div className="p-4 sm:p-6 w-full mx-auto space-y-6 overflow-x-auto">
      <HeaderComponent title={"المدفوعات"} titleBtn={"إضافة دفعة"} setShow={setOpenAdd} />
      <DynamicTable
        data={data || []}
        columns={PaymentsColumns}
        isLoading={isLoading}
        onShow={onShow}
      />

      <DialogAddPayments show={openAdd} handleClose={() => setOpenAdd(false)} />

      <ViewImageDialog
        show={openViewImage}
        handleClose={() => setOpenViewImage(false)}
        imageUrl={selectedPayment?.payment_image ? `https://road.levantmenu.ae/storage/${selectedPayment.payment_image}` : null}
        paymentNumber={selectedPayment?.payment_number}
      />

    </div>
  );
};

export default PaymentsContainer;
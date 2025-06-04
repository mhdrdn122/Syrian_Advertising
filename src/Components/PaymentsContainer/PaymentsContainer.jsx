import { useState } from "react";
import {  useGetPaymentsQuery } from "../../RtkQuery/Slice/Payments/PaymentsSlice";
import { DynamicTable } from "../../utils/Tables/DynamicTable";
import HeaderPage from "../../utils/HeaderPage";
import { DeleteDialog } from "../../utils/Dialogs/DeleteDialog/DeleteDialog";
import { PaymentsColumns } from "../../utils/Tables/ColumnsTable/PaymentsColumns";
import { DialogAddPayments } from "../../utils/Dialogs/EditAddDialog/Add/DialogAddPayments";

const PaymentsContainer = () => {
  const [openDelete, setOpenDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const { data, isLoading } = useGetPaymentsQuery();

  return (
    <div className="p-4 sm:p-6 w-full  mx-auto space-y-6 overflow-x-auto">
      <HeaderPage title={"المدفوعات"} titleBtn={"إضافة دفعة"} setShow={setOpen} />
      <DynamicTable
        data={data || []}
        columns={PaymentsColumns}
        isLoading={isLoading}
      />

      <DialogAddPayments  show={open} handleClose={()=> setOpen(false)} />
    </div>
  );
};

export default PaymentsContainer;
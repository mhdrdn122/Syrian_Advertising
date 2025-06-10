import {
  useDeleteBrokerMutation,
  useGetBrokersQuery,
} from "../../RtkQuery/Slice/Brokers/BrokersApi";
import LoadingGet from "../../utils/Loading/LoadingGet/LoadingGet";
import { DynamicTable } from "../../utils/Tables/DynamicTable";
import HeaderComponent from "../../utils/HeaderComponent";
import { useState } from "react";
import { DialogAddBroker } from "../../utils/Dialogs/EditAddDialog/Add/DialogAddBroker";
import { DialogEditBroker } from "../../utils/Dialogs/EditAddDialog/Edit/DialogEditBroker";
import { DeleteDialog } from "../../utils/Dialogs/DeleteDialog/DeleteDialog";
import { BrokersColumns } from "../../utils/Tables/ColumnsTable/BrokersColumns";

const BrokersContainer = () => {
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(null);
  const [selectBroker, setSelectBroker] = useState({});

  const { data: brokers, isLoading } = useGetBrokersQuery(undefined, {
    refetchOnMountOrArgChange: false,
  });

  const [deleteBroker, { isDeleting }] = useDeleteBrokerMutation();
  const handleEdit = (row) => {
    if (!row) {
      console.error("No row data provided for edit");
      return;
    }
    setSelectBroker(row);
    setOpenEdit(true);
  };

  const handleDelete = (row) => {
    if (!row) {
      console.error("No row data provided for edit");
      return;
    }
    setSelectBroker(row);
    setOpenDelete(true);
  };

  const onConfirmDelete = async () => {
    await deleteBroker(selectBroker.id).unwrap();
    setOpenDelete(false);
  };

  if (isLoading) {
    return (
      <div className="w-full h-full flex flex-col justify-center items-center">
        <LoadingGet />
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-full mx-auto space-y-6">
      <HeaderComponent title={"الوسطاء"} titleBtn={"إضافة وسيط"} setShow={setOpen} />
      <DynamicTable
        data={brokers || []}
        columns={BrokersColumns}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <DialogAddBroker show={open} handleClose={() => setOpen(false)} />
      <DialogEditBroker
        show={openEdit}
        handleClose={() => setOpenEdit(false)}
        initData={selectBroker}
        key={selectBroker.id || Math.random()}
      />
      <DeleteDialog
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={onConfirmDelete}
        loading={isDeleting}
      />
    </div>
  );
};

export default BrokersContainer;

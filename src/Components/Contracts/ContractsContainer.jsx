import { useState } from "react";
import {
  useDeleteContractMutation,
  useGetContractsQuery,
} from "../../RtkQuery/Slice/Contracts/ContractsSlice";
import { DynamicTable } from "../../utils/Tables/DynamicTable";
import HeaderPage from "../../utils/HeaderPage";
import { DeleteDialog } from "../../utils/Dialogs/DeleteDialog/DeleteDialog";
import { ContractsColumns } from "../../utils/Tables/ColumnsTable/ContractsColumns";
import LoadingGet from "../../utils/Loading/LoadingGet/LoadingGet";

const ContractsContainer = () => {
  const [openDelete, setOpenDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedContract, setSelectedContract] = useState(null);
  const [deleteContract, { isLoading: isDeleting }] =
    useDeleteContractMutation();
  const { data, isLoading } = useGetContractsQuery();

  const handleEdit = (contract) => {
    setSelectedContract(contract);
    setOpenEdit(true);
  };

  const handleDelete = (contract) => {
    setSelectedContract(contract);
    setOpenDelete(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedContract) {
      try {
        await deleteContract(selectedContract.id).unwrap();
        setOpenDelete(false);
        setSelectedContract(null);
      } catch (error) {
        console.error("Failed to delete contract:", error);
      }
    }
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
    <div className="p-4 sm:p-6 w-full mx-auto space-y-6 overflow-x-auto">
      <HeaderPage title={"العقود"} titleBtn={"إضافة عقد"} setShow={setOpen} />
      <DynamicTable
        data={data || []}
        columns={ContractsColumns}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <DeleteDialog
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={handleConfirmDelete}
        loading={isDeleting}
      />
    </div>
  );
};

export default ContractsContainer;

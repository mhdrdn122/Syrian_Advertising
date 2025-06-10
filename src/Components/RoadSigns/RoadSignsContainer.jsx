import React, { useState } from 'react';
import {
  useDeleteRoadSignMutation,
} from '../../RtkQuery/Slice/RoadSings/RoadSingsSlice';
import { DynamicTable } from '../../utils/Tables/DynamicTable';
import HeaderComponent from '../../utils/HeaderComponent';
import { DialogAddRoadSign } from '../../utils/Dialogs/EditAddDialog/Add/DialogAddRoadSign';
import { DialogEditRoadSign } from '../../utils/Dialogs/EditAddDialog/Edit/DialogEditRoadSign';
import { DeleteDialog } from '../../utils/Dialogs/DeleteDialog/DeleteDialog';
import { RoadSignColumns } from '../../utils/Tables/ColumnsTable/RoadSignColumns';
import { RoadSignFields } from '../../utils/Dialogs/Data/Show/RoadSignFieldsShow';
import DialogShow from '../../utils/Dialogs/DialogShow/DialogShow';

const RoadSignsContainer = ({ data, isLoading }) => {
  const [openDelete, setOpenDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [open, setOpen] = useState(false);
  const [openShow, setOpenShow] = useState(false);
  const [selectedRoadSign, setSelectedRoadSign] = useState(null);

  const [deleteRoadSign, { isLoading: isDeleting }] = useDeleteRoadSignMutation();


 
  const handleEdit = (roadSign) => {
    setSelectedRoadSign(roadSign);
    setOpenEdit(true);
  };

  const handleDelete = (roadSign) => {
    setSelectedRoadSign(roadSign);
    setOpenDelete(true);
  };

  const handleShow = (roadSign) => {
    console.log('Selected road sign:', roadSign);
    setSelectedRoadSign(roadSign);
    setOpenShow(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedRoadSign) {
      try {
        await deleteRoadSign(selectedRoadSign.id).unwrap();
        setOpenDelete(false);
        setSelectedRoadSign(null);
      } catch (error) {
        console.error('Failed to delete road sign:', error);
      }
    }
  };

  return (
    <div className="p-4 sm:p-6 w-full  mx-auto space-y-6 overflow-x-auto">
      <HeaderComponent
        title={'اللوحات الطرقية'}
        titleBtn={'إضافة لوحة'}
        setShow={setOpen}
      />
      <DynamicTable
        data={data || []}
        columns={RoadSignColumns}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onShow={handleShow}
      />
      <DialogEditRoadSign
        show={openEdit}
        handleClose={() => setOpenEdit(false)}
        initData={selectedRoadSign}
      />
      <DialogAddRoadSign show={open} handleClose={() => setOpen(false)} />
      <DeleteDialog
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={handleConfirmDelete}
        loading={isDeleting}
      />
      <DialogShow
        show={openShow}
        handleClose={() => {
          setOpenShow(false);
          setSelectedRoadSign(null);
        }}
        data={selectedRoadSign}
        fields={RoadSignFields}
        loading={isLoading}
      />
    </div>
  );
};

export default RoadSignsContainer;
import { useState } from "react";
import {
  useDeleteTemplateMutation,
  useGetTemplatesQuery,
} from "../../RtkQuery/Slice/Template/TemplateSlice";
import { useNavigate, useParams } from "react-router";
import { DynamicTable } from "../../utils/Tables/DynamicTable";
import { DialogAddTemplate } from "../../utils/Dialogs/EditAddDialog/Add/DialogAddTemplate";
import { DeleteDialog } from "../../utils/Dialogs/DeleteDialog/DeleteDialog";
import { DialogEditTemplate } from "../../utils/Dialogs/EditAddDialog/Edit/DialogEditTemplate";
import { TemplateFieldsShow } from "../../utils/Dialogs/Data/Show/TamplatefieldsShow";
import DialogShow from "../../utils/Dialogs/DialogShow/DialogShow";
import { showToast } from "../../utils/Notifictions/showToast";
import { TemplateColumns } from "../../utils/Tables/ColumnsTable/TamplateColumn";
const TableTemplate = () => {
  const { id } = useParams();
  const { data, isLoading, isSuccess } = useGetTemplatesQuery(id);
  const [show, setShow] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openShow, setOpenShow] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [deleteTemplate, { isLoading: isDeleting }] =
    useDeleteTemplateMutation();
  const navigate = useNavigate();

  {
    // isSuccess && data.length > 0 ? "" : navigate("/dashboard/models/");
  }

  const [initData, setInitDat] = useState({});

  const handleEdit = (template) => {
    setSelectedTemplate(template);
    setInitDat(template);
    setOpenEdit(true);
  };

  const handleDelete = (template) => {
    setSelectedTemplate(template);
    setOpenDelete(true);
  };

  const handleShow = (template) => {
    setSelectedTemplate(template);
    setOpenShow(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedTemplate) {
      try {
        await deleteTemplate(selectedTemplate.id).unwrap();
        setOpenDelete(false);
        setSelectedTemplate(null);
        showToast("success", "تم الحذف بنجاح");
      } catch (error) {
        showToast("error", error);
      }
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-full mx-auto space-y-6 overflow-x-auto">
      <DynamicTable
        data={data || []}
        columns={TemplateColumns}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onShow={handleShow}
      />

      <DialogAddTemplate show={show} handleClose={() => setShow(false)} />
      <DeleteDialog
        open={openDelete}
        onClose={() => {
          setOpenDelete(false);
          setSelectedTemplate(null);
        }}
        onConfirm={handleConfirmDelete}
        loading={isDeleting}
      />
      <DialogEditTemplate
        show={openEdit}
        handleClose={() => setOpenEdit(false)}
        initData={initData}
      />
      <DialogShow
        show={openShow}
        handleClose={() => {
          setOpenShow(false);
          setSelectedTemplate(null);
        }}
        data={selectedTemplate}
        fields={TemplateFieldsShow}
      />
    </div>
  );
};

export default TableTemplate;

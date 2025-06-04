import { useCreateTemplateMutation } from "../../../../RtkQuery/Slice/Template/TemplateSlice";
import { TemplateFields } from "../../Data/Add/TamplateDialogConfiguration/FieldsTamplate";
import { TemplateInitialValues } from "../../Data/Add/TamplateDialogConfiguration/InitialValuesTemplate";
import { TemplateValidationSchema } from "../../Data/Add/TamplateDialogConfiguration/TemplateValidationSchema";
import DynamicDialog from "../../DynamicDialog";

export const DialogAddTemplate = ({ show, handleClose }) => {
  return (
    <DynamicDialog
      show={show}
      handleClose={handleClose}
      title="إضافة نموذج"
      fields={TemplateFields}
      validationSchema={TemplateValidationSchema}
      mutationHook={useCreateTemplateMutation}
      initialValues={TemplateInitialValues}
    />
  );
};
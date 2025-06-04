import {  useUpdataTemplateMutation } from "../../../../RtkQuery/Slice/Template/TemplateSlice";
import { TemplateFields } from "../../Data/Add/TamplateDialogConfiguration/FieldsTamplate";
import { TemplateInitialValues } from "../../Data/Add/TamplateDialogConfiguration/InitialValuesTemplate";
import { TemplateValidationSchema } from "../../Data/Add/TamplateDialogConfiguration/TemplateValidationSchema";
import DynamicDialog from "../../DynamicDialog";

export const DialogEditTemplate = ({ show, handleClose , initData  }) => {
  console.log(initData)
  return (
    <>
     <DynamicDialog
      show={show}
      handleClose={handleClose}
      title="تعديل نموذج"
      fields={TemplateFields}
      validationSchema={TemplateValidationSchema}
      mutationHook={useUpdataTemplateMutation}
      initialValues={initData}
      id={initData?.id}
    />
    </>
   
  );
};
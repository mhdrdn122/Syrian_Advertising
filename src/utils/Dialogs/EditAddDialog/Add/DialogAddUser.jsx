import { useAddNewUsersMutation, useGetRolesQuery } from "../../../../RtkQuery/Slice/Users/UsersApi";
import { UserFields } from "../../Data/Add/UsersDialogConfiguration/UserFields";
import { userInitialValues } from "../../Data/Add/UsersDialogConfiguration/UserInitialValues";
import { userValidationSchema } from "../../Data/Add/UsersDialogConfiguration/UserValidationSchema";
import DynamicDialog from "../../DynamicDialog";

export const DialogAddUser = ({ show, handleClose }) => {
  const { data: rolesData, isSuccess } = useGetRolesQuery();

  
  const selectData = isSuccess
    ? { 
        roles: {
          data: rolesData.map((role) => ({
            id: role, 
            name: role, 
          })),
        },
      }
    : { roles: { data: [] } };

  
  const onSubmitTransform = (values) => ({
    ...values,
    roles: values.roles ? [values.roles] : [], 
  });

  return (
    <DynamicDialog
      show={show}
      handleClose={handleClose}
      title="إضافة مدير"
      fields={UserFields}
      validationSchema={userValidationSchema}
      mutationHook={useAddNewUsersMutation}
      initialValues={userInitialValues}
      selectData={selectData}
      onSubmitTransform={onSubmitTransform} 
    />
  );
};
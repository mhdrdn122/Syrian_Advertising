import { useUpdateProfileMutation } from '../../../../RtkQuery/Slice/Auth/AuthApi'
import { ProfileFields } from '../../Data/Edit/ProfileDialogConfiguration/ProfileFields'
import { ProfileInitialValues } from '../../Data/Edit/ProfileDialogConfiguration/ProfileInitialValues'
import { ProfileValidationSchema } from '../../Data/Edit/ProfileDialogConfiguration/ProfileValidationSchema'
import DynamicDialog from '../../DynamicDialog'

const DialogEditProfile = ({show, handleClose , initData}) => {
    
  return (
    <>
         <DynamicDialog
          show={show}
          handleClose={handleClose}
          title="تعديل ملعومات الملف الشخصي"
          fields={ProfileFields}
          validationSchema={ProfileValidationSchema}
          mutationHook={useUpdateProfileMutation}
          initialValues={initData}
              />
    </>
  )
}

export default DialogEditProfile
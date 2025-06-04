import {  useGetCitiesQuery, useGetRegionsQuery } from "../../../../RtkQuery/Slice/CitiesAndRegions/CitiesAndRegionsSlice";
import { useAddRoadSignMutation,  useGetTemplateProductsQuery } from "../../../../RtkQuery/Slice/RoadSings/RoadSingsSlice";
import { roadSignFields } from "../../Data/Add/RoadSignDialogConfiguration/roadSignFields";
import { roadSignInitialValues } from "../../Data/Add/RoadSignDialogConfiguration/roadSignInitialValues";
import { roadSignValidationSchema } from "../../Data/Add/RoadSignDialogConfiguration/roadSignValidationSchema";
import DynamicDialog from "../../DynamicDialog";

export const DialogAddRoadSign = ({ show, handleClose }) => {
  const { data: citiesData, isSuccess: isCitiesSuccess } = useGetCitiesQuery()
  const { data: regionsData, isSuccess: isRegionsSuccess } = useGetRegionsQuery();

  const { data: tempProd, isSuccess: isTempProdSuccess } = useGetTemplateProductsQuery();
  console.log(tempProd)


  const selectData = {
    cities: {
      data: isCitiesSuccess
        ? citiesData.map((city) => ({
            id: String(city.id),
            name: city.name,
          }))
        : [],
    },
    regions: {
      data: isRegionsSuccess
        ? regionsData.map((region) => ({
            id: String(region.id),
            name: region.name,
          }))
        : [],
    },
    template_id: {
      data: isTempProdSuccess ? tempProd : [
        { id: "1", name: "Local" },
        { id: "2", name: "Foreign" },
        { id: "3", name: "Both" },
      ],
    },
    is_available: {
      data: [
        { id: "1", name: "متاح" },
        { id: "0", name: "غير متاح" },
      ],
    },
  }; 
 
  const onSubmitTransform = (values) => ({
    ...values,
    city_id: values.city_id ? Number(values.city_id) : null,
    region_id: values.region_id ? Number(values.region_id) : null,
    product_id: values.product_id ? parseInt(values.product_id, 10) : null, // تحويل إلى رقم صحيح
    is_available: values.is_available ? parseInt(values.is_available, 10) : null, // تحويل إلى رقم صحيح
    faces_number: values.faces_number ? Number(values.faces_number) : null,
    advertising_meters: values.advertising_meters ? String(Number(values.advertising_meters)) : null,
    printing_meters: values.printing_meters ? String(Number(values.printing_meters)) : null,
  });

  return (
    <DynamicDialog
      show={show}
      handleClose={handleClose}
      title="إضافة لوحة طرقية"
      fields={roadSignFields}
      validationSchema={roadSignValidationSchema}
      mutationHook={useAddRoadSignMutation}
      initialValues={roadSignInitialValues}
      selectData={selectData}
      onSubmitTransform={onSubmitTransform}
    />
  );
};
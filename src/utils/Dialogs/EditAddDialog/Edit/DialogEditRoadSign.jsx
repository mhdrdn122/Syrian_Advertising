import {  useGetTemplateProductsQuery, useUpdateRoadSignMutation } from "../../../../RtkQuery/Slice/RoadSings/RoadSingsSlice";
import { roadSignFields } from "../../Data/Add/RoadSignDialogConfiguration/roadSignFields";
import { roadSignInitialValues } from "../../Data/Add/RoadSignDialogConfiguration/roadSignInitialValues";
import { roadSignValidationSchema } from "../../Data/Add/RoadSignDialogConfiguration/roadSignValidationSchema";
import {  useGetCitiesQuery, useGetRegionsQuery } from "../../../../RtkQuery/Slice/CitiesAndRegions/CitiesAndRegionsSlice";
import DynamicDialog from "../../DynamicDialog";

export const DialogEditRoadSign = ({ show, handleClose , initData }) => {
  const { data: citiesData, isSuccess: isCitiesSuccess } = useGetCitiesQuery();
  const { data: regionsData, isSuccess: isRegionsSuccess } = useGetRegionsQuery();
  // const { data: activeRegionsByCityMutation, isSuccess: isuseActiveRegionsByCityMutation} = useGetActiveRegionsByCityMutation(4);

  const { data: tempProd, isSuccess: isTempProdSuccess } = useGetTemplateProductsQuery();

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
    product_id: {
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

  return (
    <DynamicDialog
      show={show}
      handleClose={handleClose}
      title="تعديل لوحة طرقية"
      fields={roadSignFields}
      validationSchema={roadSignValidationSchema}
      mutationHook={useUpdateRoadSignMutation}
      initialValues={initData || roadSignInitialValues}
      selectData={selectData}
    />
  );
};
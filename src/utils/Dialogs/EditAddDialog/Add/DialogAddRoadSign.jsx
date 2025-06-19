import { useEffect, useState } from "react";
import {
  useGetActiveRegionsByCityMutation,
  useGetCitiesQuery,
} from "../../../../RtkQuery/Slice/CitiesAndRegions/CitiesAndRegionsApi";
import {
  useAddRoadSignMutation,
  useGetTemplateProductsQuery,
} from "../../../../RtkQuery/Slice/RoadSings/RoadSingsApi";
import { isAvailableRoadSign } from "../../../../Static/StaticData";
import { roadSignFields } from "../../Data/DynamicDialogConfiguration/RoadSignDialogConfiguration/roadSignFields";
import { roadSignInitialValues } from "../../Data/DynamicDialogConfiguration/RoadSignDialogConfiguration/roadSignInitialValues";
import { roadSignValidationSchema } from "../../Data/DynamicDialogConfiguration/RoadSignDialogConfiguration/roadSignValidationSchema";
import DynamicDialog from "../DynamicDialog";

export const DialogAddRoadSign = ({ show, handleClose }) => {

  const [regions, setRegions] = useState([]);
  const [cityId, setCityId] = useState([]);

  const { data: citiesData, isSuccess: isCitiesSuccess } = useGetCitiesQuery();

  const [
    activeRegionsByCityMutation,
    { isSuccess: isSuccessActiveRegionsByCityMutation },
  ] = useGetActiveRegionsByCityMutation();
 const { data: tempProd, isSuccess: isTempProdSuccess } =
    useGetTemplateProductsQuery();

  const getRegionsByCityId = async (cityId) => {
    try {
      setRegions(await activeRegionsByCityMutation(cityId).unwrap());
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (cityId) {
      getRegionsByCityId(cityId);
    } else {
      getRegionsByCityId(1);
    }
  }, [cityId]);

 
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
      data: isSuccessActiveRegionsByCityMutation
        ? regions.map((region) => ({
            id: String(region.id),
            name: region.name,
          }))
        : [{ id: 0, name: "جاري تحميل المناطق ..." }],
    },
    template_id: {
      data: isTempProdSuccess ? tempProd : [],
    },
    is_available: {
      data: isAvailableRoadSign,
    },
  };

  const onSubmitTransform = (values) => ({
    ...values,
    city_id: values.city_id ? Number(values.city_id) : null,
    region_id: values.region_id ? Number(values.region_id) : null,
    product_id: values.product_id ? parseInt(values.product_id, 10) : null,
    is_available: values.is_available
      ? parseInt(values.is_available, 10)
      : null,
    faces_number: values.faces_number ? Number(values.faces_number) : null,
    advertising_meters: values.advertising_meters
      ? String(Number(values.advertising_meters))
      : null,
    printing_meters: values.printing_meters
      ? String(Number(values.printing_meters))
      : null,
  });

  const handleCityChange = (value) => {
    setCityId(value);
  };

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
      onFieldChange={(fieldName, value) => {
        if (fieldName === "city_id") {
          handleCityChange(value);
        }
      }}
    />
  );
};

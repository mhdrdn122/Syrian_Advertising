import React, { useEffect, useState } from "react";
import {
  useGetRoadSignsModelQuery,
  useGetRoadSignsQuery,
} from "../RtkQuery/Slice/RoadSings/RoadSingsApi";
import {
  useGetActiveRegionsByCityMutation,
  useGetCitiesQuery,
} from "../RtkQuery/Slice/CitiesAndRegions/CitiesAndRegionsApi";
import { useLocation, useNavigate } from "react-router";

const useGetRoadSignsByFilter = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [cityId, setCityId] = useState("");
  const [regionId, setRegionId] = useState("");
  const [model, setModel] = useState("");

  const local = useLocation();
  const pathnameSplit = local?.pathname.split("/");
  const routeBooking = pathnameSplit[2];

  const { data: cities, isLoading: isCitiesLoading } = useGetCitiesQuery();
  const [
    getActiveRegionsByCity,
    { data: regions, isLoading: isRegionsLoading , isFetching: isRegionsFetching },
  ] = useGetActiveRegionsByCityMutation();
  const { data: getRoadSignsModel, isLoading: isGetRoadSignsModel } =
    useGetRoadSignsModelQuery();

  const {
    data: roadSigns,
    isError,
    isFetching: isRoadSignsFetching,
  } = useGetRoadSignsQuery({
    start_date: startDate,
    end_date: endDate,
    city_id: cityId,
    region_id: regionId,
    model: model,
  });

  const navigate = useNavigate();

  useEffect(() => {
    roadSigns?.length == 0 && routeBooking != "booking"
      ? navigate("/dashboard/road_signs")
      : null;
  }, [roadSigns]);

  useEffect(() => {
    if (cityId) {
      getActiveRegionsByCity(cityId);
    }
  }, [cityId, getActiveRegionsByCity]);

  return {
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    cityId,
    setCityId,
    regionId,
    setRegionId,
    roadSigns,
    isError,
    cities,
    isCitiesLoading,
    getActiveRegionsByCity,
    regions,
    isRegionsLoading,
    isRegionsFetching,
    model,
    setModel,
    getRoadSignsModel,
    isGetRoadSignsModel,
    isRoadSignsFetching,

  };
};

export default useGetRoadSignsByFilter;

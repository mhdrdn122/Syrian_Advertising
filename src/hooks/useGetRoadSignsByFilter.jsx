import React, { useEffect, useState } from 'react'
import { useGetRoadSignsModelQuery, useGetRoadSignsQuery } from '../RtkQuery/Slice/RoadSings/RoadSingsApi';
import { useGetActiveRegionsByCityMutation, useGetCitiesQuery } from '../RtkQuery/Slice/CitiesAndRegions/CitiesAndRegionsApi';
import { useParams } from 'react-router';

const useGetRoadSignsByFilter = () => {
      const [startDate, setStartDate] = useState('');
      const [endDate, setEndDate] = useState('');
      const [cityId, setCityId] = useState('');
      const [regionId, setRegionId] = useState('');
      const [model , setModel] = useState('');

     const {id} = useParams()

      const { data: cities, isLoading: isCitiesLoading } = useGetCitiesQuery();
        const [getActiveRegionsByCity, { data: regions, isLoading: isRegionsLoading }] =
          useGetActiveRegionsByCityMutation();
          const {data:getRoadSignsModel , isLoading:isGetRoadSignsModel} = useGetRoadSignsModelQuery()

   const { data: roadSigns, isLoading: isRoadSignsLoading, isError } = useGetRoadSignsQuery({
      start_date: startDate,
      end_date: endDate,
      city_id: cityId,
      region_id: regionId,
      model: id ? id : model
    });
  
     useEffect(() => {
        if (cityId) {
          getActiveRegionsByCity(cityId);
        }
      }, [cityId, getActiveRegionsByCity]);

    return {
        startDate ,
        setStartDate ,
        endDate ,
        setEndDate , 
        cityId , 
        setCityId , 
        regionId , 
        setRegionId ,
        roadSigns , 
        isRoadSignsLoading,
        isError , 
        cities ,
        isCitiesLoading ,
        getActiveRegionsByCity ,
        regions ,
        isRegionsLoading ,
        model ,
        setModel ,
        getRoadSignsModel ,
        isGetRoadSignsModel

    }
   
}

export default useGetRoadSignsByFilter
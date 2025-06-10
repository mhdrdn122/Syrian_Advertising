import React, { useEffect, useState } from 'react';
import RoadSignsContainer from '../../Components/RoadSigns/RoadSignsContainer';
import { useGetRoadSignsQuery } from '../../RtkQuery/Slice/RoadSings/RoadSingsApi';
import { useGetActiveRegionsByCityMutation, useGetCitiesQuery } from '../../RtkQuery/Slice/CitiesAndRegions/CitiesAndRegionsApi';
import RoadSignsPdf from '../../Components/RoadSigns/RoadSignsPdf';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const RoadSignsPage = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [cityId, setCityId] = useState('');
  const [regionId, setRegionId] = useState('');

  const { data: cities, isLoading: isCitiesLoading } = useGetCitiesQuery();
  const [getActiveRegionsByCity, { data: regions, isLoading: isRegionsLoading }] =
    useGetActiveRegionsByCityMutation();
  const { data: roadSigns, isLoading: isRoadSignsLoading, isError } = useGetRoadSignsQuery({
    start_date: startDate,
    end_date: endDate,
    city_id: cityId,
    region_id: regionId,
  });

  useEffect(() => {
    if (cityId) {
      getActiveRegionsByCity(cityId);
    }
  }, [cityId, getActiveRegionsByCity]);

  const handleCityChange = (e) => {
    setCityId(e.target.value);
    setRegionId(''); // Reset region when city changes
  };

  const handleRegionChange = (e) => {
    setRegionId(e.target.value);
  };

  if (isError) {
    return <div className="text-center p-4 text-red-500">حدث خطأ أثناء جلب البيانات</div>;
  }

  return (
    <div className="p-4" dir="rtl">
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">المدينة</Label>
          <select
            id="city"
            value={cityId}
            onChange={handleCityChange}
            disabled={isCitiesLoading}
            className="w-full p-2 border dark:bg-gray-900 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">اختر مدينة</option>
            {cities?.map((city) => (
              <option key={city.id} value={city.id}>
                {city.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <Label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-1">المنطقة</Label>
          <select
            id="region"
            value={regionId}
            onChange={handleRegionChange}
            disabled={isRegionsLoading || !cityId}
            className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">اختر منطقة</option>
            {regions?.map((region) => (
              <option key={region.id} value={region.id}>
                {region.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <Label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">تاريخ البدء</Label>
          <Input
            id="startDate"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="flex-1">
          <Label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">تاريخ الانتهاء</Label>
          <Input
            id="endDate"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>
      <Button
        onClick={() => {
          const { generatePDF } = RoadSignsPdf({ roadSigns: roadSigns || [] });
          generatePDF();
        }}
        className="mb-6 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        disabled={isRoadSignsLoading || !roadSigns?.length}
      >
        تحميل ملف تموضع اللوحات 
      </Button>
      <RoadSignsContainer data={roadSigns || []} isLoading={isRoadSignsLoading} />
    </div>
  );
};

export default RoadSignsPage;
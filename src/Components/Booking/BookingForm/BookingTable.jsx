import React, { memo, useContext, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import { BookingContext } from "../../../Context/BookingContext";
import useGetRoadSignsByFilter from "../../../hooks/useGetRoadSignsByFilter";

const BookingTable = () => {
  const { formik, addToCart, addedSignIds } = useContext(BookingContext);

  const {
    setStartDate,
    setEndDate,
    cityId,
    regionId,
    roadSigns,
    cities,
    isCitiesLoading,
    regions,
    isRegionsLoading,
    model,
    getRoadSignsModel,
    isGetRoadSignsModel,
    isRoadSignsFetching,
    handleCityChange,
    handleRegionChange,
    handleModelChange,
  } = useGetRoadSignsByFilter();

  useEffect(() => {
    setStartDate(formik.values.start_date);
    setEndDate(formik.values.end_date);
  }, []);

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
        اللوحات الطرقية
      </h2>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Label
            htmlFor="city"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            المدينة
          </Label>
          <select
            id="city"
            value={cityId}
            onChange={handleCityChange}
            disabled={isCitiesLoading}
            className="w-full p-2 border dark:bg-gray-900 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">اختر مدينة</option>
            {isCitiesLoading && <option>جاري تحميل المدن ...</option>}
            {cities?.map((city) => (
              <option key={city.id} value={city.id}>
                {city.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <Label
            htmlFor="region"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            المنطقة
          </Label>
          <select
            id="region"
            value={regionId}
            onChange={handleRegionChange}
            disabled={isRegionsLoading || !cityId}
            className={`w-full ${
              isRegionsLoading || !cityId
                ? `dark:bg-gray-700`
                : `dark:bg-gray-900`
            } p-2 border border-gray-300 rounded-md  focus:outline-none focus:ring-2 focus:ring-blue-500 `}
          >
            {isRegionsLoading || !cityId ? (
              <option>اختر مدينة لإظهار المناطق</option>
            ) : (
              <>
                <option>كل المناطق </option>

                {regions?.map((region) => (
                  <option key={region.id} value={region.id}>
                    {region.name}
                  </option>
                ))}
              </>
            )}
          </select>
        </div>

        <div className="flex-1">
          <Label
            htmlFor="region"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            القياس
          </Label>
          <select
            id="model"
            value={model}
            onChange={handleModelChange}
            disabled={isGetRoadSignsModel}
            className={`w-full ${
              isGetRoadSignsModel ? `dark:bg-gray-700` : `dark:bg-gray-900`
            } p-2 border border-gray-300 rounded-md  focus:outline-none focus:ring-2 focus:ring-blue-500 `}
          >
            <option value="">اختر القياس</option>
            {isGetRoadSignsModel && <option>جاري تحميل القياس ...</option>}
            {getRoadSignsModel?.map((model) => (
              <option key={model.model} value={model.model}>
                {`${model.model} (${model.count} نماذج متوفرة من هذا القياس)`}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="rounded-lg shadow-sm border   border-gray-200 dark:border-gray-700">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-100 dark:bg-gray-800">
              <TableHead className="text-right">نموذج</TableHead>
              <TableHead className="text-right">عدد الوجوه</TableHead>
              <TableHead className="text-right">عدد الوجوه المحجوزة</TableHead>
              <TableHead className="text-right">عدد الأمتار</TableHead>
              <TableHead className="text-right">القياس</TableHead>
              <TableHead className="text-right">المنطقة</TableHead>
              <TableHead className="text-right">مكان التموضع</TableHead>
              <TableHead className="text-right">الاتجاه</TableHead>
              <TableHead className="text-right">الوجوه المتاحة</TableHead>
              <TableHead className="text-right">إجراء</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isRoadSignsFetching ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-4">
                  جاري التحميل...
                </TableCell>
              </TableRow>
            ) : !roadSigns || roadSigns.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-4">
                  لا توجد لوحات متوفرة لهذه الفترة
                </TableCell>
              </TableRow>
            ) : (
              roadSigns.map((sign) => (
                <TableRow
                  key={sign.id}
                  className={` ${
                    addedSignIds?.has?.(sign.id)
                      ? "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300"
                      : "hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                >
                  <TableCell className="truncate max-w-[120px] sm:max-w-[150px]">
                    {sign.template?.model || "غير متوفر"}
                  </TableCell>
                  <TableCell>{sign.panels_number || 0}</TableCell>
                  <TableCell>{sign.total_panels_on_date || 0}</TableCell>
                  <TableCell>{sign.template.printing_space || 0}</TableCell>
                  <TableCell>{sign.template?.size || "غير متوفر"}</TableCell>
                  <TableCell className="truncate max-w-[120px] sm:max-w-[150px]">
                    {sign.region?.name || "غير متوفر"}
                  </TableCell>
                  <TableCell className="truncate max-w-[120px] sm:max-w-[150px]">
                    {sign.place || "غير متوفر"}
                  </TableCell>
                  <TableCell className="truncate max-w-[120px] sm:max-w-[150px]">
                    {sign.directions || "غير متوفر"}
                  </TableCell>
                  <TableCell>
                    {sign.panels_number - sign.total_panels_on_date === 0
                      ? "لا يوجد أي لوحات متاحة"
                      : `${
                          sign.panels_number - sign.total_panels_on_date
                        } لوحة متاحة`}
                  </TableCell>
                  <TableCell>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addToCart(sign)}
                      disabled={
                        sign.panels_number - sign.total_panels_on_date === 0
                      }
                      className={`flex items-center gap-2 ${
                        addedSignIds?.has?.(sign.id)
                          ? "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300"
                          : "bg-white dark:bg-gray-700"
                      }`}
                    >
                      <ShoppingCart className="h-4 w-4" />
                      <span>إضافة</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default memo(BookingTable);

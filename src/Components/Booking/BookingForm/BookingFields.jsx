import React, { memo, useContext } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { productTypeOptions, typeOptions } from "../../../Static/StaticData";
import { BookingContext } from "../../../Context/BookingContext";

const BookingFields = () => {
  const { formik, customers, isLoadingCustomers, bookingData } =
    useContext(BookingContext);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          الزبون
        </label>
        <Select
          onValueChange={(value) => formik.setFieldValue("customer_id", value)}
          value={bookingData?.customer_id.toString()}
          onBlur={() => formik.setFieldTouched("customer_id", true)}
        >
          <SelectTrigger className="w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-right">
            <SelectValue placeholder="اختر الزبون" />
          </SelectTrigger>
          <SelectContent>
            {isLoadingCustomers ? (
              <SelectItem value="loading">جاري التحميل...</SelectItem>
            ) : (
              customers?.map((customer) => (
                <SelectItem key={customer.id} value={customer.id.toString()}>
                  {customer.full_name} - {customer.company_name}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
        {formik.touched.customer_id && formik.errors.customer_id && (
          <p className="text-sm text-red-500 mt-1 text-right">
            {formik.errors.customer_id}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          نوع الحجز
        </label>
        <Select
          onValueChange={(value) => formik.setFieldValue("type", value)}
          value={bookingData?.type.toString()}
          onBlur={() => formik.setFieldTouched("type", true)}
        >
          <SelectTrigger className="w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-right">
            <SelectValue placeholder="اختر نوع الحجز" />
          </SelectTrigger>
          <SelectContent>
            {typeOptions.map((option) => (
              <SelectItem key={option.value} value={option.value.toString()}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {formik.touched.type && formik.errors.type && (
          <p className="text-sm text-red-500 mt-1 text-right">
            {formik.errors.type}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          تاريخ البداية
        </label>
        <Input
          type="date"
          {...formik.getFieldProps("start_date")}
          className="w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-right"
        />
        {formik.touched.start_date && formik.errors.start_date && (
          <p className="text-sm text-red-500 mt-1 text-right">
            {formik.errors.start_date}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          تاريخ النهاية
        </label>
        <Input
          type="date"
          {...formik.getFieldProps("end_date")}
          className="w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-right"
        />
        {formik.touched.end_date && formik.errors.end_date && (
          <p className="text-sm text-red-500 mt-1 text-right">
            {formik.errors.end_date}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          نوع المنتج
        </label>
        <Select
          onValueChange={(value) => formik.setFieldValue("product_type", value)}
          value={bookingData?.product_type.toString()}
          onBlur={() => formik.setFieldTouched("product_type", true)}
        >
          <SelectTrigger className="w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-right">
            <SelectValue placeholder="اختر نوع المنتج" />
          </SelectTrigger>
          <SelectContent>
            {productTypeOptions.map((option) => (
              <SelectItem key={option.value} value={option.value.toString()}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {formik.touched.product_type && formik.errors.product_type && (
          <p className="text-sm text-red-500 mt-1 text-right">
            {formik.errors.product_type}
          </p>
        )}
      </div>
    </div>
  );
};

export default memo(BookingFields);

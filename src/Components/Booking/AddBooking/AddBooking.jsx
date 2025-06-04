import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useGetCustomersQuery } from "../../../RtkQuery/Slice/Customers/CustomersSlice";
import { useGetRoadSignsQuery } from "../../../RtkQuery/Slice/RoadSings/RoadSingsSlice";
import BookingForm from "./BookingForm";
import RoadSignsTable from "./RoadSignsTable";
import CartDialog from "./CartDialog";
// import { useBookingForm } from "./hooks/useBookingForm";
// import { useCart } from "./hooks/useCart";
import { useBookingForm } from "../../../hooks/useBookingForm";
import { useCart } from "../../../hooks/useCart";

const AddBooking = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [queryParams, setQueryParams] = useState({ start_date: "2025-06-30" });
  const [selectedSigns, setSelectedSigns] = useState([]); // إضافة حالة selectedSigns
  const [addedSignIds, setAddedSignIds] = useState(new Set()); // إضافة حالة addedSignIds
  const [calculationResult, setCalculationResult] = useState(null); // إضافة حالة calculationResult
  const { data: customers, isLoading: isLoadingCustomers } = useGetCustomersQuery();
  const { data: roadSigns, isLoading: isLoadingRoadSigns } = useGetRoadSignsQuery(queryParams);

  // تهيئة formik أولاً
  const formik = useBookingForm(setOpenDialog, setSelectedSigns, selectedSigns , setAddedSignIds, setCalculationResult);

//   console.log(formik)
  // تهيئة useCart بعد formik
  const {
    addToCart,
    updateSignFaces,
    removeFromCart,
    calculateTotal,
  } = useCart(roadSigns, formik, selectedSigns, setSelectedSigns, addedSignIds, setAddedSignIds, calculationResult, setCalculationResult);

  // Update query params when start_date or end_date changes
  useEffect(() => {
    if (formik.values.start_date && formik.values.end_date) {
      setQueryParams({
        start_date: formik.values.start_date,
        end_date: formik.values.end_date,
      });
    } else {
      setQueryParams({});
    }
  }, [formik.values.start_date, formik.values.end_date]);

  return (
    <div dir="rtl" className="container mx-auto p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">
          إضافة حجز جديد
        </h1>
        <Button
          type="button"
          variant="outline"
          onClick={() => setOpenDialog(true)}
          disabled={!selectedSigns || selectedSigns.length === 0} // إضافة فحص selectedSigns
          className="flex items-center gap-2 border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors rounded-lg px-4 py-2"
        >
          <ShoppingCart className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          <span className="text-sm font-medium">سلة الحجز ({selectedSigns?.length || 0})</span>
        </Button>
      </div>

      <BookingForm formik={formik} customers={customers} isLoadingCustomers={isLoadingCustomers} />
      <RoadSignsTable
        roadSigns={roadSigns}
        isLoadingRoadSigns={isLoadingRoadSigns}
        addToCart={addToCart}
        addedSignIds={addedSignIds}
      />
      <CartDialog
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        selectedSigns={selectedSigns}
        roadSigns={roadSigns}
        calculationResult={calculationResult}
        customers={customers}
        formik={formik}
        updateSignFaces={updateSignFaces}
        removeFromCart={removeFromCart}
        calculateTotal={calculateTotal}
      />
    </div>
  );
};

export default AddBooking;
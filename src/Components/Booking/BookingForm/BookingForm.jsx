import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  useAddNewBookingMutation,
  useCalculateReservationMutation,
  useUpdateBookingsMutation,
  useGetOneBookingsQuery,
} from "../../../RtkQuery/Slice/Booking/BookingApi";
import { useGetRoadSignsQuery } from "../../../RtkQuery/Slice/RoadSings/RoadSingsApi";
import { Button } from "@/components/ui/button";

import { ShoppingCart } from "lucide-react";
import { showToast } from "../../../utils/Notifictions/showToast";
import { useNavigate, useParams } from "react-router";
import ContractDialog from "./ContractDialog";
import CartDialog from "./Cart/CartDialog";
import BookingTable from "./BookingTable";
import BookingFields from "./BookingFields";

// Validation schema using Yup
const validationSchema = Yup.object({
  customer_id: Yup.string().required("حقل الزبون مطلوب"),
  type: Yup.string().required("حقل نوع الحجز مطلوب"),
  start_date: Yup.string().required("حقل تاريخ البداية مطلوب"),
  end_date: Yup.string().required("حقل تاريخ النهاية مطلوب"),
  product_type: Yup.string().required("حقل نوع المنتج مطلوب"),
});

const BookingForm = ({ bookingId }) => {
  const isEditMode = !!bookingId;
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedSigns, setSelectedSigns] = useState([]);
  const [addedSignIds, setAddedSignIds] = useState(new Set());
  const [calculationResult, setCalculationResult] = useState(null);
  const [showDiscount, setShowDiscount] = useState(false);
  const [discountType, setDiscountType] = useState("1");
  const [discountValue, setDiscountValue] = useState("");
  const [contractDialog, setContractDialog] = useState(false);
  const [notes, setNotes] = useState("");
  const [queryParams, setQueryParams] = useState({ start_date: "2025-06-30" });
  const { id } = useParams();

  const { data: roadSigns, isLoading: isLoadingRoadSigns } =
    useGetRoadSignsQuery(queryParams);
  const { data: bookingData, isLoading: isLoadingBooking } =
    useGetOneBookingsQuery(id, {
      skip: !isEditMode,
    });
  const [addNewBooking] = useAddNewBookingMutation();
  const [updateBookings] = useUpdateBookingsMutation();
  const [calculateReservation] = useCalculateReservationMutation();

  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      customer_id: "",
      type: "",
      start_date: "",
      end_date: "",
      product_type: "",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        const bookingPayload = {
          customer_id: parseInt(values.customer_id),
          type: parseInt(values.type),
          start_date: values.start_date,
          end_date: values.end_date,
          roadsigns: selectedSigns.map(({ road_sign_id, booking_faces }) => ({
            road_sign_id,
            booking_faces,
          })),
          product_type: parseInt(values.product_type),
          notes,
          discount_type: discountValue ? parseInt(discountType) : undefined,
          value: discountValue ? parseInt(discountValue) : undefined,
        };

        if (isEditMode) {
          bookingPayload.id = id;
          await updateBookings(bookingPayload).unwrap();
          showToast("success", "تم تعديل الحجز بنجاح");
        } else {
          await addNewBooking(bookingPayload).unwrap();
          showToast("success", "تم إضافة الحجز بنجاح");
        }

        resetForm();
        setSelectedSigns([]);
        setAddedSignIds(new Set());
        setCalculationResult(null);
        setShowDiscount(false);
        setDiscountType("1");
        setDiscountValue("");
        setNotes("");
        setOpenDialog(false);
        setContractDialog(false);
        navigate("/dashboard/bookings");
      } catch (error) {
        showToast(
          "error",
          isEditMode ? "فشل في تعديل الحجز" : "فشل في إضافة الحجز"
        );
      }
    },
  });

  // Populate form with booking data in edit mode
  useEffect(() => {
    if (isEditMode && bookingData && !isLoadingBooking) {
      formik.setValues({
        customer_id: bookingData.customer_id.toString(),
        type: bookingData.type.toString(),
        start_date: bookingData.start_date.split("T")[0],
        end_date: bookingData.end_date.split("T")[0],
        product_type: bookingData.product_type.toString(),
      });
      setNotes(bookingData.notes || "");
      setDiscountType(bookingData.discount_type?.toString() || "1");
      setDiscountValue(bookingData.value?.toString() || "");
      setShowDiscount(!!bookingData.value);
      setSelectedSigns(
        bookingData.roadsigns.map((sign) => ({
          road_sign_id: sign.id,
          booking_faces: sign.pivot.booking_faces,
          max_faces: sign.faces_number,
        }))
      );
      setAddedSignIds(new Set(bookingData.roadsigns.map((sign) => sign.id)));
      setCalculationResult({
        total_price: bookingData.total_price,
        total_advertising_space: bookingData.total_advertising_space,
        total_printing_space: bookingData.total_printing_space,
      });
    }
  }, [bookingData, isEditMode, isLoadingBooking]);

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

  // Remove unavailable signs from cart when roadSigns change
  useEffect(() => {
    if (roadSigns && selectedSigns.length > 0) {
      const availableSignIds = new Set(roadSigns.map((sign) => sign.id));
      const unavailableSigns = selectedSigns.filter(
        (sign) => !availableSignIds.has(sign.road_sign_id)
      );
      if (unavailableSigns.length > 0) {
        setSelectedSigns(
          selectedSigns.filter((sign) =>
            availableSignIds.has(sign.road_sign_id)
          )
        );
        setAddedSignIds(
          new Set([...addedSignIds].filter((id) => availableSignIds.has(id)))
        );
        showToast(
          "warning",
          "تمت إزالة بعض اللوحات من السلة لأنها غير متوفرة في الفترة المحددة"
        );
      }
    }
  }, [roadSigns]);

  const addToCart = (sign) => {
    const existingSign = selectedSigns.find((s) => s.road_sign_id === sign.id);
    if (!existingSign) {
      setSelectedSigns([
        ...selectedSigns,
        {
          road_sign_id: sign.id,
          booking_faces: 1,
          max_faces: sign.faces_number,
        },
      ]);
      setAddedSignIds(new Set([...addedSignIds, sign.id]));
      showToast("success", `تم إضافة لوحة ${sign.number} إلى السلة`);
    }
  };

  const updateSignFaces = (road_sign_id, value) => {
    setSelectedSigns(
      selectedSigns.map((sign) =>
        sign.road_sign_id === road_sign_id
          ? { ...sign, booking_faces: parseInt(value) }
          : sign
      )
    );
  };

  const removeFromCart = (road_sign_id) => {
    setSelectedSigns(
      selectedSigns.filter((sign) => sign.road_sign_id !== road_sign_id)
    );
    setAddedSignIds(
      new Set([...addedSignIds].filter((id) => id !== road_sign_id))
    );
    setCalculationResult(null);
    setShowDiscount(false);
    setDiscountValue("");
    showToast("success", "تم إزالة اللوحة من السلة");
  };

  const calculateTotal = async () => {
    try {
      const payload = {
        product_type: parseInt(formik.values.product_type),
        roadsigns: selectedSigns.map(({ road_sign_id, booking_faces }) => ({
          road_sign_id,
          booking_faces,
        })),
      };
      const response = await calculateReservation(payload).unwrap();
      setCalculationResult(response);
      showToast(
        "success",
        `السعر الإجمالي: ${response.total_price || "غير متوفر"}`
      );
    } catch (error) {
      showToast("error", "فشل في حساب السعر الإجمالي");
    }
  };

  const handleDiscountValueChange = (e) => {
    const value = e.target.value;
    if (discountType === "1" && calculationResult) {
      if (value <= calculationResult.total_price) {
        setDiscountValue(value);
      } else {
        showToast("error", "قيمة الحسم لا يمكن أن تتجاوز السعر الإجمالي");
      }
    } else if (discountType === "2") {
      if (value <= 100) {
        setDiscountValue(value);
      } else {
        showToast("error", "قيمة الحسم لا يمكن أن تتجاوز 100%");
      }
    }
  };

  const calculateDiscountedPrice = () => {
    if (!calculationResult || !discountValue)
      return calculationResult?.total_price;
    if (discountType === "1") {
      return calculationResult.total_price - parseFloat(discountValue);
    } else {
      return (
        calculationResult.total_price * (1 - parseFloat(discountValue) / 100)
      );
    }
  };

  return (
    <div
      dir="rtl"
      className="container mx-auto p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen"
    >
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">
          {isEditMode ? "تعديل الحجز" : "إضافة حجز جديد"}
        </h1>
        <Button
          type="button"
          variant="outline"
          onClick={() => setOpenDialog(true)}
          disabled={selectedSigns.length === 0}
          className="flex items-center gap-2 border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors rounded-lg px-4 py-2"
        >
          <ShoppingCart className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          <span className="text-sm font-medium">
            سلة الحجز ({selectedSigns.length})
          </span>
        </Button>
      </div>

      {isEditMode && isLoadingBooking ? (
        <div className="text-center py-4">جاري التحميل...</div>
      ) : (
        <form
          onSubmit={formik.handleSubmit}
          className="space-y-8 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
        >
          <BookingFields formik={formik} bookingData={bookingData} />

          <BookingTable
            isLoadingRoadSigns={isLoadingRoadSigns}
            roadSigns={roadSigns}
            addToCart={addToCart}
            addedSignIds={addedSignIds}
          />
        </form>
      )}

      <CartDialog
        openCartDialog={openDialog}
        isEditMode={isEditMode}
        setOpenCartDialog={setOpenDialog}
        calculationResult={calculationResult}
        calculateTotal={calculateTotal}
        formik={formik}
        setContractDialog={setContractDialog}
        calculateDiscountedPrice={calculateDiscountedPrice}
        handleDiscountValueChange={handleDiscountValueChange}
        discountValue={discountValue}
        setShowDiscount={setShowDiscount}
        showDiscount={showDiscount}
        discountType={discountType}
        setDiscountType={setDiscountType}
        setDiscountValue={setDiscountValue}
        selectedSigns={selectedSigns}
        roadSigns={roadSigns}
        updateSignFaces={updateSignFaces}
        removeFromCart={removeFromCart}
      />

      <ContractDialog
        openContractDialog={contractDialog}
        setOpenContractDialog={setContractDialog}
        formik={formik}
        notes={notes}
        setNotes={setNotes}
      />
    </div>
  );
};

export default BookingForm;

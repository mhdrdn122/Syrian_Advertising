import { createContext, useState, useEffect, useMemo } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useGetCustomersQuery } from "../RtkQuery/Slice/Customers/CustomersApi";
import { showToast } from "../utils/Notifictions/showToast";
import { useNavigate, useParams } from "react-router";
import { useGetRoadSignsQuery } from "../RtkQuery/Slice/RoadSings/RoadSingsApi";
import {
  useAddNewBookingMutation,
  useCalculateReservationMutation,
  useGetOneBookingsQuery,
  useUpdateBookingsMutation,
} from "../RtkQuery/Slice/Booking/BookingApi";
import { useGetCompanyQuery } from "../RtkQuery/Slice/Auth/AuthApi";

export const BookingContext = createContext();

export const BookingContextApi = ({ children, bookingId }) => {
  const isEditMode = !!bookingId;
  const { id } = useParams();
  const navigate = useNavigate();
  const superAdminInfo = JSON.parse(localStorage.getItem("SuperAdminInfo"));

  // States
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
  

  // RTK Query hooks
  const { data: roadSigns, isLoading: isLoadingRoadSigns } =
    useGetRoadSignsQuery(queryParams);
  const { data: bookingData, isLoading: isLoadingBooking } =
    useGetOneBookingsQuery(id, {
      skip: !isEditMode,
    });
  const { data: customers, isLoading: isLoadingCustomers } =
    useGetCustomersQuery();
  const [addNewBooking, { isLoading: isLoadingAdd }] =
    useAddNewBookingMutation();
  const [updateBookings, { isLoading: isLoadingUpdate }] =
    useUpdateBookingsMutation();
  const [calculateReservation ,{ isLoading:isLoadingCalculateReservation}] = useCalculateReservationMutation();

  const { data: company, isFetching: isCompanyFetching } = useGetCompanyQuery();

  // Validation schema
  const validationSchema = Yup.object({
    customer_id: Yup.string().required("حقل الزبون مطلوب"),
    type: Yup.string().required("حقل نوع الحجز مطلوب"),
    start_date: Yup.string().required("حقل تاريخ البداية مطلوب"),
    end_date: Yup.string().required("حقل تاريخ النهاية مطلوب"),
    product_type: Yup.string().required("حقل نوع المنتج مطلوب"),
  });

  // Formik setup
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
          discount_type: discountValue ? parseInt(discountType) : null,
          value: discountValue ? parseInt(discountValue) : null,
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
        price_per_period: bookingData?.total_price,
        amount: {
          total_advertising_space: bookingData?.total_advertising_space,
          total_printing_space: bookingData?.total_printing_space,
        },
      });
    }
  }, [bookingData, isEditMode, isLoadingBooking]);

  // Set notes for new bookings
  useEffect(() => {
    if (!isEditMode) {
      setNotes(superAdminInfo?.user?.company?.contract_note || "");
    }
  }, [isEditMode]);

  // Update query params
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

  // Remove unavailable signs
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

  //Initial value for the notes field in case of addition booking
  useEffect(() => {
    if (!isEditMode) {
      setNotes(company?.contract_note);
    }
  }, [isCompanyFetching]);

  // Handlers
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
      showToast("success", `تم إضافة لوحة إلى السلة`);
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
        start_date: formik.values.start_date,
        end_date: formik.values.end_date,
      };
      const response = await calculateReservation(payload).unwrap();

      setCalculationResult(response);
      showToast(
        "success",
        `السعر الإجمالي: ${
          response?.price_per_period.toFixed(2) || "غير متوفر"
        }`
      );
    } catch (error) {
      showToast("error", "فشل في حساب السعر الإجمالي");
    }
  };

  const handleDiscountValueChange = (e) => {
    const value = e.target.value;
    if (discountType === "1" && calculationResult) {
      if (value <= calculationResult?.price_per_period) {
        setDiscountValue(value);
      } else {
        setDiscountValue(calculationResult?.price_per_period);
        showToast("error", "قيمة الحسم لا يمكن أن تتجاوز السعر الإجمالي");
      }
    } else if (discountType === "2") {
      if (value <= 100) {
        setDiscountValue(value);
      } else {
        setDiscountValue(calculationResult?.price_per_period);
        showToast("error", "قيمة الحسم لا يمكن أن تتجاوز 100%");
      }
    }
  };

  const calculateDiscountedPrice = useMemo(
    () => () => {
      if (!calculationResult || !discountValue)
        return calculationResult?.price_per_period;
      if (discountType === "1") {
        return calculationResult.price_per_period - parseFloat(discountValue);
      }
      return (
        calculationResult.price_per_period *
        (1 - parseFloat(discountValue) / 100)
      );
    },
    [calculationResult, discountValue, discountType]
  );

  // Context value
  const contextValue = {
    isEditMode,
    openDialog,
    setOpenDialog,
    selectedSigns,
    addedSignIds,
    calculationResult,
    showDiscount,
    setShowDiscount,
    discountType,
    setDiscountType,
    discountValue,
    setDiscountValue,
    contractDialog,
    setContractDialog,
    notes,
    setNotes,
    queryParams,
    roadSigns,
    isLoadingRoadSigns,
    bookingData,
    isLoadingBooking,
    customers,
    isLoadingCustomers,
    isLoadingAdd,
    isLoadingUpdate,
    formik,
    addToCart,
    updateSignFaces,
    removeFromCart,
    calculateTotal,
    handleDiscountValueChange,
    calculateDiscountedPrice,
    isLoadingCalculateReservation
  };

  return (
    <BookingContext.Provider value={contextValue}>
      {children}
    </BookingContext.Provider>
  );
};

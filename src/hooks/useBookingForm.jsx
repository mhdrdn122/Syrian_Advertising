import { useFormik } from "formik";
// import { useAddNewBookingMutation } from "../../../RtkQuery/Slice/Booking/BookingSlice";
// import { showToast } from "../../../utils/Notifictions/showToast";
import { validationSchema } from "../Components/Booking/AddBooking/constants";
import { useAddNewBookingMutation } from "../RtkQuery/Slice/Booking/BookingApi";
import { showToast } from "../utils/Notifictions/showToast";


export const useBookingForm = (
  setOpenDialog,
  setSelectedSigns,
  setAddedSignIds,
  setCalculationResult,
  selectedSigns
) => {
  const [addNewBooking] = useAddNewBookingMutation();

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
        const bookingData = {
          customer_id: parseInt(values.customer_id),
          type: parseInt(values.type),
          start_date: values.start_date,
          end_date: values.end_date,
          roadsigns: selectedSigns, // selectedSigns يجب أن تُمرر عبر useCart
          product_type: parseInt(values.product_type),
        };

        await addNewBooking(bookingData).unwrap();
        showToast("success", "تم إضافة الحجز بنجاح");
        resetForm();
        setSelectedSigns([]);
        setAddedSignIds(new Set());
        setCalculationResult(null);
        setOpenDialog(false);
      } catch (error) {
        showToast("error", "فشل في إضافة الحجز");
      }
    },
  });

  return formik;
};
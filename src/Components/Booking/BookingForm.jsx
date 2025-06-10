import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useGetCustomersQuery } from "../../RtkQuery/Slice/Customers/CustomersSlice";
import {
  useAddNewBookingMutation,
  useCalculateReservationMutation,
  useUpdateBookingsMutation,
  useGetOneBookingsQuery,
} from "../../RtkQuery/Slice/Booking/BookingSlice";
import { useGetRoadSignsQuery } from "../../RtkQuery/Slice/RoadSings/RoadSingsSlice";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ShoppingCart, Trash2 } from "lucide-react";
import { showToast } from "../../utils/Notifictions/showToast";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { useNavigate, useParams } from "react-router";

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

  const { data: customers, isLoading: isLoadingCustomers } =
    useGetCustomersQuery();
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
  console.log(bookingData);

  const typeOptions = [
    { value: 1, label: "دائم" },
    { value: 2, label: "مؤقت" },
  ];

  const productTypeOptions = [
    { value: 1, label: "محلي" },
    { value: 2, label: "أجنبي" },
    { value: 3, label: "كلاهما" },
  ];

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
  console.log(bookingData?.customer_id)

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
      console.log(payload);
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

  console.log(formik.values.type);

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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                الزبون
              </label>
              <Select
                onValueChange={(value) =>
                  formik.setFieldValue("customer_id", value)
                }
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
                      <SelectItem
                        key={customer.id}
                        value={customer.id.toString()}
                      >
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
                    <SelectItem
                      key={option.value}
                      value={option.value.toString()}
                    >
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
                onValueChange={(value) =>
                  formik.setFieldValue("product_type", value)
                }
                value={bookingData?.product_type.toString()}
                onBlur={() => formik.setFieldTouched("product_type", true)}
              >
                <SelectTrigger className="w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-right">
                  <SelectValue placeholder="اختر نوع المنتج" />
                </SelectTrigger>
                <SelectContent>
                  {productTypeOptions.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value.toString()}
                    >
                      
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

          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
              اللوحات الطرقية
            </h2>
            <div className="rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-100 dark:bg-gray-800">
                    <TableHead className="text-right">نموذج</TableHead>
                    <TableHead className="text-right">عدد الأوجه</TableHead>
                    <TableHead className="text-right">
                      عدد الأوجه المحجوزة
                    </TableHead>
                    <TableHead className="text-right">عدد الأمتار</TableHead>
                    <TableHead className="text-right">القياس</TableHead>
                    <TableHead className="text-right">المنطقة</TableHead>
                    <TableHead className="text-right">مكان التموضع</TableHead>
                    <TableHead className="text-right">الاتجاه</TableHead>
                    <TableHead className="text-right">الحالة</TableHead>
                    <TableHead className="text-right">إجراء</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoadingRoadSigns ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-4">
                        جاري التحميل...
                      </TableCell>
                    </TableRow>
                  ) : roadSigns?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-4">
                        لا توجد لوحات متوفرة لهذه الفترة
                      </TableCell>
                    </TableRow>
                  ) : (
                    roadSigns?.map((sign) => (
                      <TableRow
                        key={sign.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <TableCell className="truncate max-w-[120px] sm:max-w-[150px]">
                          {sign.template.model}
                        </TableCell>
                        <TableCell>{sign.faces_number}</TableCell>
                        <TableCell>{sign.total_faces_on_date}</TableCell>
                        <TableCell>{sign.advertising_meters}</TableCell>
                        <TableCell>{sign.template.size}</TableCell>
                        <TableCell className="truncate max-w-[120px] sm:max-w-[150px]">
                          {sign.region.name}
                        </TableCell>
                        <TableCell className="truncate max-w-[120px] sm:max-w-[150px]">
                          {sign.place}
                        </TableCell>
                        <TableCell className="truncate max-w-[120px] sm:max-w-[150px]">
                          {sign.directions}
                        </TableCell>
                        <TableCell>
                          {sign.faces_number - sign.total_faces_on_date === 0
                            ? "لا يوجد أي أوجه متاحة"
                            : `${
                                sign.faces_number - sign.total_faces_on_date
                              } وجه متاح`}
                        </TableCell>
                        <TableCell>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => addToCart(sign)}
                            disabled={
                              sign.faces_number - sign.total_faces_on_date === 0
                            }
                            className={`flex items-center gap-2 ${
                              addedSignIds.has(sign.id)
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
        </form>
      )}

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent
          dir="rtl"
          className="w-full max-w-[90vw] max-w-4xl max-h-[90vh] overflow-y-auto overflow-x-hidden p-6"
        >
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100 text-right">
              سلة الحجز
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-sm">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  الزبون:
                </span>
                <span className="mt-1 text-gray-900 dark:text-gray-100 font-medium truncate">
                  {customers?.find(
                    (c) => c.id === parseInt(formik.values.customer_id)
                  )?.full_name || "غير محدد"}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  نوع الحجز:
                </span>
                <span className="mt-1 text-gray-900 dark:text-gray-100 font-medium">
                  {typeOptions.find(
                    (t) => t.value === parseInt(formik.values.type)
                  )?.label || "غير محدد"}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  تاريخ البداية:
                </span>
                <span className="mt-1 text-gray-900 dark:text-gray-100 font-medium">
                  {formik.values.start_date || "غير محدد"}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  تاريخ النهاية:
                </span>
                <span className="mt-1 text-gray-900 dark:text-gray-100 font-medium">
                  {formik.values.end_date || "غير محدد"}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  نوع المنتج:
                </span>
                <span className="mt-1 text-gray-900 dark:text-gray-100 font-medium">
                  {productTypeOptions.find(
                    (p) => p.value === parseInt(formik.values.product_type)
                  )?.label || "غير محدد"}
                </span>
              </div>
            </div>

            {calculationResult && (
              <div className="p-4 bg-blue-50 dark:bg-blue-900 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 text-right">
                  نتائج الحساب
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      السعر الإجمالي:
                    </span>
                    <span className="mt-1 text-gray-900 dark:text-gray-100 font-medium">
                      {calculationResult.total_price.toFixed(2)} ليرة
                    </span>
                  </div>
                  {discountValue && (
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        السعر بعد الحسم:
                      </span>
                      <span className="mt-1 text-gray-900 dark:text-gray-100 font-medium">
                        {calculateDiscountedPrice()?.toFixed(2)} ليرة
                      </span>
                    </div>
                  )}
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      مساحة الإعلان:
                    </span>
                    <span className="mt-1 text-gray-900 dark:text-gray-100 font-medium">
                      {calculationResult.total_advertising_space.toFixed(2)} متر
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      مساحة الطباعة:
                    </span>
                    <span className="mt-1 text-gray-900 dark:text-gray-100 font-medium">
                      {calculationResult.total_printing_space.toFixed(2)} متر
                    </span>
                  </div>
                </div>
                {calculationResult && (
                  <div className="mt-4">
                    <Button
                      type="button"
                      onClick={() => setShowDiscount(true)}
                      className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-2 rounded-lg"
                    >
                      إضافة حسم
                    </Button>
                    {showDiscount && (
                      <div className="mt-4 space-y-4">
                        <RadioGroup
                          value={discountType}
                          onValueChange={setDiscountType}
                          className="flex gap-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="1" id="amount" />
                            <Label htmlFor="amount">قيمة</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="2" id="percentage" />
                            <Label htmlFor="percentage">نسبة مئوية</Label>
                          </div>
                        </RadioGroup>
                        <Input
                          type="number"
                          value={discountValue}
                          onChange={handleDiscountValueChange}
                          placeholder="أدخل قيمة الحسم"
                          className="w-full text-right"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setShowDiscount(false);
                            setDiscountValue("");
                          }}
                          className="bg-red-500 hover:bg-red-600 text-white"
                        >
                          إلغاء الحسم
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            <div className="rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-100 dark:bg-gray-800">
                    <TableHead className="text-right w-auto">المنطقة</TableHead>
                    <TableHead className="text-right w-auto">المكان</TableHead>
                    <TableHead className="text-right w-20">
                      عدد الأوجه
                    </TableHead>
                    <TableHead className="text-right w-32">
                      أمتار الطباعة
                    </TableHead>
                    <TableHead className="text-right w-16">إجراء</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedSigns.map((sign) => {
                    const roadSign = roadSigns?.find(
                      (rs) => rs.id === sign.road_sign_id
                    );
                    return (
                      <TableRow
                        key={sign.road_sign_id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <TableCell className="truncate max-w-[120px] sm:max-w-[150px]">
                          {roadSign?.region.name}
                        </TableCell>
                        <TableCell className="truncate max-w-[120px] sm:max-w-[150px]">
                          {roadSign?.place}
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="1"
                            max={
                              roadSign
                                ? roadSign.faces_number -
                                  roadSign.total_faces_on_date
                                : 1
                            }
                            value={sign.booking_faces}
                            onChange={(e) =>
                              updateSignFaces(sign.road_sign_id, e.target.value)
                            }
                            className="w-16 text-right"
                          />
                        </TableCell>
                        <TableCell>
                          {roadSign?.printing_meters || "غير متوفر"}
                        </TableCell>
                        <TableCell>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => removeFromCart(sign.road_sign_id)}
                            className="bg-red-500 hover:bg-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
          <DialogFooter className="flex justify-between mt-6 flex-wrap gap-2">
            <Button
              type="button"
              onClick={calculateTotal}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
            >
              حساب السعر الإجمالي
            </Button>
            {formik.values.type && (
              <Button
                type="button"
                onClick={() => setContractDialog(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg"
              >
                {parseInt(formik.values.type) === 1
                  ? "تصدير عقد دائم"
                  : "تصدير عقد مؤقت"}
              </Button>
            )}
            <Button
              type="button"
              onClick={formik.submitForm}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
            >
              {isEditMode ? "تعديل الحجز" : "تثبيت الحجز"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={contractDialog} onOpenChange={setContractDialog}>
        <DialogContent dir="rtl" className="w-full max-w-[90vw] max-w-md p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100 text-right">
              {parseInt(formik.values.type) === 1
                ? "تصدير عقد دائم"
                : "تصدير عقد مؤقت"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              الملاحظات
            </label>
            <ReactQuill
              theme="snow"
              value={notes}
              onChange={setNotes}
              directions="rtl"
              className="w-full text-right dark:text-gray-200"
              placeholder="أدخل الملاحظات هنا..."
            />
          </div>
          <DialogFooter className="mt-6">
            <Button
              type="button"
              onClick={() => setContractDialog(false)}
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg"
            >
              إلغاء
            </Button>
            <Button
              type="button"
              onClick={formik.submitForm}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
            >
              تأكيد
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BookingForm;

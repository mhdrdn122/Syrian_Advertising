import { useState, useEffect } from "react";
// import { useCalculateReservationMutation } from "../../../RtkQuery/Slice/Booking/BookingSlice";
// import { showToast } from "../../../utils/Notifictions/showToast";
import { useCalculateReservationMutation } from "../RtkQuery/Slice/Booking/BookingSlice";
import { showToast } from "../utils/Notifictions/showToast";

export const useCart = (
  roadSigns,
  formik,
  selectedSigns,
  setSelectedSigns,
  addedSignIds,
  setAddedSignIds,
  calculationResult,
  setCalculationResult
) => {
  const [calculateReservation] = useCalculateReservationMutation();

  // Remove unavailable signs from cart when roadSigns change
  useEffect(() => {
    if (roadSigns && selectedSigns.length > 0) {
      const availableSignIds = new Set(roadSigns.map((sign) => sign.id));
      const unavailableSigns = selectedSigns.filter(
        (sign) => !availableSignIds.has(sign.road_sign_id)
      );
      if (unavailableSigns.length > 0) {
        setSelectedSigns(
          selectedSigns.filter((sign) => availableSignIds.has(sign.road_sign_id))
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
  }, [roadSigns, selectedSigns, setSelectedSigns, setAddedSignIds]);

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
      new Set([...addedSignIds].filter((id) => road_sign_id !== id))
    );
    setCalculationResult(null);
    showToast("success", "تم إزالة اللوحة من السلة");
  };

  console.log(formik.values)
  const calculateTotal = async () => {
    try {
      const payload = {
        product_type: parseInt(formik.values.product_type),
        roadsign_ids: selectedSigns.map((sign) => sign.road_sign_id),
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

  return {
    selectedSigns,
    setSelectedSigns,
    addedSignIds,
    setAddedSignIds,
    calculationResult,
    setCalculationResult,
    addToCart,
    updateSignFaces,
    removeFromCart,
    calculateTotal,
  };
};
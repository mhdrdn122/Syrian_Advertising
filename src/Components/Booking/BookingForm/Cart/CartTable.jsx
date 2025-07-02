import React, { memo, useContext } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { BookingContext } from "../../../../Context/BookingContext";
import { showToast } from "../../../../utils/Notifictions/showToast";
import { Toaster } from "react-hot-toast";

// قائمة ألوان لكل road_sign_id
const colorPalette = [
  "bg-blue-100 dark:bg-blue-900",
  "bg-green-100 dark:bg-green-900",
  "bg-yellow-100 dark:bg-yellow-900",
  "bg-red-100 dark:bg-red-900",
  "bg-purple-100 dark:bg-purple-900",
  "bg-pink-100 dark:bg-pink-900",
  "bg-indigo-100 dark:bg-indigo-900",
  "bg-teal-100 dark:bg-teal-900",
];

const CartTable = () => {
  const {
    selectedSigns,
    roadSigns,
    updateSignFaces,
    removeFromCart,
    isEditMode,
    bookingData,
    formik
  } = useContext(BookingContext);

  // تخصيص لون لكل road_sign_id
  const getSignColor = (roadSignId) => {
    const index = roadSignId % colorPalette.length;
    return colorPalette[index];
  };

  const getMaxAvailablePanels = (sign, startDate, endDate) => {
    const roadSign = roadSigns?.find((rs) => rs.id === sign.road_sign_id);
    if (!roadSign || !startDate || !endDate) return 0;

    let maxPanels = roadSign.panels_number;
    for (const range of roadSign.available_date_ranges) {
      const rangeStart = new Date(range.start_date);
      const rangeEnd = new Date(range.end_date);
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (
        (start >= rangeStart && start <= rangeEnd) ||
        (end >= rangeStart && end <= rangeEnd) ||
        (start <= rangeStart && end >= rangeEnd)
      ) {
        maxPanels = Math.min(maxPanels, range.available_panels);
      }
    }

    for (const booked of roadSign.booking_dates) {
      const bookedStart = new Date(booked.start_date);
      const bookedEnd = new Date(booked.end_date);
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (
        (start >= bookedStart && start <= bookedEnd) ||
        (end >= bookedStart && end <= bookedEnd) ||
        (start <= bookedStart && end >= bookedEnd)
      ) {
        maxPanels = 0; // غير متاح إذا كان هناك تعارض
      }
    }

    // في وضع التعديل، أضف عدد اللوحات المحجوزة سابقًا لهذه اللوحة
    if (isEditMode) {
      const existingBooking = bookingData?.roadsigns.find(
        (rs) =>
          rs.id === sign.road_sign_id &&
          rs.pivot.start_date === startDate &&
          rs.pivot.end_date === endDate
      );
      if (existingBooking) {
        maxPanels += existingBooking.pivot.number_of_reserved_panels;
      }
    }

    return maxPanels;
  };

  const validateDateRange = (sign, startDate, endDate, rangeIndex) => {
    const roadSign = roadSigns?.find((rs) => rs.id === sign.road_sign_id);
    if (!roadSign || !startDate || !endDate) return false;

    const start = new Date(startDate);
    const end = new Date(endDate);
    if (start >= end) return false;
    console.log(roadSign.booking_dates)
    console.log(roadSign.available_date_ranges)

    // التحقق من عدم التعارض مع التواريخ المحجوزة
    // for (const booked of roadSign.booking_dates) {
    //   const bookedStart = new Date(booked.start_date);
    //   const bookedEnd = new Date(booked.end_date);
    //   if (
    //     (start >= bookedStart && start <= bookedEnd) ||
    //     (end >= bookedStart && end <= bookedEnd) 
    //     // (start <= bookedStart && end >= bookedEnd)
    //   ) {
    //     // استثناء التواريخ المحجوزة في وضع التعديل إذا كانت لنفس المدى
    //     if (
    //       isEditMode &&
    //       bookingData?.roadsigns.some(
    //         (rs) =>
    //           rs.id === sign.road_sign_id &&
    //           rs.pivot.start_date === startDate &&
    //           rs.pivot.end_date === endDate
    //       )
    //     ) {
    //       continue;
    //     }
    //     return false;
    //   }
    // }

    // التحقق من أن التواريخ ضمن النطاقات المتاحة
    let isWithinAvailableRange = false;
    for (const range of roadSign.available_date_ranges) {
      const rangeStart = new Date(range.start_date);
      const rangeEnd = new Date(range.end_date);
//     console.log(start )
//     console.log(end )
//     console.log("=====================" )
// console.log(rangeStart )
//     console.log(rangeEnd )


      if (start >= rangeStart || end <= rangeEnd) {
    console.log("=====================" )

        isWithinAvailableRange = true;
        break;
      }
    }

    return isWithinAvailableRange;
  };

  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-gray-100 dark:bg-gray-800">
          <TableHead className="text-right w-auto">رمز النموذج</TableHead>
          <TableHead className="text-right w-auto">المنطقة</TableHead>
          <TableHead className="text-right w-auto">المكان</TableHead>
          <TableHead className="text-right w-auto">تاريخ البداية</TableHead>
          <TableHead className="text-right w-auto">تاريخ النهاية</TableHead>
          <TableHead className="text-right w-20">عدد اللوحات المطلوب</TableHead>
          <TableHead className="text-right w-20">عدد اللوحات المتاحة</TableHead>
          <TableHead className="text-right w-32">أمتار الطباعة</TableHead>
          <TableHead className="text-right w-16">إجراء</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {selectedSigns.flatMap((sign) =>
          sign.dateRanges.map((range, index) => {
            const roadSign = roadSigns?.find((rs) => rs.id === sign.road_sign_id);
            const maxPanels = getMaxAvailablePanels(sign, range.startDate, range.endDate);
            const rowColor = getSignColor(sign.road_sign_id);

            console.log(roadSign)
            return (
              <TableRow
                key={`${sign.road_sign_id}-${index}`}
                className={`hover:bg-gray-50 dark:hover:bg-gray-700 ${rowColor}`}
              >
                <TableCell className={`truncate max-w-[120px] sm:max-w-[150px] ${rowColor}`}>
                  {roadSign?.template.model || "غير متوفر"}
                </TableCell>
                <TableCell className={`truncate max-w-[120px] sm:max-w-[150px] ${rowColor}`}>
                  {roadSign?.region.name || "غير متوفر"}
                </TableCell>
                <TableCell className={`truncate max-w-[120px] sm:max-w-[150px] ${rowColor}`}>
                  {roadSign?.place || "غير متوفر"}
                </TableCell>
                <TableCell>
                  <Input
                    type="date"
                    value={range.startDate}
                    onChange={(e) => {
                      if (validateDateRange(sign, e.target.value, range.endDate, index)) {
                        updateSignFaces(sign.road_sign_id, index, range.booking_faces, e.target.value, range.endDate);
                      } else {
                        showToast("error","تاريخ البداية غير صالح أو يتعارض مع الحجوزات الحالية");
                      }
                    }}
                    className={`w-full p-2 border border-gray-300 dark:bg-gray-900 rounded-md text-right ${rowColor}`}
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="date"
                    value={range.endDate}
                    onChange={(e) => {
                      if (validateDateRange(sign, range.startDate, e.target.value, index)) {
                        updateSignFaces(sign.road_sign_id, index, range.booking_faces, range.startDate, e.target.value);
                      } else {
                        showToast("error","تاريخ النهاية غير صالح أو يتعارض مع الحجوزات الحالية");
                      }
                    }}
                    className={`w-full p-2 border border-gray-300 dark:bg-gray-900 rounded-md text-right ${rowColor}`}
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    min="1"
                    max={maxPanels}
                    value={range.booking_faces}
                    onChange={(e) =>
                      updateSignFaces(sign.road_sign_id, index, e.target.value, range.startDate, range.endDate)
                    }
                    className={`w-16 text-right ${rowColor}`}
                  />
                </TableCell>
                <TableCell className={rowColor}>{maxPanels || "0"}</TableCell>
                <TableCell className={rowColor}>
                  {roadSign?.template?.printing_space || "غير متوفر"}
                </TableCell>
                <TableCell>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeFromCart(sign.road_sign_id, index)}
                    className="bg-red-500 hover:bg-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })
        )}
      </TableBody>
      <Toaster />
    </Table>
  );
};

export default memo(CartTable);
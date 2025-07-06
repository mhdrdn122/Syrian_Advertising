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
  } = useContext(BookingContext);

  const getSignColor = (roadSignId) => {
    const index = roadSignId % colorPalette.length;
    return colorPalette[index];
  };

  const getDatesInRange = (startDate, endDate) => {
    const dates = [];
    let currentDate = new Date(startDate);
    const end = new Date(endDate);

    while (currentDate <= end) {
      dates.push(currentDate.toDateString()); 
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  };

  const getMaxAvailablePanels = (sign, startDate, endDate , rangeIndex ) => {
    const roadSign = roadSigns?.find((rs) => rs.id === sign.road_sign_id);
    if (!roadSign || !startDate || !endDate) return 0;

    let maxPanels = roadSign.panels_number;
    
    const start = new Date(startDate);
    const end = new Date(endDate); // نهاية الفترة المطلوبة

    // حساب اللوحات المتاحة بناءً على available_date_ranges
    // يجب أن تكون هذه اللوحات المتاحة هي الحد الأقصى لأي فترة تتداخل معها
    // هذه العملية معقدة وقد تتطلب منطقًا أكثر تفصيلاً إذا كانت اللوحات تختلف لكل نطاق متاح
    // حاليا، إذا تداخلت الفترة مع نطاق متاح، يتم تقليل maxPanels
    // هذا الجزء من الكود قد يحتاج لمراجعة إضافية إذا كانت available_panels تختلف عبر النطاقات
    for (const range of roadSign.available_date_ranges) {
        const rangeStart = new Date(range.start_date);
        const rangeEnd = new Date(range.end_date);
        
        // إذا كان هناك تداخل بين الفترة المطلوبة والنطاق المتاح
        if ((start <= rangeEnd && end >= rangeStart)) {
            maxPanels = Math.min(maxPanels, range.available_panels);
        }
    }

    // التحقق من التعارض مع التواريخ المحجوزة وتقليل اللوحات إلى 0 إذا كان هناك تعارض غير مستثنى
    for (const booked of roadSign.booking_dates) {
      const bookedStart = new Date(booked.start_date);
      const bookedEnd = new Date(booked.end_date);

      // إذا كان هناك تداخل (نفس شروط validateDateRange)
      if (
        (start >= bookedStart && start < bookedEnd) ||
        (end > bookedStart && end <= bookedEnd) ||
        (start <= bookedStart && end >= bookedEnd)
      ) {
        // استثناء الحجز الأصلي في وضع التعديل
        const currentBookedSignInEditMode = isEditMode && bookingData?.roadsigns.some(rs => 
            rs.id === sign.road_sign_id && 
            new Date(rs.pivot.start_date).getTime() === bookedStart.getTime() && 
            new Date(rs.pivot.end_date).getTime() === bookedEnd.getTime()
        );

        if (!currentBookedSignInEditMode) {
          maxPanels = 0; // غير متاح إذا كان هناك تعارض ولم يكن الحجز الأصلي
          break; // لا داعي للتحقق من باقي الحجوزات
        }
      }
    }

    // في وضع التعديل، أضف عدد اللوحات المحجوزة سابقًا لهذه اللوحة
    if (isEditMode) {
      const existingBooking = bookingData?.roadsigns.find(
        (rs) =>
          rs.id === sign.road_sign_id &&
          // تأكد من أن هذه المقارنات تستخدم تواريخ الحجز الأصلي في bookingData
          // وليس تواريخ الفترة الجديدة (startDate, endDate)
          new Date(rs.pivot?.start_date).toDateString() === new Date(sign.dateRanges[rangeIndex]?.startDate).toDateString() &&
          new Date(rs.pivot.end_date).toDateString() === new Date(sign.dateRanges[rangeIndex].endDate).toDateString()
      );
      if (existingBooking) {
        maxPanels += existingBooking.pivot.number_of_reserved_panels;
      }
    }

    return maxPanels;
  };

  const validateDateRange = (sign, newStartDate, newEndDate, rangeIndex) => {
    const roadSign = roadSigns?.find((rs) => rs.id === sign.road_sign_id);
    if (!roadSign || !newStartDate || !newEndDate) {
      showToast("error", "الرجاء تحديد تاريخ بداية ونهاية.");
      return false;
    }

    const start = new Date(newStartDate);
    const end = new Date(newEndDate);

    // التحقق من أن تاريخ البداية لا يأتي بعد تاريخ النهاية
    if (start.getTime() > end.getTime()) {
      showToast("error", "تاريخ البداية يجب أن يكون قبل أو يساوي تاريخ النهاية.");
      return false;
    }

    // التحقق من عدم التعارض مع التواريخ المحجوزة
    for (const booked of roadSign.booking_dates) {
      const bookedStart = new Date(booked.start_date);
      const bookedEnd = new Date(booked.end_date);

      // الشرط هنا: إذا كان الحجز الحالي (booked) هو نفسه الحجز الأصلي الذي يتم تعديله، تجاهله.
      // نستخدم تواريخ الحجز في 'booked' للمقارنة مع 'bookingData' لأنه يمثل حالة الحجز الفعلية.
      const isCurrentBookingOriginal = isEditMode && bookingData?.roadsigns.some(rs => 
        rs.id === sign.road_sign_id && 
        new Date(rs.pivot.start_date).getTime() === bookedStart.getTime() && 
        new Date(rs.pivot.end_date).getTime() === bookedEnd.getTime()
      );

      if (isCurrentBookingOriginal) {
        continue; // تجاهل هذا التداخل لأنه الحجز الأصلي نفسه الذي يتم تعديله
      }

      // شروط التداخل العامة (مع مراعاة أن التواريخ قد تكون شاملة)
      // إذا كانت الفترة الجديدة تبدأ ضمن فترة محجوزة (اليوم الأخير غير مشمول لـ bookedEnd)
      // أو الفترة الجديدة تنتهي ضمن فترة محجوزة (اليوم الأول غير مشمول لـ bookedStart)
      // أو الفترة الجديدة تغطي الفترة المحجوزة بالكامل
      if (
        (start >= bookedStart && start < bookedEnd) ||
        (end > bookedStart && end <= bookedEnd) ||
        (start <= bookedStart && end >= bookedEnd)
      ) {
        showToast("error", `تاريخ الحجز يتعارض مع حجز موجود من ${booked.start_date} إلى ${booked.end_date}.`);
        return false;
      }
    }

    // التحقق من أن الفترة المطلوبة تقع بالكامل ضمن النطاقات المتاحة
    let isCoveredByAvailableRanges = false;
    
    // نجمع كل الأيام المتاحة من جميع النطاقات في Set
    const availableDatesSet = new Set();
    for (const range of roadSign.available_date_ranges) {
      // نستخدم getDatesInRange لجمع كل الأيام بين start_date و end_date
      getDatesInRange(range.start_date, range.end_date).forEach(date => availableDatesSet.add(date));
    }

    // نتحقق مما إذا كان كل يوم في الفترة المطلوبة موجودًا في الـ availableDatesSet
    let currentCheckDate = new Date(newStartDate);
    const finalEndDateInclusive = new Date(newEndDate); // النهاية شاملة

    isCoveredByAvailableRanges = true; // نفترض أنها متاحة حتى نجد يومًا غير متاح
    while (currentCheckDate <= finalEndDateInclusive) {
      if (!availableDatesSet.has(currentCheckDate.toDateString())) {
        isCoveredByAvailableRanges = false;
        break;
      }
      currentCheckDate.setDate(currentCheckDate.getDate() + 1);
    }

    if (!isCoveredByAvailableRanges) {
      showToast("error", "الفترة المطلوبة غير متاحة بالكامل ضمن النطاقات المعلنة.");
      return false;
    }

    // إذا وصلت إلى هنا، فالفترة صالحة ومتاحة
    return true;
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
          {/* <TableHead className="text-right w-20">عدد اللوحات المتاحة</TableHead> */}
          {/* <TableHead className="text-right w-32">أمتار الطباعة</TableHead> */}
          <TableHead className="text-right w-16">إجراء</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {selectedSigns.flatMap((sign) =>
          sign.dateRanges.map((range, index) => {
            const roadSign = roadSigns?.find(
              (rs) => rs.id === sign.road_sign_id
            );
            const maxPanels = getMaxAvailablePanels(
              sign,
              range.startDate,
              range.endDate
            );
            const rowColor = getSignColor(sign.road_sign_id);

            return (
              <TableRow
                key={`${sign.road_sign_id}-${index}`}
                className={`hover:bg-gray-50 dark:hover:bg-gray-700 ${rowColor}`}
              >
                <TableCell
                  className={`truncate max-w-[120px] sm:max-w-[150px] ${rowColor}`}
                >
                  {roadSign?.template.model || "غير متوفر"}
                </TableCell>
                <TableCell
                  className={`truncate max-w-[120px] sm:max-w-[150px] ${rowColor}`}
                >
                  {roadSign?.region.name || "غير متوفر"}
                </TableCell>
                <TableCell
                  className={`truncate max-w-[120px] sm:max-w-[150px] ${rowColor}`}
                >
                  {roadSign?.place || "غير متوفر"}
                </TableCell>
                <TableCell>
                  <Input
                    type="date"
                    value={range.startDate}
                    onChange={(e) => {
                      if (
                        validateDateRange(
                          sign,
                          e.target.value, // تاريخ البداية المعدّل
                          range.endDate, // تاريخ النهاية الأصلي للفترة الحالية
                          index
                        )
                      ) {
                        updateSignFaces(sign.road_sign_id, index, {
                          booking_faces: range.booking_faces,
                          startDate: e.target.value,
                          endDate: range.endDate,
                        });
                      } else {
                        // showToast يتم استدعاؤه داخل validateDateRange
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
                      if (
                        validateDateRange(
                          sign,
                          range.startDate, // تاريخ البداية الأصلي للفترة الحالية
                          e.target.value, // تاريخ النهاية المعدّل
                          index
                        )
                      ) {
                        updateSignFaces(sign.road_sign_id, index, {
                          booking_faces: range.booking_faces,
                          startDate: range.startDate,
                          endDate: e.target.value,
                        });
                      } else {
                        // showToast يتم استدعاؤه داخل validateDateRange
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
                      updateSignFaces(sign.road_sign_id, index, {
                        booking_faces: parseInt(e.target.value) || 1,
                        startDate: range.startDate,
                        endDate: range.endDate,
                      })
                    }
                    className={`w-16 text-right ${rowColor}`}
                  />
                </TableCell>
               {/* <TableCell className={rowColor}>{maxPanels || "0"}</TableCell>*/}
                {/* <TableCell className={rowColor}>
                  {roadSign?.template?.printing_space || "غير متوفر"}
                </TableCell> */}
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
import { useState } from "react";
import { DynamicTable } from "../../utils/Tables/DynamicTable";
import {
  useGetBookingQuery,
} from "../../RtkQuery/Slice/Booking/BookingApi";
import { BookingColumns } from "../../utils/Tables/ColumnsTable/BookingColumns";
import { useNavigate } from "react-router";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import DialogShow from "../../utils/Dialogs/DialogShow/DialogShow";

// Mapping for ProductType enum
const productTypeMap = {
  1: 'محلي',
  2: 'أجنبي',
  3: 'كلاهما',
};

const BookingContainer = () => {
  const [open, setOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const { data, isLoading } = useGetBookingQuery();

  const navigate = useNavigate();

  const bookingFields = [
    { label: 'النوع', key: 'type', icon: 'mdi:format-list-bulleted-type', format: (value) => productTypeMap[value] || 'غير معروف' },
    { label: 'تاريخ البدء', key: 'start_date', icon: 'mdi:calendar-start', format: (value) => format(new Date(value), 'MMM dd, yyyy') },
    { label: 'تاريخ الانتهاء', key: 'end_date', icon: 'mdi:calendar-end', format: (value) => format(new Date(value), 'MMM dd, yyyy') },
    { label: 'إجمالي مساحة الإعلان', key: 'total_advertising_space', icon: 'mdi:image-area', format: (value) => `${value}m²` },
    { label: 'إجمالي مساحة الطباعة', key: 'total_printing_space', icon: 'mdi:printer', format: (value) => `${value}m²` },
    { label: 'السعر الإجمالي', key: 'total_price', icon: 'mdi:currency-usd', format: (value) => `$${value}` },
    { label: 'اسم المستخدم', key: 'user.full_name', icon: 'mdi:account' },
    { label: 'بريد المستخدم', key: 'user.email', icon: 'mdi:email' },
    { label: 'اسم الزبون', key: 'customer.full_name', icon: 'mdi:account-outline' },
    { label: 'اسم الشركة', key: 'customer.company_name', icon: 'mdi:office-building' },
  ];

  const roadSignFields = [
    { label: 'معرف النموذج', key: 'template_id', icon: 'mdi:shape-outline' },
    { label: 'المكان', key: 'place', icon: 'mdi:map-marker' },
    { label: 'عدد الأوجه', key: 'faces_number', icon: 'mdi:cube-outline' },
    { label: 'أوجه الحجز', key: 'pivot.booking_faces', icon: 'mdi:checkbox-marked-outline' },
    { label: 'مساحة الإعلان', key: 'advertising_meters', icon: 'mdi:image-area', format: (value) => `${value}m²` },
    { label: 'مساحة الطباعة', key: 'printing_meters', icon: 'mdi:printer', format: (value) => `${value}m²` },
    { label: 'الاتجاه', key: 'directions', icon: 'mdi:compass' },
  ];

  const onShow = (row) => {
    console.log('Selected booking:', row); // Debug data
    navigate(`/dashboard/booking/${row.id}`)
    setSelectedBooking(row);
    // setOpen(true);
  };

  const onEdit = (row) => {
    navigate(`/dashboard/booking/edit/${row.id}`)

  };

 

  return (
    <div className="p-4 sm:p-6 w-full mx-auto space-y-6 overflow-x-auto">
      <div className="flex my-6 px-3 flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2">
          <Icon icon="mdi:template" className="text-blue-500" />
          {"الحجوزات"}
        </h1>
        <Button
          onClick={() => navigate("/dashboard/booking/add")}
          className="gap-2 text-sm sm:text-base"
        >
          <Icon icon="mdi:plus" />
          {"إضافة حجز"}
        </Button>
      </div>
      <DynamicTable
        data={data || []}
        columns={BookingColumns}
        isLoading={isLoading}
        onShow={onShow}
        onEdit={onEdit}
      />
     
      <DialogShow
        data={selectedBooking}
        show={open}
        fields={bookingFields}
        arrayKey="roadsigns"
        arrayFields={roadSignFields}
        handleClose={() => {
          setOpen(false);
          setSelectedBooking(null);
        }}
        loading={isLoading}
      />
    </div>
  );
};

export default BookingContainer;
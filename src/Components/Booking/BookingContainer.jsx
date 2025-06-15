import { DynamicTable } from "../../utils/Tables/DynamicTable";
import {
  useGetBookingQuery,
} from "../../RtkQuery/Slice/Booking/BookingApi";
import { BookingColumns } from "../../utils/Tables/ColumnsTable/BookingColumns";
import { useNavigate } from "react-router";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";


const BookingContainer = () => {
  const { data, isLoading } = useGetBookingQuery();
  const navigate = useNavigate(); 

  const onShow = (row) => {
    navigate(`/dashboard/booking/${row.id}`)
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
    </div>
  );
};

export default BookingContainer;
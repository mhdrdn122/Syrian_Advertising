import { DynamicTable } from "../../utils/Tables/DynamicTable";
import {
  useCancelBookingMutation,
  useDeleteBookingMutation,
  useGetBookingQuery,
} from "../../RtkQuery/Slice/Booking/BookingApi";
import { BookingColumns } from "../../utils/Tables/ColumnsTable/BookingColumns";
import { useNavigate } from "react-router";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { useAuth } from "../../Context/AuthProvider";
import { Permissions } from "../../Static/StaticData";
import { DeleteDialog } from "../../utils/Dialogs/DeleteDialog/DeleteDialog";
import { useState } from "react";
import { showToast } from "../../utils/Notifictions/showToast";

const BookingContainer = () => {
  const { data, isLoading } = useGetBookingQuery();
  const navigate = useNavigate();
  const { hasPermission } = useAuth();
  const [openDelete, setOpenDelete] = useState(false);
  const [openCancelBooking, setOpenCancelBooking] = useState(false);

  const [selectBooking, setSelectBooking] = useState();

  const [deleteBooking, { isLoading: isLoadingDelete }] =
    useDeleteBookingMutation();

  const [cancelBooking, { isLoading: isLoadingCancel }] =
    useCancelBookingMutation();

  const handleDelete = (row) => {
    if (!row) {
      console.error("No row data provided for edit");
      return;
    }
    setSelectBooking(row);
    setOpenDelete(true);
  };

  const onCancelBooking = (row) => {
    setSelectBooking(row);
    setOpenCancelBooking(true);
  };

  const handelCancelBooking = async () => {
    try {
      await cancelBooking(selectBooking?.id).unwrap();
      showToast("success", "تم إيقاف الطلب بنجاح");
    } catch (err) {
      showToast("error", err.data?.message || "خطأ غير معروف");
    }
    setOpenCancelBooking(false);
  };

  const onConfirmDelete = async () => {
    try {
      await deleteBooking(selectBooking?.id).unwrap();
      showToast("success", "تم حذف الحجز بنجاح");
    } catch (err) {
      showToast("error", err.data.message);
    }
    setOpenDelete(false);
  };
  const permissions = {
    show: Permissions.ViewBookings,
    edit: Permissions.EditBookings,
    delete: Permissions.DeleteBookings,
    unConfirm: Permissions.EditBookings,
    
  };

  return (
    <div className="p-4 sm:p-6 w-full mx-auto space-y-6 overflow-x-auto">
      <div className="flex my-6 px-3 flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2">
          <Icon icon="mdi:template" className="text-blue-500" />
          {"الحجوزات"}
        </h1>
        {hasPermission(Permissions.CreateBookings) && (
          <Button
            onClick={() => navigate("/dashboard/booking/add")}
            className="gap-2 text-sm sm:text-base"
          >
            <Icon icon="mdi:plus" />
            {"إضافة حجز"}
          </Button>
        )}
      </div>
      <DynamicTable
        data={data || []}
        columns={BookingColumns}
        isLoading={isLoading}
        onShow={(row) => navigate(`/dashboard/booking/${row.id}`)}
        onEditBooking={(row) => navigate(`/dashboard/booking/edit/${row.id}`)}
        permissions={permissions}
        onDeleteBooking={handleDelete}
        onUnconfirmOrder={onCancelBooking}
      />

      <DeleteDialog
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={onConfirmDelete}
        loading={isLoadingDelete}
      />

      <DeleteDialog
        open={openCancelBooking}
        onClose={() => setOpenCancelBooking(false)}
        title={"إيقاف الحجز"}
        description="هل تريد تأكيد العملية"
        confirmText="نعم"
        titleLoading="جاري التأكيد"
        onConfirm={handelCancelBooking}
        loading={isLoadingCancel}
      />
    </div>
  );
};

export default BookingContainer;

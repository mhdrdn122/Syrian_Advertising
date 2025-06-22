import { useState } from "react";
import { DynamicTable } from "../../utils/Tables/DynamicTable";
import HeaderComponent from "../../utils/HeaderComponent";
import { PaymentsColumns } from "../../utils/Tables/ColumnsTable/PaymentsColumns";
import { DialogAddPayments } from "../../utils/Dialogs/EditAddDialog/Add/DialogAddPayments";
import {
  useConfirmOnePaymentMutation,
  useGetPaymentsQuery,
} from "../../RtkQuery/Slice/Payments/PaymentsApi";
import { ViewImageDialog } from "./ViewImageDialog";
import InvoicePdf from "./InvoicePdf";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DeleteDialog } from "../../utils/Dialogs/DeleteDialog/DeleteDialog";
import { showToast } from "../../utils/Notifictions/showToast";
import { Permissions } from "../../Static/StaticData";

const PaymentsContainer = () => {
  const [openAdd, setOpenAdd] = useState(false);
  const [openViewImage, setOpenViewImage] = useState(false);
  const [confirmPayment, { isLoading: isLoadingConfirm }] =
    useConfirmOnePaymentMutation();

  const [selectedPayment, setSelectedPayment] = useState(null);
  const { data: payments, isLoading: isLoadingPayments } =
    useGetPaymentsQuery();
  const {
    data: paymentIsNotReceived,
    isLoading: isLoadingPaymentsNotReceived,
  } = useGetPaymentsQuery({ is_received: false });

  const { data: paymentIsReceived, isLoading: isLoadingPaymentsReceived } =
    useGetPaymentsQuery({ is_received: true });


  const [activeTab, setActiveTab] = useState("payments");

  const [openConfirm, setOpenConfirm] = useState(false);
  const [isConfirmAction, setIsConfirmAction] = useState(true);

  const onShow = (row) => {
    setSelectedPayment(row);
    setOpenViewImage(true);
  };

 
  const onConfirmPayment = (row) => {
    setSelectedPayment(row);
    setIsConfirmAction(true);
    setOpenConfirm(true);
  };

  const handleConfirm = async () => {
    try {
      await confirmPayment(selectedPayment.id).unwrap();
      showToast(
        "success",
        isConfirmAction ? "تم تأكيد الطلب بنجاح" : "تم إلغاء تأكيد الطلب بنجاح"
      );
    } catch (err) {
      showToast(
        "error",
        `حدث خطأ أثناء ${isConfirmAction ? "تأكيد" : "إلغاء تأكيد"} الطلب: ${
          err.data?.message || "خطأ غير معروف"
        }`
      );
    }
    setOpenConfirm(false);
  };

  const dataInvoicePdf = {
    payments: payments,
  };

  const permissions = {
    confirm: Permissions.EditPayments,
    show: Permissions.ViewPayments,
  };

  return (
    <>
      {/* Tabs for switching between payments and unbooked signs */}
      <Tabs
        dir="rtl"
        defaultValue="payments"
        onValueChange={setActiveTab}
        className="w-full p-4 "
      >
        <TabsList className="grid w-full   grid-cols-3 bg-card rounded-lg border border-border">
          <TabsTrigger
            value="payments"
            className=" text-xs md:text-sm font-medium"
          >
            جميع الدفعات
          </TabsTrigger>
          <TabsTrigger
            value="received"
            className="text-xs md:text-sm font-medium"
          >
            الدفعات المستلمة
          </TabsTrigger>
          <TabsTrigger
            value="not-received"
            className="text-xs md:text-sm font-medium"
          >
            الدفعات غير المستلمة
          </TabsTrigger>
        </TabsList>

        <TabsContent value="payments">
          <div className=" p-0 w-full mx-auto space-y-6 overflow-x-auto">
            <HeaderComponent
              title={"المدفوعات"}
              titleBtn={"إضافة دفعة"}
              setShow={setOpenAdd}
              permission={Permissions.CreatePayments}
            />
            <InvoicePdf
              customer={dataInvoicePdf}
              showCustomerTable={false}
              showCustomerPaymentsTable={true}
            />
            <DynamicTable
              data={payments || []}
              columns={PaymentsColumns}
              isLoading={isLoadingPayments}
              onShow={onShow}
              permissions={permissions}
            />

            <DialogAddPayments
              show={openAdd}
              handleClose={() => setOpenAdd(false)}
            />

            <ViewImageDialog
              show={openViewImage}
              handleClose={() => setOpenViewImage(false)}
              imageUrl={
                selectedPayment?.payment_image
                  ? `https://road.levantmenu.ae/storage/${selectedPayment.payment_image}`
                  : null
              }
              paymentNumber={selectedPayment?.payment_number}
            />
          </div>
        </TabsContent>

        <TabsContent value="not-received">
          <div className=" w-full mx-auto space-y-6 overflow-x-auto">
            <DynamicTable
              data={paymentIsNotReceived || []}
              columns={PaymentsColumns}
              isLoading={isLoadingPaymentsNotReceived}
              onShow={onShow}
              onConfirmOrder={onConfirmPayment}
              permissions={permissions}

              // onUnconfirmOrder={onConfirmOrder}
            />{" "}
            <ViewImageDialog
              show={openViewImage}
              handleClose={() => setOpenViewImage(false)}
              imageUrl={
                selectedPayment?.payment_image
                  ? `https://road.levantmenu.ae/storage/${selectedPayment.payment_image}`
                  : null
              }
              paymentNumber={selectedPayment?.payment_number}
            />
          </div>
        </TabsContent>

        <TabsContent value="received">
          <div className=" w-full mx-auto space-y-6 overflow-x-auto">
            <DynamicTable
              data={paymentIsReceived || []}
              columns={PaymentsColumns}
              isLoading={isLoadingPaymentsReceived}
              onShow={onShow}
              permissions={permissions}
            />{" "}
            <ViewImageDialog
              show={openViewImage}
              handleClose={() => setOpenViewImage(false)}
              imageUrl={
                selectedPayment?.payment_image
                  ? `https://road.levantmenu.ae/storage/${selectedPayment.payment_image}`
                  : null
              }
              paymentNumber={selectedPayment?.payment_number}
            />
          </div>
        </TabsContent>
      </Tabs>

      <DeleteDialog
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        title={"عملية تأكيد استلام الدفعة"}
        description="هل تريد تأكيد العملية"
        confirmText="نعم"
        titleLoading="جاري التأكيد"
        onConfirm={handleConfirm}
        loading={isLoadingConfirm}
      />
    </>
  );
};

export default PaymentsContainer;

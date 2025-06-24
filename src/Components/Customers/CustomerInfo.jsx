import { useNavigate, useParams } from "react-router";
import {
  useDeleteCustomerMutation,
  useShowOneCustomerQuery,
  useUpdateCustomerMutation,
} from "../../RtkQuery/Slice/Customers/CustomersApi";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { DeleteDialog } from "../../utils/Dialogs/DeleteDialog/DeleteDialog";
import { DynamicTable } from "../../utils/Tables/DynamicTable";
import { BookingCustomerColumns } from "../../utils/Tables/ColumnsTable/BookingByCustomerColumns";
import { PaymentsCustomerColumns } from "../../utils/Tables/ColumnsTable/PaymentsCustomerColumns";
import { ViewImageDialog } from "../Payments/ViewImageDialog";
import InvoicePdf from "../Payments/InvoicePdf";
import { useAuth } from "../../Context/AuthProvider";
import { Permissions } from "../../Static/StaticData";
import { DialogAddPayments } from "../../utils/Dialogs/EditAddDialog/Add/DialogAddPayments";
import HeaderComponent from "../../utils/HeaderComponent";
import InvoiceExcel from "../Payments/InvoiceExcel";
import CustomerFormDialog from "../../Pages/Customers/CustomerFormDialog";
import { showToast } from "../../utils/Notifictions/showToast";
import { Toaster } from "react-hot-toast";

const CustomerInfo = () => {
  const { id } = useParams();
  const {
    data: customer,
    isFetching,
    isLoading: isLoadingCustomer, // Initial customer data loading state
  } = useShowOneCustomerQuery(id);

  // State variables for dialogs and display toggles
  const [openAddPAyment, setOpenAddPayment] = useState(false);
  const [showBookings, setShowBooking] = useState(false);
  const [showPayments, setShowPayments] = useState(false);
  const [openViewImage, setOpenViewImage] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [openDel, setOpenDel] = useState(false);

  // State and settings for CustomerFormDialog
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);

  const [updateCustomer, { isLoading: isUpdating }] =
    useUpdateCustomerMutation();

  const navigate = useNavigate();
  const { hasPermission } = useAuth();

  const [deleteCustomer, { isLoading: isDeleting }] =
    useDeleteCustomerMutation();

  // Callback function on successful form submission (add/edit)
  const handleFormSuccess = () => {
    setIsFormDialogOpen(false);
    showToast("success", "تم تعديل معلومات الزبون");
  };

  const handelDelete = async () => {
    try {
      await deleteCustomer(id).unwrap();
      navigate("/dashboard/customers");
    } catch (error) {
      console.error("Failed to delete customer:", error);
      // You can add an error notification here
    }
  };

  if (isFetching) {
    return (
      <div className="p-4 md:p-6 space-y-4">
        <Skeleton className="h-10 w-1/3" />
        <div className="flex flex-col md:flex-row items-center gap-4">
          <Skeleton className="h-32 w-32 rounded-full" />
          <div className="space-y-2 flex-1 w-full">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-full" />{" "}
            {/* Skeleton for company_name */}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="p-4 text-center text-red-500">
        Customer not found or failed to load.
      </div>
    );
  }

  const onShowBookingDetails = (row) => {
    navigate(`/dashboard/booking/${row?.id}`);
  };

  const onShowPaymentImage = (row) => {
    setOpenViewImage(true);
    setSelectedPayment(row);
  };

  return (
    <div dir="rtl" className="p-4 md:p-6 max-w-7xl w-full mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          معلومات الزبون
        </h1>
        <div className="flex flex-wrap gap-2 justify-end">
          {hasPermission(Permissions.EditCustomers) && (
            <Button
              onClick={() => {
                setIsFormDialogOpen(true);
                // initialData in CustomerFormDialog will be populated with `customer`
              }}
              variant="outline"
              className="gap-2 cursor-pointer w-full sm:w-auto"
            >
              <Icon icon="mdi:pencil" className="text-lg" />
              تعديل
            </Button>
          )}

          <Button
            onClick={() => setShowBooking((prev) => !prev)}
            variant="outline"
            className="gap-2 bg-green-500 hover:bg-green-600 text-white cursor-pointer w-full sm:w-auto"
          >
            <Icon icon="mdi:shape-outline" className="text-lg" />
            {showBookings ? "إخفاء الحجوزات" : "عرض الحجوزات"}
          </Button>

          <Button
            onClick={() => {
              setShowPayments((prev) => !prev);
            }}
            variant="outline"
            className="gap-2 bg-blue-500 hover:bg-blue-600 text-white cursor-pointer w-full sm:w-auto"
          >
            <Icon icon="mdi:currency-usd" className="text-lg" />
            {showPayments ? "إخفاء الدفعات" : "عرض الدفعات"}
          </Button>

          {hasPermission(Permissions.DeleteCustomers) && (
            <Button
              onClick={() => setOpenDel(true)}
              variant="destructive"
              className="gap-2 cursor-pointer w-full sm:w-auto"
            >
              <Icon icon="mdi:trash" className="text-lg" />
              حذف
            </Button>
          )}
        </div>
      </div>

      <div className="bg-background rounded-xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm mb-6">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8">
          <div className="flex flex-col items-center">
            <Avatar className="w-28 h-28 md:w-36 md:h-36 border-4 border-blue-100 dark:border-blue-900">
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-300 text-4xl text-white">
                {customer.full_name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <Badge variant="secondary" className="mt-4 text-base p-2">
              الرصيد المتبقي : {customer?.remaining} $
            </Badge>
          </div>

          <div className="flex-1 space-y-6 w-full">
            <div className="md:text-left text-center">
              <h2 className="text-xl md:text-2xl font-semibold mb-1">
                {customer.full_name}
              </h2>
              <p className="text-muted-foreground text-lg">
                <span className="font-semibold">الشركة: </span>
                {customer.company_name}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {/* Phone Number */}
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-full">
                    <Icon
                      icon="mdi:phone"
                      className="text-blue-600 dark:text-blue-300 text-xl"
                    />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">رقم الهاتف</p>
                    <p className="font-medium">{customer.phone_number}</p>
                  </div>
                </div>
              </div>

              {/* Alternative Phone Numbers */}
              {customer.alt_phone_number &&
                customer.alt_phone_number.length > 0 && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-full">
                        <Icon
                          icon="mdi:phone-plus"
                          className="text-blue-600 dark:text-blue-300 text-xl"
                        />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          أرقام هواتف بديلة
                        </p>
                        {customer.alt_phone_number.map((num, index) => (
                          <p key={index} className="font-medium">
                            {num}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

              {/* Address */}
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-100 dark:border-green-800">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 dark:bg-green-800 rounded-full">
                    <Icon
                      icon="mdi:map-marker"
                      className="text-green-600 dark:text-green-300 text-xl"
                    />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">العنوان</p>
                    <p className="font-medium">{customer.address}</p>
                  </div>
                </div>
              </div>

              {/* Commercial Registration Number */}
              {customer.commercial_registration_number && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-100 dark:border-yellow-800">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-yellow-100 dark:bg-yellow-800 rounded-full">
                      <Icon
                        icon="mdi:file-document-box-multiple"
                        className="text-yellow-600 dark:text-yellow-300 text-xl"
                      />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        رقم السجل التجاري
                      </p>
                      <p className="font-medium">
                        {customer.commercial_registration_number}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Discount */}
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-100 dark:border-red-800">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 dark:bg-red-800 rounded-full">
                    <Icon
                      icon="mdi:percent"
                      className="text-red-600 dark:text-red-300 text-xl"
                    />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">الخصم</p>
                    <p className="font-medium">
                      {parseFloat(customer.discount).toFixed(2)}%
                    </p>
                  </div>
                </div>
              </div>

              {/* Total Paid */}
              <div className="bg-teal-50 dark:bg-teal-900/20 p-4 rounded-lg border border-teal-100 dark:border-teal-800">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-teal-100 dark:bg-teal-800 rounded-full">
                    <Icon
                      icon="mdi:cash-multiple"
                      className="text-teal-600 dark:text-teal-300 text-xl"
                    />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      إجمالي المدفوعات
                    </p>
                    <p className="font-medium">{customer.total_paid} $</p>
                  </div>
                </div>
              </div>

              {/* Total Due */}
              <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg border border-indigo-100 dark:border-indigo-800">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-100 dark:bg-indigo-800 rounded-full">
                    <Icon
                      icon="mdi:cash-multiple"
                      className="text-indigo-600 dark:text-indigo-300 text-xl"
                    />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      إجمالي المستحق
                    </p>
                    <p className="font-medium">{customer.total} $</p>
                  </div>
                </div>
              </div>

              {/* Creation Date */}
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-100 dark:border-purple-800">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-800 rounded-full">
                    <Icon
                      icon="mdi:calendar-plus"
                      className="text-purple-600 dark:text-purple-300 text-xl"
                    />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      تاريخ الإنشاء
                    </p>
                    <p className="font-medium">
                      {new Date(customer.created_at).toLocaleDateString(
                        "en-US"
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Last Modified */}
              <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-100 dark:border-orange-800">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 dark:bg-orange-800 rounded-full">
                    <Icon
                      icon="mdi:calendar-sync"
                      className="text-orange-600 dark:text-orange-300 text-xl"
                    />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">آخر تعديل</p>
                    <p className="font-medium">
                      {new Date(customer.updated_at).toLocaleDateString(
                        "en-US"
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Business Manager Info (if available) */}
              {customer.customers && customer.customers.length > 0 && (
                <div className="bg-gray-50 dark:bg-gray-900/20 p-4 rounded-lg border border-gray-100 dark:border-gray-800 col-span-1 sm:col-span-2">
                  <h4 className="font-semibold text-lg mb-2">
                    معلومات مدير الأعمال
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <Icon
                        icon="mdi:account-box"
                        className="text-gray-600 dark:text-gray-300 text-xl"
                      />
                      <p className="font-medium">
                        {customer.customers[0].full_name}
                      </p>
                    </div>
                    {customer.customers[0].phone_number && (
                      <div className="flex items-center gap-3">
                        <Icon
                          icon="mdi:phone-in-talk"
                          className="text-gray-600 dark:text-gray-300 text-xl"
                        />
                        <p className="font-medium">
                          {customer.customers[0].phone_number}
                        </p>
                      </div>
                    )}
                    {customer.customers[0].address && (
                      <div className="flex items-center gap-3">
                        <Icon
                          icon="mdi:map-marker-radius"
                          className="text-gray-600 dark:text-gray-300 text-xl"
                        />
                        <p className="font-medium">
                          {customer.customers[0].address}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showBookings && (
        <div className="mt-8 border rounded-xl p-4 md:p-6 shadow-sm bg-background">
          <h1 className="text-xl md:text-2xl font-bold tracking-tight mb-4">
            الحجوزات الخاصة بالزبون
          </h1>
          <DynamicTable
            data={customer?.bookings || []}
            columns={BookingCustomerColumns}
            isLoading={isLoadingCustomer}
            onShow={onShowBookingDetails}
            permissions={{
              show: Permissions.ViewBookings,
            }}
          />
        </div>
      )}

      {showPayments && (
        <div className="mt-8 border rounded-xl p-4 md:p-6 shadow-sm bg-background">
          <HeaderComponent
            title={"المدفوعات الخاصة بالزبون"}
            titleBtn={"إضافة دفعة"}
            setShow={setOpenAddPayment}
            permission={Permissions.CreatePayments}
          />
          <div className="my-4 flex flex-wrap gap-3 justify-between items-center">
            <InvoicePdf
              customer={customer}
              showCustomerTable={true}
              showCustomerPaymentsTable={true}
            />
            <InvoiceExcel
              customer={customer}
              showCustomerTable={true}
              showCustomerPaymentsTable={true}
            />
          </div>
          <DynamicTable
            data={customer?.payments || []}
            columns={PaymentsCustomerColumns}
            isLoading={isLoadingCustomer}
            onShow={onShowPaymentImage}
            permissions={{
              show: Permissions.ViewPayments,
            }}
          />
        </div>
      )}

      {/* Dialogs */}
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

      <DeleteDialog
        open={openDel}
        loading={isDeleting}
        onClose={() => setOpenDel(false)}
        onConfirm={handelDelete}
      />

      <DialogAddPayments
        show={openAddPAyment}
        handleClose={() => setOpenAddPayment(false)}
        id={id}
      />

      <CustomerFormDialog
        open={isFormDialogOpen}
        onOpenChange={(isOpen) => {
          setIsFormDialogOpen(isOpen);
        }}
        initialData={customer}
        onSuccess={handleFormSuccess}
        updateCustomerMutation={updateCustomer}
        isUpdating={isUpdating}
      />
      <Toaster />
    </div>
  );
};

export default CustomerInfo;

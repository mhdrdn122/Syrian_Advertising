// src/pages/CustomersPage.jsx
import React, { useState } from "react";
import CustomersContainer from "../../Components/Customers/CustomersContainer";
import HeaderComponent from "../../utils/HeaderComponent";
import {
  useAddNewCustomerMutation,
  useGetCustomersQuery,
  useUpdateCustomerMutation,
} from "../../RtkQuery/Slice/Customers/CustomersApi";
import useSearch from "../../hooks/useSearch";
import InvoicePdf from "../../Components/Payments/InvoicePdf";
import { Permissions } from "../../Static/StaticData";
import InvoiceExcel from "../../Components/Payments/InvoiceExcel";

import CustomerFormDialog from "./CustomerFormDialog";
import { showToast } from "../../utils/Notifictions/showToast";
import { Toaster } from "react-hot-toast";

const CustomersPage = () => {
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [editingCustomerData, setEditingCustomerData] = useState(null);

  const { data: customers, isSuccess, isFetching } = useGetCustomersQuery();
  const [addNewCustomer, { isLoading: isAdding }] = useAddNewCustomerMutation();
  const [updateCustomer, { isLoading: isUpdating }] =
    useUpdateCustomerMutation();

  const { searchQuery, setSearchQuery, filteredData } = useSearch(
    isSuccess ? customers : [],
    "full_name"
  );

  const handleOpenFormDialog = (customer = null) => {
    setEditingCustomerData(customer);
    setIsFormDialogOpen(true);
  };

  const handleFormSuccess = () => {
    setIsFormDialogOpen(false);
    setEditingCustomerData(null);
    showToast("success", "تم إضافة زبون");
  };

  return (
    <div>
      <HeaderComponent
        title={"الزبائن"}
        permission={Permissions.CreateCustomers}
        setShow={() => handleOpenFormDialog()}
        titleBtn={"إضافة زبون جديد"}
      />
      <div className="p-4" dir="rtl">
        <div className="my-2 flex gap-3 justify-between items-center">
          <InvoicePdf
            howCustomerTable={false}
            customer={customers}
            showCustomerRemainingTable={true}
          />
          <InvoiceExcel
            howCustomerTable={false}
            customer={customers}
            showCustomerRemainingTable={true}
          />
        </div>
        <input
          type="text"
          placeholder="ابحث عن الزبون باسم المستخدم"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 my-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <CustomersContainer
        isFetching={isFetching}
        customers={filteredData}
        onEditCustomer={handleOpenFormDialog}
      />

      <CustomerFormDialog
        open={isFormDialogOpen}
        onOpenChange={(isOpen) => {
          setIsFormDialogOpen(isOpen);
          if (!isOpen) {
            setEditingCustomerData(null);
          }
        }}
        initialData={editingCustomerData}
        onSuccess={handleFormSuccess}
        addNewCustomerMutation={addNewCustomer}
        updateCustomerMutation={updateCustomer}
        isAdding={isAdding}
        isUpdating={isUpdating}
      />
      <Toaster />
    </div>
  );
};

export default CustomersPage;

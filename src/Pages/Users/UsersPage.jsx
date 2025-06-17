import React, { useState } from 'react';
import UsersContainer from '../../Components/Users/UsersContainer';
import HeaderComponent from '../../utils/HeaderComponent';
import { DialogAddUser } from '../../utils/Dialogs/EditAddDialog/Add/DialogAddUser';
import { useGetUsersQuery } from '../../RtkQuery/Slice/Users/UsersApi';
import useSearch from '../../hooks/useSearch';
import InvoicePdf from '../../Components/Payments/InvoicePdf';

const UsersPage = () => {
  const [open, setOpen] = useState(false);
  const { data: users, isFetching, isSuccess } = useGetUsersQuery();

  const { searchQuery, setSearchQuery, filteredData } = useSearch(
    isSuccess ? users : [],
    'username'
  );

  return (
    <div>
      <HeaderComponent title={'الموظفين'} titleBtn={'إضافة موظف'} setShow={setOpen} />
      <div className="p-4" dir="rtl">
        <input
          type="text"
          placeholder="ابحث عن موظف باسم المستخدم"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <UsersContainer users={filteredData} isFetching={isFetching} />
      <DialogAddUser show={open} handleClose={() => setOpen(false)} />
    </div>
  );
};

export default UsersPage;
import React, { useState } from 'react'
import CustomersContainer from '../../Components/Customers/CustomersContainer'
import HeaderComponent from '../../utils/HeaderComponent'
import { DialogAddCustomer } from '../../utils/Dialogs/EditAddDialog/Add/DialogAddCustomer'
import { useGetCustomersQuery } from '../../RtkQuery/Slice/Customers/CustomersApi'
import useSearch from '../../hooks/useSearch'

const CustomersPage = () => {
  const [open , setOpen] = useState(false)

    const { data: customers, isSuccess  , isFetching} = useGetCustomersQuery();
  
    console.log(customers)
    const { searchQuery, setSearchQuery, filteredData } = useSearch(
      isSuccess ? customers : [],
      'full_name'
    );
    console.log(filteredData)

  return (
    <div>
      <HeaderComponent title={"الزبائن"} setShow={setOpen} titleBtn={"إضافة زبون جديد"} />
       <div className="p-4" dir="rtl">
        <input
          type="text"
          placeholder="ابحث عن الزبون باسم المستخدم"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
        <CustomersContainer isFetching={isFetching} customers={filteredData} />
        <DialogAddCustomer show={open} handleClose={() => setOpen(false)} />

    </div>
  )
}

export default CustomersPage
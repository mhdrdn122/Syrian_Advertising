import { useNavigate, useParams } from "react-router"
import { useDeleteCustomerMutation, useShowOneCustomerQuery } from "../../RtkQuery/Slice/Customers/CustomersApi"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Icon } from "@iconify/react"
import { Skeleton } from "@/components/ui/skeleton"
import { DialogEditCustomer } from "../../utils/Dialogs/EditAddDialog/Edit/DialogEditCustomer"
import { useState } from "react"
import { DeleteDialog } from "../../utils/Dialogs/DeleteDialog/DeleteDialog"

const CustomerInfo = () => {
  const { id } = useParams()
  const { data: customer, isFetching } = useShowOneCustomerQuery(id)
  const [ open , setOpen ] = useState(false)
  const [ openDel , setOpenDel ] = useState(false)
  
  const navigate = useNavigate()

  const [deleteCustomer , { isLoading} ] = useDeleteCustomerMutation()

  const handelDelete =  async () => {
    await deleteCustomer(id).unwrap()
    navigate("/dashboard/customers")
  }

  if (isFetching) {
    return (
      <div className="p-4 md:p-6 space-y-4">
        <Skeleton className="h-10 w-1/3" />
        <div className="flex gap-4">
          <Skeleton className="h-32 w-32 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  if (!customer) {
    return <div className="p-4 text-center">Customer not found</div>
  }

  return (
    <div className="p-4 md:p-6 max-w-6xl w-full mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Customer Details</h1>
        <div  className="flex  gap-2">
          <Button onClick={() => {setOpen(true)}} variant="outline" className="gap-2 cursor-pointer">
            <Icon icon="mdi:pencil" className="text-lg" />
            Edit Customer
          </Button>
          <Button onClick={() => setOpenDel(true)} variant="destructive"  className="gap-2 cursor-pointer">
            <Icon icon="mdi:trash" className="text-lg" />
            Delete Customer
          </Button>
        </div>
      </div>

      <div className="bg-background rounded-xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
          <div className="flex flex-col items-center">
            <Avatar className="w-24 h-24 md:w-32 md:h-32 border-4 border-blue-100 dark:border-blue-900">
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-300 text-3xl text-white">
                {customer.full_name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <Badge variant="secondary" className="mt-4 text-sm">
              Customer ID: {customer.id}
            </Badge>
          </div>

          <div className="flex-1 space-y-6">
            <div className='md:text-left text-center'>
              <h2 className="text-xl md:text-2xl font-semibold">{customer.full_name}</h2>
              <p className="text-muted-foreground">{customer.company_name}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-full">
                    <Icon icon="mdi:phone" className="text-blue-600 dark:text-blue-300 text-xl" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone Number</p>
                    <p className="font-medium">{customer.phone_number}</p>
                  </div>
                </div>
              </div>

              {/* <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-100 dark:border-green-800">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 dark:bg-green-800 rounded-full">
                    <Icon icon="mdi:percent" className="text-green-600 dark:text-green-300 text-xl" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Discount Rate</p>
                    <p className="font-medium">{customer.discount}%</p>
                  </div>
                </div>
              </div> */}

              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-100 dark:border-green-800">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 dark:bg-green-800 rounded-full">
                    <Icon icon="mdi:map-marker" className="text-green-600 dark:text-green-300 text-xl" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Address</p>
                    <p className="font-medium">{customer.address}</p>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-100 dark:border-purple-800">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-800 rounded-full">
                    <Icon icon="mdi:calendar-plus" className="text-purple-600 dark:text-purple-300 text-xl" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Joined Date</p>
                    <p className="font-medium">
                      {new Date(customer.created_at).toLocaleDateString('en-US')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-100 dark:border-orange-800">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 dark:bg-orange-800 rounded-full">
                    <Icon icon="mdi:calendar-sync" className="text-orange-600 dark:text-orange-300 text-xl" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Last Updated</p>
                    <p className="font-medium">
                      {new Date(customer.updated_at).toLocaleDateString('en-US')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <DialogEditCustomer show={open} handleClose={() => setOpen(false)} initData={customer} />
      <DeleteDialog open={openDel} loading={isLoading} onClose={() => setOpenDel(false)} onConfirm={handelDelete}  />
    </div>
  )
}

export default CustomerInfo
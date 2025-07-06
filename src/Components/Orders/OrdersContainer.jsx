import { useState, useEffect } from "react";
import {
  useConfirmOneOrderMutation,
  useGetOrdersQuery,
} from "../../RtkQuery/Slice/Orders/OrdersApi";
import {
  useGetCitiesQuery,
  useGetActiveRegionsByCityMutation,
} from "../../RtkQuery/Slice/CitiesAndRegions/CitiesAndRegionsApi";
import { DynamicTable } from "../../utils/Tables/DynamicTable";
import { OrderFieldsShow } from "../../utils/Dialogs/Data/Show/OrderFieldsShow";
import DialogShow from "../../utils/Dialogs/DialogShow/DialogShow";
import { OrdersColumns } from "../../utils/Tables/ColumnsTable/OrdersColumns";
import LoadingGet from "../../utils/Loading/LoadingGet/LoadingGet";
import { showToast } from "../../utils/Notifictions/showToast";
import { DeleteDialog } from "../../utils/Dialogs/DeleteDialog/DeleteDialog";
import { DialogEditOrders } from "../../utils/Dialogs/EditAddDialog/Edit/DialogEditOrders";
import OrdersPdf from "./OrdersPdf";
import { Loader, Loader2Icon } from "lucide-react";
import { Permissions } from "../../Static/StaticData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HistoryOrdersColumns } from "../../utils/Tables/ColumnsTable/HistoryOrdersColumns";
import useMangeOrders from "../../hooks/useMangeOrders";

const OrdersContainer = () => {

  // const [activeTab, setActiveTab] = useState("orders");

  // const [orderType, setOrderType] = useState("");
  // const [cityId, setCityId] = useState("");
  // const [regionId, setRegionId] = useState("");
  // const [actionDate, setActionDate] = useState("");
  // const [regions, setRegions] = useState([]);

  // const { data: cities, isLoading: isCitiesLoading } = useGetCitiesQuery();
  // const [getActiveRegionsByCity] = useGetActiveRegionsByCityMutation();

  // const queryParams = {
  //   ...(orderType === "both" && { type: [3] }),
  //   ...(orderType === "release" && { type: [1] }),
  //   ...(orderType === "installation" && { type: [2] }),
  //   ...(cityId && { city_id: cityId }),
  //   ...(regionId && { region_id: regionId }),
  //   ...(actionDate && { action_date: actionDate }),
  //   ...( { status: false }),
  // };

  // const { data, isLoading, isFetching } = useGetOrdersQuery(queryParams, {
  //   refetchOnMountOrArgChange: true,
  // });

  // const {
  //   data: history,
  //   isLoading: isLoadingHistory,
  //   isFetching: isFetchingHistory,
  // } = useGetOrdersQuery(
  //   {
  //     status: true,
  //   },
  //   {
  //     refetchOnMountOrArgChange: true,
  //   }
  // );
  // const [confirmOrder, { isLoading: iLoadingConfirm }] =
  //   useConfirmOneOrderMutation();

  // const [openShow, setOpenShow] = useState(false);
  // const [openConfirm, setOpenConfirm] = useState(false);
  // const [openEdit, setOpenEdit] = useState(false);
  // const [isConfirmAction, setIsConfirmAction] = useState(true);
  // const [selectedOrder, setSelectedOrder] = useState(null);

  // // Fetch regions when city changes
  // useEffect(() => {
  //   const fetchRegions = async () => {
  //     if (cityId) {
  //       try {
  //         const response = await getActiveRegionsByCity(cityId).unwrap();
  //         setRegions(response || []);
  //         setRegionId(""); // Reset region when city changes
  //       } catch (error) {
  //         showToast("error", "فشل في جلب المناطق");
  //       }
  //     } else {
  //       setRegions([]);
  //       setRegionId("");
  //     }
  //   };
  //   fetchRegions();
  // }, [cityId, getActiveRegionsByCity]);

  // const handleEdit = (order) => {
  //   setSelectedOrder(order);
  //   setOpenEdit(true);
  // };

  // const handleShow = (order) => {
  //   setSelectedOrder(order);
  //   setOpenShow(true);
  // };

  // const handleConfirmOrUnconfirm = async () => {
  //   try {
  //     const status = isConfirmAction ? 1 : 0;
  //     await confirmOrder({ status, id: selectedOrder.id }).unwrap();
  //     showToast(
  //       "success",
  //       isConfirmAction ? "تم تأكيد الطلب بنجاح" : "تم إلغاء تأكيد الطلب بنجاح"
  //     );
  //   } catch (err) {
  //     showToast(
  //       "error",
  //       `حدث خطأ أثناء ${isConfirmAction ? "تأكيد" : "إلغاء تأكيد"} الطلب: ${
  //         err.data?.message || "خطأ غير معروف"
  //       }`
  //     );
  //   }
  //   setOpenConfirm(false);
  // };

  // const onConfirmOrder = (row) => {
  //   setSelectedOrder(row);
  //   setIsConfirmAction(true);
  //   setOpenConfirm(true);
  // };

  // const onUnconfirmOrder = (row) => {
  //   setSelectedOrder(row);
  //   setIsConfirmAction(false);
  //   setOpenConfirm(true);
  // };

  const 
        {
          setActiveTab , 
          orderType , 
          setOrderType , 
          cityId ,
          setCityId ,
          regionId , 
          setRegionId ,
          actionDate ,
          setActionDate ,
          regions ,
           cities ,
          isCitiesLoading ,
          data ,
          isLoading ,
          isFetching ,
          history ,
          isFetchingHistory ,
          iLoadingConfirm ,
          openShow ,
          setOpenShow ,
          openConfirm ,
          setOpenConfirm ,
          openEdit ,
          setOpenEdit ,
          isConfirmAction ,
          selectedOrder ,
          setSelectedOrder ,
          handleEdit , 
          handleShow , 
          handleConfirmOrUnconfirm ,
          onConfirmOrder ,
        } = useMangeOrders()

  // Only show loading on initial load or when cities are loading
  if (isLoading || isCitiesLoading) {
    return (
      <div className="w-full h-full flex flex-col justify-center items-center">
        <Loader />
        <p className="text-muted-foreground text-sm">جاري التحميل...</p>
      </div>
    );
  }

  const permission = {
    edit: Permissions.EditOrders,
    confirm: Permissions.EditOrders,
    unConfirm: Permissions.EditOrders,
  };

  return (
    <>
      <Tabs
        defaultValue="orders"
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full overflow-auto  grid-cols-5 justify-between flex bg-card rounded-lg border border-border">
          <TabsTrigger value="orders" className="text-sm font-medium">
            الطلبات
          </TabsTrigger>
          <TabsTrigger value="history" className="text-sm font-medium">
            الارشيف{" "}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="orders">
          <div className="p-4 sm:p-6 max-w-full mx-auto space-y-6 bg-background rounded-lg shadow-sm dark:shadow-gray-800">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-foreground">
                إدارة الطلبات
              </h2>
              <OrdersPdf orders={data || []} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {/* Order Type Filter */}
              <div className="flex flex-col">
                <label className="mb-2 text-sm font-medium text-foreground">
                  نوع الطلب
                </label>
                <div className="flex flex-wrap gap-4 bg-card p-4 rounded-lg shadow-sm border border-border">
                  <label className="flex items-center gap-2 text-sm text-foreground">
                    <input
                      type="radio"
                      name="orderType"
                      value="release"
                      checked={orderType === "release"}
                      onChange={(e) => setOrderType(e.target.value)}
                      className="text-primary focus:ring-primary h-4 w-4 accent-primary"
                    />
                    فك
                  </label>
                  <label className="flex items-center gap-2 text-sm text-foreground">
                    <input
                      type="radio"
                      name="orderType"
                      value="installation"
                      checked={orderType === "installation"}
                      onChange={(e) => setOrderType(e.target.value)}
                      className="text-primary focus:ring-primary h-4 w-4 accent-primary"
                    />
                    تركيب
                  </label>
                  <label className="flex items-center gap-2 text-sm text-foreground">
                    <input
                      type="radio"
                      name="orderType"
                      value="both"
                      checked={orderType === "both"}
                      onChange={(e) => setOrderType(e.target.value)}
                      className="text-primary focus:ring-primary h-4 w-4 accent-primary"
                    />
                    فك وتركيب
                  </label>
                </div>
              </div>

              {/* City Filter */}
              <div className="flex flex-col">
                <label className="mb-2 text-sm font-medium text-foreground">
                  المدينة
                </label>
                <select
                  value={cityId}
                  onChange={(e) => setCityId(e.target.value)}
                  className="p-2.5 border rounded-lg bg-card text-foreground text-sm shadow-sm focus:ring-2 focus:ring-primary focus:border-primary w-full disabled:bg-muted disabled:text-muted-foreground transition-colors duration-200"
                >
                  <option value="">اختر مدينة</option>
                  {cities?.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Region Filter */}
              <div className="flex flex-col">
                <label className="mb-2 text-sm font-medium text-foreground">
                  المنطقة
                </label>
                <select
                  value={regionId}
                  onChange={(e) => setRegionId(e.target.value)}
                  className="p-2.5 border rounded-lg bg-card text-foreground text-sm shadow-sm focus:ring-2 focus:ring-primary focus:border-primary w-full disabled:bg-muted disabled:text-muted-foreground transition-colors duration-200"
                  disabled={!cityId}
                >
                  <option value="">اختر منطقة</option>
                  {regions.map((region) => (
                    <option key={region.id} value={region.id}>
                      {region.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date Filter */}
              <div className="flex flex-col">
                <label className="mb-2 text-sm font-medium text-foreground">
                  تاريخ العملية
                </label>
                <input
                  type="date"
                  value={actionDate}
                  onChange={(e) => setActionDate(e.target.value)}
                  className="p-2.5 border rounded-lg bg-card text-foreground text-sm shadow-sm focus:ring-2 focus:ring-primary focus:border-primary w-full transition-colors duration-200"
                />
              </div>
            </div>

            <DynamicTable
              data={data?.filter((order) => order.status == 0) || []}
              columns={OrdersColumns}
              isLoading={isFetching}
              onEdit={handleEdit}
              onShow={handleShow}
              onConfirmOrder={onConfirmOrder}
              // onUnconfirmOrder={onUnconfirmOrder}
              permissions={permission}
              className="bg-card rounded-lg shadow-sm border border-border w-full"
            />
            <DialogEditOrders
              show={openEdit}
              handleClose={() => setOpenEdit(false)}
              initData={selectedOrder}
            />
            <DialogShow
              show={openShow}
              handleClose={() => {
                setOpenShow(false);
                setSelectedOrder(null);
              }}
              data={selectedOrder}
              fields={OrderFieldsShow}
            />
            <DeleteDialog
              open={openConfirm}
              onClose={() => setOpenConfirm(false)}
              title={
                isConfirmAction
                  ? "عملية تأكيد الطلب"
                  : "عملية إلغاء تأكيد الطلب"
              }
              description={`هل تريد ${
                isConfirmAction ? "تأكيد" : "إلغاء تأكيد"
              } هذا الطلب؟`}
              confirmText="نعم"
              onConfirm={handleConfirmOrUnconfirm}
              loading={iLoadingConfirm}
              titleLoading={`  ${
                isConfirmAction ? "جاري التأكيد " : "جاري إلغاء تأكيد"
              }  `}
            />
          </div>
        </TabsContent>
        <TabsContent value="history">
          <DynamicTable
            data={history || []}
            columns={HistoryOrdersColumns}
            isLoading={isFetchingHistory}
            permissions={permission}
            className="bg-card rounded-lg shadow-sm border border-border w-full"
          />
        </TabsContent>
      </Tabs>
    </>
  );
};

export default OrdersContainer;

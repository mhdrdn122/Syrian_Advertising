import { useState } from "react";
import { DynamicTable } from "../../utils/Tables/DynamicTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoadingGet from "../../utils/Loading/LoadingGet/LoadingGet";
import {
  useGetRoadSignBookingByDateQuery,
  useGetRoadSignBookingByWeekQuery,
  useGetSoadSignDontHaveBookingQuery,
} from "../../RtkQuery/Slice/Report/ReportApi";
import { ReportBookingsColumns } from "../../utils/Tables/ColumnsTable/ReportBookingsColumns";
import { ReportUnbookedSignsColumns } from "../../utils/Tables/ColumnsTable/ReportUnbookedSignsColumns";
import { Loader } from "lucide-react";
import { ReportBookingsCustomersColumns } from "../../utils/Tables/ColumnsTable/ReportBookingsCustomersColumns";
import { ReportPdf } from "./ReportPdf";

const ReportsContainer = () => {
  const [activeTab, setActiveTab] = useState("bookings");
  const [fromDate, setFromDate] = useState();
  const [toDate, setToDate] = useState();

  // Fetch data for bookings this week
  const {
    data: bookingsData,
    isLoading: isBookingsLoading,
    isFetching: isBookingsFetching,
  } = useGetRoadSignBookingByWeekQuery();
  console.log(bookingsData);

  // Fetch data for bookings this Date
  const {
    data,
    isLoading: isBookingsDateLoading,
    isFetching: isBookingsDateFetching,
  } = useGetRoadSignBookingByDateQuery({
    from_date: fromDate,
    to_date: toDate,
  });
  console.log(data);

  // Fetch data for unbooked signs
  const {
    data: unbookedSignsData,
    isLoading: isUnbookedLoading,
    isFetching: isUnbookedFetching,
  } = useGetSoadSignDontHaveBookingQuery();

  // Handle loading state
  if (isBookingsLoading || isUnbookedLoading) {
    return (
      <div className="w-full h-full flex flex-col justify-center items-center">
        <Loader />
        <p className="text-muted-foreground text-sm">جاري التحميل...</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-full mx-auto space-y-6 bg-background rounded-lg shadow-sm dark:shadow-gray-800">
      <h2 className="text-2xl font-bold text-foreground mb-4">التقارير</h2>

      <ReportPdf
        customers={data?.customers}
        globalModelCounts={data?.globalModelCounts}
        total_advertising_space_all_customers={
          data?.total_advertising_space_all_customers
        }
        from_date={fromDate}
        to_date={toDate}
      />
      {/* Tabs for switching between bookings and unbooked signs */}
      <Tabs
        defaultValue="bookings"
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full overflow-auto  grid-cols-5 justify-between flex bg-card rounded-lg border border-border">
          <TabsTrigger value="bookings" className="text-sm font-medium">
            الحجوزات هذا الأسبوع
          </TabsTrigger>
          <TabsTrigger value="unbooked" className="text-sm font-medium">
            اللوحات الغير محجوزة
          </TabsTrigger>
          <TabsTrigger value="customer-booking" className="text-sm font-medium">
            حجوزات الزبائن
          </TabsTrigger>
          <TabsTrigger value="model-booking" className="text-sm font-medium">
            النماذج المحجوزة
          </TabsTrigger>
        </TabsList>

        {/* Bookings This Week Table */}
        <TabsContent value="bookings">
          <DynamicTable
            data={bookingsData || []}
            columns={ReportBookingsColumns}
            isLoading={isBookingsFetching}
            className="bg-card rounded-lg shadow-sm border border-border w-full"
          />
        </TabsContent>

        {/* Unbooked Signs Table */}
        <TabsContent value="unbooked">
          <DynamicTable
            data={unbookedSignsData || []}
            columns={ReportUnbookedSignsColumns}
            isLoading={isUnbookedFetching}
            className="bg-card rounded-lg shadow-sm border border-border w-full"
          />
        </TabsContent>

        {/* customer-booking This Date Tables */}
        <TabsContent value="customer-booking">
          {/* Date Filter */}
          <div className="flex justify-between items-center gap-3 mb-5">
            <div className="flex flex-col flex-1">
              <label className="mb-2 text-sm font-medium text-foreground">
                {" "}
                من{" "}
              </label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="p-2.5 border rounded-lg bg-card text-foreground text-sm shadow-sm focus:ring-2 focus:ring-primary focus:border-primary w-full transition-colors duration-200"
              />
            </div>

            <div className="flex flex-col flex-1 ">
              <label className="mb-2 text-sm font-medium text-foreground">
                إلى{" "}
              </label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="p-2.5 border rounded-lg bg-card text-foreground text-sm shadow-sm focus:ring-2 focus:ring-primary focus:border-primary w-full transition-colors duration-200"
              />
            </div>
          </div>
          <div className="my-3 text-center text-red-600 text-[20px]">
            <span>عدد الأمتار الإجمالي : </span>
            <span>{data?.total_advertising_space_all_customers} </span>
          </div>

          {data?.customers?.map((customer, ind) => {
            return (
              <div
                dir="rtl"
                className="border-2 p-2 m-2 text-right rounded-2xl"
                key={ind}
              >
                <div className="my-3">
                  <span>اسم الشركة : </span>
                  <span>{customer?.company_name} </span>
                </div>
                <DynamicTable
                  data={customer?.roadSigns || []}
                  columns={ReportBookingsCustomersColumns}
                  isLoading={isBookingsFetching}
                  className="bg-card rounded-lg shadow-sm border border-border w-full"
                />
              </div>
            );
          })}
        </TabsContent>

        {/* model-booking This Date Tables */}
        <TabsContent value="model-booking">
          <DynamicTable
            data={data?.globalModelCounts || []}
            columns={[
              {
                header: "عدد الأمتار الإعلانية",
                accessor: "model",
                cellClassName: "text-center",
              },
              {
                header: "عدد الأمتار الإعلانية",
                accessor: "count",
                cellClassName: "text-center",
              },
            ]}
            isLoading={isBookingsFetching}
            className="bg-card rounded-lg shadow-sm border border-border w-full"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportsContainer;

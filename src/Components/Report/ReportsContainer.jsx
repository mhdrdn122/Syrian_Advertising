import { useState } from "react";
import { DynamicTable } from "../../utils/Tables/DynamicTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoadingGet from "../../utils/Loading/LoadingGet/LoadingGet";
import { useGetRoadSignBookingByWeekQuery, useGetSoadSignDontHaveBookingQuery } from "../../RtkQuery/Slice/Report/ReportApi";
import { ReportBookingsColumns } from "../../utils/Tables/ColumnsTable/ReportBookingsColumns";
import { ReportUnbookedSignsColumns } from "../../utils/Tables/ColumnsTable/ReportUnbookedSignsColumns";

const ReportsContainer = () => {
  const [activeTab, setActiveTab] = useState("bookings");

  // Fetch data for bookings this week
  const {
    data: bookingsData,
    isLoading: isBookingsLoading,
    isFetching: isBookingsFetching,
  } = useGetRoadSignBookingByWeekQuery();

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
        <LoadingGet />
        <p className="text-muted-foreground text-sm">جاري التحميل...</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-full mx-auto space-y-6 bg-background rounded-lg shadow-sm dark:shadow-gray-800">
      <h2 className="text-2xl font-bold text-foreground mb-4">التقارير</h2>
      
      {/* Tabs for switching between bookings and unbooked signs */}
      <Tabs defaultValue="bookings" onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-[400px] grid-cols-2 bg-card rounded-lg border border-border">
          <TabsTrigger value="bookings" className="text-sm font-medium">
            الحجوزات هذا الأسبوع
          </TabsTrigger>
          <TabsTrigger value="unbooked" className="text-sm font-medium">
            اللوحات الغير محجوزة
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
      </Tabs>
    </div>
  );
};

export default ReportsContainer;
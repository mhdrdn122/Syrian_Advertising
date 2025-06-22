import React, { useState } from "react";
import { useGetTotalPaymentAndRemainingQuery } from "../../RtkQuery/Slice/Payments/PaymentsApi";
import { DynamicTable } from "../../utils/Tables/DynamicTable";
import { BoxColumns } from "../../utils/Tables/ColumnsTable/BoxColumns";

const Box = () => {
  const [fromDate, setFromDate] = useState();
  const [toDate, setToDate] = useState();

  const { data , isLoading} = useGetTotalPaymentAndRemainingQuery({
    from_date: fromDate,
    to_date: toDate,
  });

  const dataBox = [
    {
      total_booking_amount: data?.total_booking_amount,
      total_customer_remaining: data?.total_customer_remaining,
      total_paid_received: data?.total_paid_received,
    },
  ];

  return (
    <div>
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
      <DynamicTable data={dataBox} isLoading={isLoading} columns={BoxColumns} />
    </div>
  );
};

export default Box;

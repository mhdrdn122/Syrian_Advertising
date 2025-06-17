import { BookingType } from "../../../Static/StaticData";

export const BookingCustomerColumns = [

  {
    header: "إلى",
    accessor: "end_date",
    format: (value) =>
      new Date(value).toLocaleDateString("en-US"),
    prefixIcon: "mdi:calendar-end",
    className: "min-w-[100px] sm:min-w-[120px] md:min-w-[150px]",
    priority: 3,
  },
  {
    header: "من",
    accessor: "start_date",
    format: (value) =>
      new Date(value).toLocaleDateString("en-US"),
    prefixIcon: "mdi:calendar-start",
    className: "min-w-[100px] sm:min-w-[120px] md:min-w-[150px]",
    priority: 4,
  },
  {
    header: "الحالة",
    accessor: "type",
    prefixIcon: "mdi:tag",
    format: (value) => BookingType[value] || "غير معروف",
    className: "min-w-[80px] sm:min-w-[100px] md:min-w-[120px]",
    priority: 6,
  },
];

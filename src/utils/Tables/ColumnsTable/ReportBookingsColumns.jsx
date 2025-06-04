// Columns for Bookings This Week
export const ReportBookingsColumns = [
  {
    header: "اسم الشركة",
    accessor: "bookings.0.customer.company_name",
    cellClassName: "text-center",
  },
  {
    header: "المنطقة",
    accessor: "region.name",
    cellClassName: "text-center",
  },
  {
    header: "الموقع",
    accessor: "place",
    cellClassName: "text-center",
  },
  {
    header: "النموذج",
    accessor: "template.model",
    cellClassName: "text-center",
  },
  {
    header: "عدد اللوحات",
    accessor: "number",
    cellClassName: "text-center",
  },
  {
    header: "عدد الوجوه",
    accessor: "faces_number",
    cellClassName: "text-center",
  },
  {
    header: "عدد الأمتار",
    accessor: "advertising_meters",
    cellClassName: "text-center",
  },
];
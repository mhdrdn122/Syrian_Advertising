
export const OrdersColumns = [
  
    {
      header: "اسم الشركة",
      accessor: "customer.company_name",
      prefixIcon: "mdi:office-building",
      className: "min-w-[150px]",
      priority: 3,
    },
    {
      header: "الزبون الجديد ",
      accessor: "customer_new.company_name",
      format : (value) => value ?  value : "غير متوفر" ,
      prefixIcon: "mdi:office-building",
      className: "min-w-[150px]",
      priority: 3,
    },
    {
      header: "نوع الطلب",
      accessor: "type",
      prefixIcon: "mdi:format-list-bulleted-type",
      format: (value) => (value === 1 ? "فك" : value === 2 ?   "تركيب" : "فك و تركيب")
        ,
      className: "min-w-[100px]",
      priority: 4,
    },
    {
      header: "تاريخ الفك أو التركيب",
      accessor: "action_date",
      prefixIcon: "mdi:calendar",
      // format: (value) => new Date(value).toLocaleDateString("en-US"),
      className: "min-w-[120px]",
      priority: 5,
    },
    {
      header: "الملاحظة",
      accessor: "notes",
      prefixIcon: "mdi:note-text",
      className: "min-w-[100px]",
      priority: 6,
    },
    {
      header: "الحالة",
      accessor: "status",
      prefixIcon: "mdi:traffic-light",
      format: (value) => (value === 0 ? " جاري العمل" : "تمت العملية")
      ,
      className: "min-w-[100px]",
      priority: 7,
    },
  ];

const ContractType = {
  1: "مؤقت",
  2: "دائم",
};


export const ContractsColumns = [
    {
      header: "اسم الشركة",
      accessor: "customer.company_name",
      prefixIcon: "mdi:office-building",
      className: "min-w-[120px] sm:min-w-[150px] md:min-w-[200px] lg:min-w-[250px]",
      cellClassName: "font-medium",
      priority: 1,
    },
    {
      header: "تاريخ البدء",
      accessor: "start_date",
      prefixIcon: "mdi:calendar-start",
      className: "min-w-[100px] sm:min-w-[120px] md:min-w-[150px]",
      priority: 2,
    },
    {
      header: "تاريخ الانتهاء",
      accessor: "end_date",
      prefixIcon: "mdi:calendar-end",
      className: "min-w-[100px] sm:min-w-[120px] md:min-w-[150px]",
      priority: 3,
    },
    {
      header: "الحدث",
      accessor: "type",
      prefixIcon: "mdi:tag",
      format: (value) => ContractType[value] || "غير معروف",
      className: "min-w-[80px] sm:min-w-[100px] md:min-w-[120px]",
      priority: 4,
    },
  ];
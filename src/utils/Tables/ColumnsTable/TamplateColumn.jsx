import { format } from "date-fns";

export  const TemplateColumns = [
    {
      header: "Model",
      accessor: "model",
      prefixIcon: "mdi:shape-outline",
      className: "min-w-[100px] sm:min-w-[120px]",
      cellClassName: "font-medium",
      priority: 1,
    },
    {
      header: "Type",
      accessor: "type",
      prefixIcon: "mdi:format-list-bulleted-type",
      className: "min-w-[100px]",
      priority: 2,
    },
    {
      header: "Size",
      accessor: "size",
      prefixIcon: "mdi:ruler-square",
      className: "min-w-[80px]",
      priority: 3,
    },
    {
      header: "Print Space",
      accessor: "printing_space",
      prefixIcon: "mdi:image-area",
      format: (value) => `${value}m²`,
      className: "text-right min-w-[100px]",
      cellClassName: "text-right font-mono",
      priority: 5,
    },
    {
      header: "Ad Space",
      accessor: "advertising_space",
      prefixIcon: "mdi:image-area",
      format: (value) => `${value}m²`,
      className: "text-right min-w-[100px]",
      cellClassName: "text-right font-mono",
      priority: 7,
    },
    {
      header: "Created",
      accessor: "created_at",
      prefixIcon: "mdi:calendar",
      format: (value) => format(new Date(value), "MMM dd, yyyy"),
      className: "min-w-[100px] sm:min-w-[120px]",
      priority: 8,
    },
  ];

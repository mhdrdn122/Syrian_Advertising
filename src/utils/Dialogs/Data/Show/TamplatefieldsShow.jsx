import { format } from "date-fns";

 export const TemplateFieldsShow = [
    { label: "Model", key: "model", icon: "mdi:shape-outline" },
    { label: "Type", key: "type", icon: "mdi:format-list-bulleted-type" },
    { label: "Size", key: "size", icon: "mdi:ruler-square" },
    {
      label: "Print Space",
      key: "printing_space",
      icon: "mdi:image-area",
      format: (value) => `${value}m²`,
    },
    {
      label: "Ad Space",
      key: "advertising_space",
      icon: "mdi:image-area",
      format: (value) => `${value}m²`,
    },
    {
      label: "Created",
      key: "created_at",
      icon: "mdi:calendar",
      format: (value) => format(new Date(value), "MMM dd, yyyy"),
    },
  ];
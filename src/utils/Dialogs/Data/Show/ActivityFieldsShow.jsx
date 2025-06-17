import { format } from "date-fns";

export const ActivityFieldsShow = [
  { label: "النشاط", key: "activity", icon: "mdi:history" },
  {
    label: "انشاء",
    key: "created_at",
    icon: "mdi:calendar",
    format: (value) => format(new Date(value), "MMM dd, yyyy HH:mm"),
  },
];


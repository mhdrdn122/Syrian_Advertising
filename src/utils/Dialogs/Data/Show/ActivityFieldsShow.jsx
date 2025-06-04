import { format } from "date-fns";

export const ActivityFieldsShow = [
  { label: "Activity", key: "activity", icon: "mdi:history" },
  {
    label: "Created",
    key: "created_at",
    icon: "mdi:calendar",
    format: (value) => format(new Date(value), "MMM dd, yyyy HH:mm"),
  },
];
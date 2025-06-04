import { format } from "date-fns";
const productTypeMap = {
  1: 'LOCAL',
  2: 'FOREIGN',
  3: 'BOTH',
};
export const OrderFieldsShow = [
  { label: 'Type', key: 'type', icon: 'mdi:format-list-bulleted-type', format: (value) => productTypeMap[value] || 'Unknown' },
  { label: 'Action Date', key: 'action_date', icon: 'mdi:calendar', format: (value) => format(new Date(value), 'MMM dd, yyyy') },
  { label: 'Notes', key: 'notes', icon: 'mdi:note-text' },
  { label: 'Created', key: 'created_at', icon: 'mdi:calendar-plus', format: (value) => format(new Date(value), 'MMM dd, yyyy HH:mm') },
  { label: 'User Name', key: 'user.full_name', icon: 'mdi:account' },
  { label: 'User Email', key: 'user.email', icon: 'mdi:email' },
  { label: 'Customer Name', key: 'customer.full_name', icon: 'mdi:account-outline' },
  { label: 'Company Name', key: 'customer.company_name', icon: 'mdi:office-building' },
  { label: 'Road Sign Place', key: 'road_sign.place', icon: 'mdi:map-marker' },
  { label: 'Advertising Meters', key: 'road_sign.advertising_meters', icon: 'mdi:image-area', format: (value) => `${value}m²` },
];
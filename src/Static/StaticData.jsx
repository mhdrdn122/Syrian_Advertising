import {
  IconDashboard,
  IconUsers,
  IconUsersGroup,
  IconCalendarEvent,
  IconCash,
  IconTemplate,
  IconRoad,
} from "@tabler/icons-react";

export const BookingType = {
  1: "مؤقت",
  2: "دائم",
};

export const typeOptions = [
  { value: 1, label: "مؤقت" },
  { value: 2, label: "دائم" },
];

export const productTypeOptions = [
  { value: 1, label: "محلي" },
  { value: 2, label: "أجنبي" },
  { value: 3, label: "كلاهما" },
];

export const productTypeMap = {
  1: "محلي",
  2: "أجنبي",
  3: "كلاهما",
};
export const navLinksAdministrationPage = [
  { to: "", text: "الاحصائيات", mobileText: "الرئيسية" },
  { to: "regions-city", text: "المناطق والمدن", mobileText: "المناطق" },
  { to: "orders", text: " الطلبات", mobileText: "الطلبات" },
  { to: "report", text: " التقرير الاسبوعي", mobileText: "التقرير الاسبوعي" },
  { to: "box", text: "  الصندوق", mobileText: "الصندوق " },

];

export const navLinkSidebar = [
  {
    title: "الإدارة",
    url: "/dashboard/administration-page",
    icon: IconDashboard,
  },
  {
    title: "الموظفين",
    url: "/dashboard/users",
    icon: IconUsers,
  },
  {
    title: "الزبائن",
    url: "/dashboard/customers",
    icon: IconUsersGroup,
  },
  {
    title: "الحجوزات",
    url: "/dashboard/bookings",
    icon: IconCalendarEvent,
  },
  {
    title: "الدفعات",
    url: "/dashboard/payments",
    icon: IconCash,
  },
  {
    title: "النماذج",
    url: "/dashboard/models",
    icon: IconTemplate,
  },
  {
    title: "اللوحات الطرقية",
    url: "/dashboard/road_signs",
    icon: IconRoad,
  },
];

export const isAvailableRoadSign = [
  { id: "1", name: "متاح" },
  { id: "0", name: "غير متاح" },
];
  

export const Permissions = {
  CreateBookings: "create-bookings",
  CreateBrokers: "create-brokers",
  CreateCities: "create-cities",
  CreateCustomers: "create-customers",
  // CreateOrders: "create-orders",
  CreatePayments: "create-payments",
  CreateProducts: "create-products",
  CreateRegions: "create-regions",
  CreateRoadSigns: "create-road-signs",
  CreateTemplates: "create-templates",
  CreateUsers: "create-users",

  // DeleteBookings: "delete-bookings",
  DeleteBrokers: "delete-brokers",
  DeleteCities: "delete-cities",
  DeleteCustomers: "delete-customers",
  // DeleteOrders: "delete-orders",
  // DeletePayments: "delete-payments",
  // DeleteProducts: "delete-products",
  DeleteRegions: "delete-regions",
  DeleteRoadSigns: "delete-road-signs",
  DeleteTemplates: "delete-templates",
  DeleteUsers: "delete-users", 

  EditBookings: "edit-bookings",
  EditBrokers: "edit-brokers",
  EditCities: "edit-cities",
  EditCustomers: "edit-customers",
  EditOrders: "edit-orders",//
  EditPayments: "edit-payments",
  // EditProducts: "edit-products",
  EditRegions: "edit-regions",
  EditRoadSigns: "edit-road-signs",
  EditTemplates: "edit-templates",
  EditUsers: "edit-users",

  ViewBookings: "view-bookings",
  ViewBrokers: "view-brokers",
  ViewCities: "view-cities",//
  ViewCustomers: "view-customers",//
  ViewOrders: "view-orders",//
  ViewPayments: "view-payments",//
  // ViewProducts: "view-products",
  ViewRegions: "view-regions",//
  ViewRoadSigns: "view-road-signs",
  ViewTemplates: "view-templates",
  ViewUsers: "view-users",
};

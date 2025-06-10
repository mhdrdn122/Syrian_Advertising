import * as React from "react";
import {
  IconDashboard,
  IconUsers,
  IconUsersGroup,
  IconCalendarEvent,
  IconCash,
  IconTemplate,
  IconRoad,
  IconChartBar
} from "@tabler/icons-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu
} from "@/components/ui/sidebar";
import { useGetProfileQuery } from "../RtkQuery/Slice/Auth/AuthSlice";
import { useLocation } from "react-router";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: profile, isSuccess } = useGetProfileQuery();

  const data = {
    user: {
      name: isSuccess ? profile.full_name : "",
      email: isSuccess ? profile.email : "",
      avatar: "/avatars/shadcn.jpg",
    },
    navMain: [
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
      }
    ],
  };

  return (
    <Sidebar  collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu></SidebarMenu>
      </SidebarHeader>
      <SidebarContent style={{ marginTop: "30px" }}>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { Skeleton } from "@/components/ui/skeleton";
import { DeleteDialog } from "../../utils/Dialogs/DeleteDialog/DeleteDialog";
import { DialogEditUser } from "../../utils/Dialogs/EditAddDialog/Edit/DialogEditUser";
import {
  useDeleteUserMutation,
  useGetActivitiesQuery,
  useShowOneUsersQuery,
} from "../../RtkQuery/Slice/Users/UsersApi";
import DialogShow from "../../utils/Dialogs/DialogShow/DialogShow";
import { ActivityFieldsShow } from "../../utils/Dialogs/Data/Show/ActivityFieldsShow";
import { useAuth } from "../../Context/AuthProvider";
import { Permissions } from "../../Static/StaticData";
import DetailCard from "../../utils/DetailCard";

const UserInfo = () => {
  const { id } = useParams();
  const { data: user, isFetching } = useShowOneUsersQuery(id);
  const { data: activities, isFetching: isFetchingActivities } =
    useGetActivitiesQuery(id);
  const [open, setOpen] = useState(false);
  const [openActivities, setOpenActivities] = useState(false);
  const [openDel, setOpenDel] = useState(false);
  const navigate = useNavigate();
  const [deleteUser, { isLoading }] = useDeleteUserMutation();
  const { hasPermission } = useAuth();

  const handleDelete = async () => {
    try {
      await deleteUser(id).unwrap();
      navigate("/dashboard/users");
    } catch (error) {
      console.error("Failed to delete user:", error);
      // يمكنك إضافة إشعار خطأ هنا
    } finally {
      setOpenDel(false); // أغلق الحوار بعد المحاولة
    }
  };

  if (isFetching) {
    return (
      <div dir="rtl" className="p-4 md:p-6 space-y-4">
        <Skeleton className="h-10 w-1/3" />
        <div className="flex gap-4">
          <Skeleton className="h-32 w-32 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (!user) {
    return <div className="p-4 text-center">لا تتوفر بيانات</div>;
  }

  return (
    <div dir="rtl" className="p-4 md:p-6 max-w-6xl w-full mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-2xl md:text-3xl flex-1 font-bold tracking-tight">
          تفاصيل المستخدم
        </h1>
        <div className="flex flex-1 flex-wrap gap-2">
          {hasPermission(Permissions.EditUsers) && (
            <Button
              onClick={() => setOpen(true)}
              variant="outline"
              className="gap-2 cursor-pointer"
            >
              <Icon icon="mdi:pencil" className="text-lg" />
              تعديل
            </Button>
          )}

          {hasPermission(Permissions.DeleteUsers) && (
            <Button
              onClick={() => setOpenDel(true)}
              variant="destructive"
              className="gap-2 cursor-pointer"
            >
              <Icon icon="mdi:trash" className="text-lg" />
              حذف
            </Button>
          )}

          <Button
            onClick={() => setOpenActivities(true)}
            variant="outline"
            className="gap-2 cursor-pointer"
          >
            <Icon icon="mdi:history" className="text-lg" />
            عرض النشاطات
          </Button>
        </div>
      </div>

      <div className="bg-background rounded-xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
          <div className="flex flex-col items-center">
            <Avatar className="w-24 h-24 md:w-32 md:h-32 border-4 border-blue-100 dark:border-blue-900">
              {user.avatar ? (
                <AvatarImage src={`https://road.levantmenu.ae/storage/${user.avatar}`} alt={user.full_name} />
              ) : (
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-300 text-3xl text-white">
                  {user.full_name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              )}
            </Avatar>
            <Badge variant="secondary" className="mt-4 text-sm">
              User ID: {user.id}
            </Badge>
          </div>

          <div className="flex-1 space-y-6">
            <div className="md:text-left text-center">
              <h2 className="text-xl md:text-2xl font-semibold">
                {user.full_name}
              </h2>
              <p className="text-muted-foreground">@{user.username}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* البريد الالكتروني */}
              <DetailCard
                icon="mdi:email"
                title="البريد الالكتروني"
                content={
                  <>
                    <p className="font-medium">{user.email}</p>
                    {user.email_verified_at && (
                      <Badge
                        variant="outline"
                        className="mt-1 text-green-600 dark:text-green-300"
                      >
                        Verified
                      </Badge>
                    )}
                  </>
                }
                colorClass="bg-blue-50 dark:bg-blue-900/20"
              />

              {/* رقم الهاتف */}
              <DetailCard
                icon="mdi:phone"
                title="رقم الهاتف"
                content={user.phone_number || "غير متوفر"}
                colorClass="bg-green-50 dark:bg-green-900/20"
              />

              {/* الدور */}
              <DetailCard
                icon="mdi:account-group"
                title="الدور"
                content={
                  user?.roles?.length > 0 ? (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {user.roles?.map((role) => (
                        <Badge
                          key={role.id}
                          variant="outline"
                          className="text-purple-600 dark:text-purple-300"
                        >
                          {role.name}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    "غير متوفر"
                  )
                }
                colorClass="bg-purple-50 dark:bg-purple-900/20"
              />

              {/* تاريخ التسجيل */}
              <DetailCard
                icon="mdi:calendar-plus"
                title="تاريخ التسجيل"
                content={new Date(user.created_at).toLocaleDateString("en-US")}
                colorClass="bg-orange-50 dark:bg-orange-900/20"
              />

              {/* العنوان (إذا كان متوفراً) */}
              {user.address && (
                <DetailCard
                  icon="mdi:map-marker"
                  title="العنوان"
                  content={user.address}
                  colorClass="bg-amber-50 dark:bg-amber-900/20"
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <DialogEditUser
        show={open}
        handleClose={() => setOpen(false)}
        initData={user}
      />
      <DeleteDialog
        open={openDel}
        onClose={() => setOpenDel(false)}
        loading={isLoading}
        onConfirm={handleDelete}
      />
      <DialogShow
        show={openActivities}
        handleClose={() => setOpenActivities(false)}
        data={activities}
        arrayKey="activities"
        arrayFields={ActivityFieldsShow}
        loading={isFetchingActivities}
      />
    </div>
  );
};

export default UserInfo;
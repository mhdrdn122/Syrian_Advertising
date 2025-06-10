import { useGetProfileQuery, useGetCompanyQuery } from "../../RtkQuery/Slice/Auth/AuthSlice"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Icon } from "@iconify/react"
import { Skeleton } from "@/components/ui/skeleton"
import DialogEditProfile from "../../utils/Dialogs/EditAddDialog/Edit/DialogEditProfile"
import DialogEditCompany from "../../utils/Dialogs/EditAddDialog/Edit/DialogEditCompany"
import { useState } from "react"

const ProfileInfo = () => {
  const { data: profile, isFetching: isProfileFetching } = useGetProfileQuery()
  const { data: company, isFetching: isCompanyFetching } = useGetCompanyQuery()
  const [openProfile, setOpenProfile] = useState(false)
  const [openCompany, setOpenCompany] = useState(false)

  if (isProfileFetching || isCompanyFetching) {
    return (
      <div className="p-4 md:p-6 space-y-4">
        <Skeleton className="h-10 w-1/3" />
        <div className="flex gap-4">
          <Skeleton className="h-32 w-32 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  if (!profile || !company) {
    return <div className="p-4 text-center">لم يتم العثور على الملف الشخصي أو بيانات الشركة</div>
  }

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">الملف الشخصي للمدير</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setOpenProfile(true)} className="gap-2">
            <Icon icon="mdi:pencil" className="text-lg" />
            تعديل البيانات
          </Button>
          {/* <Button variant="destructive" className="gap-2">
            <Icon icon="mdi:trash" className="text-lg" />
            حذف الحساب
          </Button> */}
        </div>
      </div>

      <div className="bg-background rounded-xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm mb-6">
        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
          <div className="flex flex-col items-center">
            <Avatar className="w-24 h-24 md:w-32 md:h-32 border-4 border-blue-100 dark:border-blue-900">
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-300 text-3xl text-white">
                {profile.full_name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <Badge variant="secondary" className="mt-4 text-sm">
              رقم التعريف: {profile.id}
            </Badge>
          </div>

          <div className="flex-1 space-y-6">
            <div>
              <h2 className="text-xl md:text-2xl font-semibold">{profile.full_name}</h2>
              <p className="text-muted-foreground">@{profile.username}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-full">
                    <Icon icon="mdi:email" className="text-blue-600 dark:text-blue-300 text-xl" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">البريد الإلكتروني</p>
                    <p className="font-medium">{profile.email}</p>
                    {profile.email_verified_at ? (
                      <Badge variant="outline" className="mt-1 text-green-600 dark:text-green-400">
                        موثق
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="mt-1 text-yellow-600 dark:text-yellow-400">
                        غير موثق
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-100 dark:border-green-800">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 dark:bg-green-800 rounded-full">
                    <Icon icon="mdi:phone" className="text-green-600 dark:text-green-300 text-xl" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">رقم الهاتف</p>
                    <p className="font-medium">{profile.phone_number}</p>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-100 dark:border-purple-800">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-800 rounded-full">
                    <Icon icon="mdi:map-marker" className="text-purple-600 dark:text-purple-300 text-xl" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">العنوان</p>
                    <p className="font-medium">{profile.address || "غير محدد"}</p>
                  </div>
                </div>
              </div>

              <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-100 dark:border-orange-800">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 dark:bg-orange-800 rounded-full">
                    <Icon icon="mdi:calendar-sync" className="text-orange-600 dark:text-orange-300 text-xl" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">آخر تحديث</p>
                    <p className="font-medium">
                      {new Date(profile.updated_at).toLocaleDateString('ar-EG', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-background rounded-xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">معلومات الشركة</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setOpenCompany(true)} className="gap-2">
              <Icon icon="mdi:pencil" className="text-lg" />
              تعديل البيانات
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg border border-indigo-100 dark:border-indigo-800">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-800 rounded-full">
                <Icon icon="mdi:office-building" className="text-indigo-600 dark:text-indigo-300 text-xl" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">اسم الشركة</p>
                <p className="font-medium">{company.name}</p>
              </div>
            </div>
          </div>

          <div className="bg-teal-50 dark:bg-teal-900/20 p-4 rounded-lg border border-teal-100 dark:border-teal-800">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-teal-100 dark:bg-teal-800 rounded-full">
                <Icon icon="mdi:card-bulleted" className="text-teal-600 dark:text-teal-300 text-xl" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">رقم التسجيل التجاري</p>
                <p className="font-medium">{company.commercial_registration_number}</p>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-100 dark:border-purple-800">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-800 rounded-full">
                <Icon icon="mdi:map-marker" className="text-purple-600 dark:text-purple-300 text-xl" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">عنوان الشركة</p>
                <p className="font-medium">{company.address || "غير محدد"}</p>
              </div>
            </div>
          </div>

          <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-100 dark:border-orange-800">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 dark:bg-orange-800 rounded-full">
                <Icon icon="mdi:text-box" className="text-orange-600 dark:text-orange-300 text-xl" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">وصف الشركة</p>
                <p className="font-medium">{company.description || "غير محدد"}</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-full">
                <Icon icon="mdi:information" className="text-blue-600 dark:text-blue-300 text-xl" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">عن الشركة</p>
                <p className="font-medium">{company.about_us || "غير محدد"}</p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-100 dark:border-green-800">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-800 rounded-full">
                <Icon icon="mdi:contract" className="text-green-600 dark:text-green-300 text-xl" />
              </div>
              <div>
                
                <p className="text-sm text-muted-foreground">شروط العقود</p>
                <p className="font-medium">{company.contract_note || "غير محدد"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <DialogEditProfile show={openProfile} handleClose={() => setOpenProfile(false)} initData={profile} />
      <DialogEditCompany show={openCompany} handleClose={() => setOpenCompany(false)} initData={company} />
    </div>
  )
}

export default ProfileInfo
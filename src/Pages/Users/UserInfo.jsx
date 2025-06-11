import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Icon } from '@iconify/react';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { DeleteDialog } from '../../utils/Dialogs/DeleteDialog/DeleteDialog';
import { DialogEditUser } from '../../utils/Dialogs/EditAddDialog/Edit/DialogEditUser';
// import DialogShow from '../../utils/Dialogs/DialogShow';
import { useDeleteUserMutation, useGetActivitiesQuery, useShowOneUsersQuery } from '../../RtkQuery/Slice/Users/UsersApi';
import DialogShow from '../../utils/Dialogs/DialogShow/DialogShow';

const UserInfo = () => {
  const { id } = useParams();
  const { data: user, isFetching } = useShowOneUsersQuery(id);
  const { data: activities, isFetching: isFetchingActivities } = useGetActivitiesQuery(id);
  const [open, setOpen] = useState(false);
  const [openActivities, setOpenActivities] = useState(false);
  const [openDel, setOpenDel] = useState(false);
  const navigate = useNavigate();
  const [deleteUser] = useDeleteUserMutation();

  const activityFields = [
    {
      label: 'Activity',
      key: 'activity',
      icon: 'mdi:history',
    },
    {
      label: 'Created',
      key: 'created_at',
      icon: 'mdi:calendar',
      format: (value) => format(new Date(value), 'MMM dd, yyyy HH:mm'),
    },
  ];

  const handleDelete = async () => {
    await deleteUser(id).unwrap();
    navigate('/dashboard/users');
  };

  if (isFetching) {
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
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (!user) {
    return <div className="p-4 text-center">User not found</div>;
  }

  return (
    <div className="p-4 md:p-6 max-w-6xl w-full mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-2xl md:text-3xl flex-1 font-bold tracking-tight">User Details</h1>
        <div className="flex flex-1 flex-wrap gap-2">
          <Button onClick={() => setOpen(true)} variant="outline" className="gap-2 cursor-pointer">
            <Icon icon="mdi:pencil" className="text-lg" />
            Edit User
          </Button>
          <Button onClick={() => setOpenDel(true)} variant="destructive" className="gap-2 cursor-pointer">
            <Icon icon="mdi:trash" className="text-lg" />
            Delete User
          </Button>
          <Button onClick={() => setOpenActivities(true)} variant="outline" className="gap-2 cursor-pointer">
            <Icon icon="mdi:history" className="text-lg" />
            View Activities
          </Button>
        </div>
      </div>

      <div className="bg-background rounded-xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
          <div className="flex flex-col items-center">
            <Avatar className="w-24 h-24 md:w-32 md:h-32 border-4 border-blue-100 dark:border-blue-900">
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-300 text-3xl text-white">
                {user.full_name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <Badge variant="secondary" className="mt-4 text-sm">
              User ID: {user.id}
            </Badge>
          </div>

          <div className="flex-1  space-y-6">
            <div className='md:text-left text-center' >
              <h2 className="text-xl md:text-2xl font-semibold">{user.full_name}</h2>
              <p className="text-muted-foreground">@{user.username}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-full">
                    <Icon icon="mdi:email" className="text-blue-600 dark:text-blue-300 text-xl" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email Address</p>
                    <p className="font-medium">{user.email}</p>
                    {user.email_verified_at && (
                      <Badge variant="outline" className="mt-1 text-green-600 dark:text-green-300">
                        Verified
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
                    <p className="text-sm text-muted-foreground">Phone Number</p>
                    <p className="font-medium">{user.phone_number || 'Not provided'}</p>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-100 dark:border-purple-800">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-800 rounded-full">
                    <Icon icon="mdi:account-group" className="text-purple-600 dark:text-purple-300 text-xl" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Roles</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {user.roles?.map(role => (
                        <Badge key={role.id} variant="outline" className="text-purple-600 dark:text-purple-300">
                          {role.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-100 dark:border-orange-800">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 dark:bg-orange-800 rounded-full">
                    <Icon icon="mdi:calendar-plus" className="text-orange-600 dark:text-orange-300 text-xl" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Joined Date</p>
                    <p className="font-medium">
                      {new Date(user.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {user.address && (
                <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-100 dark:border-amber-800">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-100 dark:bg-amber-800 rounded-full">
                      <Icon icon="mdi:map-marker" className="text-amber-600 dark:text-amber-300 text-xl" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Address</p>
                      <p className="font-medium">{user.address}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <DialogEditUser show={open} handleClose={() => setOpen(false)} initData={user} />
      <DeleteDialog open={openDel} onClose={() => setOpenDel(false)} onConfirm={handleDelete} />
      <DialogShow
        show={openActivities}
        handleClose={() => setOpenActivities(false)}
        data={activities}
        arrayKey="activities"
        arrayFields={activityFields}
        loading={isFetchingActivities}
      />
    </div>
  );
};

export default UserInfo;
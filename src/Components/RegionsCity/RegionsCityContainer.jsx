import React, { useState } from "react";
import {
  useGetCitiesQuery,
  useAddNewCityMutation,
  useUpdateCityMutation,
  useDeleteCityMutation,
  useGetRegionsQuery,
  useAddNewRegionMutation,
  useUpdateRegionMutation,
  useDeleteRegionMutation,
} from "../../RtkQuery/Slice/CitiesAndRegions/CitiesAndRegionsApi"; // Adjust path as needed
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trash2, Edit, Plus, Loader2 } from "lucide-react";
// import { toast } from "sonner";
import { showToast } from "../../utils/Notifictions/showToast";
import { DeleteDialog } from "../../utils/Dialogs/DeleteDialog/DeleteDialog";
import { Toaster } from "react-hot-toast";

const RegionsCityContainer = () => {
  // State for city form
  const [cityForm, setCityForm] = useState({ name: "", is_active: 1 });
  const [editCityId, setEditCityId] = useState(null);
  const [isCityDialogOpen, setIsCityDialogOpen] = useState(false);
  const [deleteDialogCityOpen, setDeleteDialogCityOpen] = useState(false);
  const [deleteDialogRegionOpen, setDeleteDialogRegionOpen] = useState(false);

  const [id, setId] = useState(null);

  // State for region form
  const [regionForm, setRegionForm] = useState({
    name: "",
    city_id: "",
    is_active: 1,
  });
  const [editRegionId, setEditRegionId] = useState(null);
  const [isRegionDialogOpen, setIsRegionDialogOpen] = useState(false);
  const [cityFilter, setCityFilter] = useState("all");

  // RTK Query hooks
  const { data: cities = [], isLoading: isCitiesLoading } = useGetCitiesQuery();
  const { data: regions = [], isLoading: isRegionsLoading } =
    useGetRegionsQuery();
  const [addNewCity, { isLoading: addCityLoading }] = useAddNewCityMutation();
  const [updateCity] = useUpdateCityMutation();
  const [deleteCity, { isLoading: isLoadingDeleteCity }] =
    useDeleteCityMutation();
  const [addNewRegion, { isLoading: addRegionLoading }] =
    useAddNewRegionMutation();
  const [updateRegion] = useUpdateRegionMutation();
  const [deleteRegion, { isLoading: isLoadingDeleteRegion }] =
    useDeleteRegionMutation();

  // Handle city form submission
  const handleCitySubmit = async () => {
    try {
      if (editCityId) {
        await updateCity({ id: editCityId, ...cityForm }).unwrap();
        showToast("success", "تم تعديل المدينة بنجاح");
      } else {
        await addNewCity(cityForm).unwrap();
        showToast("success", "تم إضافة المدينة بنجاح");
      }
      setCityForm({ name: "", is_active: 1 });
      setEditCityId(null);
      setIsCityDialogOpen(false);
    } catch (error) {
      showToast("error", "حدث خطأ غير متوقع حاول من جديد ");
    }
  };

  // Handle region form submission
  const handleRegionSubmit = async () => {
    try {
      if (editRegionId) {
        await updateRegion({ id: editRegionId, ...regionForm }).unwrap();
        showToast("success", "تم تعديل المنطقة بنجاح");
      } else {
        await addNewRegion(regionForm).unwrap();
        showToast("success", "تم إضافة المنطقة بنجاح");
      }
      setRegionForm({ name: "", city_id: "", is_active: 1 });
      setEditRegionId(null);
      setIsRegionDialogOpen(false);
    } catch (error) {
      showToast("error", "حدث خطأ غير متوقع حاول من جديد ");
    }
  };

  // Handle city edit
  const handleEditCity = (city) => {
    setCityForm({ name: city.name, is_active: city.is_active });
    setEditCityId(city.id);
    setIsCityDialogOpen(true);
  };

  // Handle region edit
  const handleEditRegion = (region) => {
    setRegionForm({
      name: region.name,
      city_id: region.city_id,
      is_active: region.is_active,
    });
    setEditRegionId(region.id);
    setIsRegionDialogOpen(true);
  };

  const handleDeleteDialogCity = (id) => {
    setId(id);
    setDeleteDialogCityOpen(true);
  };
  // Handle city delete
  const handleDeleteCity = async () => {
    try {
      await deleteCity(id).unwrap();
      showToast("success", "تم حذف المدينة بنجاح ");
    } catch (error) {
      showToast("error", "حدث خطأ غير متوقع حاول من جديد ");
    }
    setDeleteDialogCityOpen(false);
  };

  const handleDeleteDialogRegion = (id) => {
    setId(id);
    setDeleteDialogRegionOpen(true);
  };
  // Handle region delete
  const handleDeleteRegion = async () => {
    try {
      await deleteRegion(id).unwrap();
      showToast("success", "تم حذف المنطقة بنجاح ");
    } catch (error) {
      showToast("error", "حدث خطأ غير متوقع حاول من جديد ");
    }
    setDeleteDialogRegionOpen(false);
  };

  // Filter regions by city
  const filteredRegions =
    cityFilter === "all"
      ? regions
      : regions.filter((region) => region.city_id === parseInt(cityFilter));

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Cities and Regions</h1>
      <Tabs defaultValue="cities" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="cities">Cities</TabsTrigger>
          <TabsTrigger value="regions">Regions</TabsTrigger>
        </TabsList>

        {/* Cities Tab */}
        <TabsContent value="cities">
          <div className="flex justify-end mb-4">
            <Dialog open={isCityDialogOpen} onOpenChange={setIsCityDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Add City
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editCityId ? "Edit City" : "Add New City"}
                  </DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <Input
                    placeholder="City Name"
                    value={cityForm.name}
                    onChange={(e) =>
                      setCityForm({ ...cityForm, name: e.target.value })
                    }
                  />
                  <Select
                    value={cityForm.is_active.toString()}
                    onValueChange={(value) =>
                      setCityForm({ ...cityForm, is_active: parseInt(value) })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Active</SelectItem>
                      <SelectItem value="0">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={handleCitySubmit}>
                    {addCityLoading ? (
                      <Loader2 />
                    ) : (
                      <>{editCityId ? "Update" : "Add"}</>
                    )}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          {isCitiesLoading ? (
            <div>Loading cities...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cities.map((city) => (
                  <TableRow key={city.id}>
                    <TableCell>{city.id}</TableCell>
                    <TableCell>{city.name}</TableCell>
                    <TableCell>
                      {city.is_active ? "Active" : "Inactive"}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditCity(city)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteDialogCity(city.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </TabsContent>

        {/* Regions Tab */}
        <TabsContent value="regions">
          <div className="flex justify-between mb-4">
            <Select value={cityFilter} onValueChange={setCityFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by City" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cities</SelectItem>
                {cities.map((city) => (
                  <SelectItem key={city.id} value={city.id.toString()}>
                    {city.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Dialog
              open={isRegionDialogOpen}
              onOpenChange={setIsRegionDialogOpen}
            >
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Add Region
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editRegionId ? "Edit Region" : "Add New Region"}
                  </DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <Input
                    placeholder="Region Name"
                    value={regionForm.name}
                    onChange={(e) =>
                      setRegionForm({ ...regionForm, name: e.target.value })
                    }
                  />
                  <Select
                    value={regionForm.city_id.toString()}
                    onValueChange={(value) =>
                      setRegionForm({ ...regionForm, city_id: parseInt(value) })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select City" />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map((city) => (
                        <SelectItem key={city.id} value={city.id.toString()}>
                          {city.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    value={regionForm.is_active.toString()}
                    onValueChange={(value) =>
                      setRegionForm({
                        ...regionForm,
                        is_active: parseInt(value),
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Active</SelectItem>
                      <SelectItem value="0">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={handleRegionSubmit}>
                    {addRegionLoading ? (
                      <Loader2 />
                    ) : (
                      <> {editRegionId ? "Update" : "Add"}</>
                    )}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          {isRegionsLoading ? (
            <div>Loading regions...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRegions.map((region) => (
                  <TableRow key={region.id}>
                    <TableCell>{region.id}</TableCell>
                    <TableCell>{region.name}</TableCell>
                    <TableCell>
                      {cities.find((city) => city.id === region.city_id)
                        ?.name || "Unknown"}
                    </TableCell>
                    <TableCell>
                      {region.is_active ? "Active" : "Inactive"}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditRegion(region)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteDialogRegion(region.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </TabsContent>
      </Tabs>
      <DeleteDialog
        open={deleteDialogCityOpen}
        onClose={() => setDeleteDialogCityOpen(false)}
        loading={isLoadingDeleteCity}
        onConfirm={handleDeleteCity}
      />
      <DeleteDialog
        open={deleteDialogRegionOpen}
        onClose={() => setDeleteDialogRegionOpen(false)}
        loading={isLoadingDeleteRegion}
        onConfirm={handleDeleteRegion}
      />
      <Toaster />
    </div>
  );
};

export default RegionsCityContainer;

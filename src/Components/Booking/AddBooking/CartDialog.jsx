import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";
import { typeOptions, productTypeOptions } from "./constants";

const CartDialog = ({
  openDialog,
  setOpenDialog,
  selectedSigns,
  roadSigns,
  calculationResult,
  customers,
  formik,
  updateSignFaces,
  removeFromCart,
  calculateTotal,
}) => {
  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogContent dir="rtl" className="w-full max-w-[90vw] max-w-4xl max-h-[90vh] overflow-y-auto overflow-x-hidden p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100 text-right">
            سلة الحجز
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-sm">
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">الزبون:</span>
              <span className="mt-1 text-gray-900 dark:text-gray-100 font-medium truncate">
                {customers?.find((c) => c.id === parseInt(formik.values.customer_id))?.full_name || "غير محدد"}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">نوع الحجز:</span>
              <span className="mt-1 text-gray-900 dark:text-gray-100 font-medium">
                {typeOptions.find((t) => t.value === parseInt(formik.values.type))?.label || "غير محدد"}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">تاريخ البداية:</span>
              <span className="mt-1 text-gray-900 dark:text-gray-100 font-medium">
                {formik.values.start_date || "غير محدد"}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">تاريخ النهاية:</span>
              <span className="mt-1 text-gray-900 dark:text-gray-100 font-medium">
                {formik.values.end_date || "غير محدد"}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">نوع المنتج:</span>
              <span className="mt-1 text-gray-900 dark:text-gray-100 font-medium">
                {productTypeOptions.find((p) => p.value === parseInt(formik.values.product_type))?.label || "غير محدد"}
              </span>
            </div>
          </div>

          {calculationResult && (
            <div className="p-4 bg-blue-50 dark:bg-blue-900 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 text-right">نتائج الحساب</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">السعر الإجمالي:</span>
                  <span className="mt-1 text-gray-900 dark:text-gray-100 font-medium">
                    {calculationResult.total_price.toFixed(2)} ليرة
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">مساحة الإعلان:</span>
                  <span className="mt-1 text-gray-900 dark:text-gray-100 font-medium">
                    {calculationResult.total_advertising_space.toFixed(2)} متر
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">مساحة الطباعة:</span>
                  <span className="mt-1 text-gray-900 dark:text-gray-100 font-medium">
                    {calculationResult.total_printing_space.toFixed(2)} متر
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-100 dark:bg-gray-800">
                  <TableHead className="text-right w-auto">المنطقة</TableHead>
                  <TableHead className="text-right w-auto">المكان</TableHead>
                  <TableHead className="text-right w-20">عدد الأوجه</TableHead>
                  <TableHead className="text-right w-32">أمتار الطباعة</TableHead>
                  <TableHead className="text-right w-16">إجراء</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedSigns.map((sign) => {
                  const roadSign = roadSigns?.find((rs) => rs.id === sign.road_sign_id);
                  return (
                    <TableRow key={sign.road_sign_id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <TableCell className="truncate max-w-[120px] sm:max-w-[150px]">
                        {roadSign?.region.name}
                      </TableCell>
                      <TableCell className="truncate max-w-[120px] sm:max-w-[150px]">
                        {roadSign?.place}
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min="1"
                          max={sign.max_faces}
                          value={sign.booking_faces}
                          onChange={(e) => updateSignFaces(sign.road_sign_id, e.target.value)}
                          className="w-16 text-right"
                        />
                      </TableCell>
                      <TableCell>{roadSign?.printing_meters || "غير متوفر"}</TableCell>
                      <TableCell>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeFromCart(sign.road_sign_id)}
                          className="bg-red-500 hover:bg-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
        <DialogFooter className="flex justify-between mt-6 flex-wrap gap-2">
          <Button
            type="button"
            onClick={calculateTotal}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
          >
            حساب السعر الإجمالي
          </Button>
          <Button
            type="button"
            onClick={formik.submitForm}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
          >
            تثبيت الحجز
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CartDialog;
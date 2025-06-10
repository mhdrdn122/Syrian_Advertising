import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

const BookingTable = ({isLoadingRoadSigns , roadSigns , addToCart , addedSignIds}) => {
  return (
    <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
              اللوحات الطرقية
            </h2>
            <div className="rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-100 dark:bg-gray-800">
                    <TableHead className="text-right">نموذج</TableHead>
                    <TableHead className="text-right">عدد الأوجه</TableHead>
                    <TableHead className="text-right">
                      عدد الأوجه المحجوزة
                    </TableHead>
                    <TableHead className="text-right">عدد الأمتار</TableHead>
                    <TableHead className="text-right">القياس</TableHead>
                    <TableHead className="text-right">المنطقة</TableHead>
                    <TableHead className="text-right">مكان التموضع</TableHead>
                    <TableHead className="text-right">الاتجاه</TableHead>
                    <TableHead className="text-right">الحالة</TableHead>
                    <TableHead className="text-right">إجراء</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoadingRoadSigns ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-4">
                        جاري التحميل...
                      </TableCell>
                    </TableRow>
                  ) : roadSigns?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-4">
                        لا توجد لوحات متوفرة لهذه الفترة
                      </TableCell>
                    </TableRow>
                  ) : (
                    roadSigns?.map((sign) => (
                      <TableRow
                        key={sign.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <TableCell className="truncate max-w-[120px] sm:max-w-[150px]">
                          {sign.template.model}
                        </TableCell>
                        <TableCell>{sign.faces_number}</TableCell>
                        <TableCell>{sign.total_faces_on_date}</TableCell>
                        <TableCell>{sign.advertising_meters}</TableCell>
                        <TableCell>{sign.template.size}</TableCell>
                        <TableCell className="truncate max-w-[120px] sm:max-w-[150px]">
                          {sign.region.name}
                        </TableCell>
                        <TableCell className="truncate max-w-[120px] sm:max-w-[150px]">
                          {sign.place}
                        </TableCell>
                        <TableCell className="truncate max-w-[120px] sm:max-w-[150px]">
                          {sign.directions}
                        </TableCell>
                        <TableCell>
                          {sign.faces_number - sign.total_faces_on_date === 0
                            ? "لا يوجد أي أوجه متاحة"
                            : `${
                                sign.faces_number - sign.total_faces_on_date
                              } وجه متاح`}
                        </TableCell>
                        <TableCell>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => addToCart(sign)}
                            disabled={
                              sign.faces_number - sign.total_faces_on_date === 0
                            }
                            className={`flex items-center gap-2 ${
                              addedSignIds.has(sign.id)
                                ? "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300"
                                : "bg-white dark:bg-gray-700"
                            }`}
                          >
                            <ShoppingCart className="h-4 w-4" />
                            <span>إضافة</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
  )
}

export default BookingTable
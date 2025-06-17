import React, { memo, useContext } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { BookingContext } from "../../../../Context/BookingContext";

const CartTable = () => {
  const {
    selectedSigns,
    roadSigns,
    updateSignFaces,
    removeFromCart,
    isEditMode,
    bookingData,
  } = useContext(BookingContext);

  return (
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
          const faces_max = roadSign
            ? isEditMode
              ? roadSign.faces_number -
                roadSign.total_faces_on_date +
                (bookingData?.roadsigns.find(
                  (rs) => rs.id === sign.road_sign_id
                )?.pivot.booking_faces || 0)
              : roadSign.faces_number - roadSign.total_faces_on_date
            : null;
          return (
            <TableRow
              key={sign.road_sign_id}
              className="hover:bg-gray-50 dark:hover:bg-gray-700"
            >
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
                  max={faces_max}
                  value={sign.booking_faces}
                  onChange={(e) =>
                    updateSignFaces(sign.road_sign_id, e.target.value)
                  }
                  className="w-16 text-right"
                />
              </TableCell>
              <TableCell>
                {roadSign?.template?.printing_space || "غير متوفر"}
              </TableCell>
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
  );
};

export default memo(CartTable);

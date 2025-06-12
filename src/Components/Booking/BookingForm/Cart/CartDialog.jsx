import React from "react";
import CartInfo from "./CartInfo";
import CalculationResult from "./CalculationResult";
import CartTable from "./CartTable";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useGetCustomersQuery } from "../../../../RtkQuery/Slice/Customers/CustomersApi";
import { Loader2 } from "lucide-react";

const CartDialog = ({
  openCartDialog,
  isEditMode,
  setOpenCartDialog,
  calculationResult,
  calculateTotal,
  formik,
  setContractDialog,
  calculateDiscountedPrice,

  handleDiscountValueChange,
  discountValue,
  setShowDiscount,
  showDiscount,
  discountType,
  setDiscountType,
  setDiscountValue,

  selectedSigns,
  roadSigns,
  updateSignFaces,
  removeFromCart,

  isLoadingAdd,
  isLoadingUpdate,
}) => {
  const { data: customers, isLoading: isLoadingCustomers } =
    useGetCustomersQuery();
  return (
    <Dialog open={openCartDialog} onOpenChange={setOpenCartDialog}>
      <DialogContent
        dir="rtl"
        className="w-full max-w-[90vw] max-w-4xl max-h-[90vh] dialog-content overflow-auto p-6"
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100 text-right">
            سلة الحجز
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <CartInfo formik={formik} customers={customers} />

          {calculationResult && (
            <CalculationResult
              calculateDiscountedPrice={calculateDiscountedPrice}
              handleDiscountValueChange={handleDiscountValueChange}
              calculationResult={calculationResult}
              discountValue={discountValue}
              setShowDiscount={setShowDiscount}
              showDiscount={showDiscount}
              discountType={discountType}
              setDiscountType={setDiscountType}
              setDiscountValue={setDiscountValue}
            />
          )}

          <div className="rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <CartTable
              selectedSigns={selectedSigns}
              roadSigns={roadSigns}
              updateSignFaces={updateSignFaces}
              removeFromCart={removeFromCart}
            />
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
          {formik.values.type && (
            <Button
              type="button"
              onClick={() => setContractDialog(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg"
            >
              {isLoadingAdd || isLoadingUpdate ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {parseInt(formik.values.type) === 1
                    ? "... جاري تصدير عقد دائم"
                    : "جاري تصدير عقد مؤقت "} 
                </>
              ) : parseInt(formik.values.type) === 1 ? (
                "تصدير عقد دائم"
              ) : (
                "تصدير عقد مؤقت"
              )}
            </Button>
          )}
          <Button
            type="button"
            onClick={formik.submitForm}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
          >
            {isLoadingAdd || isLoadingUpdate ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />

                {isEditMode ? "... جاري تعديل الحجز " : "جاري تثبيت الحجز ..."}
              </>
            ) : isEditMode ? (
              "تعديل الحجز"
            ) : (
              "تثبيت الحجز"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CartDialog;

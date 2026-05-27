import { getDataInitial } from "@/apis/querysInitial.apis";
import { useQuery } from "@tanstack/react-query";
import { Hammer, Truck, UserCheck } from "lucide-react";

export default function DashboardView() {
  const { data } = useQuery({
    queryKey: ["/"],
    queryFn: getDataInitial,
  });

  console.log(data);

  return (
    <div className="h-full w-full p-4">
      <div className="h-[25%] w-full p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {
          data?.map(info => (
            <>
              <div
                key={info.getSupplierAndTotalNumberOfSupplier?.id}
                className="w-full h-full flex gap-x-6 items-center justify-center border border-gray-300 dark:border-gray-700 rounded-lg p-4"
              >
                <div className="w-[30%] flex items-center justify-center">
                  <Truck className="size-12" />
                </div>
                <div className="space-y-4 w-[60%]">
                  <div>
                    <h2 className="font-bold">Ultimo proveedor:</h2>
                    <h2 className="font-bold text-lg">{info.getSupplierAndTotalNumberOfSupplier?.nombre_proveedor}</h2>
                  </div>
                  <div>
                    <h2 className="font-bold text-md">Total proveedor: <span className="text-lg">{info.getSupplierAndTotalNumberOfSupplier?.total_proveedor}</span></h2>
                  </div>
                </div>
              </div>

              <div
                className="w-full h-full flex gap-x-6 items-center justify-center border border-gray-300 dark:border-gray-700 rounded-lg p-4"
              >
                <div className="w-[30%] flex items-center justify-center">
                  <UserCheck className="size-12" />
                </div>
                <div className="space-y-4 w-[60%]">
                  <div>
                    <h2 className="font-bold">Ultimo cliente:</h2>
                    <h2 className="font-bold text-lg">{info.getCustomerAndTotalNumberOfCustomer?.nombre_cliente}</h2>
                  </div>
                  <div>
                    <h2 className="font-bold text-md">Total cliente: <span className="text-lg">{info.getCustomerAndTotalNumberOfCustomer?.total_cliente}</span></h2>
                  </div>
                </div>
              </div>

              <div
                className="w-full h-full flex gap-x-6 items-center justify-center border border-gray-300 dark:border-gray-700 rounded-lg p-4"
              >
                <div className="w-[30%] flex items-center justify-center">
                  <Hammer className="size-12" />
                </div>
                <div className="space-y-4 w-[60%]">
                  <div>
                    <h2 className="font-bold">Ultimo producto:</h2>
                    <h2 className="font-bold text-lg">{info.getProductsAndTotalNumberOfProducts?.nombre_producto}</h2>
                  </div>
                  <div>
                    <h2 className="font-bold text-md">Total producto: <span className="text-lg">{info.getProductsAndTotalNumberOfProducts?.total_producto}</span></h2>
                  </div>
                </div>
              </div>
            </>
          ))
        }
      </div>
    </div>
  )
}

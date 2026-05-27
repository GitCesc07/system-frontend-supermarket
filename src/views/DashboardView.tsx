import { getDataInitial } from "@/apis/querysInitial.apis";
import { useQuery } from "@tanstack/react-query";
import { Hammer, Truck, UserCheck } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { formatWeekDate } from "@/utils/utilidad";


export const description = "A simple area chart"

const chartConfig = {
  gasto_total: {
    label: "Gasto",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

export default function DashboardView() {
  const { data } = useQuery({
    queryKey: ["/"],
    queryFn: getDataInitial,
  });

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
                <div className="w-[30%] flex items-center justify-center bg-slate-50 dark:bg-slate-900 border boder-gray-300 dark:border-gray-700 p-4 rounded-lg">
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
                <div className="w-[30%] flex items-center justify-center bg-slate-50 dark:bg-slate-900 border boder-gray-300 dark:border-gray-700 p-4 rounded-lg">
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
                <div className="w-[30%] flex items-center justify-center bg-slate-50 dark:bg-slate-900 border boder-gray-300 dark:border-gray-700 p-4 rounded-lg">
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

      <div className="w-full p-4 grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4">
        {
          data?.map(info => (
            <Card>
              <CardHeader>
                <CardTitle>Compras</CardTitle>
                <CardDescription>
                  Vista de las compra en la semana
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig}>
                  <AreaChart
                    accessibilityLayer
                    data={info.getBuysChart}
                    margin={{
                      left: 12,
                      right: 12,
                    }}
                  >
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="dia_semana"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      tickFormatter={(value) => value.slice(0, 3)}
                    />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent indicator="line" />}
                    />
                    <Area
                      dataKey="gasto_total"
                      type="natural"
                      fill="var(--color-gasto_total)"
                      fillOpacity={0.4}
                      stroke="var(--color-gasto_total)"
                    />
                  </AreaChart>
                </ChartContainer>
              </CardContent>
              <CardFooter>
                <div className="flex w-full items-start gap-2 text-sm">
                  <div className="grid gap-2">
                    <div className="flex items-center gap-2 leading-none text-muted-foreground">
                      {"Semana " + formatWeekDate()}
                    </div>
                  </div>
                </div>
              </CardFooter>
            </Card>
          ))
        }

      </div>
    </div>
  )
}

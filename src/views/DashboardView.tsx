import { getDataInitial, getDataInitialChartBuysAndSales } from "@/apis/querysInitial.apis";
import { useQuery } from "@tanstack/react-query";
import { Hammer, Truck, UserCheck } from "lucide-react";
import { Area, AreaChart, CartesianGrid, Line, LineChart, XAxis } from "recharts"

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


export const description = "A simple area chart"

const chartConfig = {
  gasto_total: {
    label: "Gasto",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

const chartConfigSales = {
  monto_total: {
    label: "Venta",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

const chartConfigSalesByBrand = {
  total_venta: {
    label: "Marca",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export default function DashboardView() {


  const chartConfigData = {
    visitors: {
      label: "NoVisitor",
    },
    desktop: {
      label: "compra",
      color: "var(--chart-1)",
    },
    mobile: {
      label: "venta",
      color: "var(--chart-2)",
    },
  } satisfies ChartConfig

  const { data } = useQuery({
    queryKey: ["/"],
    queryFn: getDataInitial,
  });

  const { data: dataChart } = useQuery({
    queryKey: ["querysCharts"],
    queryFn: getDataInitialChartBuysAndSales,
  });

  const filteredData = dataChart?.filter((item) => {
    const date = new Date(item.fecha)
    const referenceDate = new Date("2024-06-30")
    const daysToSubtract = 90
    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)
    return date >= startDate
  })

  return (
    <div className="h-full w-full space-y-12 lg:space-y-0">
      <div className="h-auto w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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

      <div className="h-auto mt-8 w-full flex items-center justify-center">
        <Card className="pt-0 w-full">
          <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
            <div className="grid flex-1 gap-1">
              <CardTitle>Comparativo de compras y ventas</CardTitle>
              <CardDescription>
                Vista de las compras y ventas los ultimos 3 meses
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
            <ChartContainer
              config={chartConfig}
              className="aspect-auto h-62.5 w-full"
            >
              <AreaChart data={filteredData}>
                <defs>
                  <linearGradient id="fillventa" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--color-venta)"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-venta)"
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                  <linearGradient id="fillCompra" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--color-compra)"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-compra)"
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="fecha"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={32}
                  tickFormatter={(value) => {
                    const date = new Date(value)
                    return date.toLocaleDateString("es-Es", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                />
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      labelFormatter={(value) => {
                        return new Date(value).toLocaleDateString("en-ES", {
                          month: "short",
                          day: "numeric",
                        })
                      }}
                      indicator="dot"
                    />
                  }
                />
                <Area
                  dataKey="compra"
                  type="natural"
                  fill="url(#fillCompra)"
                  stroke="var(--color-compra)"
                  stackId="a"
                />
                <Area
                  dataKey="venta"
                  type="natural"
                  fill="url(#fillVenta)"
                  stroke="var(--color-venta)"
                  stackId="a"
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div className="w-full grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4 mt-0 md:mt-8">
        {
          data?.map(info => (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Compras</CardTitle>
                  <CardDescription>
                    Vista de las compras
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfigData}>
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
                        Ultimos 7 días
                      </div>
                    </div>
                  </div>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Ventas</CardTitle>
                  <CardDescription>Vista de las ventas</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfigSales}>
                    <LineChart
                      accessibilityLayer
                      data={info.getSalesChart}
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
                        content={<ChartTooltipContent hideLabel />}
                      />
                      <Line
                        dataKey="monto_total"
                        type="natural"
                        stroke="var(--color-monto_total)"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ChartContainer>
                </CardContent>
                <CardFooter className="flex-col items-start gap-2 text-sm">
                  <div className="flex w-full items-start gap-2 text-sm">
                    <div className="grid gap-2">
                      <div className="flex items-center gap-2 leading-none text-muted-foreground">
                        Ultimos 7 días
                      </div>
                    </div>
                  </div>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Ventas por marca</CardTitle>
                  <CardDescription>Vista de las ventas por marcas</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfigSalesByBrand}>
                    <LineChart
                      accessibilityLayer
                      data={info.getSalesByBrandChart}
                      margin={{
                        left: 12,
                        right: 12,
                      }}
                    >
                      <CartesianGrid vertical={false} />
                      <XAxis
                        dataKey="producto"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        tickFormatter={(value) => value.slice(0, 3)}
                      />
                      <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent hideLabel />}
                      />
                      <Line
                        dataKey="total_venta"
                        type="natural"
                        stroke="var(--color-total_venta)"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ChartContainer>
                </CardContent>
                <CardFooter className="flex-col items-start gap-2 text-sm">
                  <div className="flex w-full items-start gap-2 text-sm">
                    <div className="grid gap-2">
                      <div className="flex items-center gap-2 leading-none text-muted-foreground">
                        Ultimos 7 días
                      </div>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            </>
          ))
        }
      </div>
    </div>
  )
}

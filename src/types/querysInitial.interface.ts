import { z } from "zod";


const dataImageShema = z.object({
    logotipo: z.string().optional().nullable(),
});

export const dataproductExpiringShema = z.object({
    id: z.string().optional().nullable(),
    total_productos: z.number().optional().nullable(),
    nombre_producto: z.string().optional().nullable(),
    fecha_expiracion: z.string().optional().nullable(),
    imagen_url: z.string().optional().nullable(),
});

export const dataProductWithMinimunQuantityShema = z.object({
    id: z.string().optional().nullable(),
    nombre_producto: z.string().optional().nullable(),
    imagen_url: z.string().optional().nullable(),
    cantidad_minima: z.number().optional().nullable(),
    stock: z.number().optional().nullable(),
});

export const dataCustomerAndTotalNumberOfCustomerShema = z.object({
    id: z.string().optional().nullable(),
    nombre_cliente: z.string().optional().nullable(),
    total_cliente: z.number().optional().nullable()
});

export const dataSupllierAndTotalNumberOfSupllierShema = z.object({
    id: z.string().optional().nullable(),
    nombre_proveedor: z.string().optional().nullable(),
    total_proveedor: z.number().optional().nullable()
});

export const dataProductsAndTotalNumberOfProductsShema = z.object({
    id: z.string().optional().nullable(),
    nombre_producto: z.string().optional().nullable(),
    total_producto: z.number().optional().nullable()
});


export const dataTotalInventoryShema = z.object({
    id: z.string().optional().nullable(),
    total_inventario: z.string().optional().nullable(),
    nombre_producto: z.string().optional().nullable()
});

export const dataBuysTotalShema = z.object({
    id: z.string().optional().nullable(),
    monto_total: z.string().optional().nullable(),
    total_compras: z.number().optional().nullable()
});

export const dataBillingTotalShema = z.object({
    id: z.string().optional().nullable(),
    monto_total: z.string().optional().nullable(),
    total_ventas: z.number().optional().nullable()
});

// * Data query initial data
const queryShema = z.object({
    dataImagen: dataImageShema.nullable().optional(),
    dataproductExpiring: z.array(dataproductExpiringShema.optional().nullable()),
    dataProductWithMinimunQuantity: z.array(dataProductWithMinimunQuantityShema.optional().nullable()),
    getCustomerAndTotalNumberOfCustomer: dataCustomerAndTotalNumberOfCustomerShema.optional().nullable(),
    getSupplierAndTotalNumberOfSupplier: dataSupllierAndTotalNumberOfSupllierShema.optional().nullable(),
    getProductsAndTotalNumberOfProducts: dataProductsAndTotalNumberOfProductsShema.optional().nullable(),
    getproductsInInventory: dataTotalInventoryShema.optional().nullable(),
    getBuysTotal: dataBuysTotalShema.optional().nullable(),
    getBillingTotal: dataBillingTotalShema.optional().nullable(),
});

export const queryDataSchema = z.array(
    queryShema.pick({
        dataImagen: true,
        dataproductExpiring: true,
        dataProductWithMinimunQuantity: true,
        getCustomerAndTotalNumberOfCustomer: true,
        getSupplierAndTotalNumberOfSupplier: true,
        getProductsAndTotalNumberOfProducts: true,
        getproductsInInventory: true,
        getBuysTotal: true,
        getBillingTotal: true
    })
)

export type QueryInitial = z.infer<typeof queryShema>;
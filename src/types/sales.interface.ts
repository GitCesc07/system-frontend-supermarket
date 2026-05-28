import { z } from "zod";

export const salesTaxManualShema = z.object({
    porcentaje: z.string(),
    valor_porcentaje: z.number(),
    valor_cantidad: z.number()
})

export const paymentMethodSales = z.object({
    monto: z.string(),
    metodo: z.string(),
    observaciones: z.string()
})

export const salesCustomerManualShema = z.object({
    id: z.string(),
    nombre_cliente: z.string()
})

export const salesShema = z.object({
    id: z.string(),
    numero_venta: z.number().nullable(),
    observaciones: z.string(),
    subtotal: z.string(),
    total: z.string(),
    impuesto_manual: z.array(salesTaxManualShema).nullable(),
    metodo_pago: z.array(paymentMethodSales),
    cliente_existente: z.number().optional().nullable(),
    cliente_manual: z.array(salesCustomerManualShema).nullable().optional(),
    fecha_creacion: z.string(),
    id_cliente: z.string().nullable().optional(),
    cliente: z.string().nullable().optional(),
    nombre_cliente_manual: z.string().optional().nullable(),
    nombre_usuario_creador: z.string().optional()
});


export const salesDataSchema = z.array(
    salesShema.pick({
        id: true,
        numero_venta: true,
        observaciones: true,
        subtotal: true,
        total: true,
        impuesto_manual: true,
        cliente_existente: true,
        cliente_manual: true,
        metodo_pago: true,
        fecha_creacion: true,
        id_cliente: true,
        nombre_cliente_manual: true,
        cliente: true,
        nombre_usuario_creador: true
    })
)

export type Sales = z.infer<typeof salesShema>;

// * Form data sales
export const salesDetailsShema = z.array(
    z.object({
        utilidad: z.string(),
        detalle_nombre_producto: z.string().optional().nullable(),
        nombre_producto: z.string(),
        precio_compra: z.string(),
        precio_venta: z.string(),
        cantidad: z.string(),
        subtotal_compra: z.string(),
        subtotal_venta: z.string(),
        id_producto: z.string()
    })
)

// * Form data sales
export const salesDetailsFormShema = z.object({
    utilidad: z.number(),
    nombre_producto: z.string(),
    detalle_nombre_producto: z.string().optional().nullable(),
    precio_compra: z.string(),
    precio_venta: z.string(),
    cantidad: z.number(),
    subtotal_compra: z.string(),
    subtotal_venta: z.string(),
    id_producto: z.string()
});

const salesFormShema = z.object({
    id: z.string(),
    numero_venta: z.string().nullable(),
    observaciones: z.string(),
    subtotal: z.string(),
    total: z.string(),
    estado: z.number().optional(),
    impuesto_manual: z.array(salesTaxManualShema).nullable(),
    metodo_pago: z.array(paymentMethodSales).nullable(),
    cliente_existente: z.number().optional().nullable(),
    cliente_manual: z.array(salesCustomerManualShema).nullable().optional(),
    fecha_creacion: z.string(),
    fecha_vencimiento: z.string().nullable(),
    id_cliente: z.string().nullable().optional(),
    cliente: z.string().nullable().optional(),
    detalles_venta: salesDetailsShema,
    nombre_cliente_manual: z.string().optional().nullable(),
    usuario_creador: z.string(),
    nombre_usuario_creador: z.string().optional()
});

export const salesFormDataSchema = z.array(
    salesFormShema.pick({
        id: true,
        numero_venta: true,
        observaciones: true,
        subtotal: true,
        estado: true,
        total: true,
        impuesto_manual: true,
        metodo_pago: true,
        cliente_existente: true,
        cliente_manual: true,
        fecha_creacion: true,
        id_cliente: true,
        nombre_cliente_manual: true,
        cliente: true,
        nombre_usuario_creador: true
    })
)

export type SalesData = z.infer<typeof salesFormShema>;

export type SalesFormData = Pick<SalesData,
    "id" |
    "numero_venta" |
    "observaciones" |
    "subtotal" |
    "total" |
    "impuesto_manual" |
    "metodo_pago" |
    "fecha_creacion" |
    "id_cliente" |
    "cliente_existente" |
    "cliente" |
    "nombre_cliente_manual" |
    "detalles_venta" |
    "usuario_creador"
>;

export type SalesFormDataInfo = Pick<SalesData,
    "id" |
    "numero_venta" |
    "observaciones" |
    "subtotal" |
    "total" |
    "impuesto_manual" |
    "metodo_pago" |
    "fecha_creacion" |
    "id_cliente" |
    "detalles_venta" |
    "nombre_cliente_manual" |
    "cliente_existente" |
    "cliente_manual" |
    "cliente"
>;

export type SalesFormDataAdd = Pick<SalesData,
    "observaciones" |
    "subtotal" |
    "total" |
    "impuesto_manual" |
    "metodo_pago" |
    "nombre_cliente_manual" |
    "id_cliente" |
    "detalles_venta" |
    "fecha_vencimiento" |
    "usuario_creador"
>;

export type SalesFormDataDelete = Pick<SalesData, "id" | "numero_venta">;

// * Temporary purchasing data
const tempPurchasingDetailsShema = z.object({
    id_producto: z.string(),
    utilidad: z.string(),
    nombre_producto: z.string(),
    detalle_nombre_producto: z.string().optional().nullable(),
    precio_compra: z.string(),
    precio_venta: z.string(),
    cantidad: z.number(),
    subtotal_compra: z.string(),
    subtotal_venta: z.string()
});



export const tempPurchasingDetailsDataSchema = z.array(
    tempPurchasingDetailsShema.pick({
        id_producto: true,
        utilidad: true,
        detalle_nombre_producto: true,
        nombre_producto: true,
        precio_compra: true,
        precio_venta: true,
        cantidad: true,
        subtotal_compra: true,
        subtotal_venta: true
    })
)

export type TempPurchasingDetails = z.infer<typeof tempPurchasingDetailsShema>;

export type TempSalesFormDataDetails = Pick<TempPurchasingDetails,
    "id_producto" |
    "utilidad" |
    "detalle_nombre_producto" |
    "nombre_producto" |
    "precio_compra" |
    "precio_venta" |
    "cantidad" |
    "subtotal_compra" |
    "subtotal_venta"
>;

// * Temporary purchasing data
const tempPurchasingShema = z.object({
    id_producto: z.string(),
    utilidad: z.number(),
    nombre_producto: z.string(),
    detalle_nombre_producto: z.string().optional().nullable(),
    precio_venta: z.string(),
    precio_compra: z.string(),
    cantidad: z.number(),
    stock: z.number(),
    subtotal_compra: z.string(),
    subtotal_venta: z.string()
});



export const tempPurchasingDataSchema = z.array(
    tempPurchasingShema.pick({
        id_producto: true,
        detalle_nombre_producto: true,
        nombre_producto: true,
        utilidad: true,
        precio_venta: true,
        precio_compra: true,
        cantidad: true,
        stock: true,
        subtotal_compra: true,
        subtotal_venta: true
    })
)

export type TempPurchasing = z.infer<typeof tempPurchasingShema>;

export type TempPurchasingFormData = Pick<TempPurchasing,
    "id_producto" |
    "detalle_nombre_producto" |
    "nombre_producto" |
    "utilidad" |
    "precio_venta" |
    "precio_compra" |
    "cantidad" |
    "stock" |
    "subtotal_compra" |
    "subtotal_venta"

>;

export type TempPurchasingFormDataAdd = Pick<TempPurchasing,
    "detalle_nombre_producto" |
    "nombre_producto" |
    "utilidad" |
    "precio_venta" |
    "precio_compra" |
    "cantidad" |
    "stock" |
    "subtotal_compra" |
    "subtotal_venta"
>;
export interface DataItem {
    value: string;
    label: string;
}
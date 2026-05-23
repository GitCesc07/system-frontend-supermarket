import { z } from "zod";

const buysTaxManualShema = z.object({
    porcentaje: z.string(),
    valor_porcentaje: z.number(),
    valor_cantidad: z.number()
});

const paymentMethodBuys = z.object({
    metodo: z.string(),
    monto: z.string(),
    observaciones: z.string(),
})

const buysShema = z.object({
    id: z.string(),
    numero_factura_proveedor: z.string(),
    numero_compra: z.number(),
    termino: z.string(),
    observaciones: z.string(),
    estado: z.number(),
    subtotal: z.string(),
    total: z.string(),
    impuesto_manual: z.array(buysTaxManualShema),
    metodo_pago: z.array(paymentMethodBuys),
    fecha_creacion: z.string(),
    id_proveedor: z.string(),
    proveedor: z.string(),
    nombre_usuario_creador: z.string().optional()
});


export const buysDataSchema = z.array(
    buysShema.pick({
        id: true,
        numero_factura_proveedor: true,
        numero_compra: true,
        termino: true,
        observaciones: true,
        subtotal: true,
        estado: true,
        total: true,
        impuesto_manual: true,
        metodo_pago: true,
        fecha_creacion: true,
        id_proveedor: true,
        proveedor: true,
        nombre_usuario_creador: true
    })
)

export type Buys = z.infer<typeof buysShema>;

// * Form data buys
export const buysDetailsShema = z.array(
    z.object({
        precio_compra: z.string(),
        cantidad: z.string(),
        subtotal: z.string(),
        id_producto: z.string(),
    })
)

// * Form data buys
export const buysDetailsFormShema = z.object({
    precio_compra: z.string(),
    cantidad: z.number(),
    subtotal: z.string(),
    id_producto: z.string(),
});

const buysTaxManualFormShema = z.object({
    porcentaje: z.string(),
    valor_porcentaje: z.number(),
    valor_cantidad: z.number()
})

const buysFormShema = z.object({
    id: z.string(),
    numero_factura_proveedor: z.string(),
    numero_compra: z.string(),
    observaciones: z.string(),
    estado: z.number(),
    subtotal: z.string(),
    total: z.string(),
    impuesto_manual: z.array(buysTaxManualFormShema),
    metodo_pago: z.array(paymentMethodBuys),
    fecha_creacion: z.string(),
    fecha_modificacion: z.string(),
    id_proveedor: z.string(),
    proveedor: z.string(),
    detalles_compra: buysDetailsShema,
    usuario_creador: z.string(),
    nombre_usuario_creador: z.string().optional(),
    usuario_modificador: z.string(),
    nombre_usuario_modificador: z.string().optional()
});

export const buysFormDataSchema = z.array(
    buysFormShema.pick({
        id: true,
        numero_factura_proveedor: true,
        numero_compra: true,
        estado: true,
        observaciones: true,
        subtotal: true,
        total: true,
        impuesto_manual: true,
        metodo_pago: true,
        // detalles_compra: true,        
        fecha_creacion: true,
        fecha_modificacion: true,
        id_proveedor: true,
        proveedor: true,
        nombre_usuario_creador: true,
        nombre_usuario_modificador: true
    })
)

export type BuysData = z.infer<typeof buysFormShema>;

export type BuysFormData = Pick<BuysData,
    "id" |
    "numero_factura_proveedor" |
    "numero_compra" |
    "observaciones" |
    "estado" |
    "subtotal" |
    "total" |
    "impuesto_manual" |
    "metodo_pago" |
    "fecha_creacion" |
    "id_proveedor" |
    "proveedor" |
    "detalles_compra" |
    "usuario_creador"
>;

export type BuysFormDataInfo = Pick<BuysData,
    "id" |
    "numero_factura_proveedor" |
    "numero_compra" |
    "estado" |
    "observaciones" |
    "subtotal" |
    "total" |
    "impuesto_manual" |
    "metodo_pago" |
    "fecha_creacion" |
    "id_proveedor" |
    "detalles_compra" |
    "proveedor"
>;

export type BuysFormDataAdd = Pick<BuysData,
    "numero_factura_proveedor" |
    "observaciones" |
    "subtotal" |
    "estado" |
    "total" |
    "impuesto_manual" |
    "metodo_pago" |
    "id_proveedor" |
    "detalles_compra" |
    "usuario_creador"
>;

export type BuysFormDataDelete = Pick<BuysData, "id" | "numero_compra">;

// * Temporary purchasing data
const tempPurchasingDetailsShema = z.object({
    id_producto: z.string(),
    nombre_producto: z.string(),
    precio_compra: z.string(),
    cantidad: z.string(),
    subtotal: z.string(),
});



export const tempPurchasingDetailsDataSchema = z.array(
    tempPurchasingDetailsShema.pick({
        id_producto: true,
        nombre_producto: true,
        precio_compra: true,
        cantidad: true,
        subtotal: true,
    })
)

// * Temporary purchasing data
const buysTempDetailsShema = z.object({
    id_producto: z.string(),
    nombre_producto: z.string(),
    precio_compra: z.string(),
    cantidad: z.number(),
    subtotal: z.string(),
});



export const buysTempDetailsDataSchema = z.array(
    buysTempDetailsShema.pick({
        id_producto: true,
        nombre_producto: true,
        precio_compra: true,
        cantidad: true,
        subtotal: true
    })
)

export type TempPurchasingDetails = z.infer<typeof tempPurchasingDetailsShema>;

export type TempPurchasingFormDataDetails = Pick<TempPurchasingDetails,
    "id_producto" |
    "nombre_producto" |
    "precio_compra" |
    "cantidad" |
    "subtotal"
>;

// * Temporary purchasing data
const tempPurchasingShema = z.object({
    id_inventario: z.string(),
    id_producto: z.string(),
    nombre_producto: z.string(),
    precio_compra: z.string(),
    cantidad: z.string(),
    stock: z.number(),
    subtotal_compra: z.string(),
    subtotal_venta: z.string()
});



export const tempPurchasingDataSchema = z.array(
    tempPurchasingShema.pick({
        id_inventario: true,
        id_producto: true,
        nombre_producto: true,
        precio_compra: true,
        cantidad: true,
        stock: true,
        subtotal_compra: true,
        subtotal_venta: true
    })
)

export type TempPurchasing = z.infer<typeof tempPurchasingShema>;

export type TempPurchasingFormData = Pick<TempPurchasing,
    "id_inventario" |
    "id_producto" |
    "nombre_producto" |
    "precio_compra" |
    "cantidad" |
    "stock" |
    "subtotal_compra" |
    "subtotal_venta"

>;

export type TempPurchasingFormDataAdd = Pick<TempPurchasing,
    "id_inventario" |
    "cantidad" |
    "nombre_producto" |
    "subtotal_compra" |
    "subtotal_venta" |
    "id_producto"
>;

// * Temporary purchasing data
const tempPurchasingPaymentMethodShema = z.object({
    metodo: z.string(),
    monto: z.string(),
    observaciones: z.string()
});



export const tempPurchasingPaymentMethodDataSchema = z.array(
    tempPurchasingPaymentMethodShema.pick({
        metodo: true,
        monto: true,
        observaciones: true
    })
)

export type TempPurchasingPaymentMethod = z.infer<typeof tempPurchasingPaymentMethodShema>;

export type TempPurchasingFormDataPaymentmethod = Pick<TempPurchasingPaymentMethod,
    "metodo" |
    "monto" |
    "observaciones"
>;

export interface DataItem {
    value: string;
    label: string;
}

export interface DataComboboxPayment {
    value: string,
    label: string
}
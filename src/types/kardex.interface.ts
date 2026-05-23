import { z } from "zod";


// * Data kardex
const kardexShema = z.object({
    id: z.string().nullable(),
    fecha_creacion: z.string().nullable(),
    descripcion: z.string().nullable(),
    nombre_producto: z.string().nullable(),
    tipo: z.string().nullable(),
    cantidad_entrada: z.number().nullable(),
    precio_entrada: z.string().nullable(),
    total_entrada: z.string().nullable(),
    cantidad_salida: z.number().nullable(),
    precio_salida: z.string().nullable(),
    precio_facturacion: z.string().nullable(),
    total_salida: z.string().nullable(),
    cantidad_disponible: z.number().nullable(),
    precio_disponible: z.string().nullable(),
    total_disponible: z.string().nullable()
});

export const kardexDataSchema = z.array(
    kardexShema.pick({
        id: true,
        fecha_creacion: true,
        descripcion: true,
        nombre_producto: true,
        tipo: true,
        cantidad_entrada: true,
        precio_entrada: true,
        total_entrada: true,
        cantidad_salida: true,
        precio_salida: true,
        precio_facturacion: true,
        total_salida: true,
        cantidad_disponible: true,
        precio_disponible: true,
        total_disponible: true
    })
)

export type Kardex = z.infer<typeof kardexShema>;

// * Form data Kardex
const kardexFormShema = z.object({
    id: z.string().nullable(),
    fecha_creacion: z.string().nullable(),
    nombre_producto: z.string().nullable(),
    descripcion: z.string().nullable(),
    tipo: z.string().nullable(),
    cantidad_entrada: z.number().nullable(),
    precio_entrada: z.string().nullable(),
    total_entrada: z.string().nullable(),
    cantidad_salida: z.number().nullable(),
    precio_salida: z.string().nullable(),
    precio_facturacion: z.string().nullable(),
    total_salida: z.string().nullable(),
    cantidad_disponible: z.number().nullable(),
    precio_disponible: z.string().nullable(),
    total_disponible: z.string().nullable()
});

export const kardexFormDataSchema = z.array(
    kardexFormShema.pick({
        id: true,
        fecha_creacion: true,
        nombre_producto: true,
        descripcion: true,
        tipo: true,
        cantidad_entrada: true,
        precio_entrada: true,
        total_entrada: true,
        cantidad_salida: true,
        precio_salida: true,
        precio_facturacion: true,
        total_salida: true,
        cantidad_disponible: true,
        precio_disponible: true,
        total_disponible: true
    })
)

export type KardexData = z.infer<typeof kardexFormShema>;
export type BrandFormDataInfo = Pick<KardexData,
    "fecha_creacion" |
    "descripcion" |
    "nombre_producto" |
    "tipo" |
    "cantidad_entrada" |
    "precio_entrada" |
    "total_entrada" |
    "cantidad_salida" |
    "precio_salida" |
    "precio_facturacion" |
    "total_salida" |
    "cantidad_disponible" |
    "precio_disponible" |
    "total_disponible"
>; 
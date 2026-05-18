import { z } from "zod";


// * Data brand
const productShema = z.object({
    id: z.string(),
    codigo: z.string(),
    nombre_producto: z.string(),
    descripcion_producto: z.string(),
    precio_compra: z.string(),
    precio_venta_promedio: z.string(),
    cantidad_minima: z.number(),
    imagen_url: z.string(),
    estado: z.number(),
    expiracion: z.number(),
    fecha_expiracion: z.string(),
    fecha_creacion: z.string(),
    id_marca: z.string().nullable(),
    marca: z.string().nullable(),
    id_categoria: z.string().nullable(),
    categoria: z.string().nullable(),
    nombre_usuario_creador: z.string().optional(),
    nombre_usuario_modificador: z.string().optional(),
});

export const productDataSchema = z.array(
    productShema.pick({
        id: true,
        codigo: true,
        nombre_producto: true,
        descripcion_producto: true,
        precio_compra: true,
        precio_venta_promedio: true,
        cantidad_minima: true,
        imagen_url: true,
        estado: true,
        expiracion: true,
        fecha_expiracion: true,
        fecha_creacion: true,
        id_marca: true,
        marca: true,
        id_categoria: true,
        categoria: true,
        nombre_usuario_creador: true,
        nombre_usuario_modificador: true
    })
);

// * Form data Product
const productFormShema = z.object({
    id: z.string(),
    codigo: z.string(),
    nombre_producto: z.string(),
    descripcion_producto: z.string(),
    precio_compra: z.string(),
    precio_venta_promedio: z.string(),
    cantidad: z.number(),
    cantidad_minima: z.string(),
    cantidad_maxima: z.string(),
    imagen_url: z.string(),
    estado: z.number(),
    expiracion: z.number(),
    fecha_expiracion: z.string(),
    fecha_creacion: z.string(),
    fecha_modificacion: z.string(),
    id_marca: z.string().nullable(),
    id_categoria: z.string().nullable()
});

export const productFormDataSchema = z.array(
    productFormShema.pick({
        id: true,
        codigo: true,
        nombre_producto: true,
        descripcion_producto: true,
        precio_compra: true,
        precio_venta_promedio: true,
        cantidad: true,
        cantidad_minima: true,
        cantidad_maxima: true,
        imagen_url: true,
        estado: true,
        expiracion: true,
        fecha_expiracion: true,
        fecha_creacion: true,
        // fecha_modificacion: true,        
        id_marca: true,
        id_categoria: true,
        // usuario_creador: true,
        // usuario_modificador: true,
    })
)

export type ProductData = z.infer<typeof productFormShema>;

export type ProductFormData = Pick<ProductData,
    "id" |
    "codigo" |
    "nombre_producto" |
    "descripcion_producto" |
    "precio_compra" |
    "precio_venta_promedio" |
    "cantidad" |
    "cantidad_minima" |
    "cantidad_maxima" |
    "imagen_url" |
    "estado" |
    "expiracion" |
    "fecha_expiracion" |
    "fecha_creacion" |
    "fecha_modificacion" |
    "id_marca" |
    "id_categoria"
>;

export type ProductDataCombobox = Pick<ProductData,
    "id" |
    "codigo" |
    "nombre_producto" |
    "descripcion_producto" |
    "precio_compra" |
    "precio_venta_promedio" |
    "cantidad" |
    "cantidad_minima" |
    "cantidad_maxima" |
    "imagen_url" |
    "estado">;

export type ProductFormDataInfo = Pick<ProductData,
    "id" |
    "codigo" |
    "nombre_producto" |
    "descripcion_producto" |
    "precio_compra" |
    "precio_venta_promedio" |
    "cantidad_minima" |
    "imagen_url" |
    "estado" |
    "expiracion" |
    "fecha_expiracion" |
    "id_marca" |
    "id_categoria">;

export type ProductFormDataInfoKardex = Pick<ProductData,
    "id" |
    "codigo" |
    "nombre_producto" |
    "descripcion_producto" |
    "precio_compra" |
    "precio_venta_promedio" |
    "cantidad_minima" |
    "imagen_url" |
    "estado" |
    "expiracion" |
    "fecha_expiracion" |
    "id_marca" | "id_categoria">;

export type ProductFormDataAdd = Pick<ProductData,
    "codigo" |
    "nombre_producto" |
    "descripcion_producto" |
    "precio_compra" |
    "cantidad_minima" |
    "imagen_url" |
    "estado" |
    "expiracion" |
    "fecha_expiracion" |
    "id_marca" | "id_categoria"
>;

export type ProductFormDataEdit = Pick<ProductData,
    "id" |
    "codigo" |
    "nombre_producto" |
    "descripcion_producto" |
    "precio_compra" |
    "cantidad_minima" |
    "imagen_url" |
    "estado" |
    "expiracion" |
    "fecha_expiracion" |
    "id_marca" | "id_categoria"
>;

export type ProductFormDataDelete = Pick<ProductData, "id" | "nombre_producto">;
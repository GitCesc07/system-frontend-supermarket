import { z } from "zod";

export const detailsExpiredProducts = z.array(z.object({
    cantidad: z.string(),
    id_producto: z.string(),
    id_inventario: z.string()
}));

export const expiredProductsShema = z.object({
    id: z.string(),
    observaciones: z.string(),
    fecha_creacion: z.string(),
    fecha_modificacion: z.string(),
    detalle_productos_expirado: detailsExpiredProducts,
    usuario_creador: z.string(),
    nombre_usuario_creador: z.string(),
    usuario_modificador: z.string(),
    nombre_usuario_modificador: z.string()
});


export const expiredProductsDataSchema = z.array(
    expiredProductsShema.pick({
        id: true,
        observaciones: true,
        fecha_creacion: true,
        fecha_modificacion: true,
        usuario_creador: true,
        nombre_usuario_creador: true,
        usuario_modificador: true,
        nombre_usuario_modificador: true
    })
)

export type ExpiredProducts = z.infer<typeof expiredProductsShema>;

export type ExpiredProductsFormData = Pick<ExpiredProducts,
    "id" |
    "observaciones" |
    "fecha_creacion" |
    "fecha_modificacion" |
    "detalle_productos_expirado" |
    "usuario_creador" |
    "usuario_modificador"
>;

export type ExpiredProductsFormDataInfo = Pick<ExpiredProducts,
    "id" |
    "observaciones" |
    "fecha_creacion" |
    "fecha_modificacion" |
    "usuario_creador" |
    "usuario_modificador"
>;

export type ExpiredProductsFormDataAdd = Pick<ExpiredProducts,
    "observaciones" |
    "detalle_productos_expirado"
>;

export type ExpiredProductsFormDataDelete = Pick<ExpiredProducts, "id" | "observaciones">;
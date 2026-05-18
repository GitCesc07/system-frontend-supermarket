import { z } from "zod";


// * Data customers
const customerShema = z.object({
    id: z.string(),
    codigo_cliente: z.string(),
    nombre_cliente: z.string(),
    telefono_cliente: z.string().optional(),
    celular_cliente: z.string(),
    correo_cliente: z.string(),
    direccion_cliente: z.string(),
    ciudad_cliente: z.string(),
    ruc: z.string().optional(),
    acceso_precio1: z.number().optional().nullable(),
    acceso_precio2: z.number().optional().nullable(),
    acceso_precio3: z.number().optional().nullable(),
    acceso_precio4: z.number().optional().nullable(),
    cantidad_acceso_precios: z.number().optional().nullable(),
    contacto: z.string(),
    estado: z.number(),
    fecha_creacion: z.string(),
    fecha_modificacion: z.string(),
    usuario_creador: z.string(),
    usuario_modificador: z.string(),
    nombre_usuario_creador: z.string().optional(),
    nombre_usuario_modificador: z.string().optional()
});

export const customerDataSchema = z.array(
    customerShema.pick({
        id: true,
        codigo_cliente: true,
        nombre_cliente: true,
        telefono_cliente: true,
        celular_cliente: true,
        correo_cliente: true,
        direccion_cliente: true,
        ciudad_cliente: true,
        acceso_precio1: true,
        acceso_precio2: true,
        acceso_precio3: true,
        acceso_precio4: true,
        cantidad_acceso_precios: true,
        ruc: true,
        contacto: true,
        estado: true,
        fecha_creacion: true,
        usuario_creador: true,
        nombre_usuario_creador: true,
        nombre_usuario_modificador: true
    })
)

export type Customer = z.infer<typeof customerShema>;

// * Form data Customers
const customerFormShema = z.object({
    id: z.string(),
    codigo_cliente: z.string(),
    nombre_cliente: z.string(),
    telefono_cliente: z.string().optional(),
    celular_cliente: z.string(),
    correo_cliente: z.string(),
    direccion_cliente: z.string(),
    ciudad_cliente: z.string(),
    acceso_precio1: z.number().optional().nullable(),
    acceso_precio2: z.number().optional().nullable(),
    acceso_precio3: z.number().optional().nullable(),
    acceso_precio4: z.number().optional().nullable(),
    cantidad_acceso_precios: z.number().optional().nullable(),
    ruc: z.string().optional(),
    contacto: z.string(),
    estado: z.number(),
    termino_venta: z.string(),
    limite_credito: z.string(),
    fecha_creacion: z.string(),
    fecha_modificacion: z.string(),
    usuario_creador: z.string(),
    usuario_modificador: z.string()
});

export const brandFormDataSchema = z.array(
    customerFormShema.pick({
        id: true,
        codigo_cliente: true,
        nombre_cliente: true,
        telefono_cliente: true,
        celular_cliente: true,
        correo_cliente: true,
        direccion_cliente: true,
        ciudad_cliente: true,
        acceso_precio1: true,
        acceso_precio2: true,
        acceso_precio3: true,
        acceso_precio4: true,
        cantidad_acceso_precios: true,
        ruc: true,
        contacto: true,
        estado: true,
        termino_venta: true,
        limite_credito: true,
        fecha_creacion: true,
        fecha_modificacion: true,
        usuario_creador: true,
        usuario_modificador: true
    })
)

export type CustomerData = z.infer<typeof customerFormShema>;
export type CustomerFormData = Pick<CustomerData,
    "id" |
    "codigo_cliente" |
    "nombre_cliente" |
    "telefono_cliente" |
    "celular_cliente" |
    "acceso_precio1" |
    "acceso_precio2" |
    "acceso_precio3" |
    "acceso_precio4" |
    "cantidad_acceso_precios" |
    "correo_cliente" |
    "direccion_cliente" |
    "ciudad_cliente" |
    "ruc" |
    "contacto" |
    "estado"
>;


export type CustomerFormDataAdd = Pick<CustomerData,
    "nombre_cliente" |
    "telefono_cliente" |
    "celular_cliente" |
    "correo_cliente" |
    "acceso_precio1" |
    "acceso_precio2" |
    "acceso_precio3" |
    "acceso_precio4" |
    "cantidad_acceso_precios" |
    "direccion_cliente" |
    "ciudad_cliente" |
    "ruc" |
    "contacto" |
    "estado" |
    "usuario_creador"
>;

export type CustomerFormDataInfo = Pick<CustomerData,
    "id" |
    "nombre_cliente" |
    "telefono_cliente" |
    "celular_cliente" |
    "correo_cliente" |
    "acceso_precio1" |
    "acceso_precio2" |
    "acceso_precio3" |
    "acceso_precio4" |
    "cantidad_acceso_precios" |
    "direccion_cliente" |
    "ciudad_cliente" |
    "ruc" |
    "contacto" |
    "estado"
>;

export type CustomerFormDataEdit = Pick<CustomerData,
    "id" |
    "nombre_cliente" |
    "telefono_cliente" |
    "celular_cliente" |
    "correo_cliente" |
    "direccion_cliente" |
    "acceso_precio1" |
    "acceso_precio2" |
    "acceso_precio3" |
    "acceso_precio4" |
    "cantidad_acceso_precios" |
    "ciudad_cliente" |
    "ruc" |
    "contacto" |
    "estado" |
    "usuario_modificador"
>;


export type CustomerFormDataDelete = Pick<CustomerData, "id" | "nombre_cliente">;

export interface DataItemCustomer {
    value: string;
    label: string;
}
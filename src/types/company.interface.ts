import { z } from "zod";


// * Data company
const companyShema = z.object({
    id: z.string(),
    nombre_empresa: z.string(),
    eslogan: z.string(),
    direccion_empresa: z.string(),
    ruc: z.string(),
    telefono_empresa: z.string(),
    celular_empresa: z.string(),
    correo_empresa: z.string(),
    logotipo: z.string(),
    usuario_creador: z.string(),
    usuario_modificador: z.string(),
    fecha_creacion: z.string(),
    fecha_modificacion: z.string()
});

export const companyDataSchema = z.array(
    companyShema.pick({
        id: true,
        nombre_empresa: true,
        eslogan: true,
        direccion_empresa: true,
        ruc: true,
        telefono_empresa: true,
        celular_empresa: true,
        correo_empresa: true,
        logotipo: true
    })
)

export type Company = z.infer<typeof companyShema>;

// * Form data company
const companyFormShema = z.object({
    id: z.string(),
    nombre_empresa: z.string(),
    eslogan: z.string(),
    direccion_empresa: z.string(),
    ruc: z.string(),
    telefono_empresa: z.string(),
    celular_empresa: z.string(),
    correo_empresa: z.string(),
    logotipo: z.string(),
    usuario_creador: z.string(),
    fecha_creacion: z.string(),
    fecha_modificacion: z.string()
});

export const companyFormDataSchema = z.array(
    companyFormShema.pick({
        id: true,
        nombre_empresa: true,
        eslogan: true,
        direccion_empresa: true,
        ruc: true,
        telefono_empresa: true,
        celular_empresa: true,
        correo_empresa: true,
        logotipo: true,
        usuario_creador: true,
        fecha_creacion: true,
        fecha_modificacion: true,
    })
)
export const companyDataSchemaImage = z.array(
    companyShema.pick({
        logotipo: true
    })
)

export type CompanyData = z.infer<typeof companyFormShema>;

export type CompanyFormData = Pick<CompanyData,
    "id" |
    "nombre_empresa" |
    "eslogan" |
    "direccion_empresa" |
    "ruc" |
    "telefono_empresa" |
    "celular_empresa" |
    "correo_empresa" |
    "logotipo" |
    "usuario_creador" |
    "fecha_creacion" |
    "fecha_modificacion"
>;

export type CompanyFormDataAdd = Pick<CompanyData,
    "nombre_empresa" |
    "eslogan" |
    "direccion_empresa" |
    "ruc" |
    "telefono_empresa" |
    "celular_empresa" |
    "correo_empresa" |
    "logotipo" |
    "usuario_creador"
>;

export type CompanyFormDataInfo = Pick<CompanyData,
    "id" |
    "nombre_empresa" |
    "eslogan" |
    "direccion_empresa" |
    "ruc" |
    "telefono_empresa" |
    "celular_empresa" |
    "correo_empresa" |
    "logotipo"
>;

export type CompanyFormDataEdit = Pick<CompanyData,
    "id" |
    "nombre_empresa" |
    "eslogan" |
    "direccion_empresa" |
    "ruc" |
    "telefono_empresa" |
    "celular_empresa" |
    "correo_empresa" |
    "logotipo"
>;


// * Get image from database the company
export type CompanyFormDataImage = Pick<CompanyData,
    "logotipo"
>
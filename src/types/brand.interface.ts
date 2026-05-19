import { z } from "zod";


// * Data brand
const brandShema = z.object({
  id: z.string(),
  nombre_marca: z.string(),
  descripcion: z.string(),
  estado: z.number(),
  fecha_creacion: z.string(),
  fecha_modificacion: z.string(),
  nombre_usuario_creador: z.string().optional(),
  nombre_usuario_modificador: z.string().optional()
});

export const brandDataSchema = z.array(
  brandShema.pick({
    id: true,
    nombre_marca: true,
    descripcion: true,
    estado: true,
    fecha_creacion: true,
    fecha_modificacion: true,
    nombre_usuario_creador: true,
    nombre_usuario_modificador: true
  })
);

export type Brand = z.infer<typeof brandShema>;

// * Form data Brand
const brandFormShema = z.object({
  id: z.string(),
  nombre_marca: z.string(),
  descripcion: z.string(),
  estado: z.number(),
  fecha_creacion: z.string(),
  fecha_modificacion: z.string(),
  usuario_creador: z.string(),
  usuario_modificador: z.string(),
});

export const brandFormDataSchema = z.array(
  brandFormShema.pick({
    id: true,
    nombre_marca: true,
    descripcion: true,
    estado: true,
    fecha_creacion: true,
    fecha_modificacion: true,
    usuario_creador: true,
    usuario_modificador: true,
  })
)

export type BrandData = z.infer<typeof brandFormShema>;
export type BrandFormData = Pick<BrandData, "id" | "nombre_marca" | "descripcion" | "estado" | "usuario_creador" | "usuario_modificador" | "fecha_creacion" | "fecha_modificacion">;
export type BrandFormDataAdd = Pick<BrandData, "nombre_marca" | "descripcion" | "estado" | "usuario_creador">;

export type BrandFormDataInfo = Pick<BrandData, "id" | "nombre_marca" | "descripcion" | "estado">;
export type BrandFormDataEdit = Pick<BrandData, "id" | "nombre_marca" | "descripcion" | "estado" | "usuario_modificador">;
export type BrandFormDataDelete = Pick<BrandData, "id" | "nombre_marca">;

export interface DataItemBrand {
  value: string;
  label: string;
}
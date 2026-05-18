import { z } from "zod";


// * Data category
const categoryShema = z.object({
    id: z.string(),
    nombre_categoria: z.string(),
    descripcion: z.string(),
    estado: z.number(),
    fecha_creacion: z.string(),
    nombre_usuario_creador: z.string().optional(),
    nombre_usuario_modificador: z.string().optional(),
  });
  
  export const categtroyDataSchema = z.array(
    categoryShema.pick({
      id: true,
      nombre_categoria: true,
      descripcion: true,    
      estado: true,
      fecha_creacion: true,
      nombre_usuario_creador: true,
      nombre_usuario_modificador: true,
    })
  )
  
  export type Category = z.infer<typeof categoryShema>;

   // * Form data Category
const categoryFormShema = z.object({
    id: z.string(),
    nombre_categoria: z.string(),
    descripcion: z.string(),
    estado: z.number(),
    fecha_creacion: z.string(),
    fecha_modificacion: z.string(),
    usuario_creador: z.string(),
    usuario_modificador: z.string(),
  });
  
  export const categoryFormDataSchema = z.array(
    categoryFormShema.pick({
      id: true,
      nombre_categoria: true,
      descripcion: true,
      estado: true,
      fecha_creacion: true,
      fecha_modificacion: true,
      usuario_creador: true,
      usuario_modificador: true,
    })
  )
  
  export type CategoryData = z.infer<typeof categoryFormShema>;
  export type CategoryFormData = Pick<CategoryData, "id" | "nombre_categoria" | "descripcion" | "estado" | "usuario_creador" | "usuario_modificador" | "fecha_creacion" | "fecha_modificacion" >;
  export type CategoryFormDataInfo = Pick<CategoryData, "id" | "nombre_categoria" | "descripcion" | "estado" >;
  export type CategoryFormDataAdd = Pick<CategoryData, "nombre_categoria" | "descripcion" | "estado" | "usuario_creador" >;
  export type CategoryFormDataEdit = Pick<CategoryData, "id" | "nombre_categoria" | "descripcion" | "estado" | "usuario_modificador" >;
  export type CategoryFormDataDelete = Pick<CategoryData, "id" | "nombre_categoria" >;


  export interface DataItemCategories {
    value: string;
    label: string;
  }
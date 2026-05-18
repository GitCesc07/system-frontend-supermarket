import { z } from "zod";


// * Data User
const userShema = z.object({
  id: z.string(),
  nombre_completo: z.string(),
  cedula: z.string(),
  celular_usuario: z.string(),
  correo_usuario: z.string().email(),
  tipo_usuario: z.string(),
  contraseña: z.string(),
  estado: z.number(),
  fecha_creacion: z.string(),
  nombre_completo_creador: z.string().optional(),
  nombre_usuario_modificador: z.string().optional()
});

export const userDataSchema = z.array(
  userShema.pick({
    id: true,
    nombre_completo: true,
    cedula: true,
    celular_usuario: true,
    correo_usuario: true,
    tipo_usuario: true,
    estado: true,
    fecha_creacion: true,
    nombre_completo_creador: true,
    nombre_usuario_modificador: true
  })
)

export type User = z.infer<typeof userShema>;

// * Form data User
const userFormShema = z.object({
  id: z.string(),
  nombre_completo: z.string(),
  cedula: z.string(),
  celular_usuario: z.string(),
  correo_usuario: z.string().email(),
  contraseña: z.string(),
  oldContraseñaUser: z.string().optional(),
  tipo_usuario: z.string(),
  estado: z.number(),
  usuario_creador: z.string(),
  usuario_modificador: z.string(),
  fecha_creacion: z.string(),
  fecha_modificacion: z.string(),
});

export const userFormDataSchema = z.array(
  userFormShema.pick({
    id: true,
    nombre_completo: true,
    cedula: true,
    celular_usuario: true,
    correo_usuario: true,
    // contraseña: true,
    oldContraseñaUser: true,
    tipo_usuario: true,
    estado: true,
    // usuario_creador: true,
    // usuario_modificador: true,
    // fecha_creacion: true,
    // fecha_modificacion: true,
  })
)

export type UserData = z.infer<typeof userFormShema>;
export type UserFormData = Pick<UserData, "id" | "nombre_completo" | "cedula" | "celular_usuario" | "correo_usuario" | "contraseña" | "tipo_usuario" | "estado" | "usuario_creador" | "usuario_modificador" | "fecha_creacion" | "fecha_modificacion">;
export type UserFormDataAdd = Pick<UserData, "nombre_completo" | "cedula" | "celular_usuario" | "correo_usuario" | "contraseña" | "tipo_usuario" | "estado" | "usuario_creador">;

export type UserFormDataInfo = Pick<UserData, "id" | "nombre_completo" | "cedula" | "celular_usuario" | "correo_usuario" | "tipo_usuario" | "estado">;
export type UserFormDataEdit = Pick<UserData, "id" | "nombre_completo" | "cedula" | "celular_usuario" | "correo_usuario" | "tipo_usuario" | "estado" | "usuario_modificador">;
export type UserFormDataEditStaff = Pick<UserData, "celular_usuario" | "correo_usuario" | "contraseña" | "oldContraseñaUser">;
// export type UserFormDataUserEdit = Pick<UserData,"nombre_completo" | "celular_usuario" | "correo_usuario"  | "contraseña" >;

export type UserFormDataDelete = Pick<UserData, "id" | "nombre_completo">;


// * permissions for button
export const repeatShema = z.object({
  key: z.number().optional().default(0),
  guardar: z.number().optional().default(0),
  modificar: z.number().optional().default(0),
  eliminar: z.number().optional().default(0)
});

export const repeatMotionShema = z.object({
  key: z.number().optional().default(0),
  guardar: z.number().optional().default(0),
  reporte: z.number().optional().default(0)
});

export const companyShema = z.object({
  key: z.number().optional().default(0),
  guardar: z.number().optional().default(0),
  modificar: z.number().optional().default(0)
});

export const repeatSalesShema = z.object({
  key: z.number().optional().default(0),
  guardar: z.number().optional().default(0),
  modificar: z.number().optional().default(0),
  eliminar: z.number().optional().default(0),
  reporte: z.number().optional().default(0)
});


export const repeatMovementsByCustomerAndSuppliers = z.object({
  key: z.number().optional().default(0),
  pagos: z.number().optional().default(0),
  anular: z.number().optional().default(0),
  eliminar: z.number().optional().default(0)
});


// * Permissions by users
const permisssionsUserFormShema = z.object({
  empresa: z.number(),
  permisos_empresa: z.array(companyShema),
  usuario: z.number(),
  permisos_usuario: z.array(repeatShema),
  proveedor: z.number(),
  permisos_proveedor: z.array(repeatShema),
  cliente: z.number(),
  permisos_cliente: z.array(repeatShema),  
  marca: z.number(),
  permisos_marca: z.array(repeatShema),
  categoria: z.number(),
  permisos_categoria: z.array(repeatShema),
  producto: z.number(),
  permisos_producto: z.array(repeatShema),
  inventario: z.number(),
  permisos_inventario: z.array(repeatSalesShema),  
  compra: z.number(),
  permisos_compra: z.array(repeatMotionShema),
  venta: z.number(),
  permisos_venta: z.array(repeatMotionShema),
  kardex: z.number(),
  reportes_inventario: z.number(),  
  reportes: z.number(),
  id_usuario: z.string()
});

export const permissionsUserFormDataSchema = z.array(
  permisssionsUserFormShema.pick({
    empresa: true,
    permisos_empresa: true,
    usuario: true,
    permisos_usuario: true,
    proveedor: true,
    permisos_proveedor: true,
    cliente: true,
    permisos_cliente: true,    
    marca: true,
    permisos_marca: true,
    categoria: true,
    permisos_categoria: true,
    producto: true,
    permisos_producto: true,
    inventario: true,
    permisos_inventario: true,    
    compra: true,
    permisos_compra: true,    
    venta: true,
    permisos_venta: true,
    kardex: true,
    reportes_inventario: true,    
    reportes: true,
    id_usuario: true
  })
)

export type PermissionsUserData = z.infer<typeof permisssionsUserFormShema>;
export type PermissionsUserFormData = Pick<PermissionsUserData,
  "empresa" |
  "permisos_empresa" |
  "usuario" |
  "permisos_usuario" |
  "proveedor" |
  "permisos_proveedor" |
  "cliente" |
  "permisos_cliente" |
  "marca" |
  "permisos_marca" |
  "categoria" |
  "permisos_categoria" |
  "producto" |
  "permisos_producto" |
  "inventario" |
  "permisos_inventario" |
  "compra" |
  "permisos_compra" |  
  "venta" |
  "permisos_venta" |
  "kardex" |
  "reportes_inventario" |
  "reportes" |
  "id_usuario"
>;
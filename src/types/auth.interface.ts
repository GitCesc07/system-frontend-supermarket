import { z } from "zod";
import { repeatMotionShema, repeatSalesShema, repeatShema } from "./users.interface";

// * Auth User
const authShema = z.object({
  id: z.string(),
  correo_usuario: z.string().email(),
  nombre_completo: z.string(),
  tipo_usuario: z.string(),
  contraseña: z.string(),
  contraseña_confirmation: z.string(),
  empresa: z.number(),
  permisos_empresa: z.array(repeatShema),
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
  cotizacion_venta: z.number(),
  permisos_cotizacion_venta: z.array(repeatSalesShema),
  venta: z.number(),
  permisos_venta: z.array(repeatMotionShema),
  kardex: z.number(),
  reportes_inventario: z.number(),
  reportes: z.number(),
  access_token: z.string(),
  token: z.string(),
});

// * Auth Users 
export const userSchema = authShema
  .pick({
    id: true,
    correo_usuario: true,
    nombre_completo: true,
    tipo_usuario: true,
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
    cotizacion_venta: true,
    permisos_cotizacion_venta: true,
    venta: true,
    permisos_venta: true,
    kardex: true,
    reportes_inventario: true,
    reportes: true
  })
  .extend({
    id: z.string(),
  });

export type UserAuth = z.infer<typeof userSchema>;

export type Auth = z.infer<typeof authShema>;
export type UserLoginForm = Pick<Auth, "correo_usuario" | "contraseña">;
export type UserRegistrationForm = Pick<
  Auth,
  "correo_usuario" | "nombre_completo" | "tipo_usuario" | "contraseña" | "contraseña_confirmation"
>;
export type RequestConfirmationCodeForm = Pick<Auth, "correo_usuario">;
export type ForgotPasswordForm = Pick<Auth, "correo_usuario">;
export type NewPasswordForm = Pick<Auth, "contraseña" | "contraseña_confirmation">;

export type ConfirmToken = Pick<Auth, "access_token">;
export type ConfirmTokenNew = Pick<Auth, "access_token">;


export type permissionsUser = {
  // tipo_usuario: Auth["tipo_usuario"],
  usuario: Auth["usuario"],
  empresa: Auth["empresa"],
  proveedor: Auth["proveedor"],
  cliente: Auth["cliente"],  
  marca: Auth["marca"],
  categoria: Auth["categoria"],
  producto: Auth["producto"],
  inventario: Auth["inventario"],  
  compra: Auth["compra"],
  cotizacion_venta: Auth["cotizacion_venta"],  
  venta: Auth["venta"],
  kardex: Auth["kardex"],
  reportes_inventario: Auth["reportes_inventario"],  
  reportes: Auth["reportes"]
};

export type AuthPermissions = Pick<Auth,
  "tipo_usuario" |
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
  "cotizacion_venta" |
  "permisos_cotizacion_venta" |  
  "venta" |
  "permisos_venta" |
  "kardex" |
  "reportes_inventario" |  
  "reportes">
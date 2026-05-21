import { z } from "zod";


// * Data inventory
const inventoryShema = z.object({
    id_inventario: z.string(),
    id_producto: z.string(),
    cantidad_minima: z.number(),
    codigo: z.string(),
    nombre_producto: z.string(),
    descripcion_producto: z.string(),
    imagen_url: z.string(),
    precio_compra: z.string(),
    expiracion: z.number(),
    stock: z.number(),
    producto_vencido: z.number(),
    producto_deteriorado: z.number(),
    nombre_categoria: z.string(),
    nombre_marca: z.string(),
    estado: z.number(),
});

export const inventoryDataSchema = z.array(
    inventoryShema.pick({
        id_inventario: true,
        id_producto: true,
        cantidad_minima: true,
        codigo: true,
        nombre_producto: true,
        descripcion_producto: true,
        imagen_url: true,
        precio_compra: true,
        expiracion: true,
        producto_vencido: true,
        producto_deteriorado: true,
        stock: true,
        nombre_categoria: true,
        nombre_marca: true,
        estado: true
    })
);

export type Inventory = z.infer<typeof inventoryShema>;

export type InventoryFormDataInfo = Pick<Inventory,
    "id_inventario" |    
    "id_producto" |
    "codigo" |    
    "cantidad_minima" |
    "nombre_producto" |
    "descripcion_producto" |
    "imagen_url" |
    "precio_compra" |    
    "expiracion" |    
    "producto_vencido" |
    "stock" |    
    "nombre_categoria" |
    "nombre_marca" |
    "estado"
>;

// * Temporary purchasing data
const tempPurchasingShema = z.object({    
    precio_compra: z.string(),
    cantidad: z.number(),
    subtotal: z.string(),
    id_producto: z.string(),
});


export const tempPurchasingDataSchema = z.array(
    tempPurchasingShema.pick({
        id_producto: true,        
        precio_compra: true,
        cantidad: true,
        subtotal: true
    })
)

export type TempPurchasing = z.infer<typeof tempPurchasingShema>;

export type TempPurchasingFormData = Pick<TempPurchasing,
    "id_producto" |    
    "precio_compra" |
    "cantidad" |
    "subtotal"
>;

export type TempPurchasingFormDataAdd = Pick<TempPurchasing,    
    "precio_compra" |
    "cantidad" |
    "subtotal" |
    "id_producto"
>;


// * expired products
const tempExpiredProductsShema = z.object({
    id_inventario: z.string(),
    codigo: z.string(),    
    id_producto: z.string(),
    nombre_producto: z.string(),
    imagen_url: z.string(),
    fecha_expiracion: z.string(),
    stock: z.number(),    
    nombre_categoria: z.string(),
    nombre_marca: z.string(),
    estado: z.number(),
});



export const tempExpiredProductsDataSchema = z.array(
    tempExpiredProductsShema.pick({
        id_inventario: true,
        codigo: true,        
        id_producto: true,
        nombre_producto: true,
        imagen_url: true,
        fecha_expiracion: true,
        stock: true,        
        nombre_categoria: true,
        nombre_marca: true,
        estado: true
    })
)

export type TempExpiredProducts = z.infer<typeof tempExpiredProductsShema>;

export type TempExpiredProductsFormData = Pick<TempExpiredProducts,
    "id_inventario" |
    "codigo" |    
    "id_producto" |
    "nombre_producto" |
    "imagen_url" |
    "fecha_expiracion" |
    "stock" |    
    "nombre_categoria" |
    "nombre_marca" |
    "estado"
>;

export type TempExpiredProductsFormDataAdd = Pick<TempExpiredProducts,
    "id_inventario" |
    "codigo" |    
    "id_producto" |
    "nombre_producto" |
    "imagen_url" |
    "fecha_expiracion" |
    "stock" |    
    "nombre_categoria" |
    "nombre_marca" |
    "estado"
>;
import type { KardexFormDataInfo } from "@/types/kardex.interface";
import { TableBody, TableCell, TableRow } from "../ui/table";
import { formatCurrency } from "@/utils/utilidad";


type TableCellKardexProps = {
    products: KardexFormDataInfo[],
    showFields: string[]
}

export default function TableCellKardex({ products, showFields }: TableCellKardexProps) {
    return (
        <TableBody>
            {
                products.map(product => (
                    <TableRow key={product.id}>
                        {
                            showFields.includes("Fecha creación") &&
                            <TableCell>{product.fecha_creacion}</TableCell>
                        }

                        {
                            showFields.includes("Descripción") &&
                            <TableCell>
                                <div className="truncate w-56">
                                    {product.descripcion}
                                </div>
                            </TableCell>
                        }
                        {
                            showFields.includes("Nombre producto") &&
                            <TableCell>{product.nombre_producto}</TableCell>
                        }
                        {
                            showFields.includes("Tipo") &&
                            <TableCell>{product.tipo}</TableCell>
                        }
                        {
                            showFields.includes("Cantidad entrada") &&
                            <TableCell>{product.cantidad_entrada}</TableCell>
                        }
                        {
                            showFields.includes("Precio entrada") &&
                            <TableCell>{formatCurrency(product.precio_entrada!)}</TableCell>
                        }
                        {
                            showFields.includes("Total entrada") &&
                            <TableCell>{formatCurrency(product.total_entrada!)}</TableCell>
                        }
                        {
                            showFields.includes("Cantidad salida") &&
                            <TableCell>{product.cantidad_salida}</TableCell>
                        }
                        {
                            showFields.includes("Precio salida") &&
                            <TableCell>{formatCurrency(product.precio_salida!)}</TableCell>
                        }
                        {
                            showFields.includes("Total salida") &&
                            <TableCell>{formatCurrency(product.total_salida!)}</TableCell>
                        }
                        {
                            showFields.includes("Cantidad disponible") &&
                            <TableCell>{product.cantidad_disponible}</TableCell>
                        }
                        {
                            showFields.includes("Precio disponible") &&
                            <TableCell>{formatCurrency(product.precio_disponible!)}</TableCell>
                        }
                        {
                            showFields.includes("Total disponible") &&
                            <TableCell>{formatCurrency(product.total_disponible!)}</TableCell>
                        }
                    </TableRow>
                ))
            }
        </TableBody>
    )
}
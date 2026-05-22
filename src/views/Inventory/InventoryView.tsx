import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import Loader from "@/components/loader";
import { Loader2, Search } from "lucide-react";
import type { AuthPermissions } from "@/types/auth.interface";
import { toast } from "sonner";
import TableEmpty from "@/components/ui-components/TableEmpty";
import ViewImageDialog from "@/components/products/ViewImageDialog";
import { Dialog } from "@/components/ui/dialog";
import { getInventory } from "@/apis/inventory.apis";
import ToogleFieldsDialogInventory from "@/components/inventory/ToogleFieldsDialogInventory";

export default function InventoryView({ dataAuth }: { dataAuth: AuthPermissions }) {

    const { data, isLoading, refetch, isError } = useQuery({
        queryKey: ["inventory"],
        queryFn: getInventory,
    });

    const inputRef = useRef<HTMLInputElement>(null);
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.ctrlKey && event.key === 'b') {
                event.preventDefault();
                if (inputRef.current) {
                    inputRef.current.focus();
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    const [open, setOpen] = useState(false);
    const [imagenView, setImagenView] = useState<string>();
    const [messageImage, setMessageImage] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    const [showFields, setShowFields] = useState<string[]>([
        "Código",
        "Producto",
        "Descripciòn",
        "Cantidad minima",
        "Imagen",
        "Expiración",
        "Stock",
        "Vencidos",
        "Deteriorados",
        "Marca",
        "Categoría"
    ]);

    const filteredInventory = Object.values(data || {}).filter(inventory =>
        Object.values(inventory).some(value =>
            value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    if (isError) return <Navigate to={"/404"} />

    return (
        <div className="w-full h-full flex items-center justify-center">
            {
                isLoading ? (<Loader />) :
                    (
                        <div className="h-full flex flex-col items-center justify-center w-full px-4">
                            <section className="h-[20%] md:h-[10%] w-full flex flex-col-reverse md:flex-row items-center justify-center gap-x-10">
                                <div className="w-full md:w-[50%] border border-gray-400 py-1 px-2 mt-3 md:mt-0 rounded-lg flex items-center gap-x-1">
                                    <Search className="size-5 text-gray-400" href="search" />
                                    <input
                                        id="search"
                                        type="text"
                                        ref={inputRef}
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Buscar..."
                                        className="w-full border-none outline-none placeholder:text-gray-400"
                                    />
                                </div>

                                <div className="w-full flex flex-col md:flex-row items-center justify-center gap-y-4 md:gap-x-4">
                                    <Tooltip>
                                        <TooltipTrigger className="w-full md:w-auto">
                                            <button
                                                className="w-full md:w-auto border bg-gray-100 dark:bg-gray-900 border-gray-300 dark:border-gray-700 rounded-md flex items-center justify-center gap-x-4 py-1 px-4 font-medium text-base"
                                                color="gray"
                                                onClick={() => {
                                                    refetch();
                                                    toast.success("Datos actualizados correctamente...", {
                                                        position: "top-right",
                                                        closeButton: true,
                                                        action: {
                                                            label: "Cerrar",
                                                            onClick: () => toast.dismiss()
                                                        }
                                                    });
                                                }}
                                            >
                                                <Loader2 className="size-5" />
                                                <span className="md:hidden">Actualizar</span>
                                            </button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Clic para actualizar la información</p>
                                        </TooltipContent>
                                    </Tooltip>

                                    <ToogleFieldsDialogInventory showFields={showFields} setShowFields={setShowFields} />
                                </div>
                            </section>

                            <div className="mt-3 w-full h-[80%] md:h-[90%] mx-auto">
                                <Table>
                                    <TableCaption>Registro de productos.</TableCaption>
                                    <TableHeader>
                                        <TableRow>
                                            {showFields.includes("Producto") && <TableHead>Producto</TableHead>}
                                            {showFields.includes("Descripción") && <TableHead>Descripción</TableHead>}
                                            {showFields.includes("Cantidad minima") && <TableHead className="text-center">Cantidad minima</TableHead>}
                                            {showFields.includes("Imagen") && <TableHead>Imagen</TableHead>}
                                            {showFields.includes("Stock") && <TableHead>Stock</TableHead>}
                                            {showFields.includes("Vencidos") && <TableHead className="text-center">Vencidos</TableHead>}
                                            {showFields.includes("Deteriorados") && <TableHead className="text-center">Deteriorados</TableHead>}
                                            {showFields.includes("Marca") && <TableHead>Marca</TableHead>}
                                            {showFields.includes("Categoría") && <TableHead>Categoría</TableHead>}
                                            {
                                                dataAuth.tipo_usuario == import.meta.env.VITE_TYPEFROM_USER &&
                                                <TableHead className="text-right">Acción</TableHead>
                                            }
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {
                                            filteredInventory?.map(product => (
                                                <TableRow key={product.id_inventario}>
                                                    {
                                                        showFields.includes("id") &&
                                                        <TableCell>{product.id_inventario}</TableCell>
                                                    }
                                                    {
                                                        showFields.includes("Producto") &&
                                                        <TableCell>{product.nombre_producto}</TableCell>
                                                    }
                                                    {
                                                        showFields.includes("Descripción") &&
                                                        <TableCell>
                                                            <div className="truncate w-56">
                                                                {product.descripcion_producto}
                                                            </div>
                                                        </TableCell>
                                                    }
                                                    {
                                                        showFields.includes("Cantidad minima") &&
                                                        <TableCell align="center">{product.cantidad_minima}</TableCell>
                                                    }

                                                    {
                                                        showFields.includes("Imagen") &&
                                                        <TableCell>
                                                            <Tooltip>
                                                                <TooltipTrigger>
                                                                    {
                                                                        showFields.includes("Imagen") &&
                                                                        (
                                                                            <img
                                                                                loading="lazy"
                                                                                className="size-10 cursor-pointer"
                                                                                src={product.imagen_url == "" || product.imagen_url == null ? "https://i.ibb.co/q30MxkxD/Image-upload-bro.png" : product.imagen_url}
                                                                                alt={product.nombre_producto}
                                                                                onClick={() => {
                                                                                    if (product.imagen_url == "") {
                                                                                        setImagenView("https://i.ibb.co/q30MxkxD/Image-upload-bro.png");
                                                                                        setMessageImage("No hay imagen de este producto, agrega una imagen para visualizarla...")
                                                                                        setOpen(!open)
                                                                                    }
                                                                                    else {
                                                                                        setImagenView(product.imagen_url!)
                                                                                        setMessageImage("");
                                                                                        setOpen(!open)
                                                                                    }
                                                                                }}
                                                                            />
                                                                        )
                                                                    }
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    Clic para ver la imagen
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        </TableCell>
                                                    }

                                                    {
                                                        showFields.includes("Stock") &&
                                                        <TableCell className={`${product.stock <= product.cantidad_minima ? "darK:text-red-300 text-red-500" : ""}`}>
                                                            {product.stock}
                                                        </TableCell>
                                                    }
                                                    {
                                                        showFields.includes("Vencidos") &&
                                                        <TableCell align="center">
                                                            {product.producto_vencido}
                                                        </TableCell>
                                                    }

                                                    {
                                                        showFields.includes("Deteriorados") &&
                                                        <TableCell align="center">
                                                            {product.producto_deteriorado}
                                                        </TableCell>
                                                    }

                                                    {
                                                        showFields.includes("Marca") &&
                                                        <TableCell>{product.nombre_marca}</TableCell>
                                                    }

                                                    {
                                                        showFields.includes("Categoría") &&
                                                        <TableCell>{product.nombre_categoria}</TableCell>
                                                    }
                                                    <TableCell className="text-right">
                                                        <Button>
                                                            Reportes
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        }

                                        <TableRow>
                                            {
                                                filteredInventory.length == 0 &&
                                                (
                                                    <TableCell colSpan={14}>
                                                        <div className="flex items-center flex-col justify-center w-full h-96 mx-auto">
                                                            <TableEmpty />
                                                            <p className='text-center font-bold text-3xl'>No se encontraron resultados...</p>
                                                        </div>
                                                    </TableCell>
                                                )
                                            }
                                        </TableRow>


                                        {
                                            imagenView && (
                                                <Dialog open={open} onOpenChange={() => {
                                                    setOpen(!open)
                                                }}>
                                                    <ViewImageDialog url_image={imagenView} messageImage={messageImage} onClose={() => setImagenView("")} />
                                                </Dialog>
                                            )
                                        }
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    )
            }
        </div >
    )
}

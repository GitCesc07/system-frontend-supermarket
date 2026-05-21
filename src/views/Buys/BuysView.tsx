import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import { BadgeCheck, Ban, Ellipsis, Loader2, Search, UserPenIcon } from "lucide-react";
import type { AuthPermissions } from "@/types/auth.interface";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import TableEmpty from "@/components/ui-components/TableEmpty";
import { Dialog } from "@/components/ui/dialog";
import Createproduct from "@/components/products/Createproduct";
import { getBuys } from "@/apis/buys.apis";
import type { BuysFormDataInfo } from "@/types/buys.interface";
import ToogleFieldsDialogBuys from "@/components/buys/ToogleFieldsDialogBuys";
import { formatCurrency } from "@/utils/utilidad";

export default function BuysView({ dataAuth }: { dataAuth: AuthPermissions }) {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search)
    const modalEditBuys = queryParams.get("editBuys");
    const showEditModal = modalEditBuys ? true : false;


    const { data, isLoading, refetch, isError } = useQuery({
        queryKey: ["buys"],
        queryFn: getBuys,
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

    const [searchTerm, setSearchTerm] = useState("");
    const [openDialogEditBuys, setOpenDialogEditBuys] = useState(showEditModal)


    const [editingBuys, setEditingBuys] = useState<BuysFormDataInfo | null>(null);
    const [showFields, setShowFields] = useState<string[]>([
        "Número compra",
        "Número factura proveedor",
        "Termino",
        "Estado",
        "Observaciones",
        "Subtotal",
        "Total",
        "Proveedor",
        "Fecha creación",
        "Fecha modificación",
        "Usuario creador",
        "Usuario modificador"
    ]);

    const filteredProducts = Object.values(data || {}).filter(buys =>
        Object.values(buys).some(value =>
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
                                                    toast.error("Datos actualizados correctamente...", {
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

                                    {
                                        dataAuth?.permisos_compra[0].guardar == 1 && (<Createproduct />)
                                    }

                                    <ToogleFieldsDialogBuys showFields={showFields} setShowFields={setShowFields} />
                                </div>
                            </section>

                            <div className="mt-3 w-full h-[80%] md:h-[90%] mx-auto">
                                <Table>
                                    <TableCaption>Registro de productos.</TableCaption>
                                    <TableHeader>
                                        <TableRow>
                                            {showFields.includes("Número compra") && <TableHead>Número compra</TableHead>}
                                            {showFields.includes("Número factura proveedor") && <TableHead>Número factura proveedor</TableHead>}
                                            {showFields.includes("Termino") && <TableHead>Termino</TableHead>}
                                            {showFields.includes("Estado") && <TableHead>Estado</TableHead>}
                                            {showFields.includes("Observaciones") && <TableHead>Observaciones</TableHead>}
                                            {showFields.includes("Subtotal") && <TableHead>Subtotal</TableHead>}
                                            {showFields.includes("Total") && <TableHead>Total</TableHead>}
                                            {showFields.includes("Proveedor") && <TableHead>Proveedor</TableHead>}
                                            {showFields.includes("Fecha creación") && <TableHead>Fecha creación</TableHead>}
                                            {showFields.includes("Fecha modificación") && <TableHead>Fecha modificación</TableHead>}
                                            {
                                                dataAuth.tipo_usuario == import.meta.env.VITE_TYPEFROM_USER &&
                                                showFields.includes("Usuario creador") && <TableHead>Usuario creador</TableHead>
                                            }
                                            {
                                                dataAuth.tipo_usuario == import.meta.env.VITE_TYPEFROM_USER &&
                                                showFields.includes("Usuario modificador") && <TableHead>Usuario modificador</TableHead>
                                            }
                                            {
                                                dataAuth.tipo_usuario == import.meta.env.VITE_TYPEFROM_USER &&
                                                <TableHead className="text-right">Acción</TableHead>
                                            }
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {
                                            filteredProducts?.map(buy => (
                                                <TableRow key={buy.id}>
                                                    {
                                                        showFields.includes("id") &&
                                                        <TableCell>{buy.id}</TableCell>
                                                    }
                                                    {
                                                        showFields.includes("Número compra") &&
                                                        <TableCell>{buy.numero_compra}</TableCell>
                                                    }
                                                    {
                                                        showFields.includes("Número factura proveedor") &&
                                                        <TableCell>
                                                            <div className="truncate w-56">
                                                                {buy.numero_factura_proveedor}
                                                            </div>
                                                        </TableCell>
                                                    }
                                                    {
                                                        showFields.includes("Termino") &&
                                                        <TableCell>{buy.termino}</TableCell>
                                                    }

                                                    {
                                                        showFields.includes("Estado") &&
                                                        <TableCell>
                                                            <Badge variant={buy.estado == 1 ? "secondary" : "destructive"}>
                                                                {buy.estado == 1 ? (<BadgeCheck className="inline-start" />) : (<Ban className="inline-start" />)}
                                                                {buy.estado == 1 ? "Activo" : "Inactivo"}
                                                            </Badge>
                                                        </TableCell>
                                                    }

                                                    {
                                                        showFields.includes("Observaciones") &&
                                                        <TableCell>
                                                            {buy.observaciones}
                                                        </TableCell>
                                                    }

                                                    {
                                                        showFields.includes("Subtotal") &&
                                                        <TableCell>
                                                            {
                                                                formatCurrency(buy.subtotal)
                                                            }
                                                        </TableCell>
                                                    }

                                                    {
                                                        showFields.includes("Total") &&
                                                        <TableCell>
                                                            {formatCurrency(buy.total)}
                                                        </TableCell>
                                                    }

                                                    {
                                                        showFields.includes("Proveedor") &&
                                                        <TableCell>
                                                            {buy.proveedor}
                                                        </TableCell>
                                                    }

                                                    {
                                                        showFields.includes("Fecha creación") &&
                                                        <TableCell>{buy.fecha_creacion}</TableCell>
                                                    }

                                                    {
                                                        showFields.includes("Fecha modificación") &&
                                                        <TableCell>{buy.fecha_modificacion}</TableCell>
                                                    }

                                                    {
                                                        showFields.includes("Usuario creador") &&
                                                        <TableCell>{buy.nombre_usuario_creador}</TableCell>
                                                    }

                                                    {
                                                        showFields.includes("Usuario modificador") &&
                                                        <TableCell>{buy.nombre_usuario_modificador}</TableCell>
                                                    }

                                                    <TableCell className="text-right">
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="outline">
                                                                    <Ellipsis className="size-5" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent className="w-full">
                                                                <DropdownMenuGroup>
                                                                    <DropdownMenuItem>
                                                                        <Button
                                                                            onClick={() => {
                                                                                setEditingBuys({ ...buy, detalles_compra: [] })
                                                                                setOpenDialogEditBuys(!openDialogEditBuys)
                                                                                refetch()

                                                                                if (openDialogEditBuys) {
                                                                                    navigate(location.pathname, { replace: true })
                                                                                    setOpenDialogEditBuys(!openDialogEditBuys)
                                                                                    refetch()
                                                                                }
                                                                                else {
                                                                                    navigate(location.pathname + `?editBuy=${buy.id}`)
                                                                                    refetch()
                                                                                }
                                                                            }}
                                                                            variant="outline"
                                                                            className="flex items-center justify-center gap-x-3"
                                                                        >
                                                                            <UserPenIcon className="size-4" />
                                                                            Modificar compra
                                                                        </Button>
                                                                    </DropdownMenuItem>
                                                                </DropdownMenuGroup>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        }

                                        <TableRow>
                                            {
                                                filteredProducts.length == 0 &&
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
                                            editingBuys && (
                                                <Dialog open={openDialogEditBuys} onOpenChange={() => {
                                                    setOpenDialogEditBuys(!openDialogEditBuys)
                                                }}>
                                                    <EditBuy product={editingBuys} onClose={() => setEditingBuys(null)} />
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

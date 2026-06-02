import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
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
import { BadgeCheck, Ban, Edit, Ellipsis, File, Loader2, MessageCircleQuestion, Search } from "lucide-react";
import type { AuthPermissions } from "@/types/auth.interface";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import TableEmpty from "@/components/ui-components/TableEmpty";
import { Dialog } from "@/components/ui/dialog";
import { formatCurrency } from "@/utils/utilidad";
import EditBuys from "@/components/buys/EditBuy";
import { AlertDialog } from "@/components/ui/alert-dialog";
import AlertDialogDelete from "@/components/ui-components/AlertDialogDelete";
import api from "@/lib/axios";
import { getSales } from "@/apis/sales.apis";
import type { SalesFormDataInfo } from "@/types/sales.interface";
import ToogleFieldsDialogSales from "@/components/sales/ToogleFieldsDialogSales";
import CreateSales from "@/components/sales/CreateSales";

export default function SalesView({ dataAuth }: { dataAuth: AuthPermissions }) {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search)
    const modalEditSales = queryParams.get("editSales");
    const showEditModal = modalEditSales ? true : false;


    const { data, isLoading, refetch, isError } = useQuery({
        queryKey: ["sales"],
        queryFn: getSales,
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
    const [idSales, setidSales] = useState("");
    const [openDialogEditSales, setOpenDialogEditSales] = useState(showEditModal);
    const [openAlertDialogReport, setOpenAlertDialogReport] = useState(false);


    const [editingSales, setEditingSales] = useState<SalesFormDataInfo | null>(null);
    const [showFields, setShowFields] = useState<string[]>([
        "Número venta",
        "Observaciones",
        "Subtotal",
        "Total",
        "Estado",
        "Cliente",
        "Fecha creación",
        "Usuario creador"
    ]);

    const filteredSales = Object.values(data || {}).filter(sales =>
        Object.values(sales).some(value =>
            value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    if (isError) return <Navigate to={"/404"} />

    const handleChangeState = (state: boolean) => {
        if (state == true) {
            onClickCreateReportInventory();
        }

    }


    const onClickCreateReportInventory = async () => {
        try {
            // Realiza la solicitud GET para obtener el PDF
            const response = await api(`/buys/reportBuys/${idSales}`, {
                responseType: "blob", // Importante para manejar archivos binarios
            });

            const blob = response.data;
            const url = URL.createObjectURL(blob);
            window.open(url, '_blank');
        } catch (error) {
            let errormessage = "";
            if (error instanceof Error) {
                errormessage = error.message;
            }

            toast.error(`Error al descargar el archivo: ${errormessage || "Error desconocido"}`, {
                position: "top-right",
                closeButton: true,
                action: {
                    label: "Cerrar",
                    onClick: () => toast.dismiss()
                }
            });
        }
    }

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

                                    {
                                        dataAuth?.permisos_compra[0].guardar == 1 && (<CreateSales dataAuth={dataAuth} />)
                                    }

                                    <ToogleFieldsDialogSales showFields={showFields} setShowFields={setShowFields} />
                                </div>
                            </section>

                            <div className="mt-3 w-full h-[80%] md:h-[90%] mx-auto">
                                <Table>
                                    <TableCaption>Registro de compras.</TableCaption>
                                    <TableHeader>
                                        <TableRow>
                                            {showFields.includes("Número venta") && <TableHead>Número venta</TableHead>}
                                            {showFields.includes("Termino") && <TableHead>Termino</TableHead>}
                                            {showFields.includes("Estado") && <TableHead>Estado</TableHead>}
                                            {showFields.includes("Observaciones") && <TableHead>Observaciones</TableHead>}
                                            {showFields.includes("Subtotal") && <TableHead>Subtotal</TableHead>}
                                            {showFields.includes("Total") && <TableHead>Total</TableHead>}
                                            {showFields.includes("Cliente") && <TableHead>Cliente</TableHead>}
                                            {showFields.includes("Fecha creación") && <TableHead>Fecha creación</TableHead>}
                                            {showFields.includes("Fecha modificación") && <TableHead>Fecha modificación</TableHead>}
                                            {
                                                dataAuth.tipo_usuario == import.meta.env.VITE_TYPEFROM_USER &&
                                                showFields.includes("Usuario creador") && <TableHead>Usuario creador</TableHead>
                                            }
                                            {
                                                dataAuth.tipo_usuario == import.meta.env.VITE_TYPEFROM_USER &&
                                                <TableHead className="text-right">Acción</TableHead>
                                            }
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {
                                            filteredSales?.map(sales => (
                                                <TableRow key={sales.id}>
                                                    {
                                                        showFields.includes("id") &&
                                                        <TableCell>{sales.id}</TableCell>
                                                    }
                                                    {
                                                        showFields.includes("Número venta") &&
                                                        <TableCell>{sales.numero_venta}</TableCell>
                                                    }

                                                    {
                                                        showFields.includes("Estado") &&
                                                        <TableCell>
                                                            <Badge variant={sales.estado == 1 ? "secondary" : "destructive"}>
                                                                {sales.estado == 1 ? (<BadgeCheck className="inline-start" />) : (<Ban className="inline-start" />)}
                                                                {sales.estado == 1 ? "Activo" : "Inactivo"}
                                                            </Badge>
                                                        </TableCell>
                                                    }

                                                    {
                                                        showFields.includes("Observaciones") &&
                                                        <TableCell>
                                                            {sales.observaciones}
                                                        </TableCell>
                                                    }

                                                    {
                                                        showFields.includes("Subtotal") &&
                                                        <TableCell>
                                                            {
                                                                formatCurrency(sales.subtotal)
                                                            }
                                                        </TableCell>
                                                    }

                                                    {
                                                        showFields.includes("Total") &&
                                                        <TableCell>
                                                            {formatCurrency(sales.total)}
                                                        </TableCell>
                                                    }

                                                    {
                                                        showFields.includes("Cliente") &&
                                                        <TableCell>
                                                            {
                                                                sales.cliente == null ?
                                                                    sales.nombre_cliente_manual
                                                                    :
                                                                    sales.cliente
                                                            }
                                                        </TableCell>
                                                    }

                                                    {
                                                        showFields.includes("Fecha creación") &&
                                                        <TableCell>{sales.fecha_creacion}</TableCell>
                                                    }

                                                    {
                                                        showFields.includes("Usuario creador") &&
                                                        <TableCell>{sales.nombre_usuario_creador}</TableCell>
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
                                                                                setEditingSales({ ...sales, detalles_venta: [] })
                                                                                setOpenDialogEditSales(!openDialogEditSales)
                                                                                refetch()

                                                                                if (openDialogEditSales) {
                                                                                    navigate(location.pathname, { replace: true })
                                                                                    setOpenDialogEditSales(!openDialogEditSales)
                                                                                    refetch()
                                                                                }
                                                                                else {
                                                                                    navigate(location.pathname + `?editSales=${sales.id}`)
                                                                                    refetch()
                                                                                }
                                                                            }}
                                                                            variant="outline"
                                                                            className="flex items-center justify-center gap-x-3"
                                                                        >
                                                                            <Edit className="size-4" />
                                                                            Modificar compra
                                                                        </Button>
                                                                    </DropdownMenuItem>
                                                                    {
                                                                        dataAuth.tipo_usuario == import.meta.env.VITE_TYPEFROM_USER &&
                                                                        <>
                                                                            <DropdownMenuSeparator />
                                                                            <DropdownMenuItem>
                                                                                <Button
                                                                                    onClick={() => {
                                                                                        setOpenAlertDialogReport(true);
                                                                                        setidSales(sales.id)
                                                                                    }}
                                                                                    variant="ghost"
                                                                                    className="flex items-center justify-center gap-x-4 border border-gray-300 dark:border-gray-700"
                                                                                >
                                                                                    <File className="size-5" />
                                                                                    Imprimir reporte
                                                                                </Button>
                                                                            </DropdownMenuItem>
                                                                        </>
                                                                    }
                                                                </DropdownMenuGroup>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        }

                                        <TableRow>
                                            {
                                                filteredSales.length == 0 &&
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

                                        {/* {
                                            editingSales && (
                                                <Dialog open={openDialogEditSales} onOpenChange={() => {
                                                    setOpenDialogEditSales(!openDialogEditSales)
                                                }}>
                                                    <EditBuys sales={editingSales} dataAuth={dataAuth} onClose={() => setEditingSales(null)} />
                                                </Dialog>
                                            )
                                        } */}

                                        {
                                            openAlertDialogReport == true && (
                                                <AlertDialog open={openAlertDialogReport} onOpenChange={() => setOpenAlertDialogReport(false)}>
                                                    <AlertDialogDelete
                                                        icon={MessageCircleQuestion}
                                                        title="Crear reporte"
                                                        description={`¿Seguro deseas crear el reporte?`}
                                                        buttonCancel="¡No, crear!"
                                                        buttonConfirm="¡Si, crear!"
                                                        onClickConfirm={handleChangeState}
                                                    />
                                                </AlertDialog>
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

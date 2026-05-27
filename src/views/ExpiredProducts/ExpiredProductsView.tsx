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
import { Edit, Ellipsis, Loader2, Search } from "lucide-react";
import type { AuthPermissions } from "@/types/auth.interface";
import { toast } from "sonner";
import TableEmpty from "@/components/ui-components/TableEmpty";
import { getExpiredProducts } from "@/apis/expiredProducts.apis";
import type { ExpiredProductsFormDataInfo } from "@/types/expiredProducts.interface";
import CreateExpiredProducts from "@/components/expiredProducts/CreateExpiredPropducts";
import ToogleFieldsDialogexpiredProducts from "@/components/expiredProducts/ToogleFieldsDialogexpiredProducts";
import EditExpiredProducts from "@/components/expiredProducts/EditExpiredproducts";

export default function ExpiredProductsView({ dataAuth }: { dataAuth: AuthPermissions }) {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search)
    const modalEditExpiredProducts = queryParams.get("editExpiredProducts");
    const showEditModal = modalEditExpiredProducts ? true : false;


    const { data, isLoading, refetch, isError } = useQuery({
        queryKey: ["expiredProducts"],
        queryFn: getExpiredProducts,
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
    const [openDialogEditExpiredProducts, setOpenDialogEditExpiredProducts] = useState(showEditModal)


    const [editingExpiredProducts, setEditingExpiredProducts] = useState<ExpiredProductsFormDataInfo | null>(null)
    const [showFields, setShowFields] = useState<string[]>([
        "Observaciones",
        "Fecha creación",
        "Fecha modificación",
        "Usuario creador",
        "Usuario modificador"
    ]);

    const filteredExpiredProductos = Object.values(data || {}).filter(expiredProducts =>
        Object.values(expiredProducts).some(value =>
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

                                    {
                                        dataAuth?.permisos_producto[0].guardar == 1 && (<CreateExpiredProducts />)
                                    }

                                    <ToogleFieldsDialogexpiredProducts showFields={showFields} setShowFields={setShowFields} />
                                </div>
                            </section>

                            <div className="mt-3 w-full h-[80%] md:h-[90%] mx-auto">
                                <Table>
                                    <TableCaption>Registro de marcas.</TableCaption>
                                    <TableHeader>
                                        <TableRow>
                                            {showFields.includes("Observaciones") && <TableHead>Observaciones</TableHead>}
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
                                            filteredExpiredProductos?.map(expiredProducts => (
                                                <TableRow key={expiredProducts.id}>
                                                    {
                                                        showFields.includes("id") &&
                                                        <TableCell>{expiredProducts.id}</TableCell>
                                                    }
                                                    {
                                                        showFields.includes("Observaciones") &&
                                                        <TableCell>{expiredProducts.observaciones}</TableCell>
                                                    }
                                                    {
                                                        showFields.includes("Fecha creación") &&
                                                        <TableCell>{expiredProducts.fecha_creacion}</TableCell>
                                                    }
                                                    {
                                                        showFields.includes("Fecha modificación") &&
                                                        <TableCell>{expiredProducts.fecha_modificacion}</TableCell>
                                                    }

                                                    {
                                                        showFields.includes("Usuario creador") &&
                                                        <TableCell>{expiredProducts.nombre_usuario_creador}</TableCell>
                                                    }

                                                    {
                                                        showFields.includes("Usuario modificador") &&
                                                        <TableCell>{expiredProducts.nombre_usuario_modificador}</TableCell>
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
                                                                                setEditingExpiredProducts(expiredProducts)
                                                                                setOpenDialogEditExpiredProducts(!openDialogEditExpiredProducts)
                                                                                refetch()

                                                                                if (openDialogEditExpiredProducts) {
                                                                                    navigate(location.pathname, { replace: true })
                                                                                    setOpenDialogEditExpiredProducts(!openDialogEditExpiredProducts)
                                                                                    refetch()
                                                                                }
                                                                                else {
                                                                                    navigate(location.pathname + `?editexpiredProducts=${expiredProducts.id}`)
                                                                                    refetch()
                                                                                }
                                                                            }}
                                                                            variant="outline"
                                                                            className="flex items-center justify-center gap-x-3"
                                                                        >
                                                                            <Edit className="size-4" />
                                                                            Modificar registro
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
                                                filteredExpiredProductos.length == 0 &&
                                                (
                                                    <TableCell colSpan={13}>
                                                        <div className="flex items-center flex-col justify-center w-full h-96 mx-auto">
                                                            <TableEmpty />
                                                            <p className='text-center font-bold text-3xl'>No se encontraron resultados...</p>
                                                        </div>
                                                    </TableCell>
                                                )
                                            }
                                        </TableRow>

                                        {
                                            editingExpiredProducts && (
                                                <EditExpiredProducts expiredProducts={editingExpiredProducts} onClose={() => setEditingExpiredProducts(null)} />
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

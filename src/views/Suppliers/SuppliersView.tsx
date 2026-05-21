import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
import { BadgeCheck, Ban, Ellipsis, Loader2, MessageCircleQuestion, Search, Trash, UserPenIcon } from "lucide-react";
import type { AuthPermissions } from "@/types/auth.interface";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import TableEmpty from "@/components/ui-components/TableEmpty";
import type { ErrorData } from "@/types/errors.interface";
import { AlertDialog } from "@/components/ui/alert-dialog";
import AlertDialogDelete from "@/components/ui-components/AlertDialogDelete";
import { deleteSupplier, getAllSupplier } from "@/apis/suppliers.apis";
import type { SupplierFormDataDelete, SupplierFormDataInfo } from "@/types/suppliers.interface";
import ToogleFieldsDialogSupplier from "@/components/suppliers/ToogleFieldsDialogSupplier";
import CreateSupplier from "@/components/suppliers/CreateSupplier";
import EditSupplier from "@/components/suppliers/EditSupplier";

export default function SuppliersView({ dataAuth }: { dataAuth: AuthPermissions }) {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search)
    const modalEditSupplier = queryParams.get("editSupplier");
    const showEditModal = modalEditSupplier ? true : false;


    const { data, isLoading, refetch, isError } = useQuery({
        queryKey: ["suppliers"],
        queryFn: getAllSupplier,
    });

    const queryClient = useQueryClient();
    const { mutate } = useMutation({
        mutationFn: deleteSupplier,
        onError: (error: ErrorData) => {
            toast.error(error.message, {
                position: "top-right",
                closeButton: true,
                action: {
                    label: "Cerrar",
                    onClick: () => toast.dismiss()
                }
            });
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["suppliers"] })
            toast.success(data, {
                position: "top-right",
                closeButton: true,
                action: {
                    label: "Cerrar  todas",
                    onClick: () => toast.dismiss()
                }
            });
            setDeletedSupplier(null)
        }
    })

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
    const [openDialogEditSupplier, setOpenDialogEditSupplier] = useState(showEditModal)
    const [openAlertDialogDelete, setOpenAlertDialogDelete] = useState(false);


    const [editingSupplier, setEditingSupplier] = useState<SupplierFormDataInfo | null>(null)
    const [deletedSupplier, setDeletedSupplier] = useState<SupplierFormDataDelete | null>(null)
    const [showFields, setShowFields] = useState<string[]>([
        "Código",
        "RUC",
        "Nombre",
        "Dirección",
        "Ciudad",
        "Correo",
        "Telefono",
        "Estado",
        "Fecha creación",
        "Fecha modificación",
        "Usuario creador",
        "Usuario modificador"
    ]);

    const filteredSuppliers = Object.values(data || {}).filter(supplier =>
        Object.values(supplier).some(value =>
            value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    if (isError) return <Navigate to={"/404"} />

    const handleChangeState = (state: boolean) => {
        if (state == true) {
            onClickDelete()
        }
    }


    const onClickDelete = () => {
        if (deletedSupplier != null) {
            mutate(deletedSupplier?.id);
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
                                        dataAuth?.permisos_proveedor[0].guardar == 1 && (<CreateSupplier />)
                                    }

                                    <ToogleFieldsDialogSupplier showFields={showFields} setShowFields={setShowFields} />
                                </div>
                            </section>

                            <div className="mt-3 w-full h-[80%] md:h-[90%] mx-auto">
                                <Table>
                                    <TableCaption>Registro de proveedores.</TableCaption>
                                    <TableHeader>
                                        <TableRow>
                                            {showFields.includes("Código") && <TableHead>Código</TableHead>}
                                            {showFields.includes("RUC") && <TableHead>RUC</TableHead>}
                                            {showFields.includes("Nombre") && <TableHead>Nombre</TableHead>}
                                            {showFields.includes("Dirección") && <TableHead>Dirección</TableHead>}
                                            {showFields.includes("Ciudad") && <TableHead>Ciudad</TableHead>}
                                            {showFields.includes("Correo") && <TableHead>Correo</TableHead>}
                                            {showFields.includes("Telefono") && <TableHead>Telefono</TableHead>}
                                            {showFields.includes("Celular") && <TableHead>Celular</TableHead>}
                                            {showFields.includes("Estado") && <TableHead>Estado</TableHead>}
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
                                            filteredSuppliers?.map(supplier => (
                                                <TableRow key={supplier.id}>
                                                    {
                                                        showFields.includes("id") &&
                                                        <TableCell>{supplier.id}</TableCell>
                                                    }
                                                    {
                                                        showFields.includes("Código") &&
                                                        <TableCell>{supplier.codigo_proveedor}</TableCell>
                                                    }
                                                    {
                                                        showFields.includes("RUC") &&
                                                        <TableCell>{supplier.ruc_proveedor}</TableCell>
                                                    }
                                                    {
                                                        showFields.includes("Nombre") &&
                                                        <TableCell>{supplier.nombre_proveedor}</TableCell>
                                                    }
                                                    {
                                                        showFields.includes("Dirección") &&
                                                        <TableCell>{supplier.direccion_proveedor}</TableCell>
                                                    }
                                                    {
                                                        showFields.includes("Ciudad") &&
                                                        <TableCell>{supplier.ciudad_proveedor}</TableCell>
                                                    }
                                                    {
                                                        showFields.includes("Correo") &&
                                                        <TableCell>{supplier.correo_proveedor}</TableCell>
                                                    }
                                                    {
                                                        showFields.includes("Telefono") &&
                                                        <TableCell>{supplier.telefono_proveedor}</TableCell>
                                                    }
                                                    {
                                                        showFields.includes("Celular") &&
                                                        <TableCell>{supplier.celular_proveedor}</TableCell>
                                                    }

                                                    {
                                                        showFields.includes("Estado") &&
                                                        <TableCell>
                                                            <Badge variant={supplier.estado == 1 ? "secondary" : "destructive"}>
                                                                {supplier.estado == 1 ? (<BadgeCheck className="inline-start" />) : (<Ban className="inline-start" />)}
                                                                {supplier.estado == 1 ? "Activo" : "Inactivo"}
                                                            </Badge>
                                                        </TableCell>
                                                    }
                                                    {
                                                        showFields.includes("Fecha creación") &&
                                                        <TableCell>{supplier.fecha_creacion}</TableCell>
                                                    }
                                                    {
                                                        showFields.includes("Fecha modificación") &&
                                                        <TableCell>{supplier.fecha_modificacion}</TableCell>
                                                    }

                                                    {
                                                        showFields.includes("Usuario creador") &&
                                                        <TableCell>{supplier.nombre_usuario_creador}</TableCell>
                                                    }

                                                    {
                                                        showFields.includes("Usuario modificador") &&
                                                        <TableCell>{supplier.nombre_usuario_modificador}</TableCell>
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
                                                                                setEditingSupplier(supplier)
                                                                                setOpenDialogEditSupplier(!openDialogEditSupplier)
                                                                                refetch()

                                                                                if (openDialogEditSupplier) {
                                                                                    navigate(location.pathname, { replace: true })
                                                                                    setOpenDialogEditSupplier(!openDialogEditSupplier)
                                                                                    refetch()
                                                                                }
                                                                                else {
                                                                                    navigate(location.pathname + `?editSupplier=${supplier.id}`)
                                                                                    refetch()
                                                                                }
                                                                            }}
                                                                            variant="outline"
                                                                            className="flex items-center justify-center gap-x-3"
                                                                        >
                                                                            <UserPenIcon className="size-4" />
                                                                            Modificar proveedor
                                                                        </Button>
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuSeparator />
                                                                    <DropdownMenuItem
                                                                        onClick={() => {
                                                                            setDeletedSupplier(supplier)
                                                                            setOpenAlertDialogDelete(true);
                                                                        }}
                                                                    >
                                                                        <Button
                                                                            variant="destructive"
                                                                        >
                                                                            <Trash className="size-4" />
                                                                            Eliminar proveedor
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
                                                filteredSuppliers.length == 0 &&
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
                                            editingSupplier && (
                                                <EditSupplier supplier={{ ...editingSupplier, usuario_modificador: "" }} onClose={() => setEditingSupplier(null)} />
                                            )
                                        }

                                        {
                                            (deletedSupplier != null || deletedSupplier != undefined) && (
                                                <AlertDialog open={openAlertDialogDelete} onOpenChange={() => setDeletedSupplier(null)}>
                                                    <AlertDialogDelete
                                                        icon={MessageCircleQuestion}
                                                        title="Eliminar proveedor"
                                                        description={`¿Seguro deseas eliminar el proveedor: ${deletedSupplier.nombre_proveedor}?`}
                                                        buttonCancel="¡No, eliminar!"
                                                        buttonConfirm="¡Si, eliminar!"
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

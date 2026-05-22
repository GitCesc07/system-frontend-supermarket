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
import { deleteBrand, getBrands } from "@/apis/brand.apis";
import type { BrandFormDataDelete, BrandFormDataInfo } from "@/types/brand.interface";
import ToogleFieldsDialogBrand from "@/components/brand/ToogleFieldsDialogBrand";
import EditBrand from "@/components/brand/EditBrand";
import CreateBrand from "@/components/brand/CreateBrand";

export default function BrandsView({ dataAuth }: { dataAuth: AuthPermissions }) {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search)
    const modalEditBrands = queryParams.get("editBrands");
    const showEditModal = modalEditBrands ? true : false;


    const { data, isLoading, refetch, isError } = useQuery({
        queryKey: ["brands"],
        queryFn: getBrands,
    });

    const queryClient = useQueryClient();
    const { mutate } = useMutation({
        mutationFn: deleteBrand,
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
            queryClient.invalidateQueries({ queryKey: ["brands"] })
            toast.success(data, {
                position: "top-right",
                closeButton: true,
                action: {
                    label: "Cerrar  todas",
                    onClick: () => toast.dismiss()
                }
            });
            setDeletedBrand(null)
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
    const [openDialogEditBrand, setOpenDialogEditBrand] = useState(showEditModal)
    const [openAlertDialogDelete, setOpenAlertDialogDelete] = useState(false);


    const [editingBrand, setEditingBrand] = useState<BrandFormDataInfo | null>(null)
    const [deletedBrand, setDeletedBrand] = useState<BrandFormDataDelete | null>(null)
    const [showFields, setShowFields] = useState<string[]>([
        "Marca",
        "Descripción",
        "Estado",
        "Fecha creación",
        "Fecha modificación",
        "Usuario creador",
        "Usuario modificador"
    ]);

    const filteredBrands = Object.values(data || {}).filter(brand =>
        Object.values(brand).some(value =>
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
        if (deletedBrand != null) {
            mutate(deletedBrand?.id);
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
                                        dataAuth?.permisos_marca[0].guardar == 1 && (<CreateBrand />)
                                    }

                                    <ToogleFieldsDialogBrand showFields={showFields} setShowFields={setShowFields} />
                                </div>
                            </section>

                            <div className="mt-3 w-full h-[80%] md:h-[90%] mx-auto">
                                <Table>
                                    <TableCaption>Registro de marcas.</TableCaption>
                                    <TableHeader>
                                        <TableRow>
                                            {showFields.includes("Marca") && <TableHead>Marca</TableHead>}
                                            {showFields.includes("Descripción") && <TableHead>Descripción</TableHead>}
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
                                            filteredBrands?.map(brand => (
                                                <TableRow key={brand.id}>
                                                    {
                                                        showFields.includes("id") &&
                                                        <TableCell>{brand.id}</TableCell>
                                                    }
                                                    {
                                                        showFields.includes("Marca") &&
                                                        <TableCell>{brand.nombre_marca}</TableCell>
                                                    }
                                                    {
                                                        showFields.includes("Descripción") &&
                                                        <TableCell>{brand.descripcion}</TableCell>
                                                    }

                                                    {
                                                        showFields.includes("Estado") &&
                                                        <TableCell>
                                                            <Badge variant={brand.estado == 1 ? "secondary" : "destructive"}>
                                                                {brand.estado == 1 ? (<BadgeCheck className="inline-start" />) : (<Ban className="inline-start" />)}
                                                                {brand.estado == 1 ? "Activo" : "Inactivo"}
                                                            </Badge>
                                                        </TableCell>
                                                    }
                                                    {
                                                        showFields.includes("Fecha creación") &&
                                                        <TableCell>{brand.fecha_creacion}</TableCell>
                                                    }
                                                    {
                                                        showFields.includes("Fecha modificación") &&
                                                        <TableCell>{brand.fecha_modificacion}</TableCell>
                                                    }

                                                    {
                                                        showFields.includes("Usuario creador") &&
                                                        <TableCell>{brand.nombre_usuario_creador}</TableCell>
                                                    }

                                                    {
                                                        showFields.includes("Usuario modificador") &&
                                                        <TableCell>{brand.nombre_usuario_modificador}</TableCell>
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
                                                                                setEditingBrand(brand)
                                                                                setOpenDialogEditBrand(!openDialogEditBrand)
                                                                                refetch()

                                                                                if (openDialogEditBrand) {
                                                                                    navigate(location.pathname, { replace: true })
                                                                                    setOpenDialogEditBrand(!openDialogEditBrand)
                                                                                    refetch()
                                                                                }
                                                                                else {
                                                                                    navigate(location.pathname + `?editBrand=${brand.id}`)
                                                                                    refetch()
                                                                                }
                                                                            }}
                                                                            variant="outline"
                                                                            className="flex items-center justify-center gap-x-3"
                                                                        >
                                                                            <UserPenIcon className="size-4" />
                                                                            Modificar marca
                                                                        </Button>
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuSeparator />
                                                                    <DropdownMenuItem
                                                                        onClick={() => {
                                                                            setDeletedBrand(brand)
                                                                            setOpenAlertDialogDelete(true);
                                                                        }}
                                                                    >
                                                                        <Button
                                                                            variant="destructive"
                                                                        >
                                                                            <Trash className="size-4" />
                                                                            Eliminar marca
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
                                                filteredBrands.length == 0 &&
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
                                            editingBrand && (
                                                <EditBrand brand={{ ...editingBrand, usuario_modificador: "" }} onClose={() => setEditingBrand(null)} />
                                            )
                                        }

                                        {
                                            (deletedBrand != null || deletedBrand != undefined) && (
                                                <AlertDialog open={openAlertDialogDelete} onOpenChange={() => setDeletedBrand(null)}>
                                                    <AlertDialogDelete
                                                        icon={MessageCircleQuestion}
                                                        title="Eliminar marca"
                                                        description={`¿Seguro deseas eliminar la marca: ${deletedBrand.nombre_marca}?`}
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

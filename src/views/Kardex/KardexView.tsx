import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
import { BadgeCheck, Ban, Ellipsis, Loader2, Search, Trash, UserPenIcon } from "lucide-react";
import type { AuthPermissions } from "@/types/auth.interface";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import TableEmpty from "@/components/ui-components/TableEmpty";
import ViewImageDialog from "@/components/products/ViewImageDialog";
import { Dialog } from "@/components/ui/dialog";
import EditProduct from "@/components/products/EditProduct";
import ToogleFieldsDialogKardex from "@/components/kardex/ToogleFieldsDialogKardex";
import type { ProductDataCombobox } from "@/types/products.interface";
import { getKardexByDate, getKardexById, getKardexByidAndDate } from "@/apis/kardex.apis";

export default function KardexView({ dataAuth }: { dataAuth: AuthPermissions }) {
    const navigate = useNavigate()
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    const modalViewProduct = queryParams.get("viewKardex");
    const startDateValue = queryParams.get("startDate");
    const endDateValue = queryParams.get("endDate");
    const idValue = modalViewProduct;

    const [isKardexProductActive, setisKardexProductActive] = useState(false);
    const [isKardexRangeDateActive, setisKardexRangeDateActive] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [dataProducts, setDataProducts] = useState<ProductDataCombobox | null>(null);

    const [showFields, setShowFields] = useState<string[]>([
        "Producto",
        "Descripción",
        "Cantidad minima",
        "Imagen",
        "Estado",
        "Expiracion",
        "Fecha expiración",
        "Marca",
        "Categoría",
        "Fecha creación",
        "Fecha modificación",
        "Usuario creador",
        "Usuario modificador"
    ]);

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
    const [mensaje, setMensaje] = useState<string>("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [daysDifference, setDaysDifference] = useState(0);
    const [id, setId] = useState("");


    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setStartDate(startDateValue || "")
        setEndDate(endDateValue || "")
        setId(idValue || "")
    }, [startDateValue, endDateValue, idValue])

    useEffect(() => {
        if (modalViewProduct != null || modalViewProduct != undefined) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setisKardexProductActive(true);
        }
        else {
            setisKardexProductActive(false);
        }

        if (startDateValue != null && endDateValue != null || startDateValue != undefined && endDateValue != undefined) {
            setisKardexRangeDateActive(true);
        }
        else {
            setisKardexRangeDateActive(false);
        }

    }, [modalViewProduct, startDateValue, endDateValue]);



    useEffect(() => {
        const differenceDatetime = new Date(endDate).getTime() - new Date(startDate).getTime();
        const differenceDateDays = differenceDatetime / (1000 * 3600 * 24);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setDaysDifference(differenceDateDays)

        if (startDate !== "" && endDate !== "") {
            navigate(location.pathname + `?startDate=${startDate}&endDate=${endDate}`)
        }

    }, [endDate, startDate, location.pathname, navigate]);

    const handleSelectionProducts = (dataProducts: ProductDataCombobox) => {
        setDataProducts(dataProducts);
        setStartDate("");
        setEndDate("");
        setDaysDifference(0);
        navigate(location.pathname + `?viewKardex=${dataProducts.id}`);
    }

    const { data: dataKardexRange, refetch: refreshRange, isLoading: isLoadingRange } = useQuery({
        queryKey: ["kardex", startDate, endDate],
        queryFn: () => getKardexByDate({ startDate, endDate }),
        enabled: false,
        retry: false
    });


    const { data, refetch, isLoading } = useQuery({
        queryKey: ["kardex", id],
        queryFn: () => getKardexById({ id }),
        enabled: !!id,
        retry: false
    });


    const { data: dataIdRangeDate, refetch: refreshIdRange, isLoading: isLoadingIdRangeDate } = useQuery({
        queryKey: ["kardex", id],
        queryFn: () => getKardexByidAndDate({ id, startDate, endDate }),
        enabled: !!id,
        retry: false
    });


    const filteredKardex = data?.filter(kardex =>
        Object.values(kardex).some(value =>
            value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    const filteredKardexDateRange = dataKardexRange?.filter(kardex =>
        Object.values(kardex).some(value =>
            value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    const filteredKardexIdDateRange = dataIdRangeDate?.filter(kardex =>
        Object.values(kardex).some(value =>
            value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

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

                                    <ToogleFieldsDialogKardex showFields={showFields} setShowFields={setShowFields} />
                                </div>
                            </section>

                            <div className="mt-3 w-full h-[80%] md:h-[90%] mx-auto">
                                <Table>
                                    <TableCaption>Registro de productos.</TableCaption>
                                    <TableHeader>
                                        <TableRow>
                                            {showFields.includes("Producto") && <TableHead>Producto</TableHead>}
                                            {showFields.includes("Descripción") && <TableHead>Descripción</TableHead>}
                                            {showFields.includes("Cantidad minima") && <TableHead>Cantidad minima</TableHead>}
                                            {showFields.includes("Imagen") && <TableHead>Imagen</TableHead>}
                                            {showFields.includes("Estado") && <TableHead>Estado</TableHead>}
                                            {showFields.includes("Expiración") && <TableHead>Expiración</TableHead>}
                                            {showFields.includes("Fecha expiración") && <TableHead>Fecha expiración</TableHead>}
                                            {showFields.includes("Marca") && <TableHead>Marca</TableHead>}
                                            {showFields.includes("Categoría") && <TableHead>Categoría</TableHead>}
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
                                            filteredProducts?.map(product => (
                                                <TableRow key={product.id}>
                                                    {
                                                        showFields.includes("id") &&
                                                        <TableCell>{product.id}</TableCell>
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
                                                        <TableCell>{product.cantidad_minima}</TableCell>
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
                                                        showFields.includes("Estado") &&
                                                        <TableCell>
                                                            <Badge variant={product.estado == 1 ? "secondary" : "destructive"}>
                                                                {product.estado == 1 ? (<BadgeCheck className="inline-start" />) : (<Ban className="inline-start" />)}
                                                                {product.estado == 1 ? "Activo" : "Inactivo"}
                                                            </Badge>
                                                        </TableCell>
                                                    }

                                                    {
                                                        showFields.includes("Expiración") &&
                                                        <TableCell align="center">
                                                            <input
                                                                className="opacity-90"
                                                                disabled
                                                                type="checkbox"
                                                                checked={product.expiracion == 1 ? true : false}
                                                                name="" id=""
                                                            />
                                                        </TableCell>
                                                    }
                                                    {
                                                        showFields.includes("Fecha expiración") &&
                                                        <TableCell>{product.fecha_expiracion}</TableCell>
                                                    }

                                                    {
                                                        showFields.includes("Marca") &&
                                                        <TableCell>{product.marca}</TableCell>
                                                    }

                                                    {
                                                        showFields.includes("Categoría") &&
                                                        <TableCell>{product.categoria}</TableCell>
                                                    }

                                                    {
                                                        showFields.includes("Fecha creación") &&
                                                        <TableCell>{product.fecha_creacion}</TableCell>
                                                    }

                                                    {
                                                        showFields.includes("Fecha modificación") &&
                                                        <TableCell>{product.fecha_modificacion}</TableCell>
                                                    }

                                                    {
                                                        showFields.includes("Usuario creador") &&
                                                        <TableCell>{product.nombre_usuario_creador}</TableCell>
                                                    }

                                                    {
                                                        showFields.includes("Usuario modificador") &&
                                                        <TableCell>{product.nombre_usuario_modificador}</TableCell>
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
                                                                                setEditingProduct(product)
                                                                                setOpenDialogEditProduct(!openDialogEditProduct)
                                                                                refetch()

                                                                                if (openDialogEditProduct) {
                                                                                    navigate(location.pathname, { replace: true })
                                                                                    setOpenDialogEditProduct(!openDialogEditProduct)
                                                                                    refetch()
                                                                                }
                                                                                else {
                                                                                    navigate(location.pathname + `?editProduct=${product.id}`)
                                                                                    refetch()
                                                                                }
                                                                            }}
                                                                            variant="outline"
                                                                            className="flex items-center justify-center gap-x-3"
                                                                        >
                                                                            <UserPenIcon className="size-4" />
                                                                            Modificar producto
                                                                        </Button>
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuSeparator />
                                                                    <DropdownMenuItem
                                                                        onClick={() => {
                                                                            setDeletedProduct(product)
                                                                            setOpenAlertDialogDelete(true);
                                                                        }}
                                                                    >
                                                                        <Button
                                                                            variant="destructive"
                                                                        >
                                                                            <Trash className="size-4" />
                                                                            Eliminar producto
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

                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    )
            }
        </div >
    )
}

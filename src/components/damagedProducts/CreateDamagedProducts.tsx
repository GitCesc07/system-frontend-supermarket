import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { ChevronDown, ChevronUp, Edit, MessageCircleQuestion, Plus, PlusIcon, Save, Search, Trash2 } from "lucide-react";
import type { ErrorData } from "@/types/errors.interface";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { createExpiredProducts } from "@/apis/expiredProducts.apis";
import type { ExpiredProductsFormDataAdd } from "@/types/expiredProducts.interface";
import type { TempPurchasingFormData, TempPurchasingFormDataDetails } from "@/types/buys.interface";
import { getInventory } from "@/apis/inventory.apis";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import TableEmpty from "../ui-components/TableEmpty";
import { AlertDialog } from "../ui/alert-dialog";
import AlertDialogDelete from "../ui-components/AlertDialogDelete";

export default function CreateDamagedProducts() {
    const navigate = useNavigate();
    const location = useLocation();

    const [open, setOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [openAlertDialogDeleted, setOpenAlertDialogDeleted] = useState<TempPurchasingFormData | null>(null);
    const [dataProducts, setDataProducts] = useState<TempPurchasingFormDataDetails[]>(sessionStorage.getItem("tempProductsAddExpiredProducts") ? JSON.parse(sessionStorage.getItem("tempProductsAddExpiredProducts")!) : [])
    const [editId, setEditId] = useState<string | null>(null)
    const [newProducts, setNewProducts] = useState({
        id_producto: "",
        nombre_producto: "",
        precio_compra: "",
        cantidad: "0",
        subtotal: "",
        id_inventario: ""
    })

    const [newExpiredProducts, setNewExpiredProducts] = useState({
        observaciones: "",
        detalle_productos_expirado: [{
            cantidad: "0",
            id_producto: "",
            id_inventario: ""
        }]
    });

    useEffect(() => {
        const storedProducts = sessionStorage.getItem("tempProductsAddExpiredProducts");
        if (storedProducts) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setDataProducts(JSON.parse(storedProducts));
        }
    }, [])

    useEffect(() => {
        sessionStorage.setItem("tempProductsAddExpiredProducts", JSON.stringify(dataProducts));
    }, [dataProducts]);

    // * Productos
    const { data: databaseProducts, refetch: refetchProduct } = useQuery({
        queryKey: ["inventory"],
        queryFn: getInventory,
    });
    const [openComboBoxProduct, setOpenComboBoxProduct] = useState(false);
    const [searchTermProduct, setSearchTermProduct] = useState("");
    const filteredProducts = Object.values(databaseProducts || {}).filter(product =>
        Object.values(product).some(value =>
            value.toString().toLowerCase().includes(searchTermProduct.toLowerCase())
        )
    );
    const [dataProductComboBox, setDataProductComboBox] = useState({
        id_producto: "",
        nombre_producto: "",
        id_inventario: ""
    });


    const addProducts = () => {
        setDataProducts([newProducts, ...dataProducts]);

        toast.success("El producto:", {
            description: `${newProducts.nombre_producto} se agrego correctamente...`,
            position: "top-right",
            closeButton: true,
            action: {
                label: "Cerrar  todas",
                onClick: () => toast.dismiss()
            }
        });

        setNewProducts({
            id_producto: "",
            precio_compra: "",
            nombre_producto: "",
            cantidad: "0",
            subtotal: "",
            id_inventario: ""
        })
        // setProductId(null);
        setDataProductComboBox({
            id_producto: "",
            nombre_producto: "",
            id_inventario: ""
        })
    }

    const editProduct = () => {
        setDataProducts(dataProducts.map(p => p.id_producto === newProducts.id_producto ? newProducts : p));

        toast.success("El producto:", {
            description: `${newProducts.nombre_producto} se modifico correctamente...`,
            position: "top-right",
            closeButton: true,
            action: {
                label: "Cerrar  todas",
                onClick: () => toast.dismiss()
            }
        });

        setNewProducts({
            id_producto: "",
            nombre_producto: "",
            precio_compra: "",
            cantidad: "0",
            subtotal: "",
            id_inventario: ""
        })
        sessionStorage.clear();
        setEditId(null);
    }

    const deleteProduct = (id_product: string) => {
        setDataProducts(dataProducts.filter((item) => item.id_producto !== id_product));
        sessionStorage.setItem("tempProductsAddBuys", JSON.stringify(dataProducts));
    }

    const changeDeleteState = (isDelete: boolean) => {
        if (isDelete == true) {
            deleteProduct(openAlertDialogDeleted!.id_producto);

            toast.success("El producto:", {
                description: `${newProducts.nombre_producto} se removio de la lista de los detalles...`,
                position: "top-right",
                closeButton: true,
                action: {
                    label: "Cerrar  todas",
                    onClick: () => toast.dismiss()
                }
            });
            setOpenAlertDialogDeleted(null);
        }
    }

    const handleSelectionProduct = (dataProduct: TempPurchasingFormData) => {
        if (dataProducts.find(item => item.id_producto == dataProduct.id_producto)) {
            toast.warning("El producto ya se encuentra agregado...", {
                position: "top-right",
                closeButton: true,
                action: {
                    label: "Cerrar  todas",
                    onClick: () => toast.dismiss()
                }
            });
            return;
        } else {
            // setProductId(dataProduct)
            // eslint-disable-next-line react-hooks/immutability
            newProducts.id_producto = dataProduct!.id_producto;
            newProducts.nombre_producto = dataProduct!.nombre_producto;
        }

    }

    const queryClient = useQueryClient()

    const { mutate } = useMutation({
        mutationFn: createExpiredProducts,
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
            queryClient.invalidateQueries({ queryKey: ["expiredproducts"] });
            toast.success(data, {
                position: "top-right",
                closeButton: true,
                action: {
                    label: "Cerrar  todas",
                    onClick: () => toast.dismiss()
                }
            });
            navigate(location.pathname, { replace: true });
            onClickClearForm();
        }
    })

    const {
        handleSubmit,
        reset
    } = useForm<ExpiredProductsFormDataAdd>({ defaultValues: newExpiredProducts });

    const filteredInventory = dataProducts?.filter(product =>
        Object.values(product).some(value =>
            value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
    )

    function onClickClearForm() {
        setNewExpiredProducts({
            observaciones: "",
            detalle_productos_expirado: [{
                cantidad: "0",
                id_producto: "",
                id_inventario: ""
            }]
        })
        reset();
        setOpen(false);
    }

    const onSubmitCreateExpiredProducts = () => {
        const data = newExpiredProducts;
        mutate(data);
    }
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger
                className="flex items-center justify-center gap-x-4 border border-gray-300 dark:border-gray-800 bg-gray-100 dark:bg-gray-900 rounded-lg py-1 px-2 w-full md:w-auto"
                onClick={() => {
                    navigate(location.pathname + "?createExpiredProducts");
                    setOpen(true);
                }}
            >
                <Plus className="size-5" />
                Crear registro
            </DialogTrigger>
            <DialogContent
                className="w-full h-[95%] md:max-w-lg"
                onInteractOutside={(e) => e.preventDefault()}
                onEscapeKeyDown={(e) => e.preventDefault()}
            >
                <DialogHeader>
                    <DialogTitle>Registra productos vencidos</DialogTitle>
                    <DialogDescription>
                        Aquí puedes registrar tus productos vencidos...
                    </DialogDescription>
                </DialogHeader>
                <form
                    onSubmit={handleSubmit(onSubmitCreateExpiredProducts)}
                    className="space-y-3"
                >
                    <div className="w-full">
                        <label className="w-full text-left font-bold" htmlFor="observaciones">
                            Observaciones
                        </label>
                        <input
                            className="py-1 px-4 font-normal text-base border border-gray-300 dark:border-gray-700 w-full rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
                            placeholder="Breve observaciones..."
                            id="observaciones"
                            value={newExpiredProducts.observaciones}
                            onChange={(e) => {
                                setNewExpiredProducts({ ...newExpiredProducts, observaciones: e.target.value });
                            }}
                            minLength={3}
                            maxLength={50}
                            required
                        />
                    </div>

                    <fieldset className="flex flex-1 w-full flex-col items-center mt-4 border border-gray-300 dark:border-gray-600 px-1 sm:p-4 rounded-lg py-4">
                        <legend className="uppercase font-bold">Datos del producto</legend>
                        <div className="w-full flex-col flex items-start -mt-3">
                            <label htmlFor="nombre_producto" className="font-bold mb-1">Productos:</label>
                            <div className={`w-full mx-auto flex items-center justify-center md:justify-between border border-gray-300 dark:border-gray-600 py-1 px-2 cursor-pointer ${openComboBoxProduct == true ? "rounded-t-md" : "rounded-md"}`}
                                onClick={() => {
                                    setOpenComboBoxProduct(!openComboBoxProduct)
                                    refetchProduct();
                                }}
                            >
                                <span className="cursor-pointer">{dataProductComboBox.nombre_producto == "" ? "Selecciona producto" : dataProductComboBox.nombre_producto}</span>

                                {
                                    openComboBoxProduct == true ?
                                        (
                                            <ChevronUp className="size-5" />
                                        )
                                        :
                                        (
                                            <ChevronDown className="size-5" />
                                        )
                                }
                            </div>
                            {
                                openComboBoxProduct == true ?
                                    (
                                        <div className="w-full top-0 right-0 h-32 sticky mx-auto overflow-auto touch-pan-y scrollbar-thin-custom transition-all duration-700 ease-in-out">
                                            <ul className="rounded-b-lg border border-gray-300 dark:border-gray-600">
                                                <>
                                                    <div className="w-full border-b border-gray-300 dark:border-gray-600  py-1 px-2 flex items-center gap-x-1">
                                                        <Search className="size-5 text-gray-400" href="searchProduct" />
                                                        <input
                                                            id="searchProduct"
                                                            type="text"
                                                            value={searchTermProduct}
                                                            onChange={(e) => setSearchTermProduct(e.target.value)}
                                                            placeholder="Buscar..."
                                                            className="w-full border-none outline-none placeholder:text-gray-400"
                                                        />
                                                    </div>

                                                    {
                                                        filteredProducts?.map((product, index) => (
                                                            <li
                                                                key={index}
                                                                className="hover:bg-gray-300 py-1 px-4 cursor-pointer"
                                                                onClick={() => {
                                                                    setNewProducts({
                                                                        ...newProducts,
                                                                        id_producto: product.id_producto,
                                                                        id_inventario: product.id_inventario,
                                                                        nombre_producto: product.nombre_producto,
                                                                        precio_compra: "",
                                                                        cantidad: "0",
                                                                    })
                                                                    setSearchTermProduct("");
                                                                    setOpenComboBoxProduct(!openComboBoxProduct);
                                                                    setDataProductComboBox({
                                                                        ...dataProductComboBox, id_producto: product.id_producto,
                                                                        nombre_producto: product.nombre_producto,
                                                                        id_inventario: product.id_inventario
                                                                    });
                                                                    handleSelectionProduct({
                                                                        id_producto: product.id_producto,
                                                                        id_inventario: product.id_inventario,
                                                                        nombre_producto: product.nombre_producto,
                                                                        precio_compra: "",
                                                                        cantidad: "0",
                                                                        stock: 0,
                                                                        subtotal_compra: "0",
                                                                        subtotal_venta: "0"
                                                                    });
                                                                }}
                                                            >
                                                                {product.nombre_producto}
                                                            </li>
                                                        ))
                                                    }
                                                </>
                                            </ul>
                                        </div>
                                    )
                                    :
                                    (null)
                            }
                        </div>

                        <div className="w-full mt-4 gap-Y-2 flex-col flex items-start">
                            <label htmlFor="cantidad" className="font-bold mb-1">Cantidad comprada:</label>
                            <input
                                className={`w-full border border-gray-400 hover:border-gray-600 outline-none rounded-md py-1 px-2 ${editId != null || newProducts.id_producto == "" && "cursor-not-allowed"}`}
                                id="cantidad"
                                required
                                disabled={editId != null || newProducts.id_producto == "" ? true : false}
                                value={+newProducts.cantidad == 0 || editId != null ? "" : newProducts.cantidad}
                                onChange={(e) => {
                                    setNewProducts({ ...newProducts, cantidad: e.target.value });
                                }}
                                type="number"
                                placeholder="Ejemplo: xxx..."
                            />
                        </div>

                        <div className="w-full flex items-center justify-center mt-8">

                            {
                                editId == null ?
                                    (
                                        <button
                                            type="button"
                                            className={`w-full md:w-56 py-2 px-4 flex items-center justify-center gap-x-6 font-bold text-base border border-gray-400 hover:border-gray-600 outline-none rounded-md ${+newProducts.cantidad <= 0 && "cursor-not-allowed"}`}
                                            onClick={addProducts}
                                            disabled={
                                                +newProducts.cantidad <= 0 ?
                                                    true
                                                    :
                                                    false
                                            }
                                        >
                                            <PlusIcon className="size-5" />
                                            Agregar producto
                                        </button>
                                    )
                                    :
                                    ""
                            }

                        </div>
                    </fieldset>

                    <div>
                        <div className='w-full mx-auto md:mx-0 mt-4 flex items-center justify-center gap-x-1 border border-gray-300 dark:border-gray-600 py-1 px-2'>
                            <Search className="size-5" />
                            <input
                                type="text"
                                placeholder="Buscar..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full outline-none"
                            />
                        </div>

                        <div className="w-full h-full scrollbar-thin-custom touch-pan-x touch-pan-y scroll-smooth overflow-scroll top-0">
                            <Table className="h-full p-2 w-312.5 md:w-full scrollbar-thin-custom">
                                <TableHeader className="top-0 sticky">
                                    <TableRow>
                                        <TableHead>Producto</TableHead>
                                        <TableHead>Cantidad</TableHead>
                                        <TableHead>Acción</TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {
                                        filteredInventory?.map(product => (
                                            <TableRow key={product.id_producto} className="hover:bg-gray-100/85 dark:hover:bg-gray-800/95 transition-all duration-200">

                                                <TableCell>
                                                    {
                                                        product.nombre_producto
                                                    }
                                                </TableCell>

                                                <TableCell align="center">
                                                    {
                                                        editId === product.id_producto ?
                                                            (
                                                                <input
                                                                    className="w-14 border border-gray-300 dark:border-gray-600 outline-none rounded-md py-1 px-2"
                                                                    id="cantidad"
                                                                    required
                                                                    value={newProducts.cantidad == "0" ? "" : newProducts.cantidad}
                                                                    onChange={(e) => {
                                                                        setNewProducts({ ...newProducts, cantidad: e.target.value });
                                                                    }}
                                                                    type="number"
                                                                    placeholder="Ejemplo: xxx..."
                                                                />
                                                            )
                                                            :
                                                            product.cantidad
                                                    }
                                                </TableCell>

                                                <TableCell>
                                                    {
                                                        editId === product.id_producto ? (
                                                            <div className="flex items-center justify-center">
                                                                <Tooltip>
                                                                    <TooltipTrigger>
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => {
                                                                                editProduct();
                                                                            }}
                                                                            className="flex items-center justify-center gap-x-2 text-sm font-bold bg-green-400 p-2 text-black rounded-md hover:bg-green-600 transition-all duration-200"
                                                                        >
                                                                            <span className="block md:hidden">Guardar datos modificados</span>
                                                                            <Save className="h-4 w-4" />
                                                                        </button>
                                                                    </TooltipTrigger>

                                                                    <TooltipContent>
                                                                        Clic para guardar los cambios realizados
                                                                    </TooltipContent>
                                                                </Tooltip>

                                                            </div>
                                                        )
                                                            : (
                                                                <div className="flex items-center justify-center md:flex-row gap-x-4 w-auto py-2">
                                                                    <Tooltip>
                                                                        <TooltipTrigger>
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => {
                                                                                    // setNewProducts({ ...newProducts, id_producto: product.id_producto})
                                                                                    newProducts.id_producto = product.id_producto;
                                                                                    newProducts.nombre_producto = product.nombre_producto;
                                                                                    newProducts.cantidad = product.cantidad;

                                                                                    setEditId(product.id_producto)
                                                                                }}
                                                                                className="flex items-center justify-center gap-x-2 text-sm font-bold bg-cyan-500 p-2 text-black rounded-md hover:bg-cyan-600 transition-all duration-200"
                                                                            >
                                                                                <span className="block md:hidden">Modificar item</span>
                                                                                <Edit className="size-4" />
                                                                            </button>
                                                                        </TooltipTrigger>


                                                                        <TooltipContent>
                                                                            Clic para modificar este item
                                                                        </TooltipContent>
                                                                    </Tooltip>

                                                                    <Tooltip>
                                                                        <TooltipTrigger>
                                                                            <button
                                                                                type="button"
                                                                                className="flex items-center justify-center gap-x-2 text-sm font-bold bg-red-500 p-2 text-white rounded-md hover:bg-red-600 transition-all duration-200"
                                                                                onClick={() => {
                                                                                    setOpenAlertDialogDeleted({ ...product, cantidad: "", subtotal_compra: product.subtotal, subtotal_venta: "", id_inventario: "", stock: 0 });
                                                                                }}
                                                                            >
                                                                                <span className="block md:hidden">Eliminar item</span>
                                                                                <Trash2 className="size-4" />
                                                                            </button>
                                                                        </TooltipTrigger>

                                                                        <TooltipContent>
                                                                            Clic para remover este item
                                                                        </TooltipContent>
                                                                    </Tooltip>
                                                                </div>
                                                            )
                                                    }
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    }
                                    <TableRow>
                                        {
                                            filteredInventory?.length === 0 && (
                                                <TableCell colSpan={14}>
                                                    <div className="flex items-center flex-col justify-center">
                                                        <TableEmpty />
                                                        <p className='text-center font-bold text-2xl'>Aún no hay registros agregados...</p>
                                                    </div>
                                                </TableCell>
                                            )
                                        }
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>
                    </div>

                    <Button
                        variant="outline"
                        type="submit"
                        className="w-full mt-4 md:w-[50%] mx-auto border border-gray-300 dark:border-gray-800 py-2 px-4 rounded-md flex items-center justify-center gap-x-4 font-bold"
                        aria-label="Close"
                    >
                        <Save className="size-5" />
                        Guardar registro
                    </Button>

                </form>

                {
                    openAlertDialogDeleted && (
                        <AlertDialog open={openAlertDialogDeleted != null && true} onOpenChange={() => setOpenAlertDialogDeleted(null)}>
                            <AlertDialogDelete
                                icon={MessageCircleQuestion}
                                title="Remover producto"
                                description={`¿Seguro deseas remover el producto: ${openAlertDialogDeleted.nombre_producto}?`}
                                buttonCancel="¡No, remover!"
                                buttonConfirm="¡Si, remover!"
                                onClickConfirm={changeDeleteState}
                            />
                        </AlertDialog>
                    )
                }
            </DialogContent>
        </Dialog>
    )
}
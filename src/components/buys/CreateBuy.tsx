import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Calculator, ChevronDown, ChevronUp, Edit, MessageCircleQuestion, Plus, PlusIcon, Save, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { BuysFormDataAdd, TempPurchasingFormData, TempPurchasingFormDataDetails, TempPurchasingFormDataPaymentmethod } from "@/types/buys.interface";
import type { SupplierFormDataInfo } from "@/types/suppliers.interface";
import { createBuys } from "@/apis/buys.apis";
import type { ErrorData } from "@/types/errors.interface";
import { getProducts } from "@/apis/products.apis";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import type { AuthPermissions } from "@/types/auth.interface";
import { formatCurrency } from "@/utils/utilidad";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import TableEmpty from "../ui-components/TableEmpty";
import { AlertDialog } from "../ui/alert-dialog";
import AlertDialogDelete from "../ui-components/AlertDialogDelete";
import { getAllSupplier } from "@/apis/suppliers.apis";

export default function CreateBuy({ dataAuth }: { dataAuth: AuthPermissions }) {
    const navigate = useNavigate()
    const location = useLocation()
    let precioCompra: number;

    const [open, setOpen] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const [isActiveInput, setIsActiveInput] = useState(false);
    const [subtotal, setSubtotal] = useState(0);
    const [total, setTotal] = useState(0);
    const [taxesValue, setTaxesValue] = useState(15);
    const [valorImpuesto, setValorImpuesto] = useState(0);
    const [dataProducts, setDataProducts] = useState<TempPurchasingFormDataDetails[]>(sessionStorage.getItem("tempProductsAddBuys") ? JSON.parse(sessionStorage.getItem("tempProductsAddBuys")!) : [])
    const [editId, setEditId] = useState<string | null>(null)
    const [newProducts, setNewProducts] = useState<TempPurchasingFormDataDetails>({
        id_producto: "",
        nombre_producto: "",
        precio_compra: "",
        cantidad: "0",
        subtotal: "",
    })

    const [newBuys, setNewBuys] = useState({
        numero_factura_proveedor: "0",
        observaciones: '',
        subtotal: '',
        total: '',
        estado: 1,
        impuesto_manual: [{
            porcentaje: "",
            valor_porcentaje: 15,
            valor_cantidad: 0
        }],
        metodo_pago: [{
            metodo: "",
            monto: "",
            observaciones: ""
        }],
        id_proveedor: '',
        detalles_compra: [{
            precio_compra: "",
            cantidad: "0",
            subtotal: "",
            id_producto: "",
        }],
        usuario_creador: ''
    });

    const [transferencia, setTransferencia] = useState(false);
    const [montoTransferencia, setMontoTransferencia] = useState("");
    const [observacionesTransferencia, setObservacionesTransferencia] = useState("");
    const [tarjeta, setTarjeta] = useState(false);
    const [montoTarjeta, setMontoTarjeta] = useState("");
    const [observacionesTarjeta, setObservacionesTarjeta] = useState("");
    const [efectivo, setEfectivo] = useState(false);
    const [montoEfectivo, setMontoEfectivo] = useState("");
    const [observacionesEfectivo, setObservacionesEfectivo] = useState("");
    const [cheque, setCheque] = useState(false);
    const [montoCheque, setMontoCheque] = useState("");
    const [observacionesCheque, setObservacionesCheque] = useState("");
    const [openAlertDialogDeleted, setOpenAlertDialogDeleted] = useState<TempPurchasingFormData | null>(null)


    useEffect(() => {
        const storedProducts = sessionStorage.getItem("tempProductsAddBuys");
        if (storedProducts) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setDataProducts(JSON.parse(storedProducts));
        }
    }, [])

    useEffect(() => {
        sessionStorage.setItem("tempProductsAddBuys", JSON.stringify(dataProducts));

        setTimeout(() => {
            handleCalculateTotalWithTaxes();
        }, 500);
    }, [dataProducts, handleCalculateTotalWithTaxes]);

    // * Productos
    const { data: databaseProducts, refetch: refetchProduct } = useQuery({
        queryKey: ["products"],
        queryFn: getProducts,
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
        nombre_producto: ""
    });


    // * Proveedores
    const { data: databaseSuppliers, refetch: refetchSupplier } = useQuery({
        queryKey: ["suppliers"],
        queryFn: getAllSupplier,
    });
    const [openComboBoxSupplier, setOpenComboBoxSupplier] = useState(false);
    const [searchTermSupplier, setSearchTermSupplier] = useState("");
    const filteredSuppliers = Object.values(databaseSuppliers || {}).filter(supplier =>
        Object.values(supplier).some(value =>
            value.toString().toLowerCase().includes(searchTermSupplier.toLowerCase())
        )
    );
    const [dataSupplierComboBox, setDataSupplierComboBox] = useState({
        id_proveedor: "",
        nombre_proveedor: ""
    });

    // * Get supplier information                
    const [supplierData, setSupplierData] = useState<SupplierFormDataInfo | null>(null)

    // * Get products information        
    const [productId, setProductId] = useState<TempPurchasingFormData | null>(null)

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
            subtotal: ""
        })
        setSubtotal(0);
        setProductId(null);
        setDataProductComboBox({
            id_producto: "",
            nombre_producto: ""
        });
        setIsActiveInput(false);
    }

    const editProduct = () => {
        handleCalculateSubtotalEdit(+newProducts.cantidad, +newProducts.precio_compra);

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

        handleCalculateTotalWithTaxes();
        setNewProducts({
            id_producto: "",
            nombre_producto: "",
            precio_compra: "",
            cantidad: "0",
            subtotal: ""
        })
        sessionStorage.clear();
        setSubtotal(0);
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

    const handleCalculateSubtotal = (e: number) => {
        if (newProducts.cantidad === undefined) {

            toast.success("La cantidad del producto no puede ser menor a 1...", {
                position: "top-right",
                closeButton: true,
                action: {
                    label: "Cerrar  todas",
                    onClick: () => toast.dismiss()
                }
            });
        }

        precioCompra = +productId!.precio_compra;
        const resultSubtotal = precioCompra * e;
        setSubtotal(+resultSubtotal.toFixed(2));
        newProducts.subtotal = resultSubtotal.toFixed(2).toString();
    }
    const handleCalculateSubtotalEdit = (e: number, precioCompra: number) => {

        if (newProducts.cantidad === undefined) {

            toast.success("La cantidad del producto no puede ser menor a 1...", {
                position: "top-right",
                closeButton: true,
                action: {
                    label: "Cerrar  todas",
                    onClick: () => toast.dismiss()
                }
            });

            newProducts.cantidad = "1";
            return;
        }

        const resultSubtotal = e * precioCompra;
        const result = +resultSubtotal
        setSubtotal(+result.toFixed(2));
        newProducts.subtotal = resultSubtotal.toFixed(2).toString();
        setNewProducts({ ...newProducts, subtotal: result.toString() })
    }

    function handleCalculateTotal() {
        let sum = 0;
        dataProducts.forEach((item) => {
            sum += +item.subtotal;
        })

        newBuys.subtotal = sum.toFixed(2);

        return sum.toString();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    function handleCalculateTotalWithTaxes() {
        let sum = 0;
        dataProducts.forEach((item) => {
            sum += +item.subtotal;
        })

        newBuys.total = sum.toFixed(2);

        if (taxesValue < 0) {

            toast.success("El valor del impuesto no puede ser menor a 0...", {
                position: "top-right",
                closeButton: true,
                action: {
                    label: "Cerrar  todas",
                    onClick: () => toast.dismiss()
                }
            });
            return;
        }

        if (taxesValue === 0) {
            setTotal(subtotal);
            setValorImpuesto(0);
            return
        }

        const resultTax = sum * taxesValue / 100;
        setValorImpuesto(resultTax);
        const result = sum + resultTax;
        newBuys.total = result.toFixed(2);
        setTotal(+result.toFixed(2))
    }

    const handleSelectionSupplier = (dataSupplier: SupplierFormDataInfo) => {
        setSupplierData(dataSupplier);

        setNewBuys({ ...newBuys, id_proveedor: dataSupplier.id })
    }

    const handleSelectionProduct = (dataProduct: TempPurchasingFormData) => {
        if (dataProducts.length == 0) {
            setProductId(dataProduct)
            newProducts.id_producto = dataProduct!.id_producto;
            newProducts.nombre_producto = dataProduct!.nombre_producto;
            setIsActiveInput(true);
        }
        dataProducts.find(item => {
            if (item.id_producto == dataProduct.id_producto) {
                toast.warning("El producto ya se encuentra agregado...", {
                    position: "top-right",
                    closeButton: true,
                    action: {
                        label: "Cerrar  todas",
                        onClick: () => toast.dismiss()
                    }
                });
                setIsActiveInput(false);
                return;
            }

            if (item.id_producto !== dataProduct.id_producto) {
                setProductId(dataProduct)
                newProducts.id_producto = dataProduct!.id_producto;
                newProducts.nombre_producto = dataProduct!.nombre_producto;

                setIsActiveInput(true);
            }
        })
    }

    const queryClient = useQueryClient();

    const { mutate } = useMutation({
        mutationFn: createBuys,
        onError: (error: ErrorData) => {

            toast.success(error.message, {
                position: "top-right",
                closeButton: true,
                action: {
                    label: "Cerrar  todas",
                    onClick: () => toast.dismiss()
                }
            });

            navigate(location.pathname, { replace: true })
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["buys"] });

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
            setOpen(false);
        }
    });

    const {
        reset
    } = useForm<BuysFormDataAdd>({ defaultValues: newBuys });


    const [searchTerm, setSearchTerm] = useState("");

    const filtereddataProducts = dataProducts?.filter(product =>
        Object.values(product).some(value =>
            value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
    )

    const getDataLocalStorage = (products: TempPurchasingFormDataDetails[]) => {
        return products.map((productsStorage) => {
            return {
                nombre_producto: productsStorage.nombre_producto,
                precio_compra: productsStorage.precio_compra,
                cantidad: productsStorage.cantidad,
                subtotal: productsStorage.subtotal,
                id_producto: productsStorage.id_producto
            }
        })
    }

    function onClickClearForm() {
        setNewBuys({
            numero_factura_proveedor: "0",
            observaciones: '',
            subtotal: '',
            total: '',
            estado: 1,
            impuesto_manual: [{
                porcentaje: "",
                valor_porcentaje: 15,
                valor_cantidad: 0
            }],
            metodo_pago: [{
                metodo: "",
                monto: "",
                observaciones: ""
            }],
            id_proveedor: '',
            detalles_compra: [{
                precio_compra: "",
                cantidad: "0",
                subtotal: "",
                id_producto: ""
            }],
            usuario_creador: ""
        });
        setNewProducts({
            id_producto: "",
            nombre_producto: "",
            precio_compra: "",
            cantidad: "0",
            subtotal: ""
        })
        sessionStorage.removeItem("tempProductsAddBuys");
        setValorImpuesto(0);
        setTotal(0);
        setTaxesValue(15);
        setIsChecked(false);
        setTransferencia(false);
        setMontoTransferencia("");
        setCheque(false);
        setMontoCheque("");
        setEfectivo(false);
        setMontoEfectivo("");
        setTarjeta(false);
        setMontoTarjeta("");
        reset();
        setDataProducts([]);
        setTotal(0);
        setSubtotal(0);
        setEditId(null);
        setProductId(null);
        setSupplierData(null);
    }
    const keyPressDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
        if (e.key === "Enter") {
            if (editId != "" && editId != null && editId != undefined) {

                editProduct();
            }
            else {
                addProducts();
            }
        }
    }

    const onSubmitCreateBuys = () => {

        if (openAlertDialogDeleted == null) {
            const dataStorage = getDataLocalStorage(dataProducts);
            if (dataStorage.length <= 0) {
                toast.success("No hay productos seleccionados...", {
                    position: "top-right",
                    closeButton: true,
                    action: {
                        label: "Cerrar  todas",
                        onClick: () => toast.dismiss()
                    }
                });
                return;
            }
            newBuys.detalles_compra = dataStorage;
            newBuys.impuesto_manual = [{
                porcentaje: taxesValue.toString() + "%",
                valor_porcentaje: taxesValue,
                valor_cantidad: valorImpuesto
            }];

            const paymentMethods: TempPurchasingFormDataPaymentmethod[] = [];
            if (transferencia) {

                if (+montoTransferencia <= 0) {
                    toast.success("Transferencia: ", {
                        description: "Debes agregar el monto de pago...",
                        position: "top-right",
                        closeButton: true,
                        action: {
                            label: "Cerrar  todas",
                            onClick: () => toast.dismiss()
                        }
                    });
                    return;
                }
                else {

                    paymentMethods.push({
                        metodo: "Transferencia",
                        monto: montoTransferencia,
                        observaciones: observacionesTransferencia,
                    });
                }

            }

            if (tarjeta) {
                if (+montoTarjeta <= 0) {
                    toast.success("Tarjeta: ", {
                        description: "Debes agregar el monto de pago...",
                        position: "top-right",
                        closeButton: true,
                        action: {
                            label: "Cerrar  todas",
                            onClick: () => toast.dismiss()
                        }
                    });
                    return;
                }
                else {
                    paymentMethods.push({
                        metodo: "Tarjeta",
                        monto: montoTarjeta,
                        observaciones: observacionesTarjeta,
                    });
                }
            }

            if (efectivo) {
                if (+montoEfectivo <= 0) {

                    toast.success("Efectivo: ", {
                        description: "Debes agregar el monto de pago...",
                        position: "top-right",
                        closeButton: true,
                        action: {
                            label: "Cerrar  todas",
                            onClick: () => toast.dismiss()
                        }
                    });
                    return;
                }
                else {
                    paymentMethods.push({
                        metodo: "Efectivo",
                        monto: montoEfectivo,
                        observaciones: observacionesEfectivo,
                    });
                }
            }

            if (cheque) {
                if (+montoCheque <= 0) {

                    toast.success("Cheque: ", {
                        description: "Debes agregar el monto de pago...",
                        position: "top-right",
                        closeButton: true,
                        action: {
                            label: "Cerrar  todas",
                            onClick: () => toast.dismiss()
                        }
                    });
                    return;
                }
                else {
                    paymentMethods.push({
                        metodo: "Cheque",
                        monto: montoCheque,
                        observaciones: observacionesCheque,
                    });
                }
            }
            newBuys.metodo_pago = paymentMethods;

            const result = montoCheque + montoEfectivo + montoTarjeta + montoTransferencia;
            if (+result > +newBuys.total) {

                toast.success("La suma de los metodos de pagar no puede ser mayor al monto total...", {
                    position: "top-right",
                    closeButton: true,
                    action: {
                        label: "Cerrar  todas",
                        onClick: () => toast.dismiss()
                    }
                });
                return;
            }
            else if (+result < +newBuys.total) {

                toast.success("La suma de los metodos de pagar no puede ser menor al monto total...", {
                    position: "top-right",
                    closeButton: true,
                    action: {
                        label: "Cerrar  todas",
                        onClick: () => toast.dismiss()
                    }
                });
                return;
            }
            const data = newBuys;
            mutate(data);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger
                className="flex items-center justify-center gap-x-4 border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-900 rounded-lg py-1 px-2 w-full md:w-auto"
                onClick={() => {
                    navigate(location.pathname + "?createBuy");
                    setOpen(true);
                }}
            >
                <Plus className="size-5" />
                Crear compra
            </DialogTrigger>
            <DialogContent
                onInteractOutside={(e) => e.preventDefault()}
                onEscapeKeyDown={(e) => e.preventDefault()}
                className="h-[98%] w-full md:max-w-[97%] px-2 py-4 md:p-6 scrollbar-thin-custom touch-pan-x touch-pan-y scroll-smooth overflow-scroll"
            >
                <DialogHeader>
                    <DialogTitle>Crear compra</DialogTitle>
                    <DialogDescription>
                        Crea tus compras aquí...
                    </DialogDescription>
                </DialogHeader>

                <form>
                    <div className="h-80 mx-auto flex items-start gap-y-4 md:gap-x-8 justify-center flex-col md:flex-row w-full md:w-full px-1 sm:p-4 py-4">
                        <fieldset className="flex w-full h-72 flex-col gap-y-6 items-center border border-gray-300 dark:border-gray-600 rounded-lg p-4">
                            <legend className="uppercase font-bold">Datos de la compra</legend>
                            <div className="w-full">
                                <label htmlFor="numero_factura_proveedor" className="font-bold">Número Factura Proveedor:</label>
                                <input
                                    id="numero_factura_proveedor"
                                    className="w-full border border-gray-300 dark:border-gray-600 outline-none rounded-md py-1 px-2"
                                    value={newBuys.numero_factura_proveedor}
                                    onChange={(e) => setNewBuys({ ...newBuys, numero_factura_proveedor: e.target.value })}
                                    type="text"
                                    required
                                    minLength={2}
                                    placeholder="Ejemplo: xxxxx..."
                                />
                            </div>

                            <div className="flex flex-1 w-full items-start justify-center">
                                <div className="w-full">
                                    <label htmlFor="observaciones" className="font-bold">Observaciones:</label>
                                    <textarea
                                        id="observaciones"
                                        className="w-full border border-gray-300 dark:border-gray-600 outline-none rounded-md py-1 px-2"
                                        placeholder="Ejemplo: xxxxx..."
                                        value={newBuys.observaciones}
                                        onChange={(e) => setNewBuys({ ...newBuys, observaciones: e.target.value })}
                                        rows={6}
                                    />
                                </div>
                            </div>
                        </fieldset>
                        <fieldset className="w-full scrollbar-thin-custom touch-pan-y scroll-smooth overflow-scroll h-72 border border-gray-300 dark:border-gray-600 rounded-lg p-4">
                            <legend className="uppercase font-bold">Metodo de pagos</legend>

                            <div className="flex items-center flex-col md:flex-row justify-center w-full gap-4">

                                <div className="flex items-center flex-col gap-4 w-full">

                                    <div className="w-full flex flex-col items-center justify-center gap-y-4">
                                        <div className="flex items-center justify-start md:justify-center flex-row-reverse gap-x-1">
                                            <label
                                                className="w-full md:w-28"
                                                htmlFor="transferenicaCheck"
                                            >Transferencia</label>
                                            <input
                                                type="checkbox"
                                                name=""
                                                id="transferenicaCheck"
                                                onChange={(e) => {
                                                    setTransferencia(e.target.checked);
                                                }}
                                            />
                                        </div>

                                        {
                                            transferencia == true ?
                                                (
                                                    <div className="flex w-full items-center justify-center flex-col gap-y-3">
                                                        <div className="flex w-full items-center justify-center flex-col">
                                                            <label className="w-full" htmlFor="monto_transferencia">Monto:</label>
                                                            <input
                                                                type="number"
                                                                className="border w-full border-gray-300 outline-none rounded-md py-1 px-2"
                                                                name=""
                                                                id="monto_transferencia"
                                                                value={transferencia == true ? montoTransferencia : 0}
                                                                onChange={(e) => {
                                                                    setMontoTransferencia(e.target.value);
                                                                }}
                                                            />
                                                        </div>
                                                        <div className="flex w-full items-center justify-center flex-col">
                                                            <label className="w-full" htmlFor="observaciones_transferencia">Observaciones:</label>
                                                            <textarea
                                                                className="border border-gray-300 outline-none rounded-md py-1 px-2 w-full"
                                                                name=""
                                                                id="observaciones_transferencia"
                                                                value={transferencia == true ? observacionesTransferencia : ""}
                                                                onChange={(e) => {
                                                                    setObservacionesTransferencia(e.target.value);
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                )
                                                :
                                                (null)
                                        }
                                    </div>

                                    <div className="w-full flex flex-col items-center justify-center gap-y-4">
                                        <div className="flex items-center justify-start flex-row-reverse gap-x-1">
                                            <label
                                                className="w-full md:w-28"
                                                htmlFor="tarjetaCheck"
                                            >
                                                Tarjeta</label>
                                            <input
                                                type="checkbox"
                                                name=""
                                                id="tarjetaCheck"
                                                onChange={(e) => {
                                                    setTarjeta(e.target.checked);
                                                }}
                                            />
                                        </div>
                                        {
                                            tarjeta == true ?
                                                (
                                                    <div className="flex w-full items-center justify-center flex-col gap-y-3">
                                                        <div className="flex w-full items-center justify-center flex-col">
                                                            <label className="w-full" htmlFor="monto_tarjeta">Monto:</label>
                                                            <input
                                                                type="number"
                                                                className="border border-gray-300 outline-none rounded-md py-1 px-2 w-full"
                                                                name=""
                                                                id="monto_tarjeta"
                                                                value={tarjeta == true ? montoTarjeta : 0}
                                                                onChange={(e) => {
                                                                    setMontoTarjeta(e.target.value);
                                                                }}
                                                            />
                                                        </div>
                                                        <div className="flex items-center justify-center flex-col w-full">
                                                            <label className="w-full" htmlFor="observaciones_tarjeta">Observaciones:</label>
                                                            <textarea
                                                                className="border border-gray-300 outline-none rounded-md py-1 px-2 w-full"
                                                                name=""
                                                                id="observaciones_tarjeta"
                                                                value={tarjeta == true ? observacionesTarjeta : ""}
                                                                onChange={(e) => {
                                                                    setObservacionesTarjeta(e.target.value);
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                )
                                                :
                                                (null)
                                        }
                                    </div>
                                </div>

                                <div className="flex items-center flex-col gap-4 w-full">
                                    <div className="w-full flex flex-col items-center justify-center gap-y-4">

                                        <div className="flex items-center justify-center flex-row-reverse gap-x-1">
                                            <label
                                                htmlFor="efectivoCheck"
                                                className="w-full md:w-28"
                                            >
                                                Efectivo
                                            </label>
                                            <input
                                                type="checkbox"
                                                name=""
                                                id="efectivoCheck"
                                                onChange={(e) => {
                                                    setEfectivo(e.target.checked);
                                                }}
                                            />
                                        </div>

                                        {
                                            efectivo == true ?
                                                (
                                                    <div className="flex w-full items-center justify-center flex-col gap-y-3">
                                                        <div className="flex w-full items-center justify-center flex-col">
                                                            <label className="w-full" htmlFor="monto_efectivo">Monto:</label>
                                                            <input
                                                                type="number"
                                                                className="border border-gray-300 outline-none rounded-md py-1 px-2 w-full"
                                                                name=""
                                                                id="monto_efectivo"
                                                                value={efectivo == true ? montoEfectivo : 0}
                                                                onChange={(e) => {
                                                                    setMontoEfectivo(e.target.value);
                                                                }}
                                                            />
                                                        </div>
                                                        <div className="flex items-center justify-center flex-col w-full">
                                                            <label className="w-full" htmlFor="observaciones_efectivo">Observaciones:</label>
                                                            <textarea
                                                                className="border border-gray-300 outline-none rounded-md py-1 px-2 w-full"
                                                                name=""
                                                                id="observaciones_efectivo"
                                                                value={efectivo == true ? observacionesEfectivo : ""}
                                                                onChange={(e) => {
                                                                    setObservacionesEfectivo(e.target.value);
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                )
                                                :
                                                (null)
                                        }
                                    </div>

                                    <div className="w-full flex flex-col items-center justify-center gap-y-4">
                                        <div className="flex items-center justify-center flex-row-reverse gap-x-1">
                                            <label className="w-full md:w-28" htmlFor="chequeCheck">Cheque</label>
                                            <input
                                                type="checkbox"
                                                name=""
                                                id="chequeCheck"
                                                onChange={(e) => {
                                                    setCheque(e.target.checked);
                                                }}
                                            />
                                        </div>

                                        {
                                            cheque == true ?
                                                (
                                                    <div className="flex w-full items-center justify-center flex-col gap-y-3">
                                                        <div className="flex w-full items-center justify-center flex-col">
                                                            <label className="w-full" htmlFor="monto_cheque">Monto:</label>
                                                            <input
                                                                type="number"
                                                                className="border border-gray-300 outline-none rounded-md py-1 px-2 w-full"
                                                                name=""
                                                                id="monto_cheque"
                                                                value={cheque == true ? montoCheque : 0}
                                                                onChange={(e) => {
                                                                    setMontoCheque(e.target.value);
                                                                }}
                                                            />
                                                        </div>
                                                        <div className="flex w-full items-center justify-center flex-col">
                                                            <label className="w-full" htmlFor="observaciones_cheque">Observaciones:</label>
                                                            <textarea
                                                                className="border border-gray-300 outline-none rounded-md py-1 px-2 w-full"
                                                                name=""
                                                                id="observaciones_cheque"
                                                                value={cheque == true ? observacionesCheque : ""}
                                                                onChange={(e) => {
                                                                    setObservacionesCheque(e.target.value);
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                )
                                                :
                                                (null)
                                        }
                                    </div>
                                </div>
                            </div>
                        </fieldset>
                    </div>

                    <div className="flex flex-col md:flex-row items-start w-full justify-center gap-x-4">
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
                                                                            id_producto: product.id,
                                                                            nombre_producto: product.nombre_producto,
                                                                            precio_compra: product.precio_compra,
                                                                            cantidad: "0",
                                                                        })
                                                                        setSearchTermProduct("");
                                                                        setOpenComboBoxProduct(!openComboBoxProduct);
                                                                        setDataProductComboBox({ ...dataProductComboBox, id_producto: product.id, nombre_producto: product.nombre_producto });
                                                                        handleSelectionProduct({
                                                                            id_producto: product.id,
                                                                            nombre_producto: product.nombre_producto,
                                                                            precio_compra: product.precio_compra,
                                                                            cantidad: "0",
                                                                            id_inventario: "",
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
                                <label htmlFor="precio_compra" className="font-bold mb-1">Precio:</label>
                                <input
                                    className={`w-full border border-gray-400 hover:border-gray-600 outline-none rounded-md py-1 px-2 ${isActiveInput == false && "cursor-not-allowed"}`}
                                    id="precio_compra"
                                    required
                                    disabled={isActiveInput == false ? true : false}
                                    value={+newProducts.precio_compra == 0 || editId != null ? "" : newProducts.precio_compra}
                                    onChange={(e) => setNewProducts({ ...newProducts, precio_compra: e.target.value })}
                                    type="number"
                                    placeholder="Precio del producto..."
                                />
                            </div>

                            <div className="w-full mt-4 gap-Y-2 flex-col flex items-start">
                                <label htmlFor="cantidad" className="font-bold mb-1">Cantidad comprada:</label>
                                <input
                                    className={`w-full border border-gray-400 hover:border-gray-600 outline-none rounded-md py-1 px-2 ${isActiveInput == false && "cursor-not-allowed"}`}
                                    id="cantidad"
                                    required
                                    disabled={isActiveInput == false ? true : false}
                                    value={+newProducts.cantidad == 0 || editId != null ? "" : newProducts.cantidad}
                                    onChange={(e) => {
                                        if (editId == null) {
                                            handleCalculateSubtotal(+e.target.value);
                                        }

                                        handleCalculateSubtotalEdit(+e.target.value, +newProducts.precio_compra);
                                        setNewProducts({ ...newProducts, cantidad: e.target.value });
                                    }}
                                    onKeyDown={keyPressDown}
                                    type="number"
                                    placeholder="Ejemplo: xxx..."
                                />
                            </div>

                            <div className="w-full mt-4 gap-Y-2 flex-col flex items-start">
                                <label htmlFor="subtotal" className="font-bold mb-1">Subtotal:</label>
                                <input
                                    className="w-full border border-gray-400 hover:border-gray-600 outline-none rounded-md py-1 px-2 cursor-not-allowed"
                                    id="subtotal"
                                    value={editId != null ? "" : formatCurrency(subtotal.toString())}
                                    type="text"
                                    disabled placeholder="Subtotal por producto..."

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

                        <fieldset className="flex flex-1 w-full flex-col items-center mt-4 border border-gray-300 dark:border-gray-600 px-1 sm:p-4 rounded-lg py-4">
                            <legend className="uppercase font-bold">Datos del poveedor</legend>
                            <div className="w-full flex-col flex items-start -mt-3 h-72">
                                <label htmlFor="nombre_proveedor" className="font-bold mb-1">Proveedor:</label>
                                <div className={`w-full mx-auto flex items-center justify-center md:justify-between border border-gray-300 dark:border-gray-600 py-1 px-2 cursor-pointer ${openComboBoxSupplier == true ? "rounded-t-md" : "rounded-md"}`}
                                    onClick={() => {
                                        setOpenComboBoxSupplier(!openComboBoxSupplier)
                                        refetchSupplier();
                                    }}
                                >
                                    <span className="cursor-pointer">{dataSupplierComboBox.nombre_proveedor == "" ? "Selecciona proveedor" : dataSupplierComboBox.nombre_proveedor}</span>

                                    {
                                        openComboBoxSupplier == true ?
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
                                    openComboBoxSupplier == true ?
                                        (
                                            <div className="w-full top-0 right-0 h-72 sticky mx-auto overflow-auto touch-pan-y scrollbar-thin-custom transition-all duration-700 ease-in-out">
                                                <ul className="rounded-b-lg border border-gray-300 dark:border-gray-600">
                                                    <>
                                                        <div className="w-full border-b border-gray-300 dark:border-gray-600  py-1 px-2 flex items-center gap-x-1">
                                                            <Search className="size-5 text-gray-400" href="searchSupplier" />
                                                            <input
                                                                id="searchSupplier"
                                                                type="text"
                                                                value={searchTermSupplier}
                                                                onChange={(e) => setSearchTermSupplier(e.target.value)}
                                                                placeholder="Buscar..."
                                                                className="w-full border-none outline-none placeholder:text-gray-400"
                                                            />
                                                        </div>

                                                        {
                                                            filteredSuppliers?.map((supplier, index) => (
                                                                <li
                                                                    key={index}
                                                                    className="hover:bg-gray-300 py-1 px-4 cursor-pointer"
                                                                    onClick={() => {
                                                                        setSearchTermSupplier("");
                                                                        setOpenComboBoxSupplier(!openComboBoxSupplier);
                                                                        setDataSupplierComboBox({ ...dataSupplierComboBox, id_proveedor: supplier.id, nombre_proveedor: supplier.nombre_proveedor });
                                                                        handleSelectionSupplier(supplier);
                                                                    }}
                                                                >
                                                                    {supplier.nombre_proveedor}
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
                        </fieldset>
                    </div>
                    <div className='w-full md:w-[74%] mx-auto md:mx-0 mt-4 flex items-center justify-center gap-x-1 border border-gray-300 dark:border-gray-600 py-1 px-2'>
                        <Search className="size-5" />
                        <input
                            type="text"
                            placeholder="Buscar..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full outline-none"
                        />
                    </div>
                </form>

                <div className="h-104 w-full lg:w-full flex-col lg:flex-row flex md:gap-x-4 gap-y-4 items-start justify-center mx-auto">
                    <div className="w-full h-full lg:w-[75%] scrollbar-thin-custom touch-pan-x touch-pan-y scroll-smooth overflow-scroll top-0">
                        <Table className="h-full p-2 w-312.5 md:w-full scrollbar-thin-custom">
                            <TableHeader className="top-0 sticky">
                                <TableRow>
                                    <TableHead>Producto</TableHead>
                                    <TableHead className="text-center">Cantidad</TableHead>
                                    <TableHead>P. Unitario</TableHead>
                                    <TableHead>Subtotal</TableHead>
                                    <TableHead className="text-center">Acción</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {
                                    filtereddataProducts?.map(product => (
                                        <TableRow key={product.id_producto} className="hover:bg-gray-100/85 dark:hover:bg-gray-800/95 transition-all duration-200">

                                            <TableCell>
                                                {
                                                    product.nombre_producto
                                                }
                                            </TableCell>

                                            <TableCell className="text-center">
                                                {
                                                    editId === product.id_producto ?
                                                        (
                                                            <input
                                                                className="w-14 border border-gray-300 dark:border-gray-600 outline-none rounded-md py-1 px-2"
                                                                id="cantidad"
                                                                required
                                                                value={newProducts.cantidad == "0" ? "" : newProducts.cantidad}
                                                                onChange={(e) => {
                                                                    // if (editId == null) {
                                                                    //     handleCalculateSubtotal(+e.target.value);
                                                                    // }

                                                                    handleCalculateSubtotalEdit(+e.target.value, +newProducts.precio_compra);
                                                                    setNewProducts({ ...newProducts, cantidad: e.target.value });
                                                                }}
                                                                onKeyDown={keyPressDown}
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
                                                    editId === product.id_producto && dataAuth.tipo_usuario == import.meta.env.VITE_TYPEFROM_USER ?
                                                        (
                                                            <input
                                                                className="w-24 border border-gray-300 dark:border-gray-600 outline-none rounded-md py-1 px-2"
                                                                id="precio_compra"
                                                                required
                                                                value={+newProducts.precio_compra == 0 ? "" : newProducts.precio_compra}
                                                                onChange={(e) => {
                                                                    handleCalculateSubtotalEdit(+newProducts.cantidad, +e.target.value);
                                                                    setNewProducts({ ...newProducts, precio_compra: e.target.value });
                                                                }}
                                                                onKeyDown={keyPressDown}
                                                                type="number"
                                                                placeholder="Precio del producto..."
                                                            />
                                                        )
                                                        :
                                                        product.precio_compra === undefined ? 0 : formatCurrency(product.precio_compra)
                                                }
                                            </TableCell>

                                            <TableCell>
                                                {
                                                    editId === product.id_producto ?
                                                        formatCurrency(subtotal.toString())
                                                        :
                                                        formatCurrency(product.subtotal)
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
                                                                                newProducts.precio_compra = product.precio_compra;
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
                                        filtereddataProducts?.length === 0 && (
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

                    <fieldset className="w-full lg:w-[25%] flex items-end gap-y-2 flex-col mt-2 border border-gray-300 dark:border-gray-600 rounded-lg py-4 px-2 h-104">
                        <legend className="uppercase font-bold">Montos de la compra</legend>

                        <div className="flex flex-col gap-y-2 md:gap-y-0 w-full items-center md:justify-between mx-auto">
                            <label htmlFor="total_productos" className="font-bold w-full">Total productos:</label>
                            <input
                                id="total_productos"
                                className="w-full border border-gray-300 dark:border-gray-600 outline-none rounded-md py-1 px-2 cursor-not-allowed"
                                value={dataProducts.length}
                                type="text"
                                disabled
                                placeholder="Total de productos..." />
                        </div>

                        <div className="flex flex-col gap-y-2 md:gap-y-0 w-full items-center md:justify-between mx-auto">
                            <label htmlFor="subtotal_compra" className="font-bold w-full">Subtotal de compra:</label>
                            <input
                                id="subtotal_compra"
                                className="w-full border border-gray-300 dark:border-gray-600 outline-none rounded-md py-1 px-2 text-green-800 dark:text-green-500 cursor-not-allowed"
                                value={formatCurrency(handleCalculateTotal().toString())}
                                type="text"
                                disabled
                                placeholder="Subtotal de compra..." />
                        </div>

                        <div className="flex flex-col gap-y-2 md:gap-y-0 w-full items-center md:justify-between mx-auto">
                            <label htmlFor="value_tax" className="font-bold text-start w-full">IVA:</label>
                            <input
                                id="value_tax"
                                className="w-full border border-gray-300 dark:border-gray-600 outline-none rounded-md py-1 px-2 cursor-not-allowed"
                                value={valorImpuesto === 0 ? "0.00" : formatCurrency(valorImpuesto.toString())}
                                type="text"
                                disabled
                                placeholder="Impuesto..." />
                        </div>

                        <div className="flex flex-row-reverse w-full items-center justify-center gap-x-1 mx-auto">
                            <label htmlFor="checked_impuesto" className="font-bold text-start w-full">Agregar % manual</label>
                            <input
                                type="checkbox"
                                name=""
                                id="checked_impuesto"
                                checked={isChecked}
                                onChange={(e) => setIsChecked(e.target.checked)}
                            />
                        </div>

                        <div className="flex flex-col gap-y-2 md:gap-y-0 w-full items-center md:justify-between mx-auto">
                            <label htmlFor="impuesto" className="font-bold text-start w-full">% del impuesto:</label>
                            <input
                                id="impuesto"
                                className={`w-full border border-gray-300 dark:border-gray-600 outline-none rounded-md py-1 px-2 ${isChecked == false && "cursor-not-allowed"}`}
                                value={taxesValue}
                                onChange={(e) => {
                                    setTaxesValue(+e.target.value);
                                }}
                                disabled={!isChecked}
                                type="text"
                                placeholder="Impuesto..." />
                        </div>

                        <div className="flex w-full items-center justify-center mx-auto">
                            <button
                                type="button"
                                className="w-full border border-gray-300 dark:border-gray-600 rounded-md py-2 px-4 flex items-center justify-center gap-x-6 font-bold text-base"
                                onClick={() => handleCalculateTotalWithTaxes()}
                            >
                                Calcular con impuesto
                                <Calculator className="size-5" />
                            </button>
                        </div>

                        <div className="flex flex-col gap-y-2 md:gap-y-0 w-full items-center md:justify-between mx-auto">
                            <label htmlFor="total_compra" className="font-bold w-full ">Total de compra:</label>
                            <input
                                id="total_compra"
                                className="w-full border border-gray-300 dark:border-gray-600 outline-none rounded-md py-1 px-2 text-green-800 dark:text-green-500 cursor-not-allowed"
                                value={total === 0 ? formatCurrency(handleCalculateTotal().toString()) : formatCurrency(total.toString())}
                                type="text"
                                disabled
                                placeholder="Total de compra..." />
                        </div>
                    </fieldset>
                </div>

                <div className="w-full">
                    <div

                        className="w-full flex mt-4 items-center justify-center md:gap-x-8"
                    >
                        <button
                            type="submit"
                            className={`w-full md:w-auto border border-gray-300 dark:bg-gray-700 py-2 px-4 rounded-md flex items-center justify-center gap-x-4 font-bold transition-all duration-200 ${supplierData?.nombre_proveedor === undefined ? "cursor-not-allowed" : undefined}`}
                            aria-label="Close"
                            onClick={onSubmitCreateBuys}
                            disabled={supplierData?.nombre_proveedor === undefined ? true : false}
                        >
                            <Save className="size-5" />
                            Guardar compra
                        </button>

                    </div>
                </div>

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

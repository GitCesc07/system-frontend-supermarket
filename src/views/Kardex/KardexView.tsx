import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import {
    Table,
    TableCaption,
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
import { File, Loader2, MessageCircleQuestion, Search } from "lucide-react";
import type { AuthPermissions } from "@/types/auth.interface";
import { toast } from "sonner";
import ToogleFieldsDialogKardex from "@/components/kardex/ToogleFieldsDialogKardex";
import { getKardexByDate, getKardexById, getKardexByidAndDate } from "@/apis/kardex.apis";
import TableCellKardex from "@/components/kardex/TableCellKardex";
import { Button } from "@/components/ui/button";
import DialogFilteredKardex from "@/components/kardex/DialogFilteredKardex";
import type { KardexReturnFormDataInfo } from "@/types/kardex.interface";
import type { ProductFormDataDelete } from "@/types/products.interface";
import { AlertDialog } from "@/components/ui/alert-dialog";
import AlertDialogDelete from "@/components/ui-components/AlertDialogDelete";
import api from "@/lib/axios";

export default function KardexView({ dataAuth }: { dataAuth: AuthPermissions }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [reportProduct, setReportProduct] = useState<ProductFormDataDelete["id"] | null>(null);
    const [openAlertDialogReport, setOpenAlertDialogReport] = useState(false);
    const [dataReturn, setDataReturn] = useState({
        id_producto: "",
        startDate: "",
        endDate: ""
    });

    const [showFields, setShowFields] = useState<string[]>([
        "Fecha creación",
        "Descripción",
        "Nombre producto",
        "Tipo",
        "Cantidad entrada",
        "Precio entrada",
        "Total entrada",
        "Cantidad salida",
        "Precio salida",
        "Total salida",
        "Cantidad disponible",
        "Precio disponible",
        "Total disponible"
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

    const handleSelectionProducts = (dataReturnInfo: KardexReturnFormDataInfo) => {
        setDataReturn({
            id_producto: "",
            startDate: "",
            endDate: "",
        });

        setDataReturn(dataReturnInfo);

        refetch();
        refreshRange();
        refreshIdRange();
    }

    const { data: dataKardexRange, refetch: refreshRange, isLoading: isLoadingRange } = useQuery({
        queryKey: ["kardexById", dataReturn.startDate, dataReturn.endDate],
        queryFn: () => getKardexByDate({ startDate: dataReturn.startDate, endDate: dataReturn.endDate }),
        enabled: false,
        retry: false
    });


    const { data, refetch, isLoading } = useQuery({
        queryKey: ["kardexRangeDate", dataReturn.id_producto],
        queryFn: () => getKardexById({ id: dataReturn.id_producto }),
        enabled: !!dataReturn.id_producto,
        retry: false
    });


    const { data: dataIdRangeDate, refetch: refreshIdRange, isLoading: isLoadingIdRangeDate } = useQuery({
        queryKey: ["kardexIdAndRangeDate", dataReturn.id_producto],
        queryFn: () => getKardexByidAndDate({ id: dataReturn.id_producto, startDate: dataReturn.startDate, endDate: dataReturn.endDate }),
        enabled: !!dataReturn.id_producto,
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

    const handleChangeState = (state: boolean) => {
        if (state == true && dataReturn.id_producto != "" && dataReturn.startDate != "" && dataReturn.endDate != "") {
            onClickCreateReportByIdAndRangeDate();
            return;
        }
        if (state == true && dataReturn.startDate == "" && dataReturn.endDate == "") {
            onClickCreateReportByIdProduct();
            return;
        } else {
            onClickCreateReportByRangeDate()
        }
    }


    const onClickCreateReportByIdProduct = async () => {
        try {
            // Realiza la solicitud GET para obtener el PDF
            const response = await api(`/kardex/reportKardex/report/product/${dataReturn.id_producto}`, {
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

    const onClickCreateReportByRangeDate = async () => {
        try {
            // Realiza la solicitud GET para obtener el PDF
            const response = await api(`/kardex/reportKardex/reportRangeDate/${dataReturn.startDate}/${dataReturn.endDate}`, {
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

    const onClickCreateReportByIdAndRangeDate = async () => {
        try {
            // Realiza la solicitud GET para obtener el PDF
            const response = await api(`/kardex/reportKardex/report/product/${dataReturn.id_producto}/rangeDate/${dataReturn.startDate}/${dataReturn.endDate}`, {
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
                isLoading || isLoadingRange || isLoadingIdRangeDate ? (<Loader />) :
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
                                            <Button
                                                variant="outline"
                                                className="w-full md:w-auto flex items-center justify-center gap-x-4 py-1 px-4 font-medium text-base"
                                                color="gray"
                                                onClick={() => {
                                                    refetch();
                                                    refreshRange();
                                                    refreshIdRange();
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
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Clic para actualizar la información</p>
                                        </TooltipContent>
                                    </Tooltip>

                                    <ToogleFieldsDialogKardex showFields={showFields} setShowFields={setShowFields} />

                                    <DialogFilteredKardex onSelectDataFiltered={handleSelectionProducts} />

                                    {
                                        dataReturn.startDate != "" && dataReturn.endDate != "" || dataReturn.id_producto ?
                                            (
                                                <Button
                                                    onClick={() => {
                                                        setReportProduct(dataReturn.id_producto)
                                                        setOpenAlertDialogReport(true);
                                                    }}
                                                    variant="ghost"
                                                    className="flex items-center justify-center gap-x-4 border border-gray-300 dark:border-gray-700"
                                                >
                                                    <File className="size-5" />
                                                    Imprimir reporte
                                                </Button>
                                            )
                                            :
                                            (null)
                                    }
                                </div>
                            </section>

                            <div className="mt-3 w-full h-[80%] md:h-[90%] mx-auto">
                                <Table>
                                    <TableCaption>Registro de kardex.</TableCaption>
                                    <TableHeader>
                                        <TableRow className="border-b border-gray-300">
                                            <TableHead className="border border-gray-300 text-center" colSpan={4}>
                                                Detalles
                                            </TableHead>
                                            <TableHead className="border border-gray-300 text-center" colSpan={3}>
                                                Entradas
                                            </TableHead>
                                            <TableHead className="border border-gray-300 text-center" colSpan={3}>
                                                Salidas
                                            </TableHead>
                                            <TableHead className="border border-gray-300 text-center" colSpan={3}>
                                                Disponibles
                                            </TableHead>
                                            <TableHead className="border border-gray-300 text-center" colSpan={1}>

                                            </TableHead>
                                        </TableRow>
                                        <TableRow>
                                            {showFields.includes("Fecha creación") && <TableHead>Fecha</TableHead>}
                                            {showFields.includes("Descripción") && <TableHead>Descripción</TableHead>}
                                            {showFields.includes("Nombre producto") && <TableHead>Producto</TableHead>}
                                            {showFields.includes("Tipo") && <TableHead>Tipo</TableHead>}
                                            {showFields.includes("Cantidad entrada") && <TableHead>Cantidad</TableHead>}
                                            {showFields.includes("Precio entrada") && <TableHead>Costo</TableHead>}
                                            {showFields.includes("Total entrada") && <TableHead>Total</TableHead>}
                                            {showFields.includes("Cantidad salida") && <TableHead>Salida</TableHead>}
                                            {showFields.includes("Precio salida") && <TableHead>Precio</TableHead>}
                                            {showFields.includes("Total salida") && <TableHead>Total</TableHead>}
                                            {showFields.includes("Cantidad disponible") && <TableHead>Cantidad</TableHead>}
                                            {showFields.includes("Precio disponible") && <TableHead>Precio</TableHead>}
                                            {showFields.includes("Total disponible") && <TableHead>Total</TableHead>}
                                            {
                                                dataAuth.tipo_usuario == import.meta.env.VITE_TYPEFROM_USER &&
                                                <TableHead className="text-right">Acción</TableHead>
                                            }
                                        </TableRow>
                                    </TableHeader>
                                    {
                                        filteredKardex != undefined || filteredKardex != null ? (
                                            <TableCellKardex products={filteredKardex} showFields={showFields} />
                                        )
                                            :
                                            filteredKardexDateRange != undefined || filteredKardexDateRange != null ? (
                                                <TableCellKardex products={filteredKardexDateRange} showFields={showFields} />
                                            )
                                                :
                                                filteredKardexIdDateRange != undefined || filteredKardexIdDateRange != null ? (
                                                    <TableCellKardex products={filteredKardexIdDateRange} showFields={showFields} />
                                                )
                                                    :
                                                    (
                                                        null
                                                    )
                                    }
                                </Table>

                                {
                                    (reportProduct != null || reportProduct != undefined) && (
                                        <AlertDialog open={openAlertDialogReport} onOpenChange={() => setReportProduct(null)}>
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
                            </div>
                        </div>
                    )
            }
        </div >
    )
}

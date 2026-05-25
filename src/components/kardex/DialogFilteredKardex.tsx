import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { ChevronDown, ChevronUp, Funnel, Save, Search } from "lucide-react";
import { Button } from "../ui/button";
import { getProducts } from "@/apis/products.apis";
import { useQuery } from "@tanstack/react-query";
import Loader from "../loader";
import { toast } from "sonner";
import type { KardexReturnFormDataInfo } from "@/types/kardex.interface";

export default function DialogFilteredKardex({ onSelectDataFiltered }: { onSelectDataFiltered: (data: KardexReturnFormDataInfo) => void }) {
    const [open, setOpen] = useState(false);
    const [isFilteredById, setIsFilteredById] = useState(false);
    const [isFilteredByRangeDate, setIsFilteredByRangeDate] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [openComboBoxProduct, setOpenComboBoxProduct] = useState(false);
    const [dataProductComboBox, setDataProductComboBox] = useState({
        id_producto: "",
        nombre_producto: ""
    });
    const [dateStart, setdateStart] = useState("");
    const [dateEnd, setdateEnd] = useState("");
    const [dataReturn, setDataReturn] = useState({
        id_producto: "",
        startDate: "",
        endDate: ""
    });

    const { data, isLoading, refetch } = useQuery({
        queryKey: ["products"],
        queryFn: getProducts,
    });

    const filteredProducts = Object.values(data || {}).filter(product =>
        Object.values(product).some(value =>
            value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    const handleApplyFilters = (dataValue: KardexReturnFormDataInfo) => {
        if (isFilteredById == true && dataProductComboBox.id_producto == "" || isFilteredByRangeDate == true && dateStart == "" && dateEnd == "") {
            if (isFilteredById == true && dataProductComboBox.id_producto == "") {
                toast.warning("Por favor seleccione un producto...", {
                    position: "top-right",
                    closeButton: true,
                    action: {
                        label: "Cerrar",
                        onClick: () => toast.dismiss()
                    }
                });
                return;
            }

            if (isFilteredByRangeDate == true && dateStart == "" || dateEnd == "") {
                toast.warning("Por favor seleccione un rango de fechas...", {
                    position: "top-right",
                    closeButton: true,
                    action: {
                        label: "Cerrar",
                        onClick: () => toast.dismiss()
                    }
                });
                return;
            }
        } else {
            onSelectDataFiltered(dataValue);
            console.log(dataValue);

            setOpen(false);
            setIsFilteredById(false);
            setIsFilteredByRangeDate(false);
            setSearchTerm("");
            setOpenComboBoxProduct(false);
            setDataProductComboBox({
                id_producto: "",
                nombre_producto: ""
            });
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger
            >
                <Button
                    onClick={() => {
                        setOpen(true);
                    }}
                    variant="outline"
                    className="flex items-center justify-center gap-x-4  w-full md:w-auto"

                >
                    <Funnel className="size-5" />
                    Aplicar filtro
                </Button>
            </DialogTrigger>
            <DialogContent
                onInteractOutside={(e) => e.preventDefault()}
                onEscapeKeyDown={(e) => e.preventDefault()}
                className="w-full md:max-w-md"
            >
                <DialogHeader>
                    <DialogTitle>Filtro</DialogTitle>
                    <DialogDescription>
                        Aplica los filtros que deseas para mostrar la información del kardex, según tus necesidades...
                    </DialogDescription>
                </DialogHeader>

                {
                    isLoading ?
                        (
                            <Loader />
                        )
                        :
                        (
                            <div className="w-full space-y-4">
                                <div className="flex flex-row-reverse items-center justify-end gap-x-4">
                                    <label htmlFor="checkProduct">
                                        Filtrar por producto
                                    </label>
                                    <input
                                        checked={isFilteredById}
                                        type="checkbox"
                                        name=""
                                        id="checkProduct"
                                        onChange={(e) => setIsFilteredById(e.target.checked)}
                                    />
                                </div>

                                {
                                    isFilteredById == true ?
                                        (
                                            <fieldset className={`w-full flex items-start flex-col border border-gray-400 p-4 rounded-lg ${openComboBoxProduct == true && "h-56"}`}>
                                                <legend className="uppercase font-bold">Selecciona el Producto</legend>
                                                <div className="w-full flex-col flex items-start -mt-3">
                                                    <label htmlFor="nombre_categoria" className="font-bold mb-1">Producto:</label>
                                                    <div className={`w-full mx-auto flex items-center justify-center md:justify-between border border-gray-400 py-1 px-2 cursor-pointer ${openComboBoxProduct == true ? "rounded-t-md" : "rounded-md"}`}
                                                        onClick={() => {
                                                            setOpenComboBoxProduct(!openComboBoxProduct)
                                                            refetch();
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
                                                                    <ul className="rounded-b-lg border border-gray-400">
                                                                        <>
                                                                            <div className="w-full border-b border-gray-400  py-1 px-2 flex items-center gap-x-1">
                                                                                <Search className="size-5 text-gray-400" href="searchProduct" />
                                                                                <input
                                                                                    id="searchProduct"
                                                                                    type="text"
                                                                                    value={searchTerm}
                                                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                                                    placeholder="Buscar..."
                                                                                    className="w-full border-none outline-none placeholder:text-gray-400"
                                                                                />
                                                                            </div>

                                                                            {
                                                                                filteredProducts?.map((prodct, index) => (
                                                                                    <li
                                                                                        key={index}
                                                                                        className="hover:bg-gray-300 py-1 px-4 cursor-pointer"
                                                                                        onClick={() => {
                                                                                            setOpenComboBoxProduct(!openComboBoxProduct);
                                                                                            setDataProductComboBox({ ...dataProductComboBox, id_producto: prodct.id, nombre_producto: prodct.nombre_producto });
                                                                                            setDataReturn({ ...dataReturn, id_producto: prodct.id })
                                                                                        }}
                                                                                    >
                                                                                        {prodct.nombre_producto}
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
                                        )
                                        :
                                        (null)
                                }
                            </div>
                        )
                }

                <div className="flex flex-row-reverse items-center justify-end gap-x-4">
                    <label htmlFor="checkRangeDate">
                        Filtrar por rango de fechas
                    </label>
                    <input
                        checked={isFilteredByRangeDate}
                        type="checkbox"
                        name=""
                        id="checkRangeDate"
                        onChange={(e) => setIsFilteredByRangeDate(e.target.checked)}
                    />
                </div>

                {
                    isFilteredByRangeDate == true ?
                        (
                            <fieldset className="w-full flex items-center justify-center flex-col md:flex-row border border-gray-400 p-4 rounded-lg gap-y-6 md:gap-x-4">
                                <legend className="uppercase font-bold">Selecciona fechas</legend>

                                <div className="w-full flex items-start justify-center flex-col">
                                    <label htmlFor="dateStart">Fecha de inicio</label>
                                    <input
                                        value={dateStart}
                                        onChange={(e) => {
                                            setdateStart(e.target.value)
                                            setDataReturn({ ...dataReturn, startDate: e.target.value })
                                        }}
                                        className="border border-gray-300 dark:border-gray-700 py-1 px-4 rounded-xs w-full"
                                        type="date"
                                        name=""
                                        id="dateStart"
                                    />
                                </div>
                                <div className="w-full flex items-start justify-center flex-col">
                                    <label htmlFor="dateEnd">Fecha final</label>
                                    <input
                                        value={dateEnd}
                                        onChange={(e) => {
                                            setdateEnd(e.target.value)
                                            setDataReturn({ ...dataReturn, endDate: e.target.value })
                                        }}
                                        className="border border-gray-300 dark:border-gray-700 py-1 px-4 rounded-xs w-full"
                                        type="date"
                                        name=""
                                        id="dateEnd"
                                    />
                                </div>
                            </fieldset>
                        )
                        :
                        (null)
                }


                <Button
                    variant="outline"
                    className="w-full flex items-center justify-center gap-x-4"
                    onClick={() => handleApplyFilters(dataReturn)}
                >
                    <Save className="size-5" />
                    Aplicar filtros
                </Button>
            </DialogContent>
        </Dialog>
    )
}

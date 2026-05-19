import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { Edit, X } from "lucide-react";
import { stateValue } from "@/types/state.interface";
import type { ErrorData } from "@/types/errors.interface";
import { toast } from "sonner";
import type { CustomerFormDataEdit } from "@/types/customers.interface";
import type { BrandFormDataEdit } from "@/types/brand.interface";
import { getBrandById, updateBrand } from "@/apis/brand.apis";

export default function EditBrand({ brand, onClose }: { brand: BrandFormDataEdit, onClose: () => void }) {
    const navigate = useNavigate()
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    const brandId = queryParams.get("editBrand")!;

    const { data } = useQuery({
        queryKey: ["brands", brandId],
        queryFn: () => getBrandById({ id: brandId }),
        enabled: !!brandId,
        retry: false
    });

    const [open, setOpen] = useState(false);
    const [editeBrand, setEditeBrand] = useState(brand);

    const queryClient = useQueryClient();

    const { mutate } = useMutation({
        mutationFn: updateBrand,
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
            queryClient.invalidateQueries({ queryKey: ["editBrand", brandId] })
            toast.success(data, {
                position: "top-right",
                closeButton: true,
                action: {
                    label: "Cerrar  todas",
                    onClick: () => toast.dismiss()
                }
            });
            navigate(location.pathname, { replace: true });
            reset();
            onClose();
        }
    });


    const {
        reset,
        handleSubmit
    } = useForm<CustomerFormDataEdit>();

    useEffect(() => {
        if (brandId == "" || brandId == null || brandId == undefined) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setOpen(false);
            reset();
        } else {
            setOpen(true);
        }
    }, [brandId, reset])

    const onSubmitEdit = () => {
        const formData = editeBrand;
        const dataBrands = { brandId, formData }
        mutate(dataBrands);
    }

    if (data) return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent
                className="[&>button]:hidden w-full md:max-w-md"
                onInteractOutside={(e) => e.preventDefault()}
                onEscapeKeyDown={(e) => e.preventDefault()}
            >
                <DialogHeader>
                    <DialogTitle>Editar marca</DialogTitle>
                    <DialogDescription>
                        Edita tus marcas aquí...
                    </DialogDescription>
                </DialogHeader>
                <form
                    onSubmit={handleSubmit(onSubmitEdit)}
                    className="space-y-3"
                >
                    <div className="w-full">
                        <label className="w-full text-left text-black font-bold" htmlFor="nombre_marca">
                            Marca
                        </label>
                        <input
                            className="py-1 px-4 font-normal text-base border border-gray-500 w-full rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
                            placeholder="Tu marca..."
                            id="nombre_marca"
                            value={editeBrand.nombre_marca}
                            onChange={(e) => {
                                setEditeBrand({ ...editeBrand, nombre_marca: e.target.value });
                            }}
                            minLength={5}
                            maxLength={50}
                            required
                        />
                    </div>

                    <div className="w-full">
                        <label className="w-full text-left text-black font-bold" htmlFor="descripcion">
                            Descripción
                        </label>
                        <input
                            className="py-1 px-4 font-normal text-base border border-gray-500 w-full rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
                            placeholder="Descripción de la marca..."
                            id="descripcion"
                            value={editeBrand.descripcion}
                            onChange={(e) => {
                                setEditeBrand({ ...editeBrand, descripcion: e.target.value });
                            }}
                            minLength={5}
                            maxLength={150}
                        />
                    </div>

                    <div className="w-full flex flex-col md:flex-row items-center justify-center gap-y-4 md:gap-x-4">
                        <div className="w-full flex items-center justify-center flex-col">
                            <label className="w-full text-left text-black font-bold" htmlFor="estado">
                                Estado:
                            </label>
                            <select
                                id="estado"
                                className="w-full border border-gray-400 rounded-md py-1 px-2"
                                required
                                onChange={(e) => {
                                    setEditeBrand({ ...editeBrand, estado: +e.target.value });
                                }}
                                defaultValue={editeBrand.estado}
                            >
                                {
                                    stateValue.map((state) => (
                                        <option
                                            key={state.value}
                                            value={state.value}
                                        >
                                            {state.label}
                                        </option>
                                    ))
                                }
                            </select>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full mt-4 md:w-auto mx-auto border border-gray-300 py-2 px-4 bg-slate-50/75 rounded-md flex items-center justify-center gap-x-4 font-bold hover:bg-slate-100/65 transition-all duration-200"
                        aria-label="Close"
                    >
                        <Edit className="size-5" />
                        Modificar marca
                    </button>

                </form>
                <DialogClose
                    onClick={() => {
                        setOpen(false)
                        navigate(location.pathname, { replace: true });
                        reset();
                        onClose();
                    }}
                    className="absolute right-4 top-4"
                    asChild
                >
                    <X className="size-5" />
                </DialogClose>
            </DialogContent>
        </Dialog>
    )
}

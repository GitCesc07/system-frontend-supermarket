import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Plus, Save } from "lucide-react";
import type { ErrorData } from "@/types/errors.interface";
import { toast } from "sonner";
import type { SupplierFormDataAdd } from "@/types/suppliers.interface";
import { stateValue } from "@/types/state.interface";
import { createBrand } from "@/apis/brand.apis";

export default function CreateBrand() {
    const navigate = useNavigate();
    const location = useLocation();

    const [open, setOpen] = useState(false);

    const [newBrand, setNewBrand] = useState({
        nombre_marca: '',
        descripcion: '',
        estado: 1,
        usuario_creador: ""
    })

    const queryClient = useQueryClient()

    const { mutate } = useMutation({
        mutationFn: createBrand,
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
            queryClient.invalidateQueries({ queryKey: ["brands"] });
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
    } = useForm<SupplierFormDataAdd>({ defaultValues: newBrand });

    function onClickClearForm() {
        setNewBrand({
            nombre_marca: '',
            descripcion: '',
            estado: 1,
            usuario_creador: ""
        })
        reset();
        setOpen(false);
    }

    const onSubmitCreateBrand = () => {
        const data = newBrand;
        mutate(data);
    }
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger
                className="flex items-center justify-center gap-x-4 border border-gray-300 dark:border-gray-800 bg-gray-100 dark:bg-gray-900 rounded-lg py-1 px-2 w-full md:w-auto"
                onClick={() => {
                    navigate(location.pathname + "?createBrand");
                    setOpen(true);
                }}
            >
                <Plus className="size-5" />
                Crear marca
            </DialogTrigger>
            <DialogContent className="w-full md:max-w-md">
                <DialogHeader>
                    <DialogTitle>Crear marca</DialogTitle>
                    <DialogDescription>
                        Crea tus marcas aquí...
                    </DialogDescription>
                </DialogHeader>
                <form
                    onSubmit={handleSubmit(onSubmitCreateBrand)}
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
                            value={newBrand.nombre_marca}
                            onChange={(e) => {
                                setNewBrand({ ...newBrand, nombre_marca: e.target.value });
                            }}
                            minLength={3}
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
                            value={newBrand.descripcion}
                            onChange={(e) => {
                                setNewBrand({ ...newBrand, descripcion: e.target.value });
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
                                onChange={(e) => {
                                    setNewBrand({ ...newBrand, estado: +e.target.value });
                                }}
                                defaultValue={newBrand.estado}
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
                        className="w-full mt-4 md:w-[50%] mx-auto border border-gray-300 dark:border-gray-800 py-2 px-4 rounded-md flex items-center justify-center gap-x-4 font-bold"
                        aria-label="Close"
                    >
                        <Save className="size-5" />
                        Guardar marca
                    </button>

                </form>
            </DialogContent>
        </Dialog>
    )
}

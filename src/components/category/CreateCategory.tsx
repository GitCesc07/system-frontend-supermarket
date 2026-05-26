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
import { createCategory } from "@/apis/categories.apis";
import { Button } from "../ui/button";

export default function CreateCategory() {
    const navigate = useNavigate();
    const location = useLocation();

    const [open, setOpen] = useState(false);

    const [newCategory, setNewCategory] = useState({
        nombre_categoria: '',
        descripcion: '',
        estado: 1,
        usuario_creador: ""
    })

    const queryClient = useQueryClient()

    const { mutate } = useMutation({
        mutationFn: createCategory,
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
            queryClient.invalidateQueries({ queryKey: ["categories"] });
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
    } = useForm<SupplierFormDataAdd>({ defaultValues: newCategory });

    function onClickClearForm() {
        setNewCategory({
            nombre_categoria: '',
            descripcion: '',
            estado: 1,
            usuario_creador: ""
        })
        reset();
        setOpen(false);
    }

    const onSubmitCreateCategory = () => {
        const data = newCategory;
        mutate(data);
    }
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger>
                <Button
                    className="flex items-center justify-center gap-x-4 border border-gray-300 dark:border-gray-800 bg-gray-100 dark:bg-gray-900 rounded-lg py-1 px-2 w-full md:w-auto"
                    onClick={() => {
                        navigate(location.pathname + "?createCategory");
                        setOpen(true);
                    }}
                    variant="ghost"
                >
                    <Plus className="size-5" />
                    Crear categoría
                </Button>
            </DialogTrigger>
            <DialogContent className="w-full md:max-w-md">
                <DialogHeader>
                    <DialogTitle>Crear categoría</DialogTitle>
                    <DialogDescription>
                        Crea tus categorías aquí...
                    </DialogDescription>
                </DialogHeader>
                <form
                    onSubmit={handleSubmit(onSubmitCreateCategory)}
                    className="space-y-3"
                >
                    <div className="w-full">
                        <label className="w-full text-left text-black font-bold" htmlFor="nombre_categoria">
                            Categoría
                        </label>
                        <input
                            className="py-1 px-4 font-normal text-base border border-gray-500 w-full rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
                            placeholder="Tu categoría..."
                            id="nombre_categoria"
                            value={newCategory.nombre_categoria}
                            onChange={(e) => {
                                setNewCategory({ ...newCategory, nombre_categoria: e.target.value });
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
                            placeholder="Descripción de la categoría..."
                            id="descripcion"
                            value={newCategory.descripcion}
                            onChange={(e) => {
                                setNewCategory({ ...newCategory, descripcion: e.target.value });
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
                                    setNewCategory({ ...newCategory, estado: +e.target.value });
                                }}
                                defaultValue={newCategory.estado}
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

                    <Button
                        aria-label="Close"
                        type="submit"
                        variant="ghost"
                        className="w-full mt-4 md:w-[50%] mx-auto flex items-center border border-gray-300 dark:border-gray-800 justify-center gap-x-4 font-bold"
                    >
                        <Save className="size-5" />
                        Guardar categoría
                    </Button>

                </form>
            </DialogContent>
        </Dialog>
    )
}

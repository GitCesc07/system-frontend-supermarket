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
import type { CategoryFormDataEdit } from "@/types/categories.interface.";
import { getCategoryById, updateCategory } from "@/apis/categories.apis";

export default function EditCategory({ category, onClose }: { category: CategoryFormDataEdit, onClose: () => void }) {
    const navigate = useNavigate()
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    const categoryId = queryParams.get("editCategory")!;

    const { data } = useQuery({
        queryKey: ["categories", categoryId],
        queryFn: () => getCategoryById({ id: categoryId }),
        enabled: !!categoryId,
        retry: false
    });

    const [open, setOpen] = useState(false);
    const [editeCategory, setEditeCategory] = useState(category);

    const queryClient = useQueryClient();

    const { mutate } = useMutation({
        mutationFn: updateCategory,
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
            queryClient.invalidateQueries({ queryKey: ["categories"] })
            queryClient.invalidateQueries({ queryKey: ["editCategory", categoryId] })
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
        if (categoryId == "" || categoryId == null || categoryId == undefined) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setOpen(false);
            reset();
        } else {
            setOpen(true);
        }
    }, [categoryId, reset])

    const onSubmitEdit = () => {
        const formData = editeCategory;
        const dataCategories = { categoryId, formData }
        mutate(dataCategories);
    }

    if (data) return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent
                className="[&>button]:hidden w-full md:max-w-md"
                onInteractOutside={(e) => e.preventDefault()}
                onEscapeKeyDown={(e) => e.preventDefault()}
            >
                <DialogHeader>
                    <DialogTitle>Editar categoría</DialogTitle>
                    <DialogDescription>
                        Edita tus categorías aquí...
                    </DialogDescription>
                </DialogHeader>
                <form
                    onSubmit={handleSubmit(onSubmitEdit)}
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
                            value={editeCategory.nombre_categoria}
                            onChange={(e) => {
                                setEditeCategory({ ...editeCategory, nombre_categoria: e.target.value });
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
                            value={editeCategory.descripcion}
                            onChange={(e) => {
                                setEditeCategory({ ...editeCategory, descripcion: e.target.value });
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
                                    setEditeCategory({ ...editeCategory, estado: +e.target.value });
                                }}
                                defaultValue={editeCategory.estado}
                            >
                                {
                                    stateValue.map((state) => (
                                        <option
                                            className="bg-gray-100 dark:bg-gray-950"
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
                        className="w-full mt-4 md:w-auto mx-auto py-2 px-4 border border-gray-300 dark:border-gray-700 rounded-md flex items-center justify-center gap-x-4 font-bold"
                        aria-label="Close"
                    >
                        <Edit className="size-5" />
                        Modificar categoria
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

import { getUserById, updateByManagerUser } from "@/apis/users.apis";
import type { UserFormDataEdit } from "@/types/users.interface";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { Edit, X } from "lucide-react";
import ErrorMessage from "../error-message";
import { stateValue } from "@/types/state.interface";
import type { ErrorData } from "@/types/errors.interface";
import { toast } from "sonner";
import type { SupplierFormDataEdit } from "@/types/suppliers.interface";
import { getSupplierById } from "@/apis/suppliers.apis";

export default function EditSupplier({ supplier, onClose }: { supplier: SupplierFormDataEdit, onClose: () => void }) {
    const navigate = useNavigate()
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    const userId = queryParams.get("editSupplier")!;

    const { data } = useQuery({
        queryKey: ["suppliers", userId],
        queryFn: () => getSupplierById({ id: userId }),
        enabled: !!userId,
        retry: false
    });

    const [open, setOpen] = useState(false);
    const [editedSupplier, setEditedSupplier] = useState(supplier);

    const queryClient = useQueryClient();

    const { mutate } = useMutation({
        mutationFn: updateByManagerUser,
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
            queryClient.invalidateQueries({ queryKey: ["suppliers"] })
            queryClient.invalidateQueries({ queryKey: ["editSupplier", userId] })
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
        register,
        reset,
        handleSubmit,
        formState: { errors },
    } = useForm<UserFormDataEdit>();

    useEffect(() => {
        if (userId == "" || userId == null || userId == undefined) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setOpen(false);
            reset();
        } else {
            setOpen(true);
        }
    }, [userId, reset])

    const onSubmitEditUser = () => {
        const formData = editedUser;
        const dataUsers = { userId, formData }
        mutate(dataUsers);
    }
    if (data) return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent
                className="[&>button]:hidden"
                onInteractOutside={(e) => e.preventDefault()}
                onEscapeKeyDown={(e) => e.preventDefault()}
            >
                <DialogHeader>
                    <DialogTitle>Crear usuario</DialogTitle>
                    <DialogDescription>
                        Crea tus usuarios aquí...
                    </DialogDescription>
                </DialogHeader>
                <form
                    onSubmit={handleSubmit(onSubmitEditUser)}
                    className="space-y-3"
                >
                    <div className="w-full">
                        <label className="w-full text-left font-bold" htmlFor="nombre_usuario">
                            Nombres y Apellidos:
                        </label>
                        <input
                            {...register("nombre_completo", {
                                required: "El nombre es requerido...",
                            })}
                            className="py-1 px-4 font-normal text-base border border-gray-500 w-full rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
                            placeholder="Nombre del usuario..."
                            id="nombre_completo"
                            value={editedUser.nombre_completo}
                            onChange={(e) => {
                                setEditedUser({ ...editedUser, nombre_completo: e.target.value });
                            }}
                            minLength={5}
                            maxLength={198}
                        />
                        {errors.nombre_completo && (
                            <ErrorMessage>{errors.nombre_completo!.message}</ErrorMessage>
                        )}
                    </div>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-y-4 md:gap-x-4">
                        <div className="w-full">
                            <label className="w-full text-left font-bold" htmlFor="cedula_usuario">
                                Cedula usuario:
                            </label>
                            <input
                                minLength={16}
                                maxLength={16}
                                {...register("cedula", {
                                    required: "La cedula es requerido...",
                                })}
                                className="py-1 px-4 font-normal text-base border border-gray-500 w-full rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
                                placeholder="XXX-XXXXXX-XXXXX"
                                id="cedula"
                                required
                                value={editedUser.cedula}
                                onChange={(e) => {
                                    setEditedUser({ ...editedUser, cedula: e.target.value });
                                }}
                            />
                            {errors.cedula && (
                                <ErrorMessage>{errors.cedula!.message}</ErrorMessage>
                            )}
                        </div>

                        <div className="w-full">
                            <label className="w-full text-left font-bold" htmlFor="celular_usuario">
                                Celular usuario:
                            </label>
                            <input
                                {...register("celular_usuario", {
                                    required: "El celular es requerido...",
                                })}
                                className="py-1 px-4 font-normal text-base border border-gray-500 w-full rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
                                placeholder="Celular del usuario..."
                                id="celular_usuario"
                                value={editedUser.celular_usuario}
                                onChange={(e) => {
                                    if (e.target.value.length <= 8) {
                                        setEditedUser({ ...editedUser, celular_usuario: e.target.value });
                                    }
                                }}
                                minLength={8}
                                maxLength={8}
                                required
                                type="number"
                            />
                            {errors.celular_usuario && (
                                <ErrorMessage>{errors.celular_usuario!.message}</ErrorMessage>
                            )}
                        </div>
                    </div>

                    <div className="w-full">
                        <label className="w-full text-left font-bold" htmlFor="correo_usuario">
                            Correo del usuario:
                        </label>
                        <input
                            {...register("correo_usuario", {
                                required: "El correo es requerido...",
                                pattern: {
                                    value: /\S+@\S+\.\S+/,
                                    message: "Correo no válido",
                                },
                            })}
                            type="email"
                            className="py-1 px-4 font-normal text-base border border-gray-500 w-full rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
                            placeholder="Correo del usuario..."
                            id="correo_usuario"
                            required
                            value={editedUser.correo_usuario}
                            autoComplete="username"
                            onChange={(e) => {
                                setEditedUser({ ...editedUser, correo_usuario: e.target.value });
                            }}
                            minLength={10}
                            maxLength={78}
                        />
                        {errors.correo_usuario && (
                            <ErrorMessage>{errors.correo_usuario!.message}</ErrorMessage>
                        )}
                    </div>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-y-4 md:gap-x-4">
                        <div className="w-full flex items-center justify-center flex-col">
                            <label className="w-full text-left font-bold" htmlFor="estado">
                                Estado:
                            </label>
                            <select
                                {...register("estado", {
                                    required: "El estado es requerido...",
                                })}
                                id="estado"
                                className="w-full border border-gray-300 dark:border-gray-700 rounded-md py-1 px-2 bg-gray-100 dark:bg-gray-800"
                                onChange={(e) => {
                                    setEditedUser({ ...editedUser, estado: +e.target.value });
                                }}
                                defaultValue={data[0].estado}
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
                            {errors.estado && (
                                <ErrorMessage>{errors.estado!.message}</ErrorMessage>
                            )}
                        </div>

                        <div className="w-full">
                            <label className="w-full text-left font-bold" htmlFor="tipo_usuario">
                                Tipo de usuario
                            </label>
                            <input
                                {...register("tipo_usuario", {
                                    required: "Este campo es requerido...",
                                })}
                                className="py-1 px-4 font-normal text-base border border-gray-500 w-full rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
                                placeholder="Tipo de usuario..."
                                id="tipo_usuario"
                                required
                                value={editedUser.tipo_usuario}
                                onChange={(e) => {
                                    setEditedUser({ ...editedUser, tipo_usuario: e.target.value });
                                }}
                                minLength={3}
                                maxLength={50}
                            />
                            {errors.tipo_usuario && (
                                <ErrorMessage>{errors.tipo_usuario!.message}</ErrorMessage>
                            )}
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full mt-4 mx-auto border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 py-2 px-4 rounded-md flex items-center justify-center gap-x-4 font-bold transition-all duration-200"
                        aria-label="Close"
                    >
                        <Edit className="size-5" />
                        Editar usuario
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

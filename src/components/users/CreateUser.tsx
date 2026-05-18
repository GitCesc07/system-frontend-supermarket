import { createUser } from "@/apis/users.apis";
import type { UserFormDataAdd } from "@/types/users.interface";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Eye, EyeOff, Plus, Save } from "lucide-react";
import ErrorMessage from "../error-message";
import { stateValue } from "@/types/state.interface";
import type { ErrorData } from "@/types/errors.interface";
import { toast } from "sonner";

export default function CreateUser() {
    const navigate = useNavigate()
    const location = useLocation()
    let idUSerLogin;

    const [passwordView, setPasswordView] = useState(false);
    const [open, setOpen] = useState(false);

    const [newUser, setNewUser] = useState({
        nombre_completo: '',
        cedula: '',
        celular_usuario: '',
        correo_usuario: '',
        tipo_usuario: '',
        contraseña: '',
        estado: 0,
        usuario_creador: ''
    })

    const queryClient = useQueryClient()

    const { mutate } = useMutation({
        mutationFn: createUser,
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
            queryClient.invalidateQueries({ queryKey: ["users"] });
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
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<UserFormDataAdd>({ defaultValues: newUser });

    function onClickClearForm() {
        setNewUser({
            nombre_completo: '',
            cedula: '',
            celular_usuario: '',
            correo_usuario: '',
            tipo_usuario: '',
            contraseña: '',
            estado: 0,
            usuario_creador: idUSerLogin!
        })
        reset();
        setOpen(false);
    }

    const onSubmitCreateUser = () => {        
        const data = newUser;
        mutate(data);
    }
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger
                className="flex items-center justify-center gap-x-4 border border-gray-300 dark:border-gray-800 bg-gray-100 dark:bg-gray-900 rounded-lg py-1 px-2 w-full md:w-auto"
                onClick={() => {
                    navigate(location.pathname + "?createUser");
                    setOpen(true);
                }}
            >
                <Plus className="size-5" />
                Crear usuario
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Crear usuario</DialogTitle>
                    <DialogDescription>
                        Crea tus usuarios aquí...
                    </DialogDescription>
                </DialogHeader>
                <form
                    onSubmit={handleSubmit(onSubmitCreateUser)}
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
                            required
                            id="nombre_usuario"
                            value={newUser.nombre_completo}
                            onChange={(e) => {
                                setNewUser({ ...newUser, nombre_completo: e.target.value });
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
                                value={newUser.cedula}
                                onChange={(e) => {
                                    setNewUser({ ...newUser, cedula: e.target.value });
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
                                value={newUser.celular_usuario}
                                onChange={(e) => {
                                    if (e.target.value.length <= 8) {
                                        setNewUser({ ...newUser, celular_usuario: e.target.value });
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
                            value={newUser.correo_usuario}
                            autoComplete="username"
                            onChange={(e) => {
                                setNewUser({ ...newUser, correo_usuario: e.target.value });
                            }}
                            minLength={10}
                            maxLength={78}
                        />
                        {errors.correo_usuario && (
                            <ErrorMessage>{errors.correo_usuario!.message}</ErrorMessage>
                        )}
                    </div>

                    <div className="w-full">
                        <label className="w-full text-left font-bold" htmlFor="password">
                            Contraseña del usuario:
                        </label>
                        <div className="flex items-center justify-center px-1 border-gray-400 rounded-lg border">
                            <input
                                {...register("contraseña", {
                                    required: "La contraseña es requerido...",
                                })}
                                className="py-1 px-4 font-normal text-base w-full placeholder:text-gray-300 outline-none"
                                placeholder="Contraseña del usuario..."
                                id="contraseña"
                                required
                                autoComplete="current-contraseña"
                                value={newUser.contraseña}
                                onChange={(e) => {
                                    setNewUser({ ...newUser, contraseña: e.target.value });
                                }}
                                type={passwordView ? "text" : "password"}
                                minLength={8}
                                maxLength={100}
                            />
                            <button
                                type="button"
                                onClick={() => setPasswordView(!passwordView)}
                            >
                                {passwordView ? (
                                    <Eye className="text-black dark:text-white" size={24} />
                                ) : (
                                    <EyeOff className="text-black dark:text-white" size={24} />
                                )}
                            </button>
                        </div>
                        {errors.contraseña && (
                            <ErrorMessage>{errors.contraseña!.message}</ErrorMessage>
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
                                className="w-full border border-gray-400 rounded-md py-1 px-2"
                                onChange={(e) => {
                                    setNewUser({ ...newUser, estado: +e.target.value });
                                }}
                                defaultValue={newUser.estado}
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
                                value={newUser.tipo_usuario}
                                onChange={(e) => {
                                    setNewUser({ ...newUser, tipo_usuario: e.target.value });
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
                        <Save className="size-5" />
                        Guardar usuario
                    </button>

                </form>
            </DialogContent>
        </Dialog>
    )
}

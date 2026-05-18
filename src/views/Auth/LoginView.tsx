import { useState } from "react";
import { useForm } from "react-hook-form";
import BackGroundGradient from "@/components/auth/background-gradient";
import type { UserLoginForm } from "@/types/auth.interface";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import ErrorMessage from "@/components/error-message";
import { useMutation } from "@tanstack/react-query";
import { authenticateUser } from "@/apis/auth.apis";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import type { ErrorData } from "@/types/errors.interface";

export default function LoginView() {
    const navigate = useNavigate();
    const [isVisiblePassword, setisVisiblePassword] = useState<boolean>(false);

    const handleVisiblePassword = () => {
        setisVisiblePassword(!isVisiblePassword);
    }

    const initialvalue: UserLoginForm = {
        correo_usuario: "",
        contraseña: ""
    };

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ defaultValues: initialvalue });

    const { mutate } = useMutation({
        mutationFn: authenticateUser,
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
            toast.success(data, {
                position: "top-right",
                closeButton: true,
                action: {
                    label: "Cerrar  todas",
                    onClick: () => toast.dismiss()
                }
            });
            navigate("/");
        },
    });

    const handleLogin = (FormData: UserLoginForm) => {
        mutate(FormData);
    }

    return (
        <>
            <BackGroundGradient>
                <form
                    onSubmit={handleSubmit(handleLogin)}
                    className="dark:text-white text-black space-y-3 w-full p-4"
                    action=""
                >
                    <h2 className="font-bold text-xl text-center">¡Bienvenido nuevamente!</h2>
                    <p className="text-center">Por favor ingresa tus credenciales para
                        <br />
                        <span className="font-bold"> iniciar sesión</span>
                    </p>
                    <div className="block w-full mt-3">
                        <label className="text-sm" aria-label="correo" htmlFor="correo">Correo:</label>
                        <div className="flex items-center justify-center w-full border border-gray-500 rounded-lg py-1 px-2 gap-x-2">
                            <Mail className="size-4" />
                            <input
                                className="w-full font-normal outline-none"
                                type="email"
                                required
                                id="correo"
                                {...register("correo_usuario", {
                                    required: "El correo es obligatorio...",
                                    pattern: {
                                        value: /\S+@\S+\.\S+/,
                                        message: "Correo no válido",
                                    },
                                })}
                            />
                        </div>
                        {errors.correo_usuario && (
                            <ErrorMessage>{errors.correo_usuario.message}</ErrorMessage>
                        )}
                    </div>

                    <div className="block w-full mt-3">
                        <label className="text-sm" aria-label="password" htmlFor="password">Contraseña:</label>
                        <div className="flex items-center justify-center w-full border border-gray-500 rounded-lg py-1 px-2 gap-x-2">
                            <Lock className="size-4" />
                            <input
                                className="w-full font-normal outline-none"
                                type={isVisiblePassword ? "text" : "password"}
                                required
                                id="password"
                                {...register("contraseña", {
                                    required: "La contraseña es obligatoria...",
                                })}
                            />
                            <button
                                type="button"
                                className="cursor-pointer"
                                onClick={handleVisiblePassword}
                            >
                                {
                                    isVisiblePassword ?
                                        <Eye className="size-4" />
                                        :
                                        <EyeOff className="size-4" />
                                }
                            </button>
                        </div>
                        {errors.contraseña && (
                            <ErrorMessage>{errors.contraseña.message}</ErrorMessage>
                        )}
                    </div>

                    <input
                        className="w-full bg-gray-800 hover:bg-gray-900/85 transition-all duration-300 border border-gray-500 rounded-lg py-1 px-4 mt-4 cursor-pointer"
                        type="submit"
                        value="Iniciar sesión"
                    />

                    <p className="text-sm mt-4 text-center">¿Olvidaste tu contraseña?  <a href="/auth/forgot-password" className="font-bold">Reestablecer aquí</a></p>
                </form>
            </BackGroundGradient>
        </>
    )
}

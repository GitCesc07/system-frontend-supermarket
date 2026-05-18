import { forgotPassword } from "@/apis/auth.apis";
import BackGroundGradient from "@/components/auth/background-gradient";
import FooterForm from "@/components/auth/footer-form";
import ErrorMessage from "@/components/error-message";
import type { ForgotPasswordForm } from "@/types/auth.interface";
import { useMutation } from "@tanstack/react-query";
import { Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function ForgoPasswordView() {
    const initialvalue: ForgotPasswordForm = {
        correo_usuario: "",
    };

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({ defaultValues: initialvalue });

    const { mutate } = useMutation({
        mutationFn: forgotPassword,
        onError: (error: Error) => {
            toast.error(error.message, {
                position: "top-right",
                closeButton: true,
                action: {
                    label: "Cerrar",
                    onClick: () => toast.dismiss()
                }
            });
        },
        onSuccess: (data: Error) => {
            toast.success(data?.message, {
                position: "top-right",
                closeButton: true,
                action: {
                    label: "Cerrar  todas",
                    onClick: () => toast.dismiss()
                }
            });
            reset();
        },
    });

    const handleLogin = (FormData: ForgotPasswordForm) => mutate(FormData!);

    return (
        <>
            <BackGroundGradient>
                <form
                    onSubmit={handleSubmit(handleLogin)}
                    className="dark:text-white text-black space-y-3 w-full p-4"
                    action=""
                >
                    <h2 className="font-bold text-xl text-center">¡Reestablece tu contraseña!</h2>
                    <p className="text-center"> ¿Olvidaste tu contraseña? coloca tu correo
                        <br />
                        <span className="font-bold"> y reestable tu contraseña.</span>
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

                    <input
                        className="w-full bg-gray-800 hover:bg-gray-900/85 transition-all duration-300 border border-gray-500 rounded-lg py-1 px-4 mt-4 cursor-pointer"
                        type="submit"
                        value="Enviar instrucciones"
                    />

                    <FooterForm />
                </form>
            </BackGroundGradient>
        </>
    )
}

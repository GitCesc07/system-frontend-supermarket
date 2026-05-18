import { requestConfirmationCode } from "@/apis/auth.apis";
import BackGroundGradient from "@/components/auth/background-gradient";
import FooterForm from "@/components/auth/footer-form";
import ErrorMessage from "@/components/error-message";
import type { RequestConfirmationCodeForm } from "@/types/auth.interface";
import { useMutation } from "@tanstack/react-query";
import { Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function RequestCodeView() {
    const initialValues: RequestConfirmationCodeForm = {
        correo_usuario: "",
    };

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({ defaultValues: initialValues });

    const { mutate } = useMutation({
        mutationFn: requestConfirmationCode,
        onError: (error) => {
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
            toast.error(data, {
                position: "top-right",
                closeButton: true,
                action: {
                    label: "Cerrar",
                    onClick: () => toast.dismiss()
                }
            });
            reset();
        },
    });

    const handleRequestCode = (formData: RequestConfirmationCodeForm) => {
        mutate(formData);
    }
    return (
        <BackGroundGradient>
            <form
                onSubmit={handleSubmit(handleRequestCode)}
                className="dark:text-white text-black space-y-3 w-full p-4"
                action=""
            >
                <h2 className="font-bold text-xl text-center">¡Solicitar Código de Confirmación!</h2>
                <p className="text-center">Coloca tu e-mail para recibir
                    <br />
                    <span className="font-bold">un nuevo código</span>
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
    )
}

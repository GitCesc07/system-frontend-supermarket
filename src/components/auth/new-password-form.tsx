/* eslint-disable react-hooks/incompatible-library */
import { updatePasswordWithToken } from "@/apis/auth.apis";
import type { NewPasswordForm } from "@/types/auth.interface";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Eye, EyeOff, Lock } from "lucide-react";
import ErrorMessage from "../error-message";
import FooterForm from "./footer-form";

type NewPasswordFormProps = {
    token: string;
};

export default function NewPasswordForm({ token }: NewPasswordFormProps) {
    const navigate = useNavigate();
    const [mostrarPassword, setMostrarPassword] = useState(false);
    const [mostrarPasswordConfirm, setMostrarPasswordConfirm] = useState(false);

    const initialValues: NewPasswordForm = {
        contraseña: "",
        contraseña_confirmation: "",
    };

    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors },
    } = useForm({ defaultValues: initialValues });

    const { mutate } = useMutation({
        mutationFn: updatePasswordWithToken,
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
            navigate("/auth/login");
        },
    });

    const handleNewPassword = (formData: NewPasswordForm) => {
        const data = {
            formData,
            token,
        };
        mutate(data);
    };

    const constraseña = watch("contraseña");
    return (
        <form
            onSubmit={handleSubmit(handleNewPassword)}
            className="dark:text-white text-black space-y-3 w-full p-4"
            action=""
        >
            <div className="block w-full mt-3">
                <label className="text-sm" aria-label="password" htmlFor="password">Contraseña:</label>
                <div className="flex items-center justify-center w-full border border-gray-500 rounded-lg py-1 px-2 gap-x-2">
                    <Lock className="size-4" />
                    <input
                        className="w-full font-normal outline-none"
                        type={mostrarPassword ? "text" : "password"}
                        required
                        id="password"
                        {...register("contraseña", {
                            required: "La contraseña es obligatoria...",
                        })}
                    />
                    <button
                        type="button"
                        className="cursor-pointer"
                        onClick={() => setMostrarPassword(!mostrarPassword)}
                    >
                        {
                            mostrarPassword ?
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

            <div className="block w-full mt-3">
                <label className="text-sm" aria-label="confirm_password" htmlFor="confirm_password">Confirmar contraseña:</label>
                <div className="flex items-center justify-center w-full border border-gray-500 rounded-lg py-1 px-2 gap-x-2">
                    <Lock className="size-4" />
                    <input
                        className="w-full font-normal outline-none"
                        type={mostrarPasswordConfirm ? "text" : "password"}
                        required
                        id="password"

                        {...register("contraseña_confirmation", {
                            required: "La contraseña es obligatoria...",
                            validate: (value) =>
                                value === constraseña || "Las contraseñas no son iguales",
                        })}
                    />
                    <button
                        type="button"
                        className="cursor-pointer"
                        onClick={() => setMostrarPasswordConfirm(!mostrarPasswordConfirm)}
                    >
                        {
                            mostrarPasswordConfirm ?
                                <Eye className="size-4" />
                                :
                                <EyeOff className="size-4" />
                        }
                    </button>
                </div>
                {errors.contraseña_confirmation && (
                    <ErrorMessage>{errors.contraseña_confirmation.message}</ErrorMessage>
                )}
            </div>

            <input
                className="w-full bg-gray-800 hover:bg-gray-900/85 transition-all duration-300 border border-gray-500 rounded-lg py-1 px-4 mt-4 cursor-pointer"
                type="submit"
                value="Reestablecer contraseña"
            />

            <FooterForm />
        </form>
    )
}

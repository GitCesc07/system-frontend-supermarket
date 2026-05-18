import { confirmAccount } from "@/apis/auth.apis";
import BackGroundGradient from "@/components/auth/background-gradient";
import InputOTPAuth from "@/components/auth/input-otp-auth";
import type { ConfirmTokenNew } from "@/types/auth.interface";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function ConfirmAccountView() {
    const navigate = useNavigate();
    const [token, setToken] = useState<ConfirmTokenNew["access_token"]>("");
    const { mutate } = useMutation({
        mutationFn: confirmAccount,
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
            setToken("");
            navigate("/auth/login");
        },
    });

    const handleChange = (access_token: ConfirmTokenNew["access_token"]) => {
        setToken(access_token);
    };

    const handleComplete = (access_token: ConfirmTokenNew["access_token"]) => {
        mutate({ access_token });
    };
    return (
        <BackGroundGradient>
            <form
                className="dark:text-white text-black space-y-3 w-full p-4 text-center"
                action=""
            >
                <h2 className="font-bold text-xl text-center">¡Confirma tu cuenta!</h2>
                <p className="text-center">Ingresa el código que recibiste
                    <br />
                    <span className="font-bold">por correo</span>
                </p>

                <InputOTPAuth token={token} onHandleChange={handleChange} handleComplete={handleComplete} />

                <a
                    className="w-full text-center cursor-pointer"
                    href="/auth/request-code"
                >
                    Solicitar un nuevo código
                </a>
            </form>
        </BackGroundGradient>
    )
}

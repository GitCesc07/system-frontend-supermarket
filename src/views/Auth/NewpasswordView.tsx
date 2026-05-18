import BackGroundGradient from "@/components/auth/background-gradient";
import NewPasswordToken from "@/components/auth/new-password-token";
import NewPasswordForm from "@/components/auth/new-password-form";
import type { ConfirmToken } from "@/types/auth.interface";
import { useState } from "react";

export default function NewpasswordView() {
    const [token, setToken] = useState<ConfirmToken["access_token"]>("");
    const [isValidToken, setIsValidToken] = useState(false);
    return (
        <BackGroundGradient>
            <div
                className="dark:text-white text-black space-y-3 w-full p-4"                
            >
                <h2 className="font-bold text-xl text-center">¡Reestablecer Contraseña!</h2>
                {!isValidToken ? (
                    <p className="md:text-2xl text-xl font-normal text-center text-black dark:text-white mt-5">
                        Ingresa el código que recibiste {""}
                        <span className="font-bold"> por correo.</span>
                    </p>
                ) : (
                    <p className="md:text-2xl text-xl font-normal text-center text-black dark:text-white mt-5">
                        Ingresa la nueva {""}
                        <span className="font-bold"> contraseña</span>
                    </p>
                )}

                {!isValidToken ? (
                    <NewPasswordToken
                        token={token}
                        setToken={setToken}
                        setIsValidToken={setIsValidToken}
                    />
                ) : (
                    <NewPasswordForm token={token} />
                )}
            </div>
        </BackGroundGradient>
    )
}

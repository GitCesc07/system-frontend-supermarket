import { validateToken } from "@/apis/auth.apis";
import type { ConfirmToken } from "@/types/auth.interface";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";


type NewPasswordTokenProps = {
    token: ConfirmToken["access_token"];
    setToken: React.Dispatch<React.SetStateAction<string>>;
    setIsValidToken: React.Dispatch<React.SetStateAction<boolean>>;
};


export default function NewPasswordToken({
    token,
    setToken,
    setIsValidToken,
}: NewPasswordTokenProps) {

    const { mutate } = useMutation({
        mutationFn: validateToken,
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
            setIsValidToken(true);
        },
    });

    const handleChange = (token: ConfirmToken["access_token"]) => {
        setToken(token);
    };

    const handleComplete = (access_token: ConfirmToken["access_token"]) => {
        mutate({ access_token });
    };
    return (
        <div className="space-y-6 mt-8 mb-8 w-full flex items-center justify-center flex-col">
            <h3 className="text-lg text-center">Código de 6 dígitos</h3>
            <InputOTP
                value={token}
                onChange={handleChange}
                onComplete={handleComplete}
                id="code-confirm"
                maxLength={6}
                pattern={REGEXP_ONLY_DIGITS}
            >
                <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                </InputOTPGroup>
            </InputOTP>
        </div>
    )
}

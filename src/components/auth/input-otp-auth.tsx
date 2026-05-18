import type { ConfirmToken } from "@/types/auth.interface";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";

type InputOTPAuthProps = {
    token: ConfirmToken["access_token"]
    onHandleChange: (token: ConfirmToken["access_token"]) => void
    handleComplete: (access_token: ConfirmToken["access_token"]) => void
};


export default function InputOTPAuth({ token, onHandleChange, handleComplete }: InputOTPAuthProps) {

    const handleChange = (token: ConfirmToken["access_token"]) => {
        onHandleChange(token);
    };

    const onHandleComplete = (access_token: ConfirmToken["access_token"]) => {
        handleComplete(access_token);
    };

    return (
        <div className="space-y-6 mt-8 mb-8 w-full flex items-center justify-center flex-col">
            <h3 className="text-lg text-center">Código de 6 dígitos</h3>
            <InputOTP
                value={token}
                onChange={handleChange}
                onComplete={onHandleComplete}
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

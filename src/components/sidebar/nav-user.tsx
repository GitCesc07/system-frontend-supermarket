
import {
    LogOut,
    Moon,
    Sun,
} from "lucide-react"

import {
    Avatar
} from "@/components/ui/avatar"
import type { Auth } from "@/types/auth.interface"
import AvatarUser from "../avatar"
import { Switch } from "../ui/switch"
import { useTheme } from "../theme-provider"
import AlertDialogComponents from "../ui-components/AlertDialogComponents"
import { useNavigate } from "react-router-dom"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { logout } from "@/apis/auth.apis"
import { toast } from "sonner"
import type { ErrorData } from "@/types/errors.interface"

export function NavUser({
    user,
}: {
    user: {
        id_usuario: Auth["id"],
        nombre_completo: Auth["nombre_completo"],
        correo_usuario: Auth["correo_usuario"],
        tipo_usuario: Auth["tipo_usuario"]
    }
}) {
    const { setTheme } = useTheme();
    const navigate = useNavigate()

    const queryClient = useQueryClient()
    const { mutate } = useMutation({
        mutationFn: logout,
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
            queryClient.invalidateQueries({ queryKey: ["auth"] })
            toast.success(data, {
                position: "top-right",
                closeButton: true,
                action: {
                    label: "Cerrar  todas",
                    onClick: () => toast.dismiss()
                }
            });
            navigate("auth/login")
            sessionStorage.clear();
        }
    })
    const handleChangeState = (state: boolean) => {
        if (state == true) {
            onClickLogout()
        }
    }


    const onClickLogout = () => {
        mutate();
    }

    return (
        <div className="flex items-center justify-center flex-col w-full border-t border-gray-200 dark:border-gray-700 rounded-lg p-2">
            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm w-full">
                <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarUser />
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{user.nombre_completo}</span>
                    <span className="truncate text-xs">{user.correo_usuario}</span>
                </div>
            </div>
            <div className="border-b w-full my-2"></div>
            <div className="flex items-center justify-center gap-x-4 w-full">
                <Moon />
                <Switch
                    id="switch-theme"
                    onCheckedChange={() => {
                        const theme = localStorage.getItem("vite-ui-theme");
                        if (theme === "light") {
                            setTheme("dark");
                        } else {
                            setTheme("light");
                        }
                    }}
                />
                <Sun />
            </div>
            <div className="border-b w-full my-2"></div>

            <div className="flex items-center justify-center w-full">
                <AlertDialogComponents
                    isButtonAlertDialog={true}
                    buttonAlertDialog="Cerrar sesión"
                    icon={LogOut}
                    title="Cerrar sesión"
                    description="¿Estas seguro de cerrar sesión?"
                    buttonCancel="¡No, cerrar sesión!"
                    buttonConfirm="¡Si, cerrar sesión!"
                    onClickConfirm={handleChangeState}
                />
            </div>
        </div>
    )
}

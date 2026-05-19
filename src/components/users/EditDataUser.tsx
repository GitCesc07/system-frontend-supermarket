import { getUserById, updateUser } from "@/apis/users.apis";
import type { UserFormDataEditStaff } from "@/types/users.interface";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Eye, EyeOff, Save, UserRoundPenIcon, X } from "lucide-react";
import type { ErrorData } from "@/types/errors.interface";
import { toast } from "sonner";

export default function EditUserPerfil({ id_usuario }: { id_usuario: string }) {

    const navigate = useNavigate()
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    const userId = queryParams.get("editDataUser")!
    const id = userId;


    const [isActiveNewPassword, setIsActiveNewPassword] = useState(false);
    const [isActiveOldPassword, setIsActiveOldPassword] = useState(false);
    const [newContraseña, setNewContraseña] = useState("");
    const [oldContraseña, setOldContraseña] = useState("");
    const [open, setOpen] = useState(false);


    const { isError, data } = useQuery({
        queryKey: ["user", userId],
        queryFn: () => getUserById({ id }),
        enabled: !!userId,
        retry: false
    })

    const [editedUser, setEditedUser] = useState({
        celular_usuario: "",
        correo_usuario: "",
        oldContraseñaUser: "",
        contraseña: ""
    })


    const queryClient = useQueryClient()

    const {
        handleSubmit,
        reset
    } = useForm<UserFormDataEditStaff>()

    const { mutate } = useMutation({
        mutationFn: updateUser,
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
            queryClient.invalidateQueries({ queryKey: ["users"] })
            queryClient.invalidateQueries({ queryKey: ["editDataUser", userId] })
            toast.success(data, {
                position: "top-right",
                closeButton: true,
                action: {
                    label: "Cerrar  todas",
                    onClick: () => toast.dismiss()
                }
            });
            navigate(location.pathname, { replace: true })
            setOpen(false);
        }
    })

    const onSubmit = () => {
        const formData = editedUser;
        const dataUsers = { formData, userId }
        mutate(dataUsers)
    }

    if (isError) return <Navigate to={"/404"} />

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger
                className="flex items-center text-sm justify-center gap-x-4 dark:border-gray-950 bg-gray-50 hover:bg-gray-100 dark:bg-[#171717] dark:hover:bg-black/5 rounded-lg py-1 px-2 w-full"
                onClick={() => {
                    navigate(location.pathname + `?editDataUser=${id_usuario}`)
                    setOpen(true);
                }}
            >
                <UserRoundPenIcon className="size-4" />
                Modificar perfil
            </DialogTrigger>
            <DialogContent
                className="[&>button]:hidden"
                onInteractOutside={(e) => e.preventDefault()}
                onEscapeKeyDown={(e) => e.preventDefault()}
            >
                <DialogHeader>
                    <DialogTitle>Crear usuario</DialogTitle>
                    <DialogDescription>
                        Crea tus usuarios aquí...
                    </DialogDescription>
                </DialogHeader>
                {data?.map((userEdit) => (
                    <form
                        key={userEdit.id}
                        onSubmit={handleSubmit(onSubmit)}
                        className="flex flex-col items-center justify-center space-y-4"
                    >
                        <div className="flex flex-col gap-y-1 items-center justify-center w-full">
                            <label className="w-full text-left text-black font-bold" htmlFor="celular_usuario">
                                Celular usuario
                            </label>
                            <input
                                className="py-1 px-4 font-normal text-base border border-gray-500 w-full rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
                                placeholder="Tu número aquí..."
                                id="celular_usuario"
                                // eslint-disable-next-line react-hooks/immutability
                                value={editedUser.celular_usuario = userEdit.celular_usuario}
                                onChange={(e) => {
                                    userEdit.celular_usuario = e.target.value;
                                    setEditedUser({ ...editedUser, celular_usuario: userEdit.celular_usuario });
                                }}
                                minLength={8}
                                maxLength={8}
                            />
                        </div>

                        <div className="flex flex-col gap-y-1 items-center justify-center w-full">
                            <label className="w-full text-left text-black font-bold" htmlFor="correo_usuario">
                                Correo usuario
                            </label>
                            <input
                                className="py-1 px-4 font-normal text-base border border-gray-500 w-full rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
                                id="correo_usuario"
                                // eslint-disable-next-line react-hooks/immutability
                                value={editedUser.correo_usuario = userEdit.correo_usuario}
                                onChange={(e) => {
                                    // eslint-disable-next-line react-hooks/immutability
                                    userEdit.correo_usuario = e.target.value;
                                    setEditedUser({ ...editedUser, correo_usuario: userEdit.correo_usuario });
                                }}
                            />
                        </div>

                        <div className="flex flex-col gap-y-1 items-center justify-center w-full">
                            <label className="w-full text-left text-black font-bold" htmlFor="oldPassword">
                                Contraseña anterior
                            </label>
                            <div className="border border-gray-500 w-full rounded-md flex items-center justify-center px-4 py-1">
                                <input
                                    className="font-normal text-base placeholder:text-gray-300 outline-none focus-visible:border-gray-800 w-full"
                                    id="oldPassword"
                                    value={oldContraseña}
                                    type={isActiveOldPassword ? "text" : "password"}
                                    onChange={(e) => {
                                        setOldContraseña(e.target.value);
                                        setEditedUser({ ...editedUser, oldContraseñaUser: e.target.value });
                                    }}
                                    minLength={8}
                                    maxLength={20}
                                />
                                <button
                                    type="button"
                                    onClick={() => setIsActiveOldPassword(!isActiveOldPassword)}
                                >

                                    {
                                        isActiveOldPassword ? (
                                            <Eye className="size-5 text-gray-500" />
                                        )
                                            :
                                            (
                                                <EyeOff className="size-5 text-gray-500" />
                                            )
                                    }

                                </button>
                            </div>
                        </div>

                        <div className="flex flex-col gap-y-1 items-center justify-center w-full">
                            <label className="w-full text-left text-black font-bold" htmlFor="newPassword">
                                Contraseña nueva
                            </label>
                            <div className="border border-gray-500 w-full rounded-md flex items-center justify-center px-4 py-1">
                                <input
                                    className="font-normal text-base placeholder:text-gray-300 outline-none focus-visible:border-gray-800 w-full"
                                    id="newPassword"
                                    value={newContraseña}
                                    type={isActiveNewPassword ? "text" : "password"}
                                    onChange={(e) => {
                                        setNewContraseña(e.target.value);
                                        setEditedUser({ ...editedUser, contraseña: e.target.value });
                                    }}
                                    minLength={8}
                                    maxLength={20}
                                />
                                <button
                                    type="button"
                                    onClick={() => setIsActiveNewPassword(!isActiveNewPassword)}
                                >

                                    {
                                        isActiveNewPassword ? (
                                            <Eye className="size-5 text-gray-500" />
                                        )
                                            :
                                            (
                                                <EyeOff className="size-5 text-gray-500" />
                                            )
                                    }

                                </button>
                            </div>
                        </div>

                        <div className="mt-6.25 flex justify-center">
                            <button
                                type="submit"
                                className="w-full md:w-auto border border-gray-300 py-2 px-4 bg-slate-50/75 dark:bg-slate-950 dark:border-slate-800 rounded-md flex items-center justify-center gap-x-4 font-bold hover:bg-slate-100/65 transition-all duration-200"
                                aria-label="Close"
                            >
                                <Save className="size-5" />
                                Modificar perfil
                            </button>
                        </div>
                    </form>
                ))}
                <DialogClose
                    onClick={() => {
                        setOpen(false)
                        navigate(location.pathname, { replace: true });
                        reset();
                    }}
                    className="absolute right-4 top-4"
                    asChild
                >
                    <X className="size-5" />
                </DialogClose>
            </DialogContent>
        </Dialog>
    )
}

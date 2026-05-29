import { getFileBackup } from "@/apis/backupAndRestore.apis";
import RestoreBackup from "@/components/backupAndRestore/RestoreBackup";
import AlertDialogDelete from "@/components/ui-components/AlertDialogDelete";
import { AlertDialog } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import type { AuthPermissions } from "@/types/auth.interface";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Database, MessageCircleQuestion } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function BackupAndRestoreView({ dataAuth }: { dataAuth: AuthPermissions }) {
    const [openAlertDialog, setOpenAlertDialog] = useState(false)

    const { data } = useQuery({
        queryKey: ["backup"],
        queryFn: getFileBackup,
    });

    const handleChangeState = (state: boolean) => {
        if (state == true) {
            handleCopyDatabase()
        }
    }

    const queryClient = useQueryClient()
    const handleCopyDatabase = async () => {
        try {
            const date = new Date();
            const url = window.URL.createObjectURL(new Blob([data.data]));
            const a = document.createElement("a");
            a.href = url;
            a.download = "backup_" + date.getDate() + "_" + (date.getMonth() + 1) + "_" + date.getFullYear() + "_" + date.getHours() + "-" + date.getMinutes() + "-" + date.getSeconds() + ".sql";
            document.body.appendChild(a);
            a.click();
            a.remove();

            window.URL.revokeObjectURL(url);
            queryClient.invalidateQueries({ queryKey: ["backup", "backups"] })
        } catch (error) {
            let errorMessage = "";

            if (error instanceof Error) {
                errorMessage = error.message
            }

            toast.success(`Error al generar el archivo: ${errorMessage || "Error desconocido"}`, {
                position: "top-right",
                closeButton: true,
                action: {
                    label: "Cerrar",
                    onClick: () => toast.dismiss()
                }
            });
        }
    }

    return (
        <>
            {
                dataAuth.tipo_usuario == import.meta.env.VITE_TYPEFROM_USER ?
                    (
                        <div className="h-full w-full flex items-center justify-center flex-col md:flex-row gap-y-6 md:gap-x-12">
                            <div className="border border-gray-300 dark:border-gray-700 h-48 w-105 rounded-lg flex items-end justify-between gap-x-4 p-4">
                                <img className="size-40 object-fill drop-shadow-lg drop-shadow-gray-700 darK:drop-shadow-gray-200" src="backup.svg" alt="backup" />
                                <Button
                                    variant="ghost"
                                    className="flex items-center justify-center gap-x-4 rounder-lg border border-gray-300 dark:border-gray-700 py-2 px-4"
                                    onClick={() => setOpenAlertDialog(true)}
                                >
                                    <Database className="size-5" />
                                    Crear copia
                                </Button>
                            </div>
                            <div className="border border-gray-300 dark:border-gray-700 h-48 w-105 rounded-lg flex items-end justify-between gap-x-4 p-4">
                                <img className="size-40 object-fill drop-shadow-lg drop-shadow-gray-700 darK:drop-shadow-gray-200" src="restore.svg" alt="backup" />
                                <RestoreBackup />
                            </div>


                            {
                                openAlertDialog == true && (
                                    <AlertDialog open={openAlertDialog} onOpenChange={() => setOpenAlertDialog(false)}>
                                        <AlertDialogDelete
                                            icon={MessageCircleQuestion}
                                            title="Crear copia de seguridad"
                                            description={`¿Seguro deseas crear la copia de seguridad?`}
                                            buttonCancel="¡No, crear!"
                                            buttonConfirm="¡Si, crear!"
                                            onClickConfirm={handleChangeState}
                                        />
                                    </AlertDialog>
                                )
                            }
                        </div>
                    )
                    :
                    (null)
            }

        </>

    )
}
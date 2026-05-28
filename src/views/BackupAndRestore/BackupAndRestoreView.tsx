import { Button } from "@/components/ui/button";
import type { AuthPermissions } from "@/types/auth.interface";
import { Database, DatabaseBackup } from "lucide-react";

export default function BackupAndRestoreView({ dataAuth }: { dataAuth: AuthPermissions }) {
    return (
        <>
            {
                dataAuth.tipo_usuario == import.meta.env.VITE_TYPEFROM_USER ?
                    (
                        <div className="h-full w-full flex items-center justify-center flex-col md:flex-row gap-y-6 md:gap-x-12">
                            <div className="border border-gray-300 dark:border-gray-700 h-48 w-105 rounded-lg flex items-end justify-between gap-x-4 p-4">
                                <img className="size-40 object-fill drop-shadow-lg drop-shadow-gray-700 darK:drop-shadow-gray-200" src="backup.svg" alt="backup" />
                                <Button variant="ghost" className="flex items-center justify-center gap-x-4 rounder-lg border border-gray-300 dark:border-gray-700 py-2 px-4">
                                    <Database className="size-5" />
                                    Crear copia
                                </Button>
                            </div>
                            <div className="border border-gray-300 dark:border-gray-700 h-48 w-105 rounded-lg flex items-end justify-between gap-x-4 p-4">
                                <img className="size-40 object-fill drop-shadow-lg drop-shadow-gray-700 darK:drop-shadow-gray-200" src="restore.svg" alt="backup" />
                                <Button variant="ghost" className="flex items-center justify-center gap-x-4 rounder-lg border border-gray-300 dark:border-gray-700 py-2 px-4">
                                    <DatabaseBackup className="size-5" />
                                    Resturar
                                </Button>
                            </div>
                        </div>
                    )
                    :
                    (null)
            }

        </>

    )
}
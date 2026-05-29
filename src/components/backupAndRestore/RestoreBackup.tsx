import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef, useState, type ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Database, DatabaseBackup, File, FileMinus, FileUp, UploadCloud } from "lucide-react";
import type { ErrorData } from "@/types/errors.interface";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { createRestore } from "@/apis/backupAndRestore.apis";
import ErrorMessage from "../error-message";

export default function RestoreBackup() {
    const navigate = useNavigate();
    const location = useLocation();

    const [open, setOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null)
    const fileinputRef = useRef<HTMLInputElement>(null)

    const handleFile = (file: File) => {
        const allowedTypes = ".sql";
        const maxFileSize = 10 * 1024 * 1024; // 5 MB en bytes

        // 1. Validar la extensión del archivo
        if (!file.name.toLowerCase().endsWith(allowedTypes)) {
            setSelectedFile(null);

            toast.success("Por favor, seleccione un archivo con el formato correcto (SQL).", {
                position: "top-right",
                closeButton: true,
                action: {
                    label: "Cerrar",
                    onClick: () => toast.dismiss()
                }
            });
            return;
        }

        // 2. Validar el tamaño del archivo
        if (file.size > maxFileSize) {
            setSelectedFile(null);
            toast.success("El tamaño del archivo debe ser como máximo 5MB.", {
                position: "top-right",
                closeButton: true,
                action: {
                    label: "Cerrar",
                    onClick: () => toast.dismiss()
                }
            });
            return;
        }


        const reader = new FileReader();

        setSelectedFile(file);
        setError(null);
        reader.readAsDataURL(file);
    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            handleFile(file)
        }
    }

    const handleSelectClick = () => {
        fileinputRef.current?.click();
    }

    const queryClient = useQueryClient()

    const { mutate } = useMutation({
        mutationFn: createRestore,
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
            queryClient.invalidateQueries({ queryKey: ["restore"] });
            toast.success(data, {
                position: "top-right",
                closeButton: true,
                action: {
                    label: "Cerrar",
                    onClick: () => toast.dismiss()
                }
            });
            navigate(location.pathname, { replace: true });
            onClickClearForm();
        }
    })

    const {
        handleSubmit,
        reset
    } = useForm();

    function onClickClearForm() {

        reset();
        setOpen(false);
    }

    const onSubmitRestoreBasckup = () => {
        const formData = new FormData();
        formData.append("backup", selectedFile!)
        mutate(formData);
    }
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger>
                <Button
                    variant="ghost"
                    className="flex items-center justify-center w-auto gap-x-4 rounder-lg border border-gray-300 dark:border-gray-700 py-2 px-4"
                    onClick={() => {
                        navigate(location.pathname + "?createRestore");
                        setOpen(true);
                    }}
                >
                    <DatabaseBackup className="size-5" />
                    Restaurar
                </Button>
            </DialogTrigger>
            <DialogContent className="w-full md:max-w-md">
                <DialogHeader>
                    <DialogTitle>Restaurar base de datos</DialogTitle>
                    <DialogDescription>
                        Resturación de la base de datos desde una copia de seguridad...
                    </DialogDescription>
                </DialogHeader>
                <form
                    onSubmit={handleSubmit(onSubmitRestoreBasckup)}
                    className="space-y-3"
                >
                    <div className="w-full md:mt-4 mx-auto p-4 md:p-6 rounded-lg shadow-md">
                        {

                            selectedFile ? (
                                null
                            )
                                :
                                (
                                    <>
                                        <h2 className="text-2xl font-bold mb-4">Subir archivo</h2>
                                        <div
                                            className="mb-4 border-2 border-dashed rounded-lg p-4 text-center border-gray-300 dark:border-gray-700"
                                        >
                                            <input
                                                type="file"
                                                accept=".sql"
                                                onChange={handleFileChange}
                                                ref={fileinputRef}
                                                className="hidden"
                                            />
                                            {selectedFile ? (
                                                <div className="space-y-2">
                                                    <File className="mx-auto h-12 w-12" />
                                                    <p className="text-sm">
                                                        {(selectedFile as File).name}
                                                    </p>
                                                </div>
                                            ) : (
                                                <div className="space-y-2">
                                                    <UploadCloud className="mx-auto h-12 w-12" />
                                                    <p className="text-sm">
                                                        Clic en seleccionar un archivo
                                                    </p>
                                                </div>
                                            )}
                                            <button type="button" onClick={handleSelectClick} className="w-full md:w-auto py-1 px-2 flex items-center justify-center gap-x-4 font-bold text-base mx-auto border border-gray-300 dark:border-gray-700 rounded-md">
                                                <FileUp className="size-6" />
                                                Selecciona archivo aquí
                                            </button>
                                        </div>
                                    </>
                                )
                        }
                        {error && (
                            <ErrorMessage>{error}</ErrorMessage>
                        )}
                        {selectedFile && (
                            <div>
                                <p className="text-sm mb-2">Vista previa:</p>
                                <div className="relative w-full object-contain rounded-md overflow-hidden flex items-center justify-center flex-col">
                                    <Database className="size-10" />
                                    <h3>{selectedFile.name}</h3>
                                </div>


                                {
                                    selectedFile != null ?
                                        (
                                            <div className="flex items-center mt-4 gap-y-4 md:gap-x-2 flex-col md:flex-row">
                                                <button
                                                    disabled={selectedFile != null ? false : true}
                                                    type="button"
                                                    className="w-full md:w-56 py-1 px-2 flex items-center justify-center gap-x-4 font-bold text-base mx-auto border border-gray-300 dark:border-gray-700 rounded-md"
                                                    onClick={() => setSelectedFile(null)}
                                                >
                                                    <FileMinus className="size-5" />
                                                    Remover archivo
                                                </button>
                                            </div>
                                        )
                                        :
                                        (null)
                                }
                            </div>
                        )}
                    </div>

                    <Button
                        variant="outline"
                        type="submit"
                        className="w-full mt-4 md:w-[50%] mx-auto border border-gray-300 dark:border-gray-700 py-2 px-4 rounded-md flex items-center justify-center gap-x-4 font-bold"
                        aria-label="Close"
                    >
                        <DatabaseBackup className="size-5" />
                        Restaurar
                    </Button>

                </form>
            </DialogContent>
        </Dialog>
    )
}

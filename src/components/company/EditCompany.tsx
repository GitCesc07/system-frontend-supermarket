import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef, useState, type ChangeEvent, type DragEvent } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { ImageIcon, ImageOff, ImageUp, Save, Upload, X } from "lucide-react";
import type { ErrorData } from "@/types/errors.interface";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { updateCompany } from "@/apis/company.apis";
import type { CompanyFormDataAdd, CompanyFormDataInfo } from "@/types/company.interface";
import { uploadImage } from "@/apis/products.apis";
import ErrorMessage from "../error-message";

type EditCompanyProps = {
    company: CompanyFormDataInfo;
    onClose: () => void
}

export default function EditCompany({ company, onClose }: EditCompanyProps) {
    const navigate = useNavigate()
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    const companyId = queryParams.get("editCompany")!

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileinputRef = useRef<HTMLInputElement>(null);
    const [imageUpload, setImageUpload] = useState(false);

    const [editCompany, setEditCompany] = useState(company);

    const handleFile = (file: File) => {
        const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/avif'];
        const maxFileSize = 2 * 1024 * 1024; // 2 MB en bytes

        // 1. Validar el tipo de archivo
        if (!allowedTypes.includes(file.type)) {
            setSelectedFile(null);
            setPreviewUrl(null);
            toast.success("Por favor, seleccione un archivo con el formato de imagen (PNG o JPG)", {
                position: "top-right",
                closeButton: true,
                action: {
                    label: "Cerrar  todas",
                    onClick: () => toast.dismiss()
                }
            });
            return;
        }

        // 2. Validar el tamaño del archivo
        if (file.size > maxFileSize) {
            setSelectedFile(null);
            setPreviewUrl(null);
            toast.success("El tamaño de la imagen debe ser como máximo 4MB.", {
                position: "top-right",
                closeButton: true,
                action: {
                    label: "Cerrar  todas",
                    onClick: () => toast.dismiss()
                }
            });
            return;
        }

        // 3. Validar las dimensiones de la imagen
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const maxWidth = 1600;
                const maxHeight = 1400;

                if (img.width > maxWidth || img.height > maxHeight) {
                    setSelectedFile(null);
                    setPreviewUrl(null);
                    toast.success(`Las dimensiones máximas permitidas son ${maxWidth}x${maxHeight} píxeles.`, {
                        position: "top-right",
                        closeButton: true,
                        action: {
                            label: "Cerrar  todas",
                            onClick: () => toast.dismiss()
                        }
                    });
                } else {
                    // Si todas las validaciones pasan, se establece el archivo
                    setSelectedFile(file);
                    setPreviewUrl(URL.createObjectURL(file));
                    setError(null);
                }
            };
            img.src = e.target?.result as string;
        };
        reader.readAsDataURL(file);
    };

    const { mutate: mutateUpload } = useMutation({
        mutationFn: uploadImage,
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
            queryClient.invalidateQueries({ queryKey: ["company"] });
            toast.success(data.message, {
                position: "top-right",
                closeButton: true,
                action: {
                    label: "Cerrar  todas",
                    onClick: () => toast.dismiss()
                }
            });

            // eslint-disable-next-line react-hooks/immutability
            editCompany.logotipo = data.result.publicUrl;
            setImageUpload(true);
        }
    })

    const onclickUploadImage = async (data: File) => {
        const formData = new FormData();
        formData.append("image", data)
        mutateUpload(formData)
    }

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            handleFile(file)
        }
    }

    const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault()
        setIsDragging(false)
    }

    const handleDrop = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault()
        setIsDragging(false)
        const file = event.dataTransfer.files?.[0]
        if (file) {
            handleFile(file)
        }
    }

    const handleSelectClick = () => {
        fileinputRef.current?.click()
    }

    const queryClient = useQueryClient()

    const { mutate } = useMutation({
        mutationFn: updateCompany,
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
            queryClient.invalidateQueries({ queryKey: ["company"] });
            toast.success(data, {
                position: "top-right",
                closeButton: true,
                action: {
                    label: "Cerrar  todas",
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
    } = useForm<CompanyFormDataAdd>({ defaultValues: editCompany });

    function onClickClearForm() {
        reset();
        onClose();
    }

    const onSubmitCreateCompany = () => {
        const formData = editCompany;
        const dataCompany = { companyId, formData };
        mutate(dataCompany);
    }
    return (
        <DialogContent className="[&>button]:hidden w-full md:max-w-md h-[95%] scrollbar-thin-custom scroll-smooth mx-auto touch-pan-y overflow-scroll">
            <DialogHeader>
                <DialogTitle>Registrar empresa</DialogTitle>
                <DialogDescription>
                    Registra la información de tu empresa aquí...
                </DialogDescription>
            </DialogHeader>

            <div className="w-full md:mt-4 mx-auto p-4 md:p-6 bg-gray-100 dark:bg-gray-950 rounded-lg shadow-md">
                {

                    selectedFile ? (
                        null
                    )
                        :
                        (
                            <>
                                <h2 className="text-2xl font-bold mb-4">Subir imagen</h2>
                                <div
                                    className={`mb-4 border-2 border-dashed rounded-lg p-4 text-center ${isDragging ? 'border-primary bg-primary/10' : 'border-gray-300'
                                        }`}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                >
                                    <input
                                        type="file"
                                        accept=".png, .jpg, .jpeg, .webp, .avif"
                                        onChange={handleFileChange}
                                        ref={fileinputRef}
                                        className="hidden"
                                    />
                                    {selectedFile ? (
                                        <div className="space-y-2">
                                            <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                                            <p className="text-sm text-gray-500">
                                                {(selectedFile as File).name}
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                            <p className="text-sm">
                                                Arrastras y soltar la imagen aquí, o clic en seleccionar la imagen
                                            </p>
                                        </div>
                                    )}
                                    <button type="button" onClick={handleSelectClick} className="w-full md:w-auto py-1 px-2 flex items-center justify-center gap-x-4 font-bold text-base mx-auto border border-gray-300 rounded-md">
                                        <ImageUp className="size-6" />
                                        Selecciona imagen aquí
                                    </button>
                                </div>
                            </>
                        )
                }
                {error && (
                    <ErrorMessage>{error}</ErrorMessage>
                )}
                {selectedFile && previewUrl && (
                    <div>
                        <p className="text-sm mb-2">Vista previa:</p>
                        <div className="relative mx-auto size-40 object-contain rounded-md overflow-hidden">
                            <img
                                loading="lazy"
                                draggable="false"
                                src={previewUrl}
                                alt="Preview"
                                style={{ objectFit: 'cover' }}
                            />
                        </div>


                        {
                            imageUpload == false ?
                                (
                                    <div className="flex items-center mt-4 gap-y-4 md:gap-x-2 flex-col md:flex-row">
                                        <button
                                            disabled={imageUpload ? true : false}
                                            type="button"
                                            className="w-full md:w-56 py-1 px-2 flex items-center justify-center gap-x-4 font-bold text-base mx-auto border border-gray-300 dark:border-gray-700 rounded-md"
                                            onClick={() => setSelectedFile(null)}
                                        >
                                            <ImageOff className="size-5" />
                                            Remover imagen
                                        </button>
                                        <button
                                            type="button"
                                            className="w-full md:w-56 py-1 px-2 flex items-center justify-center gap-x-4 font-bold text-base mx-auto border border-gray-300 dark:border-gray-700 rounded-md"
                                            onClick={() => onclickUploadImage(selectedFile)}
                                        >
                                            <ImageUp className="size-5" />
                                            Subir imagen
                                        </button>
                                    </div>
                                )
                                :
                                (null)
                        }
                    </div>
                )}
            </div>

            <form
                onSubmit={handleSubmit(onSubmitCreateCompany)}
                className="space-y-3"
            >
                <div className="w-full">
                    <label className="w-full text-left font-bold" htmlFor="nombre_empresa">
                        Empresa
                    </label>
                    <input
                        className="py-1 px-4 font-normal text-base border border-gray-500 w-full rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
                        placeholder="Nombre de la empresa..."
                        id="nombre_empresa"
                        value={editCompany.nombre_empresa}
                        onChange={(e) => {
                            setEditCompany({ ...editCompany, nombre_empresa: e.target.value });
                        }}
                        minLength={3}
                        maxLength={50}
                        required
                    />
                </div>

                <div className="w-full">
                    <label className="w-full text-left font-bold" htmlFor="eslogan">
                        Eslogan
                    </label>
                    <input
                        className="py-1 px-4 font-normal text-base border border-gray-500 w-full rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
                        placeholder="Eslogan de tu empresa..."
                        id="eslogan"
                        value={editCompany.eslogan}
                        onChange={(e) => {
                            setEditCompany({ ...editCompany, eslogan: e.target.value });
                        }}
                        minLength={5}
                        maxLength={150}
                    />
                </div>

                <div className="w-full">
                    <label className="w-full text-left font-bold" htmlFor="direccion_empresa">
                        Dirección empresa
                    </label>
                    <input
                        className="py-1 px-4 font-normal text-base border border-gray-500 w-full rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
                        placeholder="Dirección de tu empresa..."
                        id="direccion_empresa"
                        value={editCompany.direccion_empresa}
                        onChange={(e) => {
                            setEditCompany({ ...editCompany, direccion_empresa: e.target.value });
                        }}
                        minLength={5}
                        maxLength={200}
                    />
                </div>

                <div className="w-full">
                    <label className="w-full text-left font-bold" htmlFor="ruc">
                        RUC
                    </label>
                    <input
                        className="py-1 px-4 font-normal text-base border border-gray-500 w-full rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
                        placeholder="RUC de tu empresa..."
                        id="ruc"
                        value={editCompany.ruc}
                        onChange={(e) => {
                            setEditCompany({ ...editCompany, ruc: e.target.value });
                        }}
                        minLength={5}
                        maxLength={16}
                    />
                </div>

                <div className="w-full">
                    <label className="w-full text-left font-bold" htmlFor="telefono_empresa">
                        Telefono empresa
                    </label>
                    <input
                        className="py-1 px-4 font-normal text-base border border-gray-500 w-full rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
                        placeholder="Telefono de tu empresa..."
                        id="telefono_empresa"
                        value={editCompany.telefono_empresa}
                        type="number"
                        onChange={(e) => {
                            setEditCompany({ ...editCompany, telefono_empresa: e.target.value });
                        }}
                        minLength={8}
                        maxLength={8}
                    />
                </div>

                <div className="w-full">
                    <label className="w-full text-left font-bold" htmlFor="celular_empresa">
                        Celular empresa
                    </label>
                    <input
                        className="py-1 px-4 font-normal text-base border border-gray-500 w-full rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
                        placeholder="Celular de tu empresa..."
                        id="celular_empresa"
                        type="number"
                        value={editCompany.celular_empresa}
                        onChange={(e) => {
                            setEditCompany({ ...editCompany, celular_empresa: e.target.value });
                        }}
                        minLength={8}
                        maxLength={8}
                    />
                </div>

                <div className="w-full">
                    <label className="w-full text-left font-bold" htmlFor="correo_empresa">
                        Correo empresa
                    </label>
                    <input
                        className="py-1 px-4 font-normal text-base border border-gray-500 w-full rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
                        placeholder="Correo de tu empresa..."
                        id="correo_empresa"
                        type="email"
                        value={editCompany.correo_empresa}
                        onChange={(e) => {
                            setEditCompany({ ...editCompany, correo_empresa: e.target.value });
                        }}
                        minLength={8}
                        maxLength={200}
                    />
                </div>

                <Button
                    variant="outline"
                    type="submit"
                    className="w-full mt-4 md:w-[50%] mx-auto border border-gray-300 dark:border-gray-800 py-2 px-4 rounded-md flex items-center justify-center gap-x-4 font-bold"
                    aria-label="Close"
                >
                    <Save className="size-5" />
                    Guardar información empresa
                </Button>

            </form>

            <DialogClose
                onClick={() => {
                    navigate(location.pathname, { replace: true });
                    reset();
                    // onClose();
                }}
                className="absolute right-4 top-4"
                asChild
            >
                <X className="size-5" />
            </DialogClose>
        </DialogContent>
    )
}

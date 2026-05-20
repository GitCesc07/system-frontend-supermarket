import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef, useState, type ChangeEvent, type DragEvent } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { ChevronDown, ChevronUp, ImageIcon, ImageOff, ImageUp, Plus, Save, Search, Upload } from "lucide-react";
import type { ErrorData } from "@/types/errors.interface";
import { toast } from "sonner";
import { stateValue } from "@/types/state.interface";
import type { ProductFormDataAdd } from "@/types/products.interface";
import { createProduct } from "@/apis/products.apis";
import ErrorMessage from "../error-message";
import { getBrands } from "@/apis/brand.apis";

export default function Createproduct() {
    const navigate = useNavigate();
    const location = useLocation();

    const today = new Date().toISOString().split("T")[0];

    const [open, setOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileinputRef = useRef<HTMLInputElement>(null);
    const [imageUpload, setImageUpload] = useState(false);
    const [expirationActive, setExpirationActive] = useState(0);


    const { data: dataBrands, refetch: refetchBrand } = useQuery({
        queryKey: ["products"],
        queryFn: getBrands,
    });

    const [openComboBoxBrand, setOpenComboBoxBrand] = useState(false);
    const [searchTermBrand, setSearchTermBrand] = useState("");
    const filteredBrands = Object.values(dataBrands || {}).filter(brand =>
        Object.values(brand).some(value =>
            value.toString().toLowerCase().includes(searchTermBrand.toLowerCase())
        )
    );


    const [newProduct, setNewProduct] = useState({
        nombre_producto: "",
        descripcion_producto: "",
        precio_compra: "0",
        cantidad_minima: 0,
        imagen_url: "",
        estado: 1,
        expiracion: 0,
        fecha_expiracion: "",
        id_marca: "",
        id_categoria: "",
        usuario_creador: "",
    })

    const queryClient = useQueryClient()
    const { mutate } = useMutation({
        mutationFn: createProduct,
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
            queryClient.invalidateQueries({ queryKey: ["products"] });
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
    } = useForm<ProductFormDataAdd>({ defaultValues: newProduct });


    const handleFile = (file: File) => {
        const allowedTypes = ['image/jpeg', 'image/png'];
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

    const onclickUploadImage = async (data: File) => {
        const imgAPIKey = import.meta.env.VITE_IMGBB_API_KEY;

        const formData = new FormData();
        formData.append("image", data)
        const url = import.meta.env.VITE_IMGBB_URL + `=${imgAPIKey}`;
        await fetch(url, {
            method: "POST",
            body: formData
        })
            .then(res => res.json())
            .then(result => {
                newProduct.imagen_url = result.data?.url;
            })

        MySwal.fire({
            position: "center",
            title: "Imagen",
            icon: "success",
            html:
                <div className="flex flex-col items-center">
                    <p className="text-cyan-500 font-bold">
                        Imagen subida correctamente...
                    </p>
                </div>
            ,
            showConfirmButton: false,
            timer: 2000
        });
        setImageUpload(true);
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

    function onClickClearForm() {
        setNewProduct({
            nombre_producto: "",
            descripcion_producto: "",
            precio_compra: "0",
            cantidad_minima: 0,
            imagen_url: "",
            estado: 1,
            expiracion: 0,
            fecha_expiracion: "",
            id_marca: "",
            id_categoria: "",
            usuario_creador: "",
        })
        reset();
        setOpen(false);
    }

    const onsubmitCreateProduct = () => {
        const data = newCustomer;
        mutate(data);
    }
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger
                className="flex items-center justify-center gap-x-4 border border-gray-300 dark:border-gray-800 bg-gray-100 dark:bg-gray-900 rounded-lg py-1 px-2 w-full md:w-auto"
                onClick={() => {
                    navigate(location.pathname + "?createProduct");
                    setOpen(true);
                }}
            >
                <Plus className="size-5" />
                Crear producto
            </DialogTrigger>
            <DialogContent className="w-full md:max-w-md h-[95%] md:max-h-[95%] scrollbar-thin-custom scroll-smooth mx-auto touch-pan-y overflow-scroll">
                <DialogHeader>
                    <DialogTitle>Crear producto</DialogTitle>
                    <DialogDescription>
                        Crea tus productos aquí...
                    </DialogDescription>
                </DialogHeader>

                <div className="w-full md:mt-4 mx-auto p-4 md:p-6 bg-white rounded-lg shadow-md">
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
                                            accept=".png, .jpg, .jpeg"
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
                                                <p className="text-sm text-gray-500">
                                                    Arrastras y soltar la imagen aquí, o clic en seleccionar la imagen
                                                </p>
                                            </div>
                                        )}
                                        <button type="button" onClick={handleSelectClick} className="w-full bg-white md:w-auto py-1 px-2 flex items-center justify-center gap-x-4 font-bold text-base mx-auto border border-gray-300 focus-visible:border-gray-400 rounded-md">
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
                            <p className="text-sm text-gray-500 mb-2">Vista previa:</p>
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
                                                className="w-full bg-white md:w-56 py-1 px-2 flex items-center justify-center gap-x-4 font-bold text-base mx-auto border border-gray-300 focus-visible:border-gray-400 rounded-md"
                                                onClick={() => setSelectedFile(null)}
                                            >
                                                <ImageOff className="size-5" />
                                                Remover imagen
                                            </button>
                                            <button
                                                type="button"
                                                className="w-full bg-white md:w-56 py-1 px-2 flex items-center justify-center gap-x-4 font-bold text-base mx-auto border border-gray-300 focus-visible:border-gray-400 rounded-md"
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

                <form onSubmit={handleSubmit(onsubmitCreateProduct)} className="space-y-4 scroll-smooth mx-auto touch-pan-y md:px-2 py-4 w-full">

                    <fieldset className="border border-gray-300 rounded-lg p-2">
                        <legend className="uppercase font-bold">Datos del productos</legend>
                        {/* Nombre producto */}
                        <div>
                            <label className="font-bold" htmlFor="nombre_producto">Producto:</label>
                            <input
                                className="border border-gray-400 rounded-md py-1 px-2 w-full outline-none focus-visible:border-gray-600 mt-1"
                                placeholder="Ejemplo: Pinzx puntxx..."
                                id="nombre_producto"
                                value={newProduct.nombre_producto}
                                required
                                onChange={(e) => setNewProduct({ ...newProduct, nombre_producto: e.target.value })}
                                minLength={2}
                                maxLength={80}
                            />
                        </div>

                        {/* descripción del producto */}
                        <div>
                            <label className="font-bold" htmlFor="descripcion_producto">Descripción del Producto:</label>
                            <textarea
                                className="border border-gray-400 rounded-md py-1 px-2 w-full outline-none focus-visible:border-gray-600 mt-1"
                                placeholder="Ejemplo: Información del producto..."
                                id="descripcion_producto"
                                value={newProduct.descripcion_producto}
                                onChange={(e) => setNewProduct({ ...newProduct, descripcion_producto: e.target.value })}
                                minLength={5}
                                maxLength={180}
                            />
                        </div>
                    </fieldset>

                    <fieldset className="flex items-center justify-center gap-4 w-full md:flex-row flex-col border border-gray-300 rounded-lg p-2">
                        <legend className="font-bold uppercase">Valores de productos</legend>
                        {/* Cantidad minima */}
                        <div className="w-full">
                            <label className="font-bold" htmlFor="cantidad_minima">Cantidad minima:</label>
                            <input
                                className="border border-gray-400 rounded-md py-1 px-2 w-full outline-none focus-visible:border-gray-600 mt-1"
                                placeholder="Ejemplo: 2xxx..."
                                id="cantidad_minima"
                                type='number'
                                value={newProduct.cantidad_minima}
                                onChange={(e) => setNewProduct({ ...newProduct, cantidad_minima: +e.target.value })}
                            />
                        </div>
                    </fieldset>

                    <fieldset className="w-full border border-gray-300 rounded-lg p-2">
                        <legend className="font-bold uppercase">Expiración del producto</legend>
                        <div className="flex items-start md:items-center md:flex-row flex-col gap-y-4 md:gap-x-14 md:justify-center">

                            {/* Expiración */}
                            <div className="md:w-full flex gap-x-3 items-center flex-row-reverse">
                                <label className="font-bold" htmlFor="expiracion">Expiración</label>
                                <input
                                    placeholder="Ejemplo: 2022-01-01"
                                    className=" size-4"
                                    id="expiracion"
                                    type='checkbox'
                                    value={newProduct.expiracion ? "checked" : "unchecked"}
                                    onChange={(e) => {
                                        setExpirationActive(+e.target.checked)
                                        setNewProduct({ ...newProduct, expiracion: +e.target.checked })
                                    }}
                                />
                            </div>

                            <div className="w-full">

                                {/* Fecha de Expiración */}
                                <input
                                    disabled={expirationActive === 0 ? true : false}
                                    type="date"
                                    className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-gray-400 block w-full ps-10 p-2.5 outline-none ${expirationActive === 0 && "cursor-not-allowed"}`}
                                    value={newProduct.fecha_expiracion}
                                    onChange={(e) => {
                                        setNewProduct({ ...newProduct, fecha_expiracion: e.target.value });
                                    }}
                                    min={today}
                                />
                            </div>
                        </div>
                    </fieldset>


                    <fieldset className="w-full flex items-center justify-center gap-4 md:flex-row flex-col border border-gray-400 p-4 rounded-lg">
                        <legend className="font-bold uppercase">Estado del producto</legend>
                        <div className="w-full">
                            <label className="font-bold" htmlFor="estado">Estado:</label>
                            <select
                                onChange={(e) => {
                                    setNewProduct({ ...newProduct, estado: +e.target.value })
                                }}
                                name=""
                                id="estado"
                                className="w-full bg-gray-50 border border-gray-300 hover:border-gray-500 py-2 px-4 rounded-md">
                                {
                                    stateValue.map(item => (
                                        <option className="py-0 px-4 bg-slate-50"
                                            key={item.value}
                                            value={item.value}
                                            defaultValue={1}
                                        >
                                            {
                                                item.label
                                            }
                                        </option>
                                    ))
                                }
                            </select>
                        </div>
                    </fieldset>

                    {/* Marca */}
                    <fieldset className="w-full flex items-center justify-center flex-col border border-gray-400 p-4 rounded-lg">
                        <legend className="uppercase font-bold">Marca</legend>
                        <div className="w-full mt-4 gap-Y-2 flex-col flex items-start">
                            <label htmlFor="nombre_marca" className="font-bold mb-1">Marca:</label>
                            <div className={`w-full mx-auto flex items-center justify-center md:justify-between border border-gray-400 py-1 px-2 cursor-pointer ${openComboBoxBrand == true ? "rounded-t-md" : "rounded-md"}`}
                                onClick={() => {
                                    setOpenComboBoxBrand(!openComboBoxBrand)
                                    refetchBrand();
                                }}
                            >
                                <span className="cursor-pointer">Selecciona impresora</span>

                                {
                                    openComboBoxBrand == true ?
                                        (
                                            <ChevronUp className="size-5" />
                                        )
                                        :
                                        (
                                            <ChevronDown className="size-5" />
                                        )
                                }
                            </div>
                            {
                                openComboBoxBrand == true ?
                                    (
                                        <div className={`w-full top-0 right-0 h-32 sticky mx-auto bg-white overflow-auto touch-pan-y scrollbar-thin-custom transition-all duration-700 ease-in-out ${openComboBoxBrand == true ? "opacity-100 translate-y-0" : "opacity-0 translate-y-0 hidden"}`}>
                                            <ul className="rounded-b-lg border border-gray-400">
                                                <>
                                                    <div className="w-full border-b border-gray-400  py-1 px-2 flex items-center gap-x-1">
                                                        <Search className="size-5 text-gray-400" href="search" />
                                                        <input
                                                            id="search"
                                                            type="text"
                                                            value={searchTermBrand}
                                                            onChange={(e) => setSearchTermBrand(e.target.value)}
                                                            placeholder="Buscar..."
                                                            className="w-full border-none outline-none placeholder:text-gray-400"
                                                        />
                                                    </div>

                                                    {
                                                        filteredBrands?.map((printer, index) => (
                                                            <li
                                                                key={index}
                                                                className="hover:bg-gray-300 py-1 px-4 cursor-pointer"
                                                                onClick={() => {
                                                                    setNewProduct({ ...newProduct, id_marca: printer.id });
                                                                    setSearchTermBrand("");
                                                                    setOpenComboBoxBrand(!openComboBoxBrand);
                                                                }}
                                                            >
                                                                {printer.nombre_marca}
                                                            </li>
                                                        ))
                                                    }
                                                </>
                                            </ul>
                                        </div>
                                    )
                                    :
                                    (null)
                            }
                        </div>
                    </fieldset>

                    {/* Categoría */}
                    {/* <fieldset className="w-full flex items-center justify-center flex-col border border-gray-400 p-4 rounded-lg">
                        <legend className="uppercase font-bold">Categoría</legend>
                        <div className="w-full flex items-center justify-center gap-x-2">
                            <CategoryComboBox onSelectionChange={handleSelectionCategory} />
                        </div>

                        <div className="w-full mt-4 gap-Y-2 flex-col flex items-start">
                            <label htmlFor="nombre_categoria" className="font-bold mb-1">Categoría:</label>
                            <input
                                className="w-full border border-gray-400 hover:border-gray-600 outline-none rounded-md py-1 px-2"
                                id="nombre_categoria"
                                value={categoryData == null || categoryData == undefined ? "" : categoryData?.nombre_categoria}
                                type="text"
                                disabled
                                placeholder="Tu categoría aquí..."
                            />
                        </div>
                    </fieldset>                     */}

                    <div className="flex items-center justify-center">
                        <button
                            className="w-full bg-white md:w-56 py-2 px-4 flex items-center justify-center gap-x-6 font-bold text-base border border-gray-400 rounded-lg"
                            type="submit"
                        // onClick={() => {
                        //     setTimeout(() => {
                        //         if (!errors) {
                        //             setOpen(false)
                        //         }
                        //     }, 100);
                        // }}
                        >
                            <Save className="size-5" />
                            Guardar producto
                        </button>
                    </div>
                </form>

            </DialogContent>
        </Dialog >
    )
}

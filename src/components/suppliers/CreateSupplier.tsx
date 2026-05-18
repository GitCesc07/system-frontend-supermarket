import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Plus, Save } from "lucide-react";
import type { ErrorData } from "@/types/errors.interface";
import { toast } from "sonner";
import { createSupplier } from "@/apis/suppliers.apis";
import type { SupplierFormDataAdd } from "@/types/suppliers.interface";
import { stateValue } from "@/types/state.interface";

export default function CreateSupplier() {
    const navigate = useNavigate();
    const location = useLocation();

    const [open, setOpen] = useState(false);

    const [newSupplier, setNewSupplier] = useState({
        codigo_proveedor: '',
        nombre_proveedor: '',
        direccion_proveedor: '',
        ciudad_proveedor: '',
        correo_proveedor: '',
        telefono_proveedor: '',
        celular_proveedor: '',
        ruc: '',
        contacto: '',
        estado: 1,
        usuario_creador: ''
    })

    const queryClient = useQueryClient()

    const { mutate } = useMutation({
        mutationFn: createSupplier,
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
            queryClient.invalidateQueries({ queryKey: ["users"] });
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
    } = useForm<SupplierFormDataAdd>({ defaultValues: newSupplier });

    function onClickClearForm() {
        setNewSupplier({
            codigo_proveedor: '',
            nombre_proveedor: '',
            direccion_proveedor: '',
            ciudad_proveedor: '',
            correo_proveedor: '',
            telefono_proveedor: '',
            celular_proveedor: '',
            ruc: '',
            contacto: '',
            estado: 1,
            usuario_creador: ''
        })
        reset();
        setOpen(false);
    }

    const onSubmitCreateSupplier = () => {
        const data = newSupplier;
        mutate(data);
    }
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger
                className="flex items-center justify-center gap-x-4 border border-gray-300 dark:border-gray-800 bg-gray-100 dark:bg-gray-900 rounded-lg py-1 px-2 w-full md:w-auto"
                onClick={() => {
                    navigate(location.pathname + "?createUser");
                    setOpen(true);
                }}
            >
                <Plus className="size-5" />
                Crear usuario
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Crear usuario</DialogTitle>
                    <DialogDescription>
                        Crea tus usuarios aquí...
                    </DialogDescription>
                </DialogHeader>
                <form
                    onSubmit={handleSubmit(onSubmitCreateSupplier)}
                    className="space-y-3"
                >
                    <div className="flex flex-col md:flex-row items-center justify-center gap-y-4 md:gap-x-4">

                        <div className="w-full">
                            <label className="w-full text-left text-black font-bold" htmlFor="ruc">
                                RUC:
                            </label>
                            <input
                                className="py-1 px-4 font-normal text-base border border-gray-500 w-full rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
                                placeholder="RUC del proveedor..."
                                id="ruc"
                                value={newSupplier.ruc}
                                onChange={(e) => {
                                    setNewSupplier({ ...newSupplier, ruc: e.target.value });
                                }}
                                required
                                minLength={14}
                                maxLength={14}
                            />
                        </div>
                    </div>

                    <div className="w-full">
                        <label className="w-full text-left text-black font-bold" htmlFor="nombre_proveedor">
                            Proveedor:
                        </label>
                        <input
                            className="py-1 px-4 font-normal text-base border border-gray-500 w-full rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
                            placeholder="Proveedor..."
                            id="nombre_proveedor"
                            value={newSupplier.nombre_proveedor}
                            onChange={(e) => {
                                setNewSupplier({ ...newSupplier, nombre_proveedor: e.target.value });
                            }}
                            minLength={5}
                            required
                            maxLength={120}
                        />
                    </div>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-y-4 md:gap-x-4">

                        <div className="w-full">
                            <label className="w-full text-left text-black font-bold" htmlFor="telefono_proveedor">
                                Teléfono:
                            </label>
                            <input
                                className="py-1 px-4 font-normal text-base border border-gray-500 w-full rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
                                placeholder="Teléfono del proveedor..."
                                id="telefono"
                                required
                                value={newSupplier.telefono_proveedor}
                                onChange={(e) => {
                                    setNewSupplier({ ...newSupplier, telefono_proveedor: e.target.value });
                                }}
                                minLength={8}
                                maxLength={8}
                            />
                        </div>

                        <div className="w-full">
                            <label className="w-full text-left text-black font-bold" htmlFor="celular_proveedor">
                                Celular:
                            </label>
                            <input
                                className="py-1 px-4 font-normal text-base border border-gray-500 w-full rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
                                placeholder="Celular del proveedor..."
                                id="celular_proveedor"
                                required
                                value={newSupplier.celular_proveedor}
                                onChange={(e) => {
                                    setNewSupplier({ ...newSupplier, celular_proveedor: e.target.value });
                                }}
                                minLength={8}
                                maxLength={8}
                            />
                        </div>

                    </div>

                    <div className="w-full">
                        <label className="w-full text-left text-black font-bold" htmlFor="direccion_proveedor">
                            Dirección:
                        </label>
                        <input
                            minLength={4}
                            maxLength={190}
                            required
                            className="py-1 px-4 font-normal text-base border border-gray-500 w-full rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
                            placeholder="Dirección del proveedor..."
                            id="direccion_proveedor"
                            value={newSupplier.direccion_proveedor}
                            onChange={(e) => {
                                setNewSupplier({ ...newSupplier, direccion_proveedor: e.target.value });
                            }}
                        />
                    </div>

                    <div className="w-full">
                        <label className="w-full text-left text-black font-bold" htmlFor="ciudad_proveedor">
                            Ciudad:
                        </label>
                        <input
                            minLength={4}
                            required
                            maxLength={190}
                            className="py-1 px-4 font-normal text-base border border-gray-500 w-full rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
                            placeholder="Ciudad del proveedor..."
                            id="ciudad_proveedor"
                            value={newSupplier.ciudad_proveedor}
                            onChange={(e) => {
                                setNewSupplier({ ...newSupplier, ciudad_proveedor: e.target.value });
                            }}
                        />
                    </div>

                    <div className="w-full">
                        <label className="w-full text-left text-black font-bold" htmlFor="correo_proveedor">
                            Correo:
                        </label>
                        <input
                            type="emial"
                            className="py-1 px-4 font-normal text-base border border-gray-500 w-full rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
                            placeholder="Correo del proveedor..."
                            id="correo_proveedor"
                            value={newSupplier.correo_proveedor}
                            onChange={(e) => {
                                setNewSupplier({ ...newSupplier, correo_proveedor: e.target.value });
                            }}
                            minLength={7}
                            required
                            maxLength={100}
                        />
                    </div>

                    <div className="w-full">
                        <label className="w-full text-left text-black font-bold" htmlFor="contacto">
                            Contacto:
                        </label>
                        <input
                            className="py-1 px-4 font-normal text-base border border-gray-500 w-full rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
                            placeholder="Nombre del contacto del proveedor..."
                            id="contacto"
                            required
                            value={newSupplier.contacto}
                            onChange={(e) => {
                                setNewSupplier({ ...newSupplier, contacto: e.target.value });
                            }}
                            minLength={5}
                            maxLength={100}
                        />
                    </div>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-y-4 md:gap-x-4">
                        <div className="w-full flex flex-col md:flex-row items-center justify-center gap-y-4 md:gap-x-4">
                            <div className="w-full flex items-center justify-center flex-col">
                                <label className="w-full text-left text-black font-bold" htmlFor="estado">
                                    Estado:
                                </label>
                                <select
                                    id="estado"
                                    className="w-full border border-gray-400 rounded-md py-1 px-2"
                                    onChange={(e) => {
                                        setNewSupplier({ ...newSupplier, estado: +e.target.value });
                                    }}
                                >
                                    {
                                        stateValue.map((state) => (
                                            <option
                                                key={state.value}
                                                value={state.value}
                                            >
                                                {state.label}
                                            </option>
                                        ))
                                    }
                                </select>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full mt-4 md:w-[50%] mx-auto border border-gray-300 py-2 px-4 bg-slate-50/85 rounded-md flex items-center justify-center gap-x-4 font-bold hover:bg-slate-100/85 transition-all duration-200"
                        aria-label="Close"
                    >
                        <Save className="size-5" />
                        Guardar proveedor
                    </button>

                </form>
            </DialogContent>
        </Dialog>
    )
}

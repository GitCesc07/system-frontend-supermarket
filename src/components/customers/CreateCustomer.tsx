import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Plus, Save } from "lucide-react";
import type { ErrorData } from "@/types/errors.interface";
import { toast } from "sonner";
import type { SupplierFormDataAdd } from "@/types/suppliers.interface";
import { stateValue } from "@/types/state.interface";
import { createCustomer } from "@/apis/customers.interface";

export default function CreateCustomer() {
    const navigate = useNavigate();
    const location = useLocation();

    const [open, setOpen] = useState(false);

    const [newCustomer, setNewCustomer] = useState({
        codigo_cliente: '',
        nombre_cliente: '',
        direccion_cliente: '',
        ciudad_cliente: '',
        correo_cliente: '',
        telefono_cliente: '',
        celular_cliente: '',
        ruc_cliente: '',
        estado: 1,
        usuario_creador: ''
    })

    const queryClient = useQueryClient()

    const { mutate } = useMutation({
        mutationFn: createCustomer,
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
            queryClient.invalidateQueries({ queryKey: ["customers"] });
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
    } = useForm<SupplierFormDataAdd>({ defaultValues: newCustomer });

    function onClickClearForm() {
        setNewCustomer({
            codigo_cliente: '',
            nombre_cliente: '',
            direccion_cliente: '',
            ciudad_cliente: '',
            correo_cliente: '',
            telefono_cliente: '',
            celular_cliente: '',
            ruc_cliente: '',
            estado: 1,
            usuario_creador: ''
        })
        reset();
        setOpen(false);
    }

    const onSubmitCreateSupplier = () => {
        const data = newCustomer;
        mutate(data);
    }
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger
                className="flex items-center justify-center gap-x-4 border border-gray-300 dark:border-gray-800 bg-gray-100 dark:bg-gray-900 rounded-lg py-1 px-2 w-full md:w-auto"
                onClick={() => {
                    navigate(location.pathname + "?createCustomer");
                    setOpen(true);
                }}
            >
                <Plus className="size-5" />
                Crear cliente
            </DialogTrigger>
            <DialogContent className="w-full md:max-w-md">
                <DialogHeader>
                    <DialogTitle>Crear cliente</DialogTitle>
                    <DialogDescription>
                        Crea tus clientees aquí...
                    </DialogDescription>
                </DialogHeader>
                <form
                    onSubmit={handleSubmit(onSubmitCreateSupplier)}
                    className="space-y-3"
                >
                    <div className="flex flex-col md:flex-row items-center justify-center gap-y-4 md:gap-x-4">

                        <div className="w-full">
                            <label className="w-full text-left font-bold" htmlFor="ruc">
                                RUC:
                            </label>
                            <input
                                className="py-1 px-4 font-normal border border-gray-300 dark:border-gray-700 text-base w-full rounded-md placeholder:text-gray-300"
                                placeholder="RUC del cliente..."
                                id="ruc"
                                value={newCustomer.ruc_cliente}
                                onChange={(e) => {
                                    setNewCustomer({ ...newCustomer, ruc_cliente: e.target.value });
                                }}
                                required
                                minLength={14}
                                maxLength={14}
                            />
                        </div>
                    </div>

                    <div className="w-full">
                        <label className="w-full text-left font-bold" htmlFor="nombre_cliente">
                            Cliente:
                        </label>
                        <input
                            className="py-1 px-4 font-normal border border-gray-300 dark:border-gray-700 text-base w-full rounded-md placeholder:text-gray-300"
                            placeholder="cliente..."
                            id="nombre_cliente"
                            value={newCustomer.nombre_cliente}
                            onChange={(e) => {
                                setNewCustomer({ ...newCustomer, nombre_cliente: e.target.value });
                            }}
                            minLength={2}
                            required
                            maxLength={120}
                        />
                    </div>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-y-4 md:gap-x-4">

                        <div className="w-full">
                            <label className="w-full text-left font-bold" htmlFor="telefono_cliente">
                                Teléfono:
                            </label>
                            <input
                                className="py-1 px-4 font-normal text-base border border-gray-300 dark:border-gray-700 w-full rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
                                placeholder="Teléfono del cliente..."
                                id="telefono"
                                required
                                value={newCustomer.telefono_cliente}
                                onChange={(e) => {
                                    setNewCustomer({ ...newCustomer, telefono_cliente: e.target.value });
                                }}
                                minLength={8}
                                maxLength={8}
                            />
                        </div>

                        <div className="w-full">
                            <label className="w-full text-left font-bold" htmlFor="celular_cliente">
                                Celular:
                            </label>
                            <input
                                className="py-1 px-4 font-normal text-base border border-gray-300 dark:border-gray-700 w-full rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
                                placeholder="Celular del cliente..."
                                id="celular_cliente"
                                required
                                value={newCustomer.celular_cliente}
                                onChange={(e) => {
                                    setNewCustomer({ ...newCustomer, celular_cliente: e.target.value });
                                }}
                                minLength={8}
                                maxLength={8}
                            />
                        </div>

                    </div>

                    <div className="w-full">
                        <label className="w-full text-left font-bold" htmlFor="direccion_cliente">
                            Dirección:
                        </label>
                        <input
                            minLength={4}
                            maxLength={190}
                            required
                            className="py-1 px-4 font-normal text-base border border-gray-300 dark:border-gray-700 w-full rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
                            placeholder="Dirección del cliente..."
                            id="direccion_cliente"
                            value={newCustomer.direccion_cliente}
                            onChange={(e) => {
                                setNewCustomer({ ...newCustomer, direccion_cliente: e.target.value });
                            }}
                        />
                    </div>

                    <div className="w-full">
                        <label className="w-full text-left font-bold" htmlFor="ciudad_cliente">
                            Ciudad:
                        </label>
                        <input
                            minLength={4}
                            required
                            maxLength={190}
                            className="py-1 px-4 font-normal text-base border border-gray-300 dark:border-gray-700 w-full rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
                            placeholder="Ciudad del cliente..."
                            id="ciudad_cliente"
                            value={newCustomer.ciudad_cliente}
                            onChange={(e) => {
                                setNewCustomer({ ...newCustomer, ciudad_cliente: e.target.value });
                            }}
                        />
                    </div>

                    <div className="w-full">
                        <label className="w-full text-left font-bold" htmlFor="correo_cliente">
                            Correo:
                        </label>
                        <input
                            type="emial"
                            className="py-1 px-4 font-normal text-base border border-gray-300 dark:border-gray-700 w-full rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
                            placeholder="Correo del cliente..."
                            id="correo_cliente"
                            value={newCustomer.correo_cliente}
                            onChange={(e) => {
                                setNewCustomer({ ...newCustomer, correo_cliente: e.target.value });
                            }}
                            minLength={7}
                            required
                            maxLength={100}
                        />
                    </div>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-y-4 md:gap-x-4">
                        <div className="w-full flex flex-col md:flex-row items-center justify-center gap-y-4 md:gap-x-4">
                            <div className="w-full flex items-center justify-center flex-col">
                                <label className="w-full text-left font-bold" htmlFor="estado">
                                    Estado:
                                </label>
                                <select
                                    id="estado"
                                    className="w-full border border-gray-300 dark:border-gray-700 rounded-md py-1 px-2"
                                    onChange={(e) => {
                                        setNewCustomer({ ...newCustomer, estado: +e.target.value });
                                    }}
                                >
                                    {
                                        stateValue.map((state) => (
                                            <option
                                                className="bg-gray-100 dark:bg-gray-950"
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
                        className="w-full mt-4 md:w-[50%] mx-auto py-2 px-4 border border-gray-300 dark:border-gray-700 rounded-md flex items-center justify-center gap-x-4 font-bold"
                        aria-label="Close"
                    >
                        <Save className="size-5" />
                        Guardar cliente
                    </button>

                </form>
            </DialogContent>
        </Dialog>
    )
}

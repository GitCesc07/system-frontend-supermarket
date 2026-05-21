import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { Edit, X } from "lucide-react";
import { stateValue } from "@/types/state.interface";
import type { ErrorData } from "@/types/errors.interface";
import { toast } from "sonner";
import type { CustomerFormDataEdit } from "@/types/customers.interface";
import { getCustomerById, updateCustomer } from "@/apis/customers.interface";

export default function EditCustomer({ customer, onClose }: { customer: CustomerFormDataEdit, onClose: () => void }) {
    const navigate = useNavigate()
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    const customerId = queryParams.get("editCustomer")!;

    const { data } = useQuery({
        queryKey: ["customers", customerId],
        queryFn: () => getCustomerById({ id: customerId }),
        enabled: !!customerId,
        retry: false
    });

    const [open, setOpen] = useState(false);
    const [editeCustomer, setEditeCustomer] = useState(customer);

    const queryClient = useQueryClient();

    const { mutate } = useMutation({
        mutationFn: updateCustomer,
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
            queryClient.invalidateQueries({ queryKey: ["customers"] })
            queryClient.invalidateQueries({ queryKey: ["editCustomer", customerId] })
            toast.success(data, {
                position: "top-right",
                closeButton: true,
                action: {
                    label: "Cerrar  todas",
                    onClick: () => toast.dismiss()
                }
            });
            navigate(location.pathname, { replace: true });
            reset();
            onClose();
        }
    });


    const {
        reset,
        handleSubmit
    } = useForm<CustomerFormDataEdit>();

    useEffect(() => {
        if (customerId == "" || customerId == null || customerId == undefined) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setOpen(false);
            reset();
        } else {
            setOpen(true);
        }
    }, [customerId, reset])

    const onSubmitEdit = () => {
        const formData = editeCustomer;
        const dataCustomers = { customerId, formData }
        mutate(dataCustomers);
    }    
    if (data) return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent
                className="[&>button]:hidden w-full md:max-w-md"
                onInteractOutside={(e) => e.preventDefault()}
                onEscapeKeyDown={(e) => e.preventDefault()}
            >
                <DialogHeader>
                    <DialogTitle>Editar cliente</DialogTitle>
                    <DialogDescription>
                        Edita tus clientes aquí...
                    </DialogDescription>
                </DialogHeader>
                <form
                    onSubmit={handleSubmit(onSubmitEdit)}
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
                                value={editeCustomer.ruc_cliente}
                                onChange={(e) => {
                                    setEditeCustomer({ ...editeCustomer, ruc_cliente: e.target.value });
                                }}
                                required
                                minLength={14}
                                maxLength={14}
                            />
                        </div>
                    </div>

                    <div className="w-full">
                        <label className="w-full text-left font-bold" htmlFor="nombre_cliente">
                            cliente:
                        </label>
                        <input
                            className="py-1 px-4 font-normal border border-gray-300 dark:border-gray-700 text-base w-full rounded-md placeholder:text-gray-300"
                            placeholder="cliente..."
                            id="nombre_cliente"
                            value={editeCustomer.nombre_cliente}
                            onChange={(e) => {
                                setEditeCustomer({ ...editeCustomer, nombre_cliente: e.target.value });
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
                                value={editeCustomer.telefono_cliente}
                                onChange={(e) => {
                                    setEditeCustomer({ ...editeCustomer, telefono_cliente: e.target.value });
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
                                value={editeCustomer.celular_cliente}
                                onChange={(e) => {
                                    setEditeCustomer({ ...editeCustomer, celular_cliente: e.target.value });
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
                            value={editeCustomer.direccion_cliente}
                            onChange={(e) => {
                                setEditeCustomer({ ...editeCustomer, direccion_cliente: e.target.value });
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
                            value={editeCustomer.ciudad_cliente}
                            onChange={(e) => {
                                setEditeCustomer({ ...editeCustomer, ciudad_cliente: e.target.value });
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
                            value={editeCustomer.correo_cliente}
                            onChange={(e) => {
                                setEditeCustomer({ ...editeCustomer, correo_cliente: e.target.value });
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
                                    value={editeCustomer.estado}
                                    className="w-full border border-gray-300 dark:border-gray-700 rounded-md py-1 px-2"
                                    onChange={(e) => {
                                        setEditeCustomer({ ...editeCustomer, estado: +e.target.value });
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
                        className="w-full mt-4 md:w-auto mx-auto py-2 px-4 border border-gray-300 dark:border-gray-700 rounded-md flex items-center justify-center gap-x-4 font-bold"
                        aria-label="Close"
                    >
                        <Edit className="size-5" />
                        Modificar cliente
                    </button>

                </form>
                <DialogClose
                    onClick={() => {
                        setOpen(false)
                        navigate(location.pathname, { replace: true });
                        reset();
                        onClose();
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

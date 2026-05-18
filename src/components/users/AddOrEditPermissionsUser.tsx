import { useEffect, useState } from 'react'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Save, X } from 'lucide-react';
import type { PermissionsUserFormData } from '@/types/users.interface';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { addOrUpdatePermissionsUser, getPermissionsUser } from '@/apis/users.apis';
import { toast } from 'sonner';
import type { ErrorData } from '@/types/errors.interface';
import { useForm } from 'react-hook-form';

export default function AddOrEditPermissionsUser({ onClose }: { onClose: () => void }) {
    const navigate = useNavigate()
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    const userId = queryParams.get("permissionsUser")!
    const id_usuario = userId;

    const { data } = useQuery({
        queryKey: ["users", id_usuario],
        queryFn: () => getPermissionsUser({ id_usuario }),
        enabled: !!id_usuario,
        retry: false
    });
    const queryClient = useQueryClient()
    const {
        handleSubmit,
        reset
    } = useForm<PermissionsUserFormData>()

    const [permissionsData, setPermissionsData] = useState(data);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (id_usuario == "" || id_usuario == null || id_usuario == undefined) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setOpen(false);
            reset();
        } else {
            setOpen(true);
        }
    }, [id_usuario, reset])

    useEffect(() => {
        if (data) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setPermissionsData(data);
        }
    }, [data]);

    const [permisosUsuario, setPermisosUsuario] = useState({
        key: 1,
        guardar: 0,
        modificar: 0,
        eliminar: 0
    })

    const [permisosProveedor, setPermisosProveedor] = useState({
        key: 2,
        guardar: 0,
        modificar: 0,
        eliminar: 0
    })

    const [permisosCliente, setPermisosCliente] = useState({
        key: 3,
        guardar: 0,
        modificar: 0,
        eliminar: 0
    })

    const [permisosMarca, setPermisosMarca] = useState({
        key: 4,
        guardar: 0,
        modificar: 0,
        eliminar: 0
    })

    const [permisosProducto, setPermisosProducto] = useState({
        key: 5,
        guardar: 0,
        modificar: 0,
        eliminar: 0
    })

    const [permisosCategoria, setPermisosCategoria] = useState({
        key: 6,
        guardar: 0,
        modificar: 0,
        eliminar: 0
    })

    const [permisosCompra, setPermisosCompra] = useState({
        key: 7,
        guardar: 0,
        reporte: 0
    })

    const [permisosVentas, setPermisosVentas] = useState({
        key: 10,
        guardar: 0,
        reporte: 0
    })


    const [permisosEmpresa, setPermisosEmpresa] = useState({
        key: 14,
        guardar: 0,
        modificar: 0,
    })

    const [permisosInventario, setPermisosInventario] = useState({
        key: 17,
        guardar: 0,
        modificar: 0,
        eliminar: 0,
        reporte: 0
    })


    const [permissionsUserAddORUpdate, setPermissionsUserAddORUpdate] = useState({
        empresa: 0,
        permisos_empresa: [permisosEmpresa],
        usuario: 0,
        permisos_usuario: [permisosUsuario],
        proveedor: 0,
        permisos_proveedor: [permisosProveedor],
        cliente: 0,
        permisos_cliente: [permisosCliente],
        marca: 0,
        permisos_marca: [permisosMarca],
        categoria: 0,
        permisos_categoria: [permisosCategoria],
        producto: 0,
        permisos_producto: [permisosProducto],
        inventario: 0,
        permisos_inventario: [permisosInventario],
        compra: 0,
        permisos_compra: [permisosCompra],
        venta: 0,
        permisos_venta: [permisosVentas],
        kardex: 0,
        reportes_inventario: 0,
        reportes: 0,
        id_usuario: ""
    })

    const { mutate } = useMutation({
        mutationFn: addOrUpdatePermissionsUser,
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
            queryClient.invalidateQueries({ queryKey: ["permissionsUser", userId] })
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


    const onSubmitPermissions = () => {
        if (permissionsData != undefined) {
            // eslint-disable-next-line react-hooks/immutability
            permissionsUserAddORUpdate.empresa = permissionsData![0].empresa;
            permissionsUserAddORUpdate.permisos_empresa = permissionsData![0].permisos_empresa;
            permissionsUserAddORUpdate.usuario = permissionsData![0].usuario;
            permissionsUserAddORUpdate.permisos_usuario = permissionsData![0].permisos_usuario;
            permissionsUserAddORUpdate.proveedor = permissionsData![0].proveedor;
            permissionsUserAddORUpdate.permisos_proveedor = permissionsData![0].permisos_proveedor;
            permissionsUserAddORUpdate.cliente = permissionsData![0].cliente;
            permissionsUserAddORUpdate.permisos_cliente = permissionsData![0].permisos_cliente;
            permissionsUserAddORUpdate.marca = permissionsData![0].marca;
            permissionsUserAddORUpdate.permisos_marca = permissionsData![0].permisos_marca;
            permissionsUserAddORUpdate.categoria = permissionsData![0].categoria;
            permissionsUserAddORUpdate.permisos_categoria = permissionsData![0].permisos_categoria;
            permissionsUserAddORUpdate.producto = permissionsData![0].producto;
            permissionsUserAddORUpdate.permisos_producto = permissionsData![0].permisos_producto;
            permissionsUserAddORUpdate.inventario = permissionsData![0].inventario;
            permissionsUserAddORUpdate.permisos_inventario = permissionsData![0].permisos_inventario;
            permissionsUserAddORUpdate.compra = permissionsData![0].compra;
            permissionsUserAddORUpdate.permisos_compra = permissionsData![0].permisos_compra;
            permissionsUserAddORUpdate.venta = permissionsData![0].venta;
            permissionsUserAddORUpdate.permisos_venta = permissionsData![0].permisos_venta;
            permissionsUserAddORUpdate.kardex = permissionsData![0].kardex;
            permissionsUserAddORUpdate.reportes_inventario = permissionsData![0].reportes_inventario;
            permissionsUserAddORUpdate.reportes = permissionsData![0].reportes;
        }
        else {
            permissionsUserAddORUpdate.permisos_empresa = [permisosEmpresa];
            permissionsUserAddORUpdate.permisos_usuario = [permisosUsuario];
            permissionsUserAddORUpdate.permisos_proveedor = [permisosProveedor];
            permissionsUserAddORUpdate.permisos_cliente = [permisosCliente];
            permissionsUserAddORUpdate.permisos_marca = [permisosMarca];
            permissionsUserAddORUpdate.permisos_categoria = [permisosCategoria];
            permissionsUserAddORUpdate.permisos_inventario = [permisosInventario];
            permissionsUserAddORUpdate.permisos_producto = [permisosProducto];
            permissionsUserAddORUpdate.permisos_compra = [permisosCompra];
            permissionsUserAddORUpdate.permisos_venta = [permisosVentas];
        }

        const formData = permissionsUserAddORUpdate;
        const dataPermissions = { id_usuario, formData }
        mutate(dataPermissions);
    }

    if (data == undefined) return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent
                className="[&>button]:hidden h-[90%] p-4"
                onInteractOutside={(e) => e.preventDefault()}
                onEscapeKeyDown={(e) => e.preventDefault()}
            >
                <DialogHeader>
                    <DialogTitle>Crear usuario</DialogTitle>
                    <DialogDescription>
                        Crea tus usuarios aquí...
                    </DialogDescription>
                </DialogHeader>
                <form
                    onSubmit={handleSubmit(onSubmitPermissions)}
                    className="space-y-3 h-[50%] top-0 sticky"
                >
                    <div
                        className="h-[90%] overflow-y-auto touch-pan-y space-y-2 scrollbar-thin-custom"
                    >

                        <div className="w-full gap-x-1 flex flex-row-reverse items-center justify-end">
                            <label className="text-left  font-bold" htmlFor="usuario">
                                Usuario
                            </label>
                            <input
                                className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
                                type="checkbox"
                                id="usuario"
                                checked={permissionsUserAddORUpdate.usuario ? true : false}
                                onChange={(e) => {
                                    setPermissionsUserAddORUpdate({ ...permissionsUserAddORUpdate, usuario: +e.target.checked });
                                }}
                            />
                        </div>
                        <div className="w-36 ml-4">
                            {
                                permissionsUserAddORUpdate.usuario == 1 && (
                                    <div className="bg-slate-50 dark:bg-slate-800 h-auto border border-gray-300 dark:border-gray-700 rounded-b-md w-auto px-4">
                                        {
                                            <div
                                                className="flex items-start flex-col"
                                            >

                                                <div className="flex flex-row-reverse items-center gap-x-4">
                                                    <label className="text-left text-cyan-600 dark:text-cyan-300 font-bold" htmlFor="guardar_usuario">
                                                        Guardar
                                                    </label>
                                                    <input
                                                        className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-cyan-600 dark:accent-cyan-300"
                                                        type="checkbox"
                                                        id="guardar_usuario"
                                                        checked={permisosUsuario.guardar ? true : false}
                                                        onChange={(e) => {
                                                            setPermisosUsuario({ ...permisosUsuario, guardar: +e.target.checked });
                                                        }}
                                                    />
                                                </div>

                                                <div className="flex flex-row-reverse items-center gap-x-4">
                                                    <label className="text-left text-green-600 dark:text-green-300 font-bold" htmlFor="modificar_usuario">
                                                        Modificar
                                                    </label>
                                                    <input
                                                        className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-green-600 dark:accent-green-300"
                                                        type="checkbox"
                                                        id="modificar_usuario"
                                                        checked={permisosUsuario.modificar ? true : false}
                                                        onChange={(e) => {
                                                            setPermisosUsuario({ ...permisosUsuario, modificar: +e.target.checked });
                                                        }}
                                                    />
                                                </div>

                                                <div className="flex flex-row-reverse items-center gap-x-4">
                                                    <label className="text-left text-red-600 dark:text-red-300 font-bold" htmlFor="eliminar_usuario">
                                                        Eliminar
                                                    </label>
                                                    <input
                                                        className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-red-600 dark:accent-red-300"
                                                        type="checkbox"
                                                        id="eliminar_usuario"
                                                        checked={permisosUsuario.eliminar ? true : false}
                                                        onChange={(e) => {
                                                            setPermisosUsuario({ ...permisosUsuario, eliminar: +e.target.checked });
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        }
                                    </div>
                                )
                            }
                        </div>

                        <div className="w-full gap-x-1 flex flex-row-reverse items-center justify-end">
                            <label className="text-left  font-bold" htmlFor="proveedor">
                                Proveedor
                            </label>
                            <input
                                className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
                                type="checkbox"
                                id="proveedor"
                                checked={permissionsUserAddORUpdate.proveedor == 1 ? true : false}
                                onChange={(e) => {
                                    setPermissionsUserAddORUpdate({ ...permissionsUserAddORUpdate, proveedor: +e.target.checked });
                                }}
                            />
                        </div>
                        <div className="w-36 ml-4">
                            {
                                permissionsUserAddORUpdate.proveedor == 1 && (
                                    <div className="bg-slate-50 dark:bg-slate-800 h-auto border border-gray-300 dark:border-gray-700 rounded-b-md w-auto px-4">
                                        <div
                                            className="flex items-start flex-col"
                                        >

                                            <div className="flex flex-row-reverse items-center gap-x-4">
                                                <label className="text-left text-cyan-600 dark:text-cyan-300 font-bold" htmlFor="guardar_proveedor">
                                                    Guardar
                                                </label>
                                                <input
                                                    className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-cyan-600 dark:accent-cyan-300"
                                                    type="checkbox"
                                                    id="guardar_proveedor"
                                                    checked={permisosProveedor.guardar ? true : false}
                                                    onChange={(e) => {
                                                        setPermisosProveedor({ ...permisosProveedor, guardar: +e.target.checked });
                                                    }}
                                                />
                                            </div>

                                            <div className="flex flex-row-reverse items-center gap-x-4">
                                                <label className="text-left text-green-600 font-bold" htmlFor="modificar_proveedor">
                                                    Modificar
                                                </label>
                                                <input
                                                    className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-green-600"
                                                    type="checkbox"
                                                    id="modificar_proveedor"
                                                    checked={permisosProveedor.modificar ? true : false}
                                                    onChange={(e) => {
                                                        setPermisosProveedor({ ...permisosProveedor, modificar: +e.target.checked });
                                                    }}
                                                />
                                            </div>

                                            <div className="flex flex-row-reverse items-center gap-x-4">
                                                <label className="text-left text-red-600 font-bold" htmlFor="eliminar_proveedor">
                                                    Eliminar
                                                </label>
                                                <input
                                                    className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-red-600"
                                                    type="checkbox"
                                                    id="eliminar_proveedor"
                                                    checked={permisosProveedor.eliminar ? true : false}
                                                    onChange={(e) => {
                                                        setPermisosProveedor({ ...permisosProveedor, eliminar: +e.target.checked });
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                        </div>

                        <div className="w-full gap-x-1 flex flex-row-reverse items-center justify-end">
                            <label className="text-left  font-bold" htmlFor="cliente">
                                Cliente
                            </label>
                            <input
                                className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
                                type="checkbox"
                                id="cliente"
                                checked={permissionsUserAddORUpdate.cliente == 1 ? true : false}
                                onChange={(e) => {
                                    setPermissionsUserAddORUpdate({ ...permissionsUserAddORUpdate, cliente: +e.target.checked });
                                }}
                            />
                        </div>
                        <div className="w-36 ml-4">
                            {
                                permissionsUserAddORUpdate.cliente == 1 && (
                                    <div className="bg-slate-50 dark:bg-slate-800 h-auto border border-gray-300 dark:border-gray-700 rounded-b-md w-auto px-4">
                                        <div
                                            className="flex items-start flex-col"
                                        >

                                            <div className="flex flex-row-reverse items-center gap-x-4">
                                                <label className="text-left text-cyan-600 dark:text-cyan-300 font-bold" htmlFor="guardar_cliente">
                                                    Guardar
                                                </label>
                                                <input
                                                    className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-cyan-600 dark:accent-cyan-300"
                                                    type="checkbox"
                                                    id="guardar_cliente"
                                                    checked={permisosCliente.guardar ? true : false}
                                                    onChange={(e) => {
                                                        setPermisosCliente({ ...permisosCliente, guardar: +e.target.checked });
                                                    }}
                                                />
                                            </div>

                                            <div className="flex flex-row-reverse items-center gap-x-4">
                                                <label className="text-left text-green-600 font-bold" htmlFor="modificar_cliente">
                                                    Modificar
                                                </label>
                                                <input
                                                    className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-green-600"
                                                    type="checkbox"
                                                    id="modificar_cliente"
                                                    checked={permisosCliente.modificar ? true : false}
                                                    onChange={(e) => {
                                                        setPermisosCliente({ ...permisosCliente, modificar: +e.target.checked });
                                                    }}
                                                />
                                            </div>

                                            <div className="flex flex-row-reverse items-center gap-x-4">
                                                <label className="text-left text-red-600 font-bold" htmlFor="eliminar_cliente">
                                                    Eliminar
                                                </label>
                                                <input
                                                    className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-red-600"
                                                    type="checkbox"
                                                    id="eliminar_cliente"
                                                    checked={permisosCliente.eliminar ? true : false}
                                                    onChange={(e) => {
                                                        setPermisosCliente({ ...permisosCliente, eliminar: +e.target.checked });
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                        </div>

                        <div className="w-full gap-x-1 flex flex-row-reverse items-center justify-end">
                            <label className="text-left  font-bold" htmlFor="marca">
                                Marca
                            </label>
                            <input
                                className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
                                type="checkbox"
                                id="marca"
                                checked={permissionsUserAddORUpdate.marca == 1 ? true : false}
                                onChange={(e) => {
                                    setPermissionsUserAddORUpdate({ ...permissionsUserAddORUpdate, marca: +e.target.checked });
                                }}
                            />
                        </div>
                        <div className="w-36 ml-4">
                            {
                                permissionsUserAddORUpdate.marca == 1 && (
                                    <div className="bg-slate-50 dark:bg-slate-800 h-auto border border-gray-300 dark:border-gray-700 rounded-b-md w-auto px-4">
                                        <div
                                            className="flex items-start flex-col"
                                        >

                                            <div className="flex flex-row-reverse items-center gap-x-4">
                                                <label className="text-left text-cyan-600 dark:text-cyan-300 font-bold" htmlFor="guardar_marca">
                                                    Guardar
                                                </label>
                                                <input
                                                    className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-cyan-600 dark:accent-cyan-300"
                                                    type="checkbox"
                                                    id="guardar_marca"
                                                    checked={permisosMarca.guardar ? true : false}
                                                    onChange={(e) => {
                                                        setPermisosMarca({ ...permisosMarca, guardar: +e.target.checked });
                                                    }}
                                                />
                                            </div>

                                            <div className="flex flex-row-reverse items-center gap-x-4">
                                                <label className="text-left text-green-600 font-bold" htmlFor="modificar_marca">
                                                    Modificar
                                                </label>
                                                <input
                                                    className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-green-600"
                                                    type="checkbox"
                                                    id="modificar_marca"
                                                    checked={permisosMarca.modificar ? true : false}
                                                    onChange={(e) => {
                                                        setPermisosMarca({ ...permisosMarca, modificar: +e.target.checked });
                                                    }}
                                                />
                                            </div>

                                            <div className="flex flex-row-reverse items-center gap-x-4">
                                                <label className="text-left text-red-600 font-bold" htmlFor="eliminar_marca">
                                                    Eliminar
                                                </label>
                                                <input
                                                    className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-red-600"
                                                    type="checkbox"
                                                    id="eliminar_marca"
                                                    checked={permisosMarca.eliminar ? true : false}
                                                    onChange={(e) => {
                                                        setPermisosMarca({ ...permisosMarca, eliminar: +e.target.checked });
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                        </div>

                        <div className="w-full gap-x-1 flex flex-row-reverse items-center justify-end">
                            <label className="text-left  font-bold" htmlFor="categoria">
                                Categoria
                            </label>
                            <input
                                className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
                                type="checkbox"
                                id="categoria"
                                checked={permissionsUserAddORUpdate.categoria == 1 ? true : false}
                                onChange={(e) => {
                                    setPermissionsUserAddORUpdate({ ...permissionsUserAddORUpdate, categoria: +e.target.checked });
                                }}
                            />
                        </div>
                        <div className="w-36 ml-4">
                            {
                                permissionsUserAddORUpdate.categoria == 1 && (
                                    <div className="bg-slate-50 dark:bg-slate-800 h-auto border border-gray-300 dark:border-gray-700 rounded-b-md w-auto px-4">
                                        <div
                                            className="flex items-start flex-col"
                                        >

                                            <div className="flex flex-row-reverse items-center gap-x-4">
                                                <label className="text-left text-cyan-600 dark:text-cyan-300 font-bold" htmlFor="guardar_categoria">
                                                    Guardar
                                                </label>
                                                <input
                                                    className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-cyan-600 dark:accent-cyan-300"
                                                    type="checkbox"
                                                    id="guardar_categoria"
                                                    checked={permisosCategoria.guardar ? true : false}
                                                    onChange={(e) => {
                                                        setPermisosCategoria({ ...permisosCategoria, guardar: +e.target.checked });
                                                    }}
                                                />
                                            </div>

                                            <div className="flex flex-row-reverse items-center gap-x-4">
                                                <label className="text-left text-green-600 font-bold" htmlFor="modificar_categoria">
                                                    Modificar
                                                </label>
                                                <input
                                                    className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-green-600"
                                                    type="checkbox"
                                                    id="modificar_categoria"
                                                    checked={permisosCategoria.modificar ? true : false}
                                                    onChange={(e) => {
                                                        setPermisosCategoria({ ...permisosCategoria, modificar: +e.target.checked });
                                                    }}
                                                />
                                            </div>

                                            <div className="flex flex-row-reverse items-center gap-x-4">
                                                <label className="text-left text-red-600 font-bold" htmlFor="eliminar_categoria">
                                                    Eliminar
                                                </label>
                                                <input
                                                    className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-red-600"
                                                    type="checkbox"
                                                    id="eliminar_categoria"
                                                    checked={permisosCategoria.eliminar ? true : false}
                                                    onChange={(e) => {
                                                        setPermisosCategoria({ ...permisosCategoria, eliminar: +e.target.checked });
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                        </div>

                        <div className="w-full gap-x-1 flex flex-row-reverse items-center justify-end">
                            <label className="text-left  font-bold" htmlFor="producto">
                                Producto
                            </label>
                            <input
                                className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
                                type="checkbox"
                                id="producto"
                                checked={permissionsUserAddORUpdate.producto == 1 ? true : false}
                                onChange={(e) => {
                                    setPermissionsUserAddORUpdate({ ...permissionsUserAddORUpdate, producto: +e.target.checked });
                                }}
                            />
                        </div>
                        <div className="w-36 ml-4">
                            {
                                permissionsUserAddORUpdate.producto == 1 && (
                                    <div className="bg-slate-50 dark:bg-slate-800 h-auto border border-gray-300 dark:border-gray-700 rounded-b-md w-auto px-4">
                                        <div
                                            className="flex items-start flex-col"
                                        >

                                            <div className="flex flex-row-reverse items-center gap-x-4">
                                                <label className="text-left text-cyan-600 dark:text-cyan-300 font-bold" htmlFor="guardar_producto">
                                                    Guardar
                                                </label>
                                                <input
                                                    className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-cyan-600 dark:accent-cyan-300"
                                                    type="checkbox"
                                                    id="guardar_producto"
                                                    checked={permisosProducto.guardar ? true : false}
                                                    onChange={(e) => {
                                                        setPermisosProducto({ ...permisosProducto, guardar: +e.target.checked });
                                                    }}
                                                />
                                            </div>

                                            <div className="flex flex-row-reverse items-center gap-x-4">
                                                <label className="text-left text-green-600 font-bold" htmlFor="modificar_producto">
                                                    Modificar
                                                </label>
                                                <input
                                                    className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-green-600"
                                                    type="checkbox"
                                                    id="modificar_producto"
                                                    checked={permisosProducto.modificar ? true : false}
                                                    onChange={(e) => {
                                                        setPermisosProducto({ ...permisosProducto, modificar: +e.target.checked });
                                                    }}
                                                />
                                            </div>

                                            <div className="flex flex-row-reverse items-center gap-x-4">
                                                <label className="text-left text-red-600 font-bold" htmlFor="eliminar_producto">
                                                    Eliminar
                                                </label>
                                                <input
                                                    className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-red-600"
                                                    type="checkbox"
                                                    id="eliminar_producto"
                                                    checked={permisosProducto.eliminar ? true : false}
                                                    onChange={(e) => {
                                                        setPermisosProducto({ ...permisosProducto, eliminar: +e.target.checked });
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                        </div>

                        <div className="w-full gap-x-1 flex flex-row-reverse items-center justify-end">
                            <label className="text-left  font-bold" htmlFor="inventario">
                                Inventario
                            </label>
                            <input
                                className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
                                type="checkbox"
                                id="inventario"
                                onChange={(e) => {
                                    setPermissionsUserAddORUpdate({ ...permissionsUserAddORUpdate, inventario: +e.target.checked });
                                }}
                            />
                        </div>
                        <div className="w-36 ml-4">
                            {
                                permissionsUserAddORUpdate.inventario == 1 && (
                                    <div className="bg-slate-50 dark:bg-slate-800 h-auto border border-gray-300 dark:border-gray-700 rounded-b-md w-auto px-4">
                                        <div
                                            className="flex items-start flex-col"
                                        >

                                            <div className="flex flex-row-reverse items-center gap-x-4">
                                                <label className="text-left text-cyan-600 dark:text-cyan-300 font-bold" htmlFor="guardar_inventario">
                                                    Guardar
                                                </label>
                                                <input
                                                    className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-cyan-600 dark:accent-cyan-300"
                                                    type="checkbox"
                                                    id="guardar_inventario"
                                                    checked={permisosInventario.guardar ? true : false}
                                                    onChange={(e) => {
                                                        setPermisosInventario({ ...permisosInventario, guardar: +e.target.checked });
                                                    }}
                                                />
                                            </div>

                                            <div className="flex flex-row-reverse items-center gap-x-4">
                                                <label className="text-left text-green-600 font-bold" htmlFor="modificar_inventario">
                                                    Modificar
                                                </label>
                                                <input
                                                    className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-green-600"
                                                    type="checkbox"
                                                    id="modificar_inventario"
                                                    checked={permisosInventario.modificar ? true : false}
                                                    onChange={(e) => {
                                                        setPermisosInventario({ ...permisosInventario, modificar: +e.target.checked });
                                                    }}
                                                />
                                            </div>

                                            <div className="flex flex-row-reverse items-center gap-x-4">
                                                <label className="text-left text-red-600 font-bold" htmlFor="eliminar_invenatrio">
                                                    Eliminar
                                                </label>
                                                <input
                                                    className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-red-600"
                                                    type="checkbox"
                                                    id="eliminar_invenatrio"
                                                    checked={permisosInventario.eliminar ? true : false}
                                                    onChange={(e) => {
                                                        setPermisosInventario({ ...permisosInventario, eliminar: +e.target.checked });
                                                    }}
                                                />
                                            </div>

                                            <div className="flex flex-row-reverse items-center gap-x-4">
                                                <label className="text-left text-amber-500 font-bold" htmlFor="reporte_inventario">
                                                    Reporte
                                                </label>
                                                <input
                                                    className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-amber-500"
                                                    type="checkbox"
                                                    id="reporte_inventario"
                                                    checked={permisosInventario.reporte ? true : false}
                                                    onChange={(e) => {
                                                        setPermisosInventario({ ...permisosInventario, reporte: +e.target.checked });
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                        </div>

                        <div className="w-full gap-x-1 flex flex-row-reverse items-center justify-end">
                            <label className="text-left  font-bold" htmlFor="compra">
                                Compra
                            </label>
                            <input
                                className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
                                type="checkbox"
                                id="compra"
                                checked={permissionsUserAddORUpdate.compra == 1 ? true : false}
                                onChange={(e) => {
                                    setPermissionsUserAddORUpdate({ ...permissionsUserAddORUpdate, compra: +e.target.checked });
                                }}
                            />
                        </div>
                        <div className="w-36 ml-4">
                            {
                                permissionsUserAddORUpdate.compra == 1 && (
                                    <div className="bg-slate-50 dark:bg-slate-800 h-auto border border-gray-300 dark:border-gray-700 rounded-b-md w-auto px-4">
                                        <div
                                            className="flex items-start flex-col"
                                        >

                                            <div className="flex flex-row-reverse items-center gap-x-4">
                                                <label className="text-left text-cyan-600 dark:text-cyan-300 font-bold" htmlFor="guardar_compra">
                                                    Guardar
                                                </label>
                                                <input
                                                    className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-cyan-600 dark:accent-cyan-300"
                                                    type="checkbox"
                                                    id="guardar_compra"
                                                    checked={permisosCompra.guardar ? true : false}
                                                    onChange={(e) => {
                                                        setPermisosCompra({ ...permisosCompra, guardar: +e.target.checked });
                                                    }}
                                                />
                                            </div>

                                            <div className="flex flex-row-reverse items-center gap-x-4">
                                                <label className="text-left text-amber-500 font-bold" htmlFor="reporte_compra">
                                                    Reporte
                                                </label>
                                                <input
                                                    className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-amber-500"
                                                    type="checkbox"
                                                    id="reporte_compra"
                                                    checked={permisosCompra.reporte ? true : false}
                                                    onChange={(e) => {
                                                        setPermisosCompra({ ...permisosCompra, reporte: +e.target.checked });
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                        </div>

                        <div className="w-full gap-x-1 flex flex-row-reverse items-center justify-end">
                            <label className="text-left  font-bold" htmlFor="facturacion">
                                Venta
                            </label>
                            <input
                                className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
                                type="checkbox"
                                id="facturacion"
                                checked={permissionsUserAddORUpdate.venta ? true : false}
                                onChange={(e) => {
                                    setPermissionsUserAddORUpdate({ ...permissionsUserAddORUpdate, venta: +e.target.checked });
                                }}
                            />
                        </div>
                        <div className="w-36 ml-4">
                            {
                                permissionsUserAddORUpdate.venta == 1 && (
                                    <div className="bg-slate-50 dark:bg-slate-800 h-auto border border-gray-300 dark:border-gray-700 rounded-b-md w-auto px-4">
                                        <div
                                            className="flex items-start flex-col"
                                        >

                                            <div className="flex flex-row-reverse items-center gap-x-4">
                                                <label className="text-left text-cyan-600 dark:text-cyan-300 font-bold" htmlFor="guardar_facturacion">
                                                    Guardar
                                                </label>
                                                <input
                                                    className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-cyan-600 dark:accent-cyan-300"
                                                    type="checkbox"
                                                    id="guardar_facturacion"
                                                    checked={permisosVentas.guardar ? true : false}
                                                    onChange={(e) => {
                                                        setPermisosVentas({ ...permisosVentas, guardar: +e.target.checked });
                                                    }}
                                                />
                                            </div>

                                            <div className="flex flex-row-reverse items-center gap-x-4">
                                                <label className="text-left text-amber-500 font-bold" htmlFor="reporte_facturacion">
                                                    Reporte
                                                </label>
                                                <input
                                                    className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-amber-500"
                                                    type="checkbox"
                                                    id="reporte_facturacion"
                                                    checked={permisosVentas.reporte ? true : false}
                                                    onChange={(e) => {
                                                        setPermisosVentas({ ...permisosVentas, reporte: +e.target.checked });
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                        </div>

                        <div className="w-full gap-x-1 flex flex-row-reverse items-center justify-end">
                            <label className="text-left  font-bold" htmlFor="kardex">
                                Kardex
                            </label>
                            <input
                                className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
                                type="checkbox"
                                id="kardex"
                                onChange={(e) => {
                                    setPermissionsUserAddORUpdate({ ...permissionsUserAddORUpdate, kardex: +e.target.checked });
                                }}
                            />
                        </div>

                        <div className="w-full gap-x-1 flex flex-row-reverse items-center justify-end">
                            <label className="text-left  font-bold" htmlFor="reportes_inventario">
                                Reportes de inventario
                            </label>
                            <input
                                className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
                                type="checkbox"
                                id="reportes_inventario"
                                onChange={(e) => {
                                    setPermissionsUserAddORUpdate({ ...permissionsUserAddORUpdate, reportes_inventario: +e.target.checked });
                                }}
                            />
                        </div>

                        <div className="gap-x-1 flex flex-row-reverse items-center justify-end">
                            <label className="text-left  font-bold" htmlFor="reportes">
                                Reportes generales
                            </label>
                            <input
                                className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
                                type="checkbox"
                                id="reportes"
                                onChange={(e) => {
                                    setPermissionsUserAddORUpdate({ ...permissionsUserAddORUpdate, reportes: +e.target.checked });
                                }}
                            />
                        </div>

                        <div className="w-full gap-x-1 flex flex-row-reverse items-center justify-end">
                            <label className="text-left  font-bold" htmlFor="empresa">
                                Empresa
                            </label>
                            <input
                                className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
                                type="checkbox"
                                id="empresa"
                                checked={permissionsUserAddORUpdate.empresa == 1 ? true : false}
                                onChange={(e) => {
                                    setPermissionsUserAddORUpdate({ ...permissionsUserAddORUpdate, empresa: +e.target.checked });
                                }}
                            />
                        </div>
                        <div className="w-36 ml-4">
                            {
                                permissionsUserAddORUpdate.empresa == 1 && (
                                    <div className="bg-slate-50 dark:bg-slate-800 h-auto border border-gray-300 dark:border-gray-700 rounded-b-md w-auto px-4">
                                        <div
                                            className="flex items-start flex-col"
                                        >

                                            <div className="flex flex-row-reverse items-center gap-x-4">
                                                <label className="text-left text-cyan-600 dark:text-cyan-300 font-bold" htmlFor="guardar_empresa">
                                                    Guardar
                                                </label>
                                                <input
                                                    className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-cyan-600 dark:accent-cyan-300"
                                                    type="checkbox"
                                                    id="guardar_empresa"
                                                    checked={permisosEmpresa.guardar ? true : false}
                                                    onChange={(e) => {
                                                        setPermisosEmpresa({ ...permisosEmpresa, guardar: +e.target.checked });
                                                    }}
                                                />
                                            </div>

                                            <div className="flex flex-row-reverse items-center gap-x-4">
                                                <label className="text-left text-green-600 font-bold" htmlFor="modificar_empresa">
                                                    Modificar
                                                </label>
                                                <input
                                                    className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-green-600"
                                                    type="checkbox"
                                                    id="modificar_empresa"
                                                    checked={permisosEmpresa.modificar ? true : false}
                                                    onChange={(e) => {
                                                        setPermisosEmpresa({ ...permisosEmpresa, modificar: +e.target.checked });
                                                    }}
                                                />
                                            </div>

                                        </div>
                                    </div>
                                )
                            }
                        </div>

                    </div>
                    <button
                        type="submit"
                        className="w-full mt-4 md:w-auto mx-auto border border-gray-300 dark:border-gray-700 py-2 px-4 bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-center gap-x-4 font-bold hover:bg-gray-300 transition-all duration-200"
                        aria-label="Close"
                    >
                        <Save className="size-5" />
                        Guardar cambios
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

    if (data) return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent
                className="[&>button]:hidden h-[90%] p-4"
                onInteractOutside={(e) => e.preventDefault()}
                onEscapeKeyDown={(e) => e.preventDefault()}
            >
                <DialogHeader>
                    <DialogTitle>Crear usuario</DialogTitle>
                    <DialogDescription>
                        Crea tus usuarios aquí...
                    </DialogDescription>
                </DialogHeader>
                <form
                    onSubmit={handleSubmit(onSubmitPermissions)}
                    className="space-y-3 h-[50%] top-0 sticky"
                >
                    {
                        permissionsData?.map((permission) => (
                            <div
                                key={permission.permisos_usuario[0].key}
                                className="h-[90%] overflow-y-auto touch-pan-y space-y-2 scrollbar-thin-custom"
                            >

                                {/* Permission user */}
                                <div className="w-full gap-x-1 flex flex-row-reverse items-center justify-end">
                                    <label className="text-left  font-bold" htmlFor="usuario">
                                        Usuario
                                    </label>
                                    <input
                                        className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
                                        type="checkbox"
                                        id="usuario"
                                        checked={permission.usuario ? true : false}
                                        onChange={(e) => {
                                            permission.usuario = +e.target.checked;
                                            setPermissionsUserAddORUpdate({ ...permissionsUserAddORUpdate, usuario: +e.target.checked });
                                        }}
                                    />
                                </div>
                                <div className="w-36 ml-4">
                                    {
                                        permission.usuario == 1 && (
                                            <div className="bg-slate-50 dark:bg-slate-800 h-auto border border-gray-300 dark:border-gray-700 rounded-b-md w-auto px-4">
                                                {
                                                    permission.permisos_usuario.map((permisionCRUD) => (
                                                        <div
                                                            className="flex items-start flex-col"
                                                            key={permisionCRUD.key}
                                                        >

                                                            <div className="flex flex-row-reverse items-center gap-x-4">
                                                                <label className="text-left text-cyan-600 dark:text-cyan-300 font-bold" htmlFor="guardar_usuario">
                                                                    Guardar
                                                                </label>
                                                                <input
                                                                    className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-cyan-600 dark:accent-cyan-300"
                                                                    type="checkbox"
                                                                    id="guardar_usuario"
                                                                    checked={permisionCRUD.guardar ? true : false}
                                                                    onChange={(e) => {
                                                                        permisionCRUD.guardar = +e.target.checked;
                                                                        setPermisosUsuario({ ...permisosUsuario, guardar: +e.target.checked });
                                                                    }}
                                                                />
                                                            </div>

                                                            <div className="flex flex-row-reverse items-center gap-x-4">
                                                                <label className="text-left text-green-600 font-bold" htmlFor="modificar_usuario">
                                                                    Modificar
                                                                </label>
                                                                <input
                                                                    className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-green-600"
                                                                    type="checkbox"
                                                                    id="modificar_usuario"
                                                                    checked={permisionCRUD.modificar ? true : false}
                                                                    onChange={(e) => {
                                                                        permisionCRUD.modificar = +e.target.checked;
                                                                        setPermisosUsuario({ ...permisosUsuario, modificar: +e.target.checked });
                                                                    }}
                                                                />
                                                            </div>

                                                            <div className="flex flex-row-reverse items-center gap-x-4">
                                                                <label className="text-left text-red-600 font-bold" htmlFor="eliminar_usuario">
                                                                    Eliminar
                                                                </label>
                                                                <input
                                                                    className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-red-600"
                                                                    type="checkbox"
                                                                    id="eliminar_usuario"
                                                                    checked={permisionCRUD.eliminar ? true : false}
                                                                    onChange={(e) => {
                                                                        permisionCRUD.eliminar = +e.target.checked;
                                                                        setPermisosUsuario({ ...permisosUsuario, eliminar: +e.target.checked });
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                        )
                                    }
                                </div>

                                {/* Pemission supplier */}
                                <div className="w-full gap-x-1 flex flex-row-reverse items-center justify-end">
                                    <label className="text-left  font-bold" htmlFor="proveedor">
                                        Proveedor
                                    </label>
                                    <input
                                        className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
                                        type="checkbox"
                                        id="proveedor"
                                        checked={permission.proveedor ? true : false}
                                        onChange={(e) => {
                                            // eslint-disable-next-line react-hooks/immutability
                                            permission.proveedor = +e.target.checked;
                                            setPermissionsUserAddORUpdate({ ...permissionsUserAddORUpdate, proveedor: +e.target.checked });
                                        }}
                                    />
                                </div>
                                <div className="w-36 ml-4">
                                    {
                                        permission.proveedor == 1 && (
                                            <div className="bg-slate-50 dark:bg-slate-800 h-auto border border-gray-300 dark:border-gray-700 rounded-b-md w-auto px-4">
                                                {
                                                    permission.permisos_proveedor.map((permisionCRUD) => (
                                                        <div
                                                            className="flex items-start flex-col"
                                                            key={permisionCRUD.key}
                                                        >

                                                            <div className="flex flex-row-reverse items-center gap-x-4">
                                                                <label className="text-left text-cyan-600 dark:text-cyan-300 font-bold" htmlFor="guardar_proveedor">
                                                                    Guardar
                                                                </label>
                                                                <input
                                                                    className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-cyan-600 dark:accent-cyan-300"
                                                                    type="checkbox"
                                                                    id="guardar_proveedor"
                                                                    checked={permisionCRUD.guardar ? true : false}
                                                                    onChange={(e) => {
                                                                        permisionCRUD.guardar = +e.target.checked;
                                                                        setPermisosProveedor({ ...permisosProveedor, guardar: +e.target.checked });
                                                                    }}
                                                                />
                                                            </div>

                                                            <div className="flex flex-row-reverse items-center gap-x-4">
                                                                <label className="text-left text-green-600 font-bold" htmlFor="modificar_proveedor">
                                                                    Modificar
                                                                </label>
                                                                <input
                                                                    className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-green-600"
                                                                    type="checkbox"
                                                                    id="modificar_proveedor"
                                                                    checked={permisionCRUD.modificar ? true : false}
                                                                    onChange={(e) => {
                                                                        permisionCRUD.modificar = +e.target.checked;
                                                                        setPermisosProveedor({ ...permisosProveedor, modificar: +e.target.checked });
                                                                    }}
                                                                />
                                                            </div>

                                                            <div className="flex flex-row-reverse items-center gap-x-4">
                                                                <label className="text-left text-red-600 font-bold" htmlFor="eliminar_proveedor">
                                                                    Eliminar
                                                                </label>
                                                                <input
                                                                    className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-red-600"
                                                                    type="checkbox"
                                                                    id="eliminar_proveedor"
                                                                    checked={permisionCRUD.eliminar ? true : false}
                                                                    onChange={(e) => {
                                                                        permisionCRUD.eliminar = +e.target.checked;
                                                                        setPermisosProveedor({ ...permisosProveedor, eliminar: +e.target.checked });
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                        )
                                    }
                                </div>

                                {/* Pemission customer */}
                                <div className="w-full gap-x-1 flex flex-row-reverse items-center justify-end">
                                    <label className="text-left  font-bold" htmlFor="cliente">
                                        Cliente
                                    </label>
                                    <input
                                        className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
                                        type="checkbox"
                                        id="cliente"
                                        checked={permission.cliente ? true : false}
                                        onChange={(e) => {
                                            // eslint-disable-next-line react-hooks/immutability
                                            permission.cliente = +e.target.checked;
                                            setPermissionsUserAddORUpdate({ ...permissionsUserAddORUpdate, cliente: +e.target.checked });
                                        }}
                                    />
                                </div>
                                <div className="w-36 ml-4">
                                    {
                                        permission.cliente == 1 && (
                                            <div className="bg-slate-50 dark:bg-slate-800 h-auto border border-gray-300 dark:border-gray-700 rounded-b-md w-auto px-4">
                                                {
                                                    permission.permisos_cliente.map((permisionCRUD) => (
                                                        <div
                                                            className="flex items-start flex-col"
                                                            key={permisionCRUD.key}
                                                        >

                                                            <div className="flex flex-row-reverse items-center gap-x-4">
                                                                <label className="text-left text-cyan-600 dark:text-cyan-300 font-bold" htmlFor="guardar_cliente">
                                                                    Guardar
                                                                </label>
                                                                <input
                                                                    className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-cyan-600 dark:accent-cyan-300"
                                                                    type="checkbox"
                                                                    id="guardar_cliente"
                                                                    checked={permisionCRUD.guardar ? true : false}
                                                                    onChange={(e) => {
                                                                        permisionCRUD.guardar = +e.target.checked;
                                                                        setPermisosCliente({ ...permisosCliente, guardar: +e.target.checked });
                                                                    }}
                                                                />
                                                            </div>

                                                            <div className="flex flex-row-reverse items-center gap-x-4">
                                                                <label className="text-left text-green-600 font-bold" htmlFor="modificar_cliente">
                                                                    Modificar
                                                                </label>
                                                                <input
                                                                    className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-green-600"
                                                                    type="checkbox"
                                                                    id="modificar_cliente"
                                                                    checked={permisionCRUD.modificar ? true : false}
                                                                    onChange={(e) => {
                                                                        permisionCRUD.modificar = +e.target.checked;
                                                                        setPermisosCliente({ ...permisosCliente, modificar: +e.target.checked });
                                                                    }}
                                                                />
                                                            </div>

                                                            <div className="flex flex-row-reverse items-center gap-x-4">
                                                                <label className="text-left text-red-600 font-bold" htmlFor="eliminar_cliente">
                                                                    Eliminar
                                                                </label>
                                                                <input
                                                                    className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-red-600"
                                                                    type="checkbox"
                                                                    id="eliminar_cliente"
                                                                    checked={permisionCRUD.eliminar ? true : false}
                                                                    onChange={(e) => {
                                                                        permisionCRUD.eliminar = +e.target.checked;
                                                                        setPermisosCliente({ ...permisosCliente, eliminar: +e.target.checked });
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                        )
                                    }
                                </div>

                                {/* Pemission brand */}
                                <div className="w-full gap-x-1 flex flex-row-reverse items-center justify-end">
                                    <label className="text-left  font-bold" htmlFor="marca">
                                        Marca
                                    </label>
                                    <input
                                        className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
                                        type="checkbox"
                                        id="marca"
                                        checked={permission.marca ? true : false}
                                        onChange={(e) => {
                                            // eslint-disable-next-line react-hooks/immutability
                                            permission.marca = +e.target.checked;
                                            setPermissionsUserAddORUpdate({ ...permissionsUserAddORUpdate, marca: +e.target.checked });
                                        }}
                                    />
                                </div>
                                <div className="w-36 ml-4">
                                    {
                                        permission.marca == 1 && (
                                            <div className="bg-slate-50 dark:bg-slate-800 h-auto border border-gray-300 dark:border-gray-700 rounded-b-md w-auto px-4">
                                                {
                                                    permission.permisos_marca.map((permisionCRUD) => (
                                                        <div
                                                            className="flex items-start flex-col"
                                                            key={permisionCRUD.key}
                                                        >

                                                            <div className="flex flex-row-reverse items-center gap-x-4">
                                                                <label className="text-left text-cyan-600 dark:text-cyan-300 font-bold" htmlFor="guardar_marca">
                                                                    Guardar
                                                                </label>
                                                                <input
                                                                    className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-cyan-600 dark:accent-cyan-300"
                                                                    type="checkbox"
                                                                    id="guardar_marca"
                                                                    checked={permisionCRUD.guardar ? true : false}
                                                                    onChange={(e) => {
                                                                        permisionCRUD.guardar = +e.target.checked;
                                                                        setPermisosMarca({ ...permisosMarca, guardar: +e.target.checked });
                                                                    }}
                                                                />
                                                            </div>

                                                            <div className="flex flex-row-reverse items-center gap-x-4">
                                                                <label className="text-left text-green-600 font-bold" htmlFor="modificar_marca">
                                                                    Modificar
                                                                </label>
                                                                <input
                                                                    className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-green-600"
                                                                    type="checkbox"
                                                                    id="modificar_marca"
                                                                    checked={permisionCRUD.modificar ? true : false}
                                                                    onChange={(e) => {
                                                                        permisionCRUD.modificar = +e.target.checked;
                                                                        setPermisosMarca({ ...permisosMarca, modificar: +e.target.checked });
                                                                    }}
                                                                />
                                                            </div>

                                                            <div className="flex flex-row-reverse items-center gap-x-4">
                                                                <label className="text-left text-red-600 font-bold" htmlFor="eliminar_marca">
                                                                    Eliminar
                                                                </label>
                                                                <input
                                                                    className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-red-600"
                                                                    type="checkbox"
                                                                    id="eliminar_marca"
                                                                    checked={permisionCRUD.eliminar ? true : false}
                                                                    onChange={(e) => {
                                                                        permisionCRUD.eliminar = +e.target.checked;
                                                                        setPermisosMarca({ ...permisosMarca, eliminar: +e.target.checked });
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                        )
                                    }
                                </div>

                                {/* Pemission category */}
                                <div className="w-full gap-x-1 flex flex-row-reverse items-center justify-end">
                                    <label className="text-left  font-bold" htmlFor="categoria">
                                        Categoria
                                    </label>
                                    <input
                                        className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
                                        type="checkbox"
                                        id="categoria"
                                        checked={permission.categoria ? true : false}
                                        onChange={(e) => {
                                            // eslint-disable-next-line react-hooks/immutability
                                            permission.categoria = +e.target.checked;
                                            setPermissionsUserAddORUpdate({ ...permissionsUserAddORUpdate, categoria: +e.target.checked });
                                        }}
                                    />
                                </div>
                                <div className="w-36 ml-4">
                                    {
                                        permission.categoria == 1 && (
                                            <div className="bg-slate-50 dark:bg-slate-800 h-auto border border-gray-300 dark:border-gray-700 rounded-b-md w-auto px-4">
                                                {
                                                    permission.permisos_categoria.map((permisionCRUD) => (
                                                        <div
                                                            className="flex items-start flex-col"
                                                            key={permisionCRUD.key}
                                                        >

                                                            <div className="flex flex-row-reverse items-center gap-x-4">
                                                                <label className="text-left text-cyan-600 dark:text-cyan-300 font-bold" htmlFor="guardar_categoria">
                                                                    Guardar
                                                                </label>
                                                                <input
                                                                    className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-cyan-600 dark:accent-cyan-300"
                                                                    type="checkbox"
                                                                    id="guardar_categoria"
                                                                    checked={permisionCRUD.guardar ? true : false}
                                                                    onChange={(e) => {
                                                                        permisionCRUD.guardar = +e.target.checked;
                                                                        setPermisosCategoria({ ...permisosCategoria, guardar: +e.target.checked });
                                                                    }}
                                                                />
                                                            </div>

                                                            <div className="flex flex-row-reverse items-center gap-x-4">
                                                                <label className="text-left text-green-600 font-bold" htmlFor="modificar_categoria">
                                                                    Modificar
                                                                </label>
                                                                <input
                                                                    className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-green-600"
                                                                    type="checkbox"
                                                                    id="modificar_categoria"
                                                                    checked={permisionCRUD.modificar ? true : false}
                                                                    onChange={(e) => {
                                                                        permisionCRUD.modificar = +e.target.checked;
                                                                        setPermisosCategoria({ ...permisosCategoria, modificar: +e.target.checked });
                                                                    }}
                                                                />
                                                            </div>

                                                            <div className="flex flex-row-reverse items-center gap-x-4">
                                                                <label className="text-left text-red-600 font-bold" htmlFor="eliminar_categoria">
                                                                    Eliminar
                                                                </label>
                                                                <input
                                                                    className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-red-600"
                                                                    type="checkbox"
                                                                    id="eliminar_categoria"
                                                                    checked={permisionCRUD.eliminar ? true : false}
                                                                    onChange={(e) => {
                                                                        permisionCRUD.eliminar = +e.target.checked;
                                                                        setPermisosCategoria({ ...permisosCategoria, eliminar: +e.target.checked });
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                        )
                                    }
                                </div>

                                {/* Pemission product */}
                                <div className="w-full gap-x-1 flex flex-row-reverse items-center justify-end">
                                    <label className="text-left  font-bold" htmlFor="producto">
                                        Producto
                                    </label>
                                    <input
                                        className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
                                        type="checkbox"
                                        id="producto"
                                        checked={permission.producto ? true : false}
                                        onChange={(e) => {
                                            // eslint-disable-next-line react-hooks/immutability
                                            permission.producto = +e.target.checked;
                                            setPermissionsUserAddORUpdate({ ...permissionsUserAddORUpdate, producto: +e.target.checked });
                                        }}
                                    />
                                </div>
                                <div className="w-36 ml-4">
                                    {
                                        permission.producto == 1 && (
                                            <div className="bg-slate-50 dark:bg-slate-800 h-auto border border-gray-300 dark:border-gray-700 rounded-b-md w-auto px-4">
                                                {
                                                    permission.permisos_producto.map((permisionCRUD) => (
                                                        <div
                                                            className="flex items-start flex-col"
                                                            key={permisionCRUD.key}
                                                        >

                                                            <div className="flex flex-row-reverse items-center gap-x-4">
                                                                <label className="text-left text-cyan-600 dark:text-cyan-300 font-bold" htmlFor="guardar_producto">
                                                                    Guardar
                                                                </label>
                                                                <input
                                                                    className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-cyan-600 dark:accent-cyan-300"
                                                                    type="checkbox"
                                                                    id="guardar_producto"
                                                                    checked={permisionCRUD.guardar ? true : false}
                                                                    onChange={(e) => {
                                                                        permisionCRUD.guardar = +e.target.checked;
                                                                        setPermisosProducto({ ...permisosProducto, guardar: +e.target.checked });
                                                                    }}
                                                                />
                                                            </div>

                                                            <div className="flex flex-row-reverse items-center gap-x-4">
                                                                <label className="text-left text-green-600 font-bold" htmlFor="modificar_producto">
                                                                    Modificar
                                                                </label>
                                                                <input
                                                                    className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-green-600"
                                                                    type="checkbox"
                                                                    id="modificar_producto"
                                                                    checked={permisionCRUD.modificar ? true : false}
                                                                    onChange={(e) => {
                                                                        permisionCRUD.modificar = +e.target.checked;
                                                                        setPermisosProducto({ ...permisosProducto, modificar: +e.target.checked });
                                                                    }}
                                                                />
                                                            </div>

                                                            <div className="flex flex-row-reverse items-center gap-x-4">
                                                                <label className="text-left text-red-600 font-bold" htmlFor="eliminar_producto">
                                                                    Eliminar
                                                                </label>
                                                                <input
                                                                    className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-red-600"
                                                                    type="checkbox"
                                                                    id="eliminar_producto"
                                                                    checked={permisionCRUD.eliminar ? true : false}
                                                                    onChange={(e) => {
                                                                        permisionCRUD.eliminar = +e.target.checked;
                                                                        setPermisosProducto({ ...permisosProducto, eliminar: +e.target.checked });
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                        )
                                    }
                                </div>

                                {/* Pemission inventory */}
                                <div className="w-full gap-x-1 flex flex-row-reverse items-center justify-end">
                                    <label className="text-left  font-bold" htmlFor="inventario">
                                        Inventario
                                    </label>
                                    <input
                                        className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
                                        type="checkbox"
                                        id="inventario"
                                        checked={permission.inventario ? true : false}
                                        onChange={(e) => {
                                            // eslint-disable-next-line react-hooks/immutability
                                            permission.inventario = +e.target.checked;
                                            setPermissionsUserAddORUpdate({ ...permissionsUserAddORUpdate, inventario: +e.target.checked });
                                        }}
                                    />
                                </div>
                                <div className="w-36 ml-4">
                                    {
                                        permission.inventario == 1 && (
                                            <div className="bg-slate-50 dark:bg-slate-800 h-auto border border-gray-300 dark:border-gray-700 rounded-b-md w-auto px-4">
                                                {
                                                    permission.permisos_inventario.map((permisionCRUD) => (
                                                        <div
                                                            className="flex items-start flex-col"
                                                            key={permisionCRUD.key}
                                                        >

                                                            <div className="flex flex-row-reverse items-center gap-x-4">
                                                                <label className="text-left text-cyan-600 dark:text-cyan-300 font-bold" htmlFor="guardar_inventario">
                                                                    Guardar
                                                                </label>
                                                                <input
                                                                    className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-cyan-600 dark:accent-cyan-300"
                                                                    type="checkbox"
                                                                    id="guardar_inventario"
                                                                    checked={permisionCRUD.guardar ? true : false}
                                                                    onChange={(e) => {
                                                                        permisionCRUD.guardar = +e.target.checked;
                                                                        setPermisosInventario({ ...permisosInventario, guardar: +e.target.checked });
                                                                    }}
                                                                />
                                                            </div>

                                                            <div className="flex flex-row-reverse items-center gap-x-4">
                                                                <label className="text-left text-green-600 font-bold" htmlFor="modificar_inventario">
                                                                    Modificar
                                                                </label>
                                                                <input
                                                                    className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-green-600"
                                                                    type="checkbox"
                                                                    id="modificar_inventario"
                                                                    checked={permisionCRUD.modificar ? true : false}
                                                                    onChange={(e) => {
                                                                        permisionCRUD.modificar = +e.target.checked;
                                                                        setPermisosInventario({ ...permisosInventario, modificar: +e.target.checked });
                                                                    }}
                                                                />
                                                            </div>

                                                            <div className="flex flex-row-reverse items-center gap-x-4">
                                                                <label className="text-left text-red-600 font-bold" htmlFor="eliminar_inventario">
                                                                    Eliminar
                                                                </label>
                                                                <input
                                                                    className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-red-600"
                                                                    type="checkbox"
                                                                    id="eliminar_inventario"
                                                                    checked={permisionCRUD.eliminar ? true : false}
                                                                    onChange={(e) => {
                                                                        permisionCRUD.eliminar = +e.target.checked;
                                                                        setPermisosInventario({ ...permisosInventario, eliminar: +e.target.checked });
                                                                    }}
                                                                />
                                                            </div>

                                                            <div className="flex flex-row-reverse items-center gap-x-4">
                                                                <label className="text-left text-amber-500 font-bold" htmlFor="reporte_inventario">
                                                                    Reporte
                                                                </label>
                                                                <input
                                                                    className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-amber-500"
                                                                    type="checkbox"
                                                                    id="reporte_inventario"
                                                                    checked={permisionCRUD.reporte ? true : false}
                                                                    onChange={(e) => {
                                                                        permisionCRUD.reporte = +e.target.checked;
                                                                        setPermisosInventario({ ...permisosInventario, reporte: +e.target.checked });
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                        )
                                    }
                                </div>

                                {/* Pemission buys */}
                                <div className="w-full gap-x-1 flex flex-row-reverse items-center justify-end">
                                    <label className="text-left  font-bold" htmlFor="compra">
                                        Compra
                                    </label>
                                    <input
                                        className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
                                        type="checkbox"
                                        id="compra"
                                        checked={permission.compra ? true : false}
                                        onChange={(e) => {
                                            // eslint-disable-next-line react-hooks/immutability
                                            permission.compra = +e.target.checked;
                                            setPermissionsUserAddORUpdate({ ...permissionsUserAddORUpdate, compra: +e.target.checked });
                                        }}
                                    />
                                </div>
                                <div className="w-36 ml-4">
                                    {
                                        permission.compra == 1 && (
                                            <div className="bg-slate-50 dark:bg-slate-800 h-auto border border-gray-300 dark:border-gray-700 rounded-b-md w-auto px-4">
                                                {
                                                    permission.permisos_compra.map((permisionCRUD) => (
                                                        <div
                                                            className="flex items-start flex-col"
                                                            key={permisionCRUD.key}
                                                        >

                                                            <div className="flex flex-row-reverse items-center gap-x-4">
                                                                <label className="text-left text-cyan-600 dark:text-cyan-300 font-bold" htmlFor="guardar_compra">
                                                                    Guardar
                                                                </label>
                                                                <input
                                                                    className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-cyan-600 dark:accent-cyan-300"
                                                                    type="checkbox"
                                                                    id="guardar_compra"
                                                                    checked={permisionCRUD.guardar ? true : false}
                                                                    onChange={(e) => {
                                                                        permisionCRUD.guardar = +e.target.checked;
                                                                        setPermisosCompra({ ...permisosCompra, guardar: +e.target.checked });
                                                                    }}
                                                                />
                                                            </div>

                                                            <div className="flex flex-row-reverse items-center gap-x-4">
                                                                <label className="text-left text-amber-500 font-bold" htmlFor="reporte_compra">
                                                                    Reporte
                                                                </label>
                                                                <input
                                                                    className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-amber-500"
                                                                    type="checkbox"
                                                                    id="reporte_compra"
                                                                    checked={permisionCRUD.reporte ? true : false}
                                                                    onChange={(e) => {
                                                                        permisionCRUD.reporte = +e.target.checked;
                                                                        setPermisosCompra({ ...permisosCompra, reporte: +e.target.checked });
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                        )
                                    }
                                </div>



                                {/* Pemission billing */}
                                <div className="w-full gap-x-1 flex flex-row-reverse items-center justify-end">
                                    <label className="text-left  font-bold" htmlFor="venta">
                                        Venta
                                    </label>
                                    <input
                                        className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
                                        type="checkbox"
                                        id="venta"
                                        checked={permission.venta ? true : false}
                                        onChange={(e) => {
                                            // eslint-disable-next-line react-hooks/immutability
                                            permission.venta = +e.target.checked;
                                            setPermissionsUserAddORUpdate({ ...permissionsUserAddORUpdate, venta: +e.target.checked });
                                        }}
                                    />
                                </div>
                                <div className="w-36 ml-4">
                                    {
                                        permission.venta == 1 && (
                                            <div className="bg-slate-50 dark:bg-slate-800 h-auto border border-gray-300 dark:border-gray-700 rounded-b-md w-auto px-4">
                                                {
                                                    permission.permisos_venta.map((permisionCRUD) => (
                                                        <div
                                                            className="flex items-start flex-col"
                                                            key={permisionCRUD.key}
                                                        >

                                                            <div className="flex flex-row-reverse items-center gap-x-4">
                                                                <label className="text-left text-cyan-600 dark:text-cyan-300 font-bold" htmlFor="guardar_venta">
                                                                    Guardar
                                                                </label>
                                                                <input
                                                                    className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-cyan-600 dark:accent-cyan-300"
                                                                    type="checkbox"
                                                                    id="guardar_venta"
                                                                    checked={permisionCRUD.guardar ? true : false}
                                                                    onChange={(e) => {
                                                                        permisionCRUD.guardar = +e.target.checked;
                                                                        setPermisosVentas({ ...permisosVentas, guardar: +e.target.checked });
                                                                    }}
                                                                />
                                                            </div>

                                                            <div className="flex flex-row-reverse items-center gap-x-4">
                                                                <label className="text-left text-amber-500 font-bold" htmlFor="reporte_venta">
                                                                    Reporte
                                                                </label>
                                                                <input
                                                                    className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-amber-500"
                                                                    type="checkbox"
                                                                    id="reporte_venta"
                                                                    checked={permisionCRUD.reporte ? true : false}
                                                                    onChange={(e) => {
                                                                        permisionCRUD.reporte = +e.target.checked;
                                                                        setPermisosVentas({ ...permisosVentas, reporte: +e.target.checked });
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                        )
                                    }
                                </div>

                                {/* Pemission kardex */}
                                <div className="w-full gap-x-1 flex flex-row-reverse items-center justify-end">
                                    <label className="text-left  font-bold" htmlFor="kardex">
                                        Kardex
                                    </label>
                                    <input
                                        className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
                                        type="checkbox"
                                        id="kardex"
                                        checked={permission.kardex ? true : false}
                                        onChange={(e) => {
                                            // eslint-disable-next-line react-hooks/immutability
                                            permission.kardex = +e.target.checked;
                                            setPermissionsUserAddORUpdate({ ...permissionsUserAddORUpdate, kardex: +e.target.checked });
                                        }}
                                    />
                                </div>

                                {/* Pemission reports inventory */}
                                <div className="w-full gap-x-1 flex flex-row-reverse items-center justify-end">
                                    <label className="text-left  font-bold" htmlFor="reportes_inventario">
                                        Reportes inventario
                                    </label>
                                    <input
                                        className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
                                        type="checkbox"
                                        id="reportes_inventario"
                                        checked={permission.reportes_inventario ? true : false}
                                        onChange={(e) => {
                                            // eslint-disable-next-line react-hooks/immutability
                                            permission.reportes_inventario = +e.target.checked;
                                            setPermissionsUserAddORUpdate({ ...permissionsUserAddORUpdate, reportes_inventario: +e.target.checked });
                                        }}
                                    />
                                </div>

                                {/* Pemission general reports */}
                                <div className="w-full gap-x-1 flex flex-row-reverse items-center justify-end">
                                    <label className="text-left  font-bold" htmlFor="reportes">
                                        Reportes generales
                                    </label>
                                    <input
                                        className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
                                        type="checkbox"
                                        id="reportes"
                                        checked={permission.reportes ? true : false}
                                        onChange={(e) => {
                                            // eslint-disable-next-line react-hooks/immutability
                                            permission.reportes = +e.target.checked;
                                            setPermissionsUserAddORUpdate({ ...permissionsUserAddORUpdate, reportes: +e.target.checked });
                                        }}
                                    />
                                </div>

                                {/* Pemission company */}
                                <div className="w-full gap-x-1 flex flex-row-reverse items-center justify-end">
                                    <label className="text-left  font-bold" htmlFor="empresa">
                                        Empresa
                                    </label>
                                    <input
                                        className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800"
                                        type="checkbox"
                                        id="empresa"
                                        checked={permission.empresa ? true : false}
                                        onChange={(e) => {
                                            // eslint-disable-next-line react-hooks/immutability
                                            permission.empresa = +e.target.checked;
                                            setPermissionsUserAddORUpdate({ ...permissionsUserAddORUpdate, empresa: +e.target.checked });
                                        }}
                                    />
                                </div>
                                <div className="w-36 ml-4">
                                    {
                                        permission.empresa == 1 && (
                                            <div className="bg-slate-50 dark:bg-slate-800 h-auto border border-gray-300 dark:border-gray-700 rounded-b-md w-auto px-4">
                                                {
                                                    permission.permisos_empresa.map((permisionCRUD) => (
                                                        <div
                                                            className="flex items-start flex-col"
                                                            key={permisionCRUD.key}
                                                        >

                                                            <div className="flex flex-row-reverse items-center gap-x-4">
                                                                <label className="text-left text-cyan-600 dark:text-cyan-300 font-bold" htmlFor="guardar_empresa">
                                                                    Guardar
                                                                </label>
                                                                <input
                                                                    className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-cyan-600 dark:accent-cyan-300"
                                                                    type="checkbox"
                                                                    id="guardar_empresa"
                                                                    checked={permisionCRUD.guardar ? true : false}
                                                                    onChange={(e) => {
                                                                        permisionCRUD.guardar = +e.target.checked;
                                                                        setPermisosEmpresa({ ...permisosEmpresa, guardar: +e.target.checked });
                                                                    }}
                                                                />
                                                            </div>

                                                            <div className="flex flex-row-reverse items-center gap-x-4">
                                                                <label className="text-left text-green-600 font-bold" htmlFor="modificar_empresa">
                                                                    Modificar
                                                                </label>
                                                                <input
                                                                    className="py-1 px-4 font-normal text-base border border-gray-500 rounded-md placeholder:text-gray-300 outline-none focus-visible:border-gray-800 accent-green-600"
                                                                    type="checkbox"
                                                                    id="modificar_empresa"
                                                                    checked={permisionCRUD.modificar ? true : false}
                                                                    onChange={(e) => {
                                                                        permisionCRUD.modificar = +e.target.checked;
                                                                        setPermisosEmpresa({ ...permisosEmpresa, modificar: +e.target.checked });
                                                                    }}
                                                                />
                                                            </div>

                                                        </div>
                                                    ))
                                                }
                                            </div>
                                        )
                                    }
                                </div>
                            </div>
                        ))
                    }
                    <button
                        type="submit"
                        className="w-full mt-4 md:w-auto mx-auto border border-gray-300 dark:border-gray-700 py-2 px-4 bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-center gap-x-4 font-bold hover:bg-gray-300 transition-all duration-200"
                        aria-label="Close"
                    >
                        <Save className="size-5" />
                        Guardar cambios
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

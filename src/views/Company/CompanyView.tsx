import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button"
import type { AuthPermissions } from "@/types/auth.interface";
import TableEmpty from "@/components/ui-components/TableEmpty";
import { getCompanyData } from "@/apis/company.apis";
import type { CompanyFormDataInfo } from "@/types/company.interface";
import Loader from "@/components/loader";
import CreateCompany from "@/components/company/CreateCompany";
import { Edit } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import EditCompany from "@/components/company/EditCompany";

export default function CompanyView({ dataAuth }: { dataAuth: AuthPermissions }) {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search)
    const modalEditCompany = queryParams.get("editCompany");
    const showEditModal = modalEditCompany ? true : false;


    const { data, isLoading, refetch, isError } = useQuery({
        queryKey: ["company"],
        queryFn: getCompanyData,
    });

    const inputRef = useRef<HTMLInputElement>(null);
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.ctrlKey && event.key === 'b') {
                event.preventDefault();
                if (inputRef.current) {
                    inputRef.current.focus();
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    const [openDialogEditCompany, setOpenDialogEditCompany] = useState(showEditModal)
    const [editingCompany, setEditingCompany] = useState<CompanyFormDataInfo | null>(null);

    if (isError) return <Navigate to={"/404"} />
    return (
        <div className="w-full h-full flex items-center justify-center">
            {
                isLoading ? (<Loader />) :
                    (
                        <div className="h-full md:w-2/4 flex flex-col items-center justify-center w-full">
                            {
                                data?.length ?
                                    (
                                        <fieldset className="w-full h-full border border-gray-300 dark:border-gray-700 px-4 rounded-lg p-4 shadow shadow-gray-300 space-y-3 scrollbar-thin-custom scroll-smooth mx-auto touch-pan-y overflow-scroll">
                                            <legend className="font-bold uppercase">Datos de la empresa</legend>
                                            {
                                                data?.map(company => (
                                                    <>

                                                        <div className="flex items-center justify-center flex-col gap-y-1 w-full size-24">
                                                            <img src={company.logotipo == null || company.logotipo == "" || company.logotipo == undefined ? "image-notfound.svg" : company.logotipo} alt={company.nombre_empresa}
                                                                className="size-full object-contain"
                                                            />
                                                        </div>

                                                        <div className="flex items-center justify-center flex-col gap-y-1 w-full">
                                                            <label className="w-full" htmlFor="">Empresa</label>
                                                            <input className="w-full border border-gray-300 dark:border-gray-700 py-1 px-2 rounded-md" value={company.nombre_empresa} type="text" name="" id="" />
                                                        </div>

                                                        <div className="flex items-center justify-center flex-col gap-y-1 w-full">
                                                            <label className="w-full" htmlFor="">Eslogan</label>
                                                            <input className="w-full border border-gray-300 dark:border-gray-700 py-1 px-2 rounded-md" value={company.eslogan} type="text" name="" id="" />
                                                        </div>

                                                        <div className="flex items-center justify-center flex-col gap-y-1 w-full">
                                                            <label className="w-full" htmlFor="">Dirección</label>
                                                            <input className="w-full border border-gray-300 dark:border-gray-700 py-1 px-2 rounded-md" value={company.direccion_empresa} type="text" name="" id="" />
                                                        </div>

                                                        <div className="flex items-center justify-center flex-col gap-y-1 w-full">
                                                            <label className="w-full" htmlFor="">RUC</label>
                                                            <input className="w-full border border-gray-300 dark:border-gray-700 py-1 px-2 rounded-md" value={company.ruc} type="text" name="" id="" />
                                                        </div>


                                                        <div className="flex items-center justify-center md:gap-x-4 md:flex-row flex-col gap-y-4">
                                                            <div className="flex items-center justify-center flex-col gap-y-1 w-full">
                                                                <label className="w-full" htmlFor="">Telefono</label>
                                                                <input className="w-full border border-gray-300 dark:border-gray-700 py-1 px-2 rounded-md" value={company.telefono_empresa} type="text" name="" id="" />
                                                            </div>

                                                            <div className="flex items-center justify-center flex-col gap-y-1 w-full">
                                                                <label className="w-full" htmlFor="">Celular</label>
                                                                <input className="w-full border border-gray-300 dark:border-gray-700 py-1 px-2 rounded-md" value={company.celular_empresa} type="text" name="" id="" />
                                                            </div>
                                                        </div>


                                                        <div className="flex items-center justify-center flex-col gap-y-1 w-full">
                                                            <label className="w-full" htmlFor="">Correo</label>
                                                            <input className="w-full border border-gray-300 dark:border-gray-700 py-1 px-2 rounded-md" value={company.correo_empresa} type="text" name="" id="" />
                                                        </div>

                                                        <Button
                                                            className="w-full md:w-auto mx-auto mt-4 flex items-center justify-center gap-x-4 border border-gray-300 dark:border-gray-700"
                                                            variant="ghost"
                                                            onClick={() => {
                                                                setEditingCompany(company)
                                                                setOpenDialogEditCompany(!openDialogEditCompany)
                                                                refetch()

                                                                if (openDialogEditCompany) {
                                                                    navigate(location.pathname, { replace: true })
                                                                    setOpenDialogEditCompany(!openDialogEditCompany)
                                                                    refetch()
                                                                }
                                                                else {
                                                                    navigate(location.pathname + `?editCompany=${company.id}`)
                                                                    refetch()
                                                                }
                                                            }}
                                                        >
                                                            <Edit className="size-5" />
                                                            Modificar información
                                                        </Button >

                                                        {
                                                            editingCompany && (
                                                                <Dialog open={openDialogEditCompany} onOpenChange={() => {
                                                                    setOpenDialogEditCompany(!openDialogEditCompany)
                                                                    refetch()
                                                                    if (openDialogEditCompany) {
                                                                        navigate(location.pathname, { replace: true })
                                                                    }
                                                                }}>
                                                                    <EditCompany company={company} onClose={() => setEditingCompany(null)} />
                                                                </Dialog>
                                                            )
                                                        }
                                                    </>
                                                ))
                                            }
                                        </fieldset>
                                    )
                                    :
                                    (
                                        <div className="w-full h-auto border border-gray-300 dark:border-gray-700 px-4 rounded-lg p-4 shadow shadow-gray-300 space-y-4 flex items-center justify-center flex-col">
                                            <TableEmpty />
                                            <h3 className="font-bold uppercase">Aún no hay información de la empresa...</h3>
                                            {
                                                dataAuth.permisos_empresa[0].guardar == 1 ?
                                                    (
                                                        <CreateCompany />
                                                    )
                                                    :
                                                    (null)
                                            }
                                        </div>
                                    )
                            }
                        </div>
                    )
            }
        </div >
    )
}

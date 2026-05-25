import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button"
import type { AuthPermissions } from "@/types/auth.interface";
import TableEmpty from "@/components/ui-components/TableEmpty";
import { getCompanyData } from "@/apis/company.apis";
import type { CompanyFormDataInfo } from "@/types/company.interface";
import Loader from "@/components/loader";

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
                            <fieldset className="w-full h-full border border-gray-300 dark:border-gray-700 px-4 rounded-lg p-4 shadow shadow-gray-300 space-y-3">
                                <legend className="font-bold uppercase">Datos de la empresa</legend>
                                <label htmlFor="">Empresa</label>
                                <input value={data != undefined ? data[0].nombre_empresa : ""} type="text" name="" id="" />

                            </fieldset>
                        </div>
                    )
            }
        </div >
    )
}

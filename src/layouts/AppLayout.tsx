/* eslint-disable react-hooks/set-state-in-effect */
import Loader from "@/components/loader";
import { useAuth } from "@/hooks/useAuth";
import { Navigate, Outlet, useLocation } from "react-router-dom";

import { AppSidebar } from "@/components/sidebar/app-sidebar"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { useEffect, useState } from "react";

export default function AppLayout() {
    const location = useLocation();
    const { dataAuth, isError, isLoadingAuth } = useAuth();

    const [getPathname, setGetPathname] = useState("");

    useEffect(() => {
        setGetPathname(location.pathname);
    }, [location.pathname]);

    if (isError) {
        return <Navigate to="/auth/login" />
    }

    if (dataAuth)
        return (
            <>

                <div className="h-96 w-[98%] mx-auto bg-white bg-linear-to-b dark:from-gray-700 from-gray-200 dark:via-gray-900 via-gray-400 to-black">
                    {isLoadingAuth ? (
                        <div className="flex items-center md:my-40 my-16 justify-center">
                            <Loader />
                        </div>
                    ) : (
                        <SidebarProvider>
                            <AppSidebar />
                            <SidebarInset>
                                <header className="flex h-16 shrink-0 items-center gap-2">
                                    <div className="flex items-center gap-2 px-4">
                                        <SidebarTrigger className="-ml-1" />
                                        <Separator
                                            orientation="vertical"
                                            className="mr-2 data-[orientation=vertical]:h-4"
                                        />
                                        <Breadcrumb>
                                            <BreadcrumbList>
                                                <BreadcrumbItem className="hidden md:block">
                                                    <BreadcrumbLink href="/">
                                                        Inicio
                                                    </BreadcrumbLink>
                                                </BreadcrumbItem>
                                                <BreadcrumbSeparator className="hidden md:block" />
                                                <BreadcrumbItem>
                                                    <BreadcrumbPage>
                                                        {
                                                            getPathname == "/" && <div>Dashboard</div>
                                                        }
                                                        <h2>
                                                            {
                                                                getPathname == "/users" && "Usuario" ||
                                                                getPathname == "/suppliers" && "Proveedores" ||
                                                                getPathname == "/customers" && "Clientes" ||
                                                                getPathname == "/brands" && "Marcas" ||
                                                                getPathname == "/categories" && "Categorías" ||
                                                                getPathname == "/products" && "Productos" ||
                                                                getPathname == "/inventory" && "Inventario" ||
                                                                getPathname == "/buys" && "Compras" ||
                                                                getPathname == "/salesQuote" && "Proforma" ||
                                                                getPathname == "/sales" && "Venta" ||
                                                                getPathname == "/kardex" && "Kardex" ||
                                                                getPathname == "/reportsInventory" && "Reportes" ||
                                                                getPathname == "/copyAndRestore" && "Copia y Resturación" ||
                                                                getPathname == "/company" && "Empresa" ||
                                                                getPathname == "/expiredProducts" && "Productos vencidos" ||
                                                                getPathname == "/damagedProducts" && "Productos deteriorados"
                                                            }
                                                        </h2>
                                                    </BreadcrumbPage>
                                                </BreadcrumbItem>
                                            </BreadcrumbList>
                                        </Breadcrumb>
                                    </div>
                                </header>
                                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                                    <main className="h-full w-full flex items-center justify-center">
                                        <Outlet />
                                    </main>
                                </div>
                            </SidebarInset>
                        </SidebarProvider>
                    )
                    }
                </div>
            </>
        )
}

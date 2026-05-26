import * as React from "react"
import { NavMain } from "@/components/sidebar/nav-main"
import { NavUser } from "@/components/sidebar/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { dataMenu } from "./data.menu"
import { useAuth } from "@/hooks/useAuth";
import { getDataInitial } from "@/apis/querysInitial.apis";
import { useQuery } from "@tanstack/react-query";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { dataAuth } = useAuth();
  const { data } = useQuery({
    queryKey: ["/"],
    queryFn: getDataInitial,
  });

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a
                href="/"
                className="flex items-center justify-center top-0 sticky border-b border-gray-300 h-40 w-full"
              >
                <img
                  loading="lazy"
                  draggable="false"
                  src={data == undefined || data![0].dataImagen!.logotipo == undefined || data![0].dataImagen!.logotipo == null || data![0].dataImagen!.logotipo == "" ? "https://i.ibb.co/cb71m98/your-logo-here.webp" : data![0].dataImagen!.logotipo}
                  alt="logo" className="size-40 object-contain"
                />
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={dataMenu.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={{
          id_usuario: dataAuth?.id || "",
          nombre_completo: dataAuth?.nombre_completo || "",
          correo_usuario: dataAuth?.correo_usuario || "",
          tipo_usuario: dataAuth?.tipo_usuario || ""
        }} />
      </SidebarFooter>
    </Sidebar>
  )
}

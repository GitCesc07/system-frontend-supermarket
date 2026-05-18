"use client"

import * as React from "react"
import {
  Command
} from "lucide-react"

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
import { useAuth } from "@/hooks/useAuth"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { dataAuth } = useAuth();
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Acme Inc</span>
                  <span className="truncate text-xs">Enterprise</span>
                </div>
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

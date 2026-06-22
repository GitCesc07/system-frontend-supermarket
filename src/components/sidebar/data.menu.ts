import type { AuthPermissions } from "@/types/auth.interface";
import {
    BadgeCheck,
    BadgeDollarSign,
    Ban,
    Combine,
    Database,
    Hammer,
    Home,
    Package,
    PackagePlus,
    ShoppingCartIcon,
    Store,
    Truck,
    User,
    UserCheck,
} from "lucide-react"

const authData = localStorage.getItem("authData");
const itemVisible = JSON.parse(authData!) as AuthPermissions[];


export const dataMenu = {
    navMain: [
        {
            title: "Dashboard",
            url: "/",
            icon: Home,
            isVisible: true
        },
        {
            title: "Usuarios",
            url: "/users",
            icon: User,
            isVisible: itemVisible != null ? itemVisible[0].usuario == 1 ? true : false : false
        },
        {
            title: "Proveedores",
            url: "/suppliers",
            icon: Truck,
            isVisible: itemVisible != null ? itemVisible[0].proveedor == 1 ? true : false : false
        },
        {
            title: "Clientes",
            url: "/customers",
            icon: UserCheck,
            isVisible: itemVisible != null ? itemVisible[0].cliente == 1 ? true : false : false
        },
        {
            title: "Marcas",
            url: "/brands",
            icon: BadgeCheck,
            isVisible: itemVisible != null ? itemVisible[0].marca == 1 ? true : false : false
        },
        {
            title: "Categorías",
            url: "/categories",
            icon: Combine,
            isVisible: itemVisible != null ? itemVisible[0].categoria == 1 ? true : false : false
        },
        {
            title: "Productos",
            url: "/products",
            icon: Hammer,
            isVisible: itemVisible != null ? itemVisible[0].producto == 1 ? true : false : false
        },
        {
            title: "Productos vencidos",
            url: "/expiredProducts",
            icon: Ban,
            isVisible: itemVisible != null ? itemVisible[0].producto == 1 ? true : false : false
        },
        {
            title: "Productos deteriorados",
            url: "/damagedProducts",
            icon: Ban,
            isVisible: itemVisible != null ? itemVisible[0].producto == 1 ? true : false : false
        },
        {
            title: "Inventario",
            url: "/inventory",
            icon: Package,
            isVisible: itemVisible != null ? itemVisible[0].inventario == 1 ? true : false : false
        },
        {
            title: "Compras",
            url: "/buys",
            icon: ShoppingCartIcon,
            isVisible: itemVisible != null ? itemVisible[0].compra == 1 ? true : false : false
        },
        {
            title: "Ventas",
            url: "/sales",
            icon: BadgeDollarSign,
            isVisible: itemVisible != null ? itemVisible[0].venta == 1 ? true : false : false
        },
        {
            title: "Kardex",
            url: "/kardex",
            icon: PackagePlus,
            isVisible: itemVisible != null ? itemVisible[0].kardex == 1 ? true : false : false
        },
        {
            title: "Empresa",
            url: "/company",
            icon: Store,
            isVisible: itemVisible != null ? itemVisible[0].empresa == 1 ? true : false : false
        },
        {
            title: "Copia y Resturación",
            url: "/backupAndRestore",
            icon: Database,
            isVisible: itemVisible != null ? itemVisible[0].empresa == 1 ? true : false : false
        }
    ]
}
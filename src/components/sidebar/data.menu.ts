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

export const dataMenu = {
    user: {
        name: "shadcn",
        email: "m@example.com",
        avatar: "/avatars/shadcn.jpg",
    },
    navMain: [
        {
            title: "Dashboard",
            url: "/",
            icon: Home
        },
        {
            title: "Usuarios",
            url: "/users",
            icon: User
        },
        {
            title: "Proveedores",
            url: "/suppliers",
            icon: Truck
        },
        {
            title: "Clientes",
            url: "/customers",
            icon: UserCheck
        },
        {
            title: "Marcas",
            url: "/brands",
            icon: BadgeCheck
        },
        {
            title: "Categorías",
            url: "/categories",
            icon: Combine
        },
        {
            title: "Productos",
            url: "/products",
            icon: Hammer
        },
        {
            title: "Productos vencidos",
            url: "/expiredProducts",
            icon: Ban
        },
        {
            title: "Productos deteriorados",
            url: "/damagedProducts",
            icon: Ban
        },
        {
            title: "Inventario",
            url: "/inventory",
            icon: Package
        },
        {
            title: "Compras",
            url: "/buys",
            icon: ShoppingCartIcon
        },
        {
            title: "Ventas",
            url: "/sales",
            icon: BadgeDollarSign
        },
        {
            title: "Kardex",
            url: "/kardex",
            icon: PackagePlus
        },
        {
            title: "Empresa",
            url: "/company",
            icon: Store
        },
        {
            title: "Copia y Resturación",
            url: "/backupAndRestore",
            icon: Database
        }
    ]
}
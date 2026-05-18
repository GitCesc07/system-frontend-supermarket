import { Outlet } from "react-router-dom";

export function AuthLayout() {
    return (
        <div className="h-lvh w-full">
            <Outlet />
        </div>
    );
}
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginView from "./views/Auth/LoginView";
import { useAuth } from "./hooks/useAuth";
import { AuthLayout } from "./layouts/AuthLayout";
import AppLayout from "./layouts/AppLayout";
import ForgoPasswordView from "./views/Auth/ForgoPasswordView";
import ConfirmAccountView from "./views/Auth/ConfirmAccountView";
import RequestCodeView from "./views/Auth/RequestCodeView";
import NewpasswordView from "./views/Auth/NewpasswordView";
import UsersView from "./views/Users/UsersView";
import DashboardView from "./views/DashboardView";
import SuppliersView from "./views/Suppliers/SuppliersView";
import CustomersView from "./views/Customers/CustomersView";
import BrandsView from "./views/Brands/BrandsView";
import CategoriesView from "./views/Categories/CategoriesView";
import ProductsView from "./views/Products/ProductsView";
import BuysView from "./views/Buys/BuysView";
import InventoryView from "./views/Inventory/InventoryView";
import KardexView from "./views/Kardex/KardexView";
import CompanyView from "./views/Company/CompanyView";
import ExpiredProductsView from "./views/ExpiredProducts/ExpiredProductsView";
import PageNotFound from "./components/PageNotFound";
import BackupAndRestoreView from "./views/BackupAndRestore/BackupAndRestoreView";

export function Router() {
  const { dataAuth } = useAuth();
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/auth/login" element={<LoginView />} />
          <Route path="/auth/forgot-password" element={<ForgoPasswordView />} />
          <Route path="/auth/confirm-account" element={<ConfirmAccountView />} />
          <Route path="/auth/request-code" element={<RequestCodeView />} />
          <Route path="/auth/new-password" element={<NewpasswordView />} />
          <Route path="*" element={<PageNotFound />} />
        </Route>

        <Route element={<AppLayout />}>
          <Route path="/" element={<DashboardView />} />
          {
            dataAuth?.usuario && (<Route path="/users" element={<UsersView dataAuth={dataAuth} />} />)
          }
          {
            dataAuth?.proveedor && (<Route path="/suppliers" element={<SuppliersView dataAuth={dataAuth} />} />)
          }
          {
            dataAuth?.cliente && (<Route path="/customers" element={<CustomersView dataAuth={dataAuth} />} />)
          }
          {
            dataAuth?.marca && (<Route path="/brands" element={<BrandsView dataAuth={dataAuth} />} />)
          }
          {
            dataAuth?.marca && (<Route path="/categories" element={<CategoriesView dataAuth={dataAuth} />} />)
          }
          {
            dataAuth?.marca && (<Route path="/products" element={<ProductsView dataAuth={dataAuth} />} />)
          }
          {
            dataAuth?.marca && (<Route path="/buys" element={<BuysView dataAuth={dataAuth} />} />)
          }
          {
            dataAuth?.marca && (<Route path="/inventory" element={<InventoryView dataAuth={dataAuth} />} />)
          }
          {
            dataAuth?.marca && (<Route path="/kardex" element={<KardexView dataAuth={dataAuth} />} />)
          }
          {
            dataAuth?.empresa && (<Route path="/company" element={<CompanyView dataAuth={dataAuth} />} />)
          }
          {
            dataAuth?.producto && (<Route path="/expiredProducts" element={<ExpiredProductsView dataAuth={dataAuth} />} />)
          }

          {
            dataAuth?.empresa && dataAuth.tipo_usuario == import.meta.env.VITE_TYPEFROM_USER && (<Route path="/backupAndRestore" element={<BackupAndRestoreView dataAuth={dataAuth} />} />)
          }
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default Router

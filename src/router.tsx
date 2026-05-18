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
          <Route path="*" element={<div>404</div>} />
        </Route>

        <Route element={<AppLayout />}>
          <Route path="/" element={<DashboardView />} />
          {
            dataAuth?.usuario && (<Route path="/users" element={<UsersView dataAuth={dataAuth} />} />)
          }
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default Router

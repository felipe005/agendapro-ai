import { Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "./layouts/AppLayout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";
import { ClientsPage } from "./pages/ClientsPage";
import { AgendaPage } from "./pages/AgendaPage";
import { ServicesPage } from "./pages/ServicesPage";
import { CompanyPage } from "./pages/CompanyPage";
import { FinancePage } from "./pages/FinancePage";
import { InsightsPage } from "./pages/InsightsPage";
import { useAuth } from "./hooks/useAuth";

const LoginRoute = () => {
  const { authenticated } = useAuth();

  if (authenticated) {
    return <Navigate to="/" replace />;
  }

  return <LoginPage />;
};

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginRoute />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="clientes" element={<ClientsPage />} />
        <Route path="agenda" element={<AgendaPage />} />
        <Route path="servicos" element={<ServicesPage />} />
        <Route path="empresa" element={<CompanyPage />} />
        <Route path="caixa" element={<FinancePage />} />
        <Route path="insights" element={<InsightsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

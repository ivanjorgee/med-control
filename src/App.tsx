
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { MedicineProvider } from "@/contexts/MedicineContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import LoginPage from "./pages/login";
import Index from "./pages/Index";
import StockPage from "./pages/stock";
import DistributionPage from "./pages/distribution";
import ExpirationPage from "./pages/expiration";
import UsersPage from "./pages/users";
import PermissionsPage from "./pages/permissions";
import LocationsPage from "./pages/locations";
import NotFound from "./pages/NotFound";
import MedicationRegisterPage from "./pages/medication-register";
import MedicationDispensingPage from "./pages/medication-dispensing";
import MedicationRequestPage from "./pages/medication-request";
import AboutPage from "./pages/about";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <MedicineProvider>
          <BrowserRouter>
            <Toaster />
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/about" element={<AboutPage />} />
              
              {/* Rotas protegidas para todos os usuários */}
              <Route element={<ProtectedRoute />}>
                <Route path="/" element={<Index />} />
                <Route path="/stock" element={<StockPage />} />
                <Route path="/distribution" element={<DistributionPage />} />
                <Route path="/expiration" element={<ExpirationPage />} />
              </Route>
              
              {/* Rota protegida para administradores e farmacêuticos */}
              <Route element={<ProtectedRoute requiresPharmacist={true} />}>
                <Route path="/medication-dispensing" element={<MedicationDispensingPage />} />
                <Route path="/medication-request" element={<MedicationRequestPage />} />
                <Route path="/medication-register" element={<MedicationRegisterPage />} />
              </Route>
              
              {/* Rotas protegidas apenas para administradores */}
              <Route element={<ProtectedRoute requiresAdmin={true} />}>
                <Route path="/users" element={<UsersPage />} />
                <Route path="/permissions" element={<PermissionsPage />} />
                <Route path="/locations" element={<LocationsPage />} />
              </Route>
              
              {/* Rota para páginas não encontradas */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </MedicineProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;


import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton, 
  SidebarTrigger 
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { AppLogo } from "@/components/AppLogo";
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  Settings, 
  LogOut, 
  Calendar, 
  ShieldCheck, 
  Building,
  BarChart3,
  UserPlus,
  ChevronLeft,
  FileText,
  Pill
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export function AppSidebar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { logout, authUser, isAdmin } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Check if user is a pharmacist
  const isPharmacist = authUser?.role === "pharmacist";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Sidebar>
      <SidebarHeader className="p-4 border-b">
        <div className="flex items-center">
          <AppLogo />
          <SidebarTrigger>
            <Button variant="ghost" size="sm" className="ml-auto">
              <ChevronLeft className={`transition-transform ${sidebarOpen ? "rotate-180" : ""}`} />
              <span className="sr-only">Toggle Sidebar</span>
            </Button>
          </SidebarTrigger>
        </div>
        {authUser && (
          <div className="mt-3 space-y-1 text-sm text-muted-foreground">
            <div className="font-medium text-foreground">{authUser.name}</div>
            <div>{authUser.role === "admin" ? "Administrador" : authUser.role === "pharmacist" ? "Farmacêutico" : "Usuário"}</div>
            <div className="text-xs">{authUser.locationName}</div>
          </div>
        )}
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/"}>
              <Link to="/">
                <LayoutDashboard className="h-4 w-4 mr-2" />
                Dashboard
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/stock"}>
              <Link to="/stock">
                <Package className="h-4 w-4 mr-2" />
                Estoque
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/distribution"}>
              <Link to="/distribution">
                <Calendar className="h-4 w-4 mr-2" />
                Distribuição
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/expiration"}>
              <Link to="/expiration">
                <Calendar className="h-4 w-4 mr-2" />
                Vencimentos
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* Exibir apenas para administradores, não para farmacêuticos */}
          {!isPharmacist && (
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === "/medication-register"}>
                <Link to="/medication-register">
                  <Package className="h-4 w-4 mr-2" />
                  Cadastro de Medicamentos
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
          
          {/* Exibir apenas para farmacêuticos */}
          {isPharmacist && (
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === "/medication-dispensing"}>
                <Link to="/medication-dispensing">
                  <FileText className="h-4 w-4 mr-2" />
                  Dispensação de Medicamentos
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}

          {/* Seção Admin - Apenas para administradores */}
          {isAdmin && (
            <>
              <div className="mt-6 pt-4 border-t">
                <h3 className="px-2 text-xs font-medium text-muted-foreground mb-2">ADMINISTRAÇÃO</h3>
              </div>

              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/locations"}>
                  <Link to="/locations">
                    <Building className="h-4 w-4 mr-2" />
                    Unidades
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/users"}>
                  <Link to="/users">
                    <Users className="h-4 w-4 mr-2" />
                    Usuários
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/permissions"}>
                  <Link to="/permissions">
                    <ShieldCheck className="h-4 w-4 mr-2" />
                    Permissões
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </>
          )}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-2 mt-auto border-t">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

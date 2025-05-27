
import { Button } from "@/components/ui/button";
import { MainLayout } from "@/layouts/MainLayout";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { FileQuestion } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: Usuário tentou acessar rota inexistente:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <div className="bg-[#E5F0FF] p-4 rounded-full mb-6">
          <FileQuestion className="h-16 w-16 text-[#0052CC]" />
        </div>
        <h1 className="text-6xl font-bold text-[#0052CC] mb-4">404</h1>
        <p className="text-xl text-[#1C1C1C] mb-4">Oops! Página não encontrada</p>
        <p className="text-[#1C1C1C]/70 mb-8 text-center max-w-md">
          A página que você está procurando não existe ou foi movida.
        </p>
        <Button asChild className="bg-[#0052CC] hover:bg-[#0052CC]/90">
          <a href="/">Voltar para o Dashboard</a>
        </Button>
      </div>
    </MainLayout>
  );
};

export default NotFound;


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MainLayout } from "@/layouts/MainLayout";

const AboutPage = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <Card className="mx-auto max-w-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Sobre o Cura Saúde Central</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-center space-x-4">
              <img 
                src="/lovable-uploads/12c04d39-ea85-4e5b-8cfa-8563284f1ed5.png" 
                alt="Logo Cura Saúde" 
                className="h-24"
              />
              <img 
                src="/lovable-uploads/a9b2c671-4ebc-40fd-bccc-770023fa0df9.png" 
                alt="Logo SUS" 
                className="h-24" 
              />
            </div>
            
            <p className="text-center text-muted-foreground">
              Versão 1.0.0
            </p>
            
            <div className="mt-4 text-center">
              <p className="text-sm text-muted-foreground">
                Sistema de Gerenciamento de Medicamentos
              </p>
              <p className="text-sm text-muted-foreground">
                © 2025 Cura Saúde Central - Todos os direitos reservados
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default AboutPage;

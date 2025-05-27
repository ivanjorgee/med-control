
import { MainLayout } from "@/layouts/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package } from "lucide-react";
import { MedicationRequestHeader } from "@/components/medication-request/MedicationRequestHeader";
import { MedicationRequestForm } from "@/components/medication-request/MedicationRequestForm";

const MedicationRequestPage = () => {
  return (
    <MainLayout>
      <MedicationRequestHeader />

      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            <Package className="mr-2 h-5 w-5" /> Formulário de Solicitação
          </CardTitle>
        </CardHeader>
        <CardContent>
          <MedicationRequestForm />
        </CardContent>
      </Card>
    </MainLayout>
  );
};

export default MedicationRequestPage;

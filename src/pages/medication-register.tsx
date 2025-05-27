
import { useState, useEffect } from "react";
import { MainLayout } from "@/layouts/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import { MedicationForm } from "@/components/medication/MedicationForm";
import { MedicationHeader } from "@/components/medication/MedicationHeader";
import { useForm } from "react-hook-form";
import { medicationSchema } from "@/components/medication/MedicationForm";

const MedicationRegisterPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { authUser } = useAuth();
  
  // Form setup just for the submit handler in the header
  const form = useForm({
    resolver: undefined, // We don't need validation here as it's handled in the child component
  });

  return (
    <MainLayout>
      <MedicationHeader
        title="Cadastro de Medicamento"
        description="Adicione um novo medicamento ao estoque da central."
        isSubmitting={isSubmitting}
        onSubmit={form.handleSubmit(() => document.querySelector('form')?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true })))}
      />

      <MedicationForm defaultLocationId={authUser?.locationId} />
    </MainLayout>
  );
};

export default MedicationRegisterPage;

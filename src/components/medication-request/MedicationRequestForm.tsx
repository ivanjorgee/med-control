
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { useMedicines } from "@/contexts/MedicineContext";
import { useAuth } from "@/contexts/AuthContext";
import { v4 as uuidv4 } from 'uuid';
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Send } from "lucide-react";
import { MedicationNameField } from "./form-fields/MedicationNameField";
import { QuantityFields } from "./form-fields/QuantityFields";
import { UrgencyField } from "./form-fields/UrgencyField";
import { ReasonField } from "./form-fields/ReasonField";

const requestSchema = z.object({
  medicationName: z.string().min(1, "Nome do medicamento é obrigatório"),
  quantity: z.string().min(1, "Quantidade é obrigatória"),
  measureUnit: z.string().min(1, "Unidade de medida é obrigatória"),
  urgency: z.string().min(1, "Nível de urgência é obrigatório"),
  reason: z.string().min(10, "Justificativa deve ter pelo menos 10 caracteres"),
});

export type RequestFormData = z.infer<typeof requestSchema>;

export const MedicationRequestForm = () => {
  const { toast } = useToast();
  const { medicines } = useMedicines();
  const { authUser } = useAuth();
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  
  // Load existing requests on component mount
  useEffect(() => {
    const savedRequests = localStorage.getItem('medcontrol_medication_requests');
    if (savedRequests) {
      setPendingRequests(JSON.parse(savedRequests));
    }
  }, []);
  
  // Get unique medication names from the inventory
  const medicationOptions = [...new Set(medicines.map((med) => med.name))];
  
  const form = useForm<RequestFormData>({
    resolver: zodResolver(requestSchema),
    defaultValues: {
      medicationName: "",
      quantity: "",
      measureUnit: "",
      urgency: "normal",
      reason: "",
    },
  });

  const onSubmit = (data: RequestFormData) => {
    // Create a new request object
    const newRequest = {
      id: uuidv4(),
      medicationName: data.medicationName,
      quantity: data.quantity,
      measureUnit: data.measureUnit,
      urgency: data.urgency,
      reason: data.reason,
      requesterName: authUser?.name || "Usuário",
      unitName: authUser?.locationName || "Unidade não especificada",
      unitId: authUser?.locationId || "",
      date: new Date().toISOString(),
      status: "pending"
    };
    
    // Save to state and localStorage
    const updatedRequests = [...pendingRequests, newRequest];
    setPendingRequests(updatedRequests);
    localStorage.setItem('medcontrol_medication_requests', JSON.stringify(updatedRequests));
    
    toast({
      title: "Solicitação enviada",
      description: "Sua solicitação de medicamento foi enviada ao administrador para aprovação.",
    });
    
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <MedicationNameField control={form.control} medicationOptions={medicationOptions} />
          <QuantityFields control={form.control} />
          <UrgencyField control={form.control} />
          <ReasonField control={form.control} />
        </div>

        <div className="flex justify-end">
          <Button type="submit" className="bg-[#0052CC] hover:bg-[#0052CC]/90">
            <Send className="mr-2 h-4 w-4" /> Enviar Solicitação
          </Button>
        </div>
      </form>
    </Form>
  );
};

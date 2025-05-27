
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Medicine, MedicineStatus } from "@/types";
import { MedicationBasicFields } from "./MedicationBasicFields";
import { MedicationQuantityFields } from "./MedicationQuantityFields";
import { MedicationDetailsFields } from "./MedicationDetailsFields";
import { MedicationResponsibilityFields } from "./MedicationResponsibilityFields";
import { Form } from "@/components/ui/form";
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from "react-router-dom";
import { useMedicines } from "@/contexts/MedicineContext";

export const medicationSchema = z.object({
  name: z.string().min(3, { message: "O nome deve ter pelo menos 3 caracteres" }),
  description: z.string().optional(),
  category: z.string().min(1, { message: "Selecione uma categoria" }),
  quantity: z.coerce.number().min(1, { message: "A quantidade deve ser maior que 0" }),
  measureUnit: z.string().min(1, { message: "Selecione uma unidade de medida" }),
  batchNumber: z.string().min(1, { message: "Informe o número do lote" }),
  expirationDate: z.date({ required_error: "Informe a data de validade" }),
  manufacturer: z.string().min(1, { message: "Informe o fabricante" }),
  minQuantity: z.coerce.number().min(1, { message: "A quantidade mínima deve ser maior que 0" }),
  responsiblePerson: z.string().min(1, { message: "Selecione um responsável" }),
  locationId: z.string().min(1, { message: "Selecione uma unidade" })
});

export type MedicationFormValues = z.infer<typeof medicationSchema>;

interface MedicationFormProps {
  defaultLocationId?: string;
}

export const MedicationForm = ({ defaultLocationId }: MedicationFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addMedicine } = useMedicines();
  const navigate = useNavigate();

  const form = useForm<MedicationFormValues>({
    resolver: zodResolver(medicationSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "",
      quantity: 0,
      measureUnit: "",
      batchNumber: "",
      manufacturer: "",
      minQuantity: 0,
      responsiblePerson: "",
      locationId: defaultLocationId || ""
    }
  });

  const onSubmit = async (data: MedicationFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Make sure all required fields are present before submitting
      if (!data.name || !data.category || !data.quantity || !data.measureUnit || 
          !data.batchNumber || !data.expirationDate || !data.manufacturer || 
          !data.minQuantity || !data.responsiblePerson || !data.locationId) {
        throw new Error("Missing required fields");
      }
      
      // Determine medicine status based on quantity and minimum quantity
      let status: MedicineStatus = 'available';
      if (data.quantity <= 0) {
        status = 'critical';
      } else if (data.quantity <= data.minQuantity) {
        status = 'low';
      }
      
      // Check if expiration date is less than 30 days from now
      const today = new Date();
      const expirationDate = new Date(data.expirationDate);
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(today.getDate() + 30);
      
      if (expirationDate <= thirtyDaysFromNow) {
        status = 'expired';
      }
      
      // Convert the data to the exact format required by addMedicine
      const medicineData: Medicine = {
        id: uuidv4(), // Generate a unique ID
        name: data.name,
        description: data.description || "",
        category: data.category,
        quantity: data.quantity,
        measureUnit: data.measureUnit,
        batchNumber: data.batchNumber,
        // Convert the Date object to an ISO string for storage
        expirationDate: data.expirationDate.toISOString(),
        manufacturer: data.manufacturer,
        minQuantity: data.minQuantity,
        status: status, // Set the status based on quantity
        locationId: data.locationId // Use the selected location ID
      };
      
      // Adicionar o medicamento usando nosso contexto
      addMedicine(medicineData);
      
      // Resetar o formulário
      form.reset();
      
      // Redirecionar para a página de estoque
      navigate("/stock");
    } catch (error) {
      console.error("Erro ao cadastrar medicamento:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações do Medicamento</CardTitle>
        <CardDescription>
          Preencha os dados do medicamento a ser cadastrado no sistema.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <MedicationBasicFields control={form.control} />
              <MedicationQuantityFields control={form.control} />
              <MedicationDetailsFields control={form.control} />
              <MedicationResponsibilityFields control={form.control} />
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

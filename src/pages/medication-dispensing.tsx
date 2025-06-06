
import { useState } from "react";
import { MainLayout } from "@/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, User, Calendar, CheckCircle, Save, X, Pill, Repeat } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useAuth } from "@/contexts/AuthContext";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { useMedicines } from "@/contexts/MedicineContext";
import { Checkbox } from "@/components/ui/checkbox";
import { addMonths, isBefore, format } from "date-fns";

const dispensingSchema = z.object({
  patientName: z.string().min(3, { message: "Nome do paciente deve ter pelo menos 3 caracteres" }),
  documentType: z.enum(["cpf", "sus"], { required_error: "Selecione o tipo de documento" }),
  patientDocument: z.string().min(8, { message: "Documento inválido" }),
  doctorName: z.string().min(3, { message: "Nome do médico deve ter pelo menos 3 caracteres" }),
  doctorCRM: z.string().min(4, { message: "CRM inválido" }),
  medicationId: z.string().min(1, { message: "Selecione um medicamento" }),
  quantity: z.coerce.number().positive({ message: "Quantidade deve ser maior que zero" }),
  notes: z.string().optional(),
  prescriptionDate: z.string().min(1, { message: "Informe a data da receita" }),
  continuousUse: z.boolean().default(false),
  nextReturnDate: z.string().optional()
}).refine((data) => {
  if (data.continuousUse && !data.nextReturnDate) {
    return false;
  }
  return true;
}, {
  message: "Data do próximo retorno é obrigatória para uso contínuo",
  path: ["nextReturnDate"]
});

type DispensingFormValues = z.infer<typeof dispensingSchema>;

const MedicationDispensingPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [password, setPassword] = useState("");
  const [formData, setFormData] = useState<DispensingFormValues | null>(null);
  const { authUser, login } = useAuth();
  const { toast } = useToast();
  const { medicines, updateMedicine } = useMedicines();

  const form = useForm<DispensingFormValues>({
    resolver: zodResolver(dispensingSchema),
    defaultValues: {
      patientName: "",
      documentType: "cpf",
      patientDocument: "",
      doctorName: "",
      doctorCRM: "",
      medicationId: "",
      quantity: 1,
      notes: "",
      prescriptionDate: new Date().toISOString().split("T")[0],
      continuousUse: false,
      nextReturnDate: ""
    }
  });

  const watchContinuousUse = form.watch("continuousUse");

  const handleSubmit = (data: DispensingFormValues) => {
    // Verificar se é uma dispensação de uso contínuo e se já existe uma dispensação recente
    if (data.continuousUse) {
      const existingDispensings = JSON.parse(localStorage.getItem('medcontrol_dispensings') || '[]');
      const lastDispensing = existingDispensings.find((d: any) => 
        d.patientDocument === data.patientDocument && 
        d.medicationId === data.medicationId &&
        d.continuousUse === true
      );
      
      if (lastDispensing) {
        const lastDate = new Date(lastDispensing.created_at);
        const oneMonthLater = addMonths(lastDate, 1);
        const today = new Date();
        
        if (isBefore(today, oneMonthLater)) {
          toast({
            variant: "destructive",
            title: "Dispensação não permitida",
            description: `Próxima dispensação permitida apenas após ${format(oneMonthLater, 'dd/MM/yyyy')}`
          });
          return;
        }
      }
    }

    setFormData(data);
    setShowAuthDialog(true);
  };

  const confirmDispensing = async () => {
    if (!formData) return;
    
    setIsSubmitting(true);
    try {
      if (!authUser) {
        toast({
          variant: "destructive",
          title: "Erro de autenticação",
          description: "Você precisa estar autenticado para realizar esta operação."
        });
        return;
      }

      const isVerified = await login(authUser.email, password);
      
      if (!isVerified) {
        toast({
          variant: "destructive",
          title: "Senha incorreta",
          description: "Por favor, verifique sua senha e tente novamente."
        });
        return;
      }

      const selectedMedicine = medicines.find(med => med.id === formData.medicationId);
      
      if (!selectedMedicine) {
        toast({
          variant: "destructive",
          title: "Medicamento não encontrado",
          description: "O medicamento selecionado não está disponível."
        });
        return;
      }

      if (selectedMedicine.quantity < formData.quantity) {
        toast({
          variant: "destructive",
          title: "Estoque insuficiente",
          description: `Quantidade disponível: ${selectedMedicine.quantity} ${selectedMedicine.measureUnit}`
        });
        return;
      }

      // Criar registro de dispensação
      const dispensing = {
        id: crypto.randomUUID(),
        patientName: formData.patientName,
        documentType: formData.documentType,
        patientDocument: formData.patientDocument,
        doctorName: formData.doctorName,
        doctorCRM: formData.doctorCRM,
        medicationId: formData.medicationId,
        medicationName: selectedMedicine.name,
        quantity: formData.quantity,
        measureUnit: selectedMedicine.measureUnit,
        notes: formData.notes || '',
        prescriptionDate: formData.prescriptionDate,
        continuousUse: formData.continuousUse,
        nextReturnDate: formData.nextReturnDate || null,
        dispensedBy: authUser.name,
        locationId: authUser.locationId,
        locationName: authUser.locationId, // Será resolvido pelo nome da unidade
        created_at: new Date().toISOString()
      };

      // Salvar dispensação
      const existingDispensings = JSON.parse(localStorage.getItem('medcontrol_dispensings') || '[]');
      existingDispensings.unshift(dispensing);
      localStorage.setItem('medcontrol_dispensings', JSON.stringify(existingDispensings));

      // Atualizar estoque do medicamento
      const updatedMedicine = {
        ...selectedMedicine,
        quantity: selectedMedicine.quantity - formData.quantity
      };
      updateMedicine(updatedMedicine);

      toast({
        title: "Medicamento dispensado com sucesso",
        description: `${formData.quantity} ${selectedMedicine.measureUnit} de ${selectedMedicine.name} para ${formData.patientName}`,
      });

      form.reset();
      setShowAuthDialog(false);
      setPassword("");
      
    } catch (error) {
      console.error("Erro ao dispensar medicamento:", error);
      toast({
        variant: "destructive",
        title: "Erro ao dispensar medicamento",
        description: "Ocorreu um erro ao processar sua solicitação."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#1C1C1C]">Dispensação de Medicamentos</h1>
          <p className="text-[#1C1C1C]/70">
            Registre a dispensação de medicamentos para pacientes.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dados da Dispensação</CardTitle>
          <CardDescription>
            Preencha todos os dados do paciente, médico e receita para realizar a dispensação.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Dados do Paciente */}
                <div className="col-span-1 md:col-span-2">
                  <h3 className="text-lg font-medium flex items-center mb-4">
                    <User className="mr-2 h-5 w-5" />
                    Dados do Paciente
                  </h3>
                </div>
                
                <FormField
                  control={form.control}
                  name="patientName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Paciente</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome completo do paciente" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="documentType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Documento</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="cpf">CPF</SelectItem>
                          <SelectItem value="sus">Cartão SUS</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="patientDocument"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {form.watch("documentType") === "cpf" ? "CPF do Paciente" : "Número do Cartão SUS"}
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder={form.watch("documentType") === "cpf" ? "000.000.000-00" : "Número do SUS"} 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Dados do Médico e Receita */}
                <div className="col-span-1 md:col-span-2">
                  <h3 className="text-lg font-medium flex items-center mb-4 mt-4">
                    <FileText className="mr-2 h-5 w-5" />
                    Dados da Receita
                  </h3>
                </div>

                <FormField
                  control={form.control}
                  name="doctorName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Médico</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome do médico que prescreveu" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="doctorCRM"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CRM do Médico</FormLabel>
                      <FormControl>
                        <Input placeholder="Número do CRM" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="prescriptionDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data da Receita</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Dados do Medicamento */}
                <div className="col-span-1 md:col-span-2">
                  <h3 className="text-lg font-medium flex items-center mb-4 mt-4">
                    <Pill className="mr-2 h-5 w-5" />
                    Dados do Medicamento
                  </h3>
                </div>

                <FormField
                  control={form.control}
                  name="medicationId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Medicamento</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um medicamento" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {medicines
                            .filter(med => authUser?.role === "admin" || med.locationId === authUser?.locationId)
                            .map((med) => (
                            <SelectItem key={med.id} value={med.id}>
                              {med.name} - {med.batchNumber} ({med.quantity} {med.measureUnit} disponíveis)
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantidade</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="continuousUse"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="flex items-center">
                          <Repeat className="mr-2 h-4 w-4" />
                          Uso Contínuo
                        </FormLabel>
                        <FormDescription>
                          Marque esta opção se o medicamento é para uso contínuo
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                {watchContinuousUse && (
                  <FormField
                    control={form.control}
                    name="nextReturnDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data do Próximo Retorno</FormLabel>
                        <FormControl>
                          <Input 
                            type="date" 
                            {...field}
                            min={addMonths(new Date(), 1).toISOString().split('T')[0]}
                          />
                        </FormControl>
                        <FormDescription>
                          Data para a próxima retirada (mínimo 1 mês)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem className="col-span-1 md:col-span-2">
                      <FormLabel>Observações</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Observações sobre a dispensação (opcional)" 
                          className="min-h-[100px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  className="bg-[#0052CC] hover:bg-[#0052CC]/90"
                >
                  <Save className="mr-2 h-4 w-4" /> 
                  Confirmar Dispensação
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Dialog de autenticação para confirmar a dispensação */}
      <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Identidade</DialogTitle>
            <DialogDescription>
              Para finalizar a dispensação, confirme sua senha. Esta ação registrará você como responsável pela dispensação.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="auth-password">Senha</Label>
              <Input 
                id="auth-password" 
                type="password" 
                placeholder="Digite sua senha" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowAuthDialog(false)}
              disabled={isSubmitting}
            >
              <X className="mr-2 h-4 w-4" />
              Cancelar
            </Button>
            <Button 
              onClick={confirmDispensing} 
              disabled={isSubmitting || !password}
              className="bg-[#0052CC] hover:bg-[#0052CC]/90"
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              {isSubmitting ? "Processando..." : "Confirmar Dispensação"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default MedicationDispensingPage;

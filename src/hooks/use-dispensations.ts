
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from 'uuid';

export interface Dispensation {
  id: string;
  medicationId: string;
  medicationName: string;
  patientName: string;
  patientDocument: string;
  documentType: string;
  quantity: number;
  measureUnit: string;
  dispensedBy: string;
  prescriptionDate: string;
  doctorName: string;
  doctorCrm: string;
  continuousUse: boolean;
  nextReturnDate?: string;
  locationId: string;
  locationName: string;
  notes?: string;
  createdAt: string;
}

export function useDispensations() {
  const [dispensations, setDispensations] = useState<Dispensation[]>([]);
  const { authUser } = useAuth();
  const { toast } = useToast();

  // Load dispensations from localStorage
  useEffect(() => {
    const savedDispensations = localStorage.getItem('medcontrol_dispensations');
    if (savedDispensations) {
      setDispensations(JSON.parse(savedDispensations));
    }
  }, []);

  // Save dispensations to localStorage
  useEffect(() => {
    if (dispensations.length >= 0) {
      localStorage.setItem('medcontrol_dispensations', JSON.stringify(dispensations));
    }
  }, [dispensations]);

  const addDispensation = (dispensationData: Omit<Dispensation, 'id' | 'createdAt' | 'dispensedBy' | 'locationId' | 'locationName'>) => {
    const newDispensation: Dispensation = {
      id: uuidv4(),
      ...dispensationData,
      dispensedBy: authUser?.name || "Farmacêutico",
      locationId: authUser?.locationId || "",
      locationName: authUser?.locationName || "",
      createdAt: new Date().toISOString()
    };

    setDispensations(prev => [newDispensation, ...prev]);
    
    toast({
      title: "Dispensação registrada",
      description: `Dispensação de ${dispensationData.medicationName} para ${dispensationData.patientName} foi registrada com sucesso.`
    });

    return newDispensation;
  };

  return {
    dispensations,
    addDispensation
  };
}

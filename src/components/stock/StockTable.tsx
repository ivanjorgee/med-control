
import { Medicine } from "@/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Package, Eye, Edit, Trash2, AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { useLocations } from "@/hooks/use-locations";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface StockTableProps {
  medicines: Medicine[];
  isAdmin: boolean;
  onEdit: (medicineId: string) => void;
  onDelete?: (medicineId: string) => void;
}

export function StockTable({ medicines, isAdmin, onEdit, onDelete }: StockTableProps) {
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
  const [medicineToDelete, setMedicineToDelete] = useState<Medicine | null>(null);
  const { locations } = useLocations();
  
  const handleRowClick = (medicine: Medicine) => {
    setSelectedMedicine(medicine);
  };

  const handleDeleteClick = (e: React.MouseEvent, medicine: Medicine) => {
    e.stopPropagation();
    setMedicineToDelete(medicine);
  };

  const confirmDelete = () => {
    if (medicineToDelete && onDelete) {
      onDelete(medicineToDelete.id);
      setMedicineToDelete(null);
    }
  };

  // Função para obter o nome da unidade pelo ID
  const getLocationName = (locationId: string) => {
    const location = locations.find(loc => loc.id === locationId);
    return location ? location.name : "Desconhecida";
  };

  const isExpiring = (date: string) => {
    const expirationDate = new Date(date);
    const today = new Date();
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(today.getMonth() + 3);
    
    return expirationDate > today && expirationDate <= threeMonthsFromNow;
  };
  
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-[#1C1C1C]">Nome</TableHead>
            <TableHead className="text-[#1C1C1C]">Categoria</TableHead>
            <TableHead className="text-[#1C1C1C]">Lote</TableHead>
            <TableHead className="text-[#1C1C1C]">Fabricante</TableHead>
            <TableHead className="text-[#1C1C1C]">Vencimento</TableHead>
            <TableHead className="text-[#1C1C1C]">Quantidade</TableHead>
            <TableHead className="text-[#1C1C1C]">Unidade</TableHead>
            <TableHead className="text-[#1C1C1C]">Status</TableHead>
            <TableHead className="text-right text-[#1C1C1C]">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {medicines.length > 0 ? (
            medicines.map((medicine) => (
              <TableRow 
                key={medicine.id} 
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => handleRowClick(medicine)}
              >
                <TableCell className="font-medium">{medicine.name}</TableCell>
                <TableCell>{medicine.category.charAt(0).toUpperCase() + medicine.category.slice(1)}</TableCell>
                <TableCell>{medicine.batchNumber}</TableCell>
                <TableCell>{medicine.manufacturer}</TableCell>
                <TableCell className="relative">
                  {format(new Date(medicine.expirationDate), 'dd/MM/yyyy')}
                  {isExpiring(medicine.expirationDate) && (
                    <AlertTriangle className="h-4 w-4 text-amber-500 inline ml-2" />
                  )}
                </TableCell>
                <TableCell>
                  {medicine.quantity} {medicine.measureUnit}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="font-normal">
                    {getLocationName(medicine.locationId)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <StatusBadge status={medicine.status} />
                </TableCell>
                <TableCell className="text-right">
                  {isAdmin && (
                    <>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(medicine.id);
                        }}
                      >
                        <span className="sr-only">Editar</span>
                        <Edit className="h-4 w-4" />
                      </Button>
                      {onDelete && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                          onClick={(e) => handleDeleteClick(e, medicine)}
                        >
                          <span className="sr-only">Excluir</span>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </>
                  )}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0 ml-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRowClick(medicine);
                    }}
                  >
                    <span className="sr-only">Ver detalhes</span>
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-10">
                <div className="flex flex-col items-center justify-center text-[#1C1C1C]/70">
                  <Package className="h-12 w-12 mb-2" />
                  <h3 className="text-lg font-medium">Nenhum medicamento encontrado</h3>
                  <p>Adicione um novo medicamento para começar</p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Dialog open={!!selectedMedicine} onOpenChange={() => setSelectedMedicine(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Detalhes do Medicamento</DialogTitle>
            <DialogDescription>
              Informações completas do medicamento selecionado.
            </DialogDescription>
          </DialogHeader>
          {selectedMedicine && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium text-right">Nome:</div>
                <div className="col-span-3">{selectedMedicine.name}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium text-right">Descrição:</div>
                <div className="col-span-3">{selectedMedicine.description}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium text-right">Categoria:</div>
                <div className="col-span-3">
                  {selectedMedicine.category.charAt(0).toUpperCase() + selectedMedicine.category.slice(1)}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium text-right">Lote:</div>
                <div className="col-span-3">{selectedMedicine.batchNumber}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium text-right">Fabricante:</div>
                <div className="col-span-3">{selectedMedicine.manufacturer}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium text-right">Vencimento:</div>
                <div className="col-span-3">
                  {format(new Date(selectedMedicine.expirationDate), 'dd/MM/yyyy')}
                  {isExpiring(selectedMedicine.expirationDate) && (
                    <span className="ml-2 text-amber-500 flex items-center text-sm">
                      <AlertTriangle className="h-4 w-4 mr-1" /> Vencimento próximo
                    </span>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium text-right">Quantidade:</div>
                <div className="col-span-3">
                  {selectedMedicine.quantity} {selectedMedicine.measureUnit}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium text-right">Quantidade mínima:</div>
                <div className="col-span-3">
                  {selectedMedicine.minQuantity} {selectedMedicine.measureUnit}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium text-right">Unidade:</div>
                <div className="col-span-3">
                  {getLocationName(selectedMedicine.locationId)}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium text-right">Status:</div>
                <div className="col-span-3">
                  <StatusBadge status={selectedMedicine.status} />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            {isAdmin && selectedMedicine && (
              <Button 
                variant="outline" 
                onClick={() => {
                  setSelectedMedicine(null);
                  onEdit(selectedMedicine.id);
                }}
              >
                <Edit className="h-4 w-4 mr-2" />
                Editar Medicamento
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!medicineToDelete} onOpenChange={() => setMedicineToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Medicamento</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o medicamento "{medicineToDelete?.name}"? 
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

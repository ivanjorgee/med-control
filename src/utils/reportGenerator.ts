
import jsPDF from "jspdf";
import "jspdf-autotable";
import { format } from "date-fns";
import { mockDistributions, mockMedicines } from "@/data/mockData";
import { mockLocations } from "@/data/mockLocations";
import { mockUsers } from "@/data/mockUsers";

interface GenerateReportOptions {
  startDate: Date;
  endDate: Date;
  locationId: string;
  reportTypes: string[];
  isAdmin: boolean;
}

export const generateReport = ({
  startDate,
  endDate,
  locationId,
  reportTypes,
  isAdmin
}: GenerateReportOptions) => {
  // Criar o documento PDF
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const today = new Date();
  
  // Adicionar título
  doc.setFontSize(18);
  doc.setTextColor(0, 82, 204); // #0052CC
  doc.text("Relatório do Sistema de Medicamentos", pageWidth / 2, 20, { align: 'center' });
  
  // Data de geração
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Gerado em: ${format(today, 'dd/MM/yyyy HH:mm')}`, pageWidth / 2, 28, { align: 'center' });
  
  // Período do relatório
  doc.text(`Período: ${format(startDate, 'dd/MM/yyyy')} até ${format(endDate, 'dd/MM/yyyy')}`, pageWidth / 2, 34, { align: 'center' });
  
  // Informação do local
  const locationName = locationId === 'all' ? 'Todos os locais' : 
    mockLocations.find(loc => loc.id === locationId)?.name || 'Local desconhecido';
  doc.text(`Local: ${locationName}`, pageWidth / 2, 40, { align: 'center' });

  let yPosition = 50; // Posição inicial Y

  // Filtra dados pelo período selecionado e local (quando aplicável)
  const filterByDateAndLocation = (item: any) => {
    const itemDate = new Date(item.date || item.expirationDate || item.createdAt);
    const isInDateRange = itemDate >= startDate && itemDate <= endDate;
    const isInLocation = locationId === 'all' || item.locationId === locationId;
    return isInDateRange && isInLocation;
  };

  // 1. Relatório de Medicamentos
  if (reportTypes.includes('medicines')) {
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text("Medicamentos", 14, yPosition);
    yPosition += 5;
    
    const filteredMedicines = mockMedicines.filter(filterByDateAndLocation);
    
    const medicineData = filteredMedicines.map(med => [
      med.name, 
      med.category,
      med.quantity.toString(),
      med.measureUnit,
      med.status,
      format(new Date(med.expirationDate), "dd/MM/yyyy")
    ]);
    
    if (medicineData.length === 0) {
      medicineData.push(["Nenhum medicamento encontrado no período selecionado", "", "", "", "", ""]);
    }
    
    (doc as any).autoTable({
      startY: yPosition,
      head: [['Medicamento', 'Categoria', 'Quantidade', 'Unidade', 'Status', 'Vencimento']],
      body: medicineData,
      theme: 'grid',
      headStyles: { fillColor: [0, 82, 204] },
    });
    
    yPosition = (doc as any).lastAutoTable.finalY + 10;
  }

  // 2. Relatório de Distribuições
  if (reportTypes.includes('distributions')) {
    // Verificar se precisa de nova página
    if (yPosition > 240) {
      doc.addPage();
      yPosition = 20;
    }
    
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text("Distribuições", 14, yPosition);
    yPosition += 5;
    
    const filteredDistributions = mockDistributions.filter(filterByDateAndLocation);
    
    const distributionData = filteredDistributions.map(dist => [
      dist.medicineName,
      dist.quantity.toString(),
      dist.sourceLocation,
      dist.destinationLocation,
      dist.status,
      format(new Date(dist.date), "dd/MM/yyyy")
    ]);
    
    if (distributionData.length === 0) {
      distributionData.push(["Nenhuma distribuição encontrada no período selecionado", "", "", "", "", ""]);
    }
    
    (doc as any).autoTable({
      startY: yPosition,
      head: [['Medicamento', 'Quantidade', 'Origem', 'Destino', 'Status', 'Data']],
      body: distributionData,
      theme: 'grid',
      headStyles: { fillColor: [0, 82, 204] },
    });
    
    yPosition = (doc as any).lastAutoTable.finalY + 10;
  }

  // 3. Relatório de Vencimentos
  if (reportTypes.includes('expirations')) {
    // Verificar se precisa de nova página
    if (yPosition > 240) {
      doc.addPage();
      yPosition = 20;
    }
    
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text("Medicamentos Próximos ao Vencimento", 14, yPosition);
    yPosition += 5;
    
    // Filtrar medicamentos que vencem nos próximos 3 meses
    const today = new Date();
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(today.getMonth() + 3);
    
    const expiringMedicines = mockMedicines.filter(med => {
      const expirationDate = new Date(med.expirationDate);
      const isExpiringSoon = expirationDate <= threeMonthsFromNow && expirationDate >= today;
      const isInLocation = locationId === 'all' || med.locationId === locationId;
      return isExpiringSoon && isInLocation;
    });
    
    const expiringData = expiringMedicines.map(med => [
      med.name,
      med.batchNumber,
      med.quantity.toString(),
      med.measureUnit,
      format(new Date(med.expirationDate), "dd/MM/yyyy")
    ]);
    
    if (expiringData.length === 0) {
      expiringData.push(["Nenhum medicamento próximo ao vencimento", "", "", "", ""]);
    }
    
    (doc as any).autoTable({
      startY: yPosition,
      head: [['Medicamento', 'Lote', 'Quantidade', 'Unidade', 'Vencimento']],
      body: expiringData,
      theme: 'grid',
      headStyles: { fillColor: [0, 82, 204] },
    });
    
    yPosition = (doc as any).lastAutoTable.finalY + 10;
  }

  // 4. Relatório de Inventário
  if (reportTypes.includes('inventory')) {
    // Verificar se precisa de nova página
    if (yPosition > 240) {
      doc.addPage();
      yPosition = 20;
    }
    
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text("Inventário por Categoria", 14, yPosition);
    yPosition += 5;
    
    // Agrupar medicamentos por categoria
    const categories: Record<string, {total: number, items: number}> = {};
    mockMedicines
      .filter(med => locationId === 'all' || med.locationId === locationId)
      .forEach(med => {
        if (!categories[med.category]) {
          categories[med.category] = { total: 0, items: 0 };
        }
        categories[med.category].total += med.quantity;
        categories[med.category].items += 1;
      });
    
    const inventoryData = Object.entries(categories).map(([category, data]) => [
      category,
      data.items.toString(),
      data.total.toString(),
    ]);
    
    if (inventoryData.length === 0) {
      inventoryData.push(["Nenhum dado de inventário disponível", "", ""]);
    }
    
    (doc as any).autoTable({
      startY: yPosition,
      head: [['Categoria', 'Itens Diferentes', 'Quantidade Total']],
      body: inventoryData,
      theme: 'grid',
      headStyles: { fillColor: [0, 82, 204] },
    });
    
    yPosition = (doc as any).lastAutoTable.finalY + 10;
  }

  // 5. Relatório de Usuários e Permissões (apenas para admin)
  if (isAdmin && reportTypes.includes('users')) {
    // Verificar se precisa de nova página
    if (yPosition > 240) {
      doc.addPage();
      yPosition = 20;
    }
    
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text("Usuários e Permissões", 14, yPosition);
    yPosition += 5;
    
    const filteredUsers = mockUsers.filter(user => 
      locationId === 'all' || user.locationId === locationId
    );
    
    const userData = filteredUsers.map(user => {
      const userLocation = mockLocations.find(loc => loc.id === user.locationId)?.name || 'Desconhecido';
      
      let roleName = '';
      switch (user.role) {
        case 'admin': roleName = 'Administrador'; break;
        case 'pharmacist': roleName = 'Farmacêutico'; break;
        case 'health_unit': roleName = 'Unidade de Saúde'; break;
        default: roleName = 'Usuário';
      }
      
      return [
        user.name,
        user.email,
        roleName,
        userLocation,
        user.canApprove ? 'Sim' : 'Não',
        user.status === 'active' ? 'Ativo' : 'Inativo'
      ];
    });
    
    if (userData.length === 0) {
      userData.push(["Nenhum usuário encontrado", "", "", "", "", ""]);
    }
    
    (doc as any).autoTable({
      startY: yPosition,
      head: [['Nome', 'Email', 'Função', 'Local', 'Pode Aprovar', 'Status']],
      body: userData,
      theme: 'grid',
      headStyles: { fillColor: [0, 82, 204] },
    });
  }

  // Adicionar rodapé
  const totalPages = doc.internal.pages.length - 1;
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(
      `Página ${i} de ${totalPages} | MedControl - Sistema de Gestão de Medicamentos`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }
  
  // Salvar o PDF
  doc.save(`relatorio-medicamentos-${format(today, 'dd-MM-yyyy-HHmm')}.pdf`);
  
  return true;
};

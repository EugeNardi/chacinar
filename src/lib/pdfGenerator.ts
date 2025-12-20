import jsPDF from 'jspdf';
import QRCode from 'qrcode';

interface BillData {
  clientName: string;
  clientEmail: string;
  bills: {
    date: string;
    amount: number;
    description: string;
  }[];
  totalAmount: number;
  mercadoPagoWallet: string;
  bankName?: string;
  bankAccount?: string;
  bankCbu?: string;
}

export async function generateBillPDF(data: BillData): Promise<void> {
  const doc = new jsPDF();
  
  // Configuración
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  let yPosition = 20;

  // Encabezado elegante
  doc.setFillColor(139, 24, 24); // Color bordeaux #8B1818
  doc.rect(0, 0, pageWidth, 35, 'F');
  
  // Texto "Chacinar" en blanco
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(28);
  doc.setFont('times', 'italic');
  doc.text('Chacinar', pageWidth / 2, 18, { align: 'center' });
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('CHACINADOS Y EMBUTIDOS ARTESANALES', pageWidth / 2, 28, { align: 'center' });
  
  yPosition = 45;
  
  // Resetear color de texto a negro
  doc.setTextColor(0, 0, 0);
  
  // Línea separadora
  doc.setLineWidth(0.5);
  doc.line(margin, yPosition, pageWidth - margin, yPosition);
  
  yPosition += 10;
  
  // Información del cliente
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('RESUMEN DE CUENTA', margin, yPosition);
  
  yPosition += 8;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Cliente: ${data.clientName}`, margin, yPosition);
  
  yPosition += 6;
  doc.text(`Email: ${data.clientEmail}`, margin, yPosition);
  
  yPosition += 6;
  doc.text(`Fecha de emisión: ${new Date().toLocaleDateString('es-AR')}`, margin, yPosition);
  
  yPosition += 15;
  
  // Tabla de boletas
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('DETALLE DE BOLETAS', margin, yPosition);
  
  yPosition += 8;
  
  // Encabezados de tabla
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('Fecha', margin, yPosition);
  doc.text('Descripción', margin + 30, yPosition);
  doc.text('Monto', pageWidth - margin - 30, yPosition, { align: 'right' });
  
  yPosition += 2;
  doc.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 6;
  
  // Boletas
  doc.setFont('helvetica', 'normal');
  data.bills.forEach((bill) => {
    // Verificar si necesitamos nueva página
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }
    
    const date = new Date(bill.date).toLocaleDateString('es-AR');
    doc.text(date, margin, yPosition);
    
    // Descripción con wrap
    const description = bill.description || 'Sin descripción';
    const descriptionLines = doc.splitTextToSize(description, 80);
    doc.text(descriptionLines[0], margin + 30, yPosition);
    
    // Monto
    const amount = `$${bill.amount.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    doc.text(amount, pageWidth - margin - 30, yPosition, { align: 'right' });
    
    yPosition += 8;
  });
  
  yPosition += 5;
  
  // Total
  doc.setLineWidth(0.5);
  doc.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 8;
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('TOTAL A PAGAR:', margin, yPosition);
  
  const totalText = `$${data.totalAmount.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  doc.text(totalText, pageWidth - margin - 30, yPosition, { align: 'right' });
  
  yPosition += 20;
  
  // QR Code
  if (data.mercadoPagoWallet && data.totalAmount > 0) {
    try {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 0, 0);
      doc.text('PAGAR CON MERCADO PAGO', margin, yPosition);
      
      yPosition += 8;
      
      // Generar QR con el alias de Mercado Pago
      const mpLink = `https://www.mercadopago.com.ar/money-request/create?alias=${data.mercadoPagoWallet}&amount=${data.totalAmount}&description=Pago Chacinar`;
      const qrDataUrl = await QRCode.toDataURL(mpLink, {
        width: 400,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      
      // Agregar QR al PDF
      const qrSize = 60;
      doc.addImage(qrDataUrl, 'PNG', margin, yPosition, qrSize, qrSize);
      
      // Instrucciones
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      const instructions = [
        'Escanea este código QR con la app de Mercado Pago',
        `Alias: ${data.mercadoPagoWallet}`,
        `Monto: $${data.totalAmount.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`
      ];
      
      let instructionY = yPosition + 5;
      instructions.forEach((line) => {
        doc.text(line, margin + qrSize + 10, instructionY);
        instructionY += 5;
      });
      
      yPosition += qrSize + 15;
    } catch (error) {
      console.error('Error generando QR:', error);
      doc.setFontSize(9);
      doc.setTextColor(255, 0, 0);
      doc.text('Error al generar código QR', margin, yPosition);
      yPosition += 10;
    }
  }
  
  // Datos bancarios
  if (data.bankName && data.bankAccount) {
    yPosition += 10;
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('TRANSFERENCIA BANCARIA', margin, yPosition);
    
    yPosition += 8;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Banco: ${data.bankName}`, margin, yPosition);
    
    yPosition += 6;
    doc.text(`Cuenta: ${data.bankAccount}`, margin, yPosition);
    
    if (data.bankCbu) {
      yPosition += 6;
      doc.text(`CBU: ${data.bankCbu}`, margin, yPosition);
    }
    
    yPosition += 10;
  }
  
  // Footer
  const footerY = doc.internal.pageSize.getHeight() - 20;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(128, 128, 128);
  doc.text('Chacinar - Chacinados y Embutidos Artesanales Monte Buey', pageWidth / 2, footerY, { align: 'center' });
  doc.text('Este documento es un resumen de su cuenta corriente', pageWidth / 2, footerY + 4, { align: 'center' });
  
  // Guardar PDF
  const fileName = `Boleta_${data.clientName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
}

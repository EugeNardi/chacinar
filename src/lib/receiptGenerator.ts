import jsPDF from 'jspdf';

interface ReceiptData {
  clientName: string;
  clientEmail: string;
  amount: number;
  description: string;
  date: string;
  receiptNumber: string;
}

export async function generateReceipt(data: ReceiptData): Promise<void> {
  const pdf = new jsPDF();
  
  // Configuración
  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 20;
  let yPos = 20;

  // Header - Logo y título
  pdf.setFillColor(139, 24, 24); // Color bordeaux #8B1818
  pdf.rect(0, 0, pageWidth, 40, 'F');
  
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(24);
  pdf.setFont('times', 'italic');
  pdf.text('Chacinar', pageWidth / 2, 20, { align: 'center' });
  
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'normal');
  pdf.text('CHACINADOS Y EMBUTIDOS ARTESANALES', pageWidth / 2, 28, { align: 'center' });
  
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Comprobante de Boleta', pageWidth / 2, 36, { align: 'center' });

  yPos = 55;

  // Número de comprobante y fecha
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Comprobante N°: ${data.receiptNumber}`, margin, yPos);
  pdf.text(`Fecha: ${new Date(data.date).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })}`, pageWidth - margin, yPos, { align: 'right' });

  yPos += 15;

  // Línea separadora
  pdf.setDrawColor(200, 200, 200);
  pdf.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 15;

  // Información del cliente
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('DATOS DEL CLIENTE', margin, yPos);
  yPos += 10;

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Nombre: ${data.clientName}`, margin, yPos);
  yPos += 7;
  pdf.text(`Email: ${data.clientEmail}`, margin, yPos);
  yPos += 15;

  // Línea separadora
  pdf.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 15;

  // Detalle de la boleta
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('DETALLE DE LA BOLETA', margin, yPos);
  yPos += 10;

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  
  // Descripción
  pdf.text('Descripción:', margin, yPos);
  yPos += 7;
  
  // Dividir descripción en líneas si es muy larga
  const maxWidth = pageWidth - (margin * 2);
  const descriptionLines = pdf.splitTextToSize(data.description, maxWidth);
  pdf.text(descriptionLines, margin + 5, yPos);
  yPos += (descriptionLines.length * 7) + 10;

  // Monto
  pdf.setFillColor(240, 240, 240);
  pdf.rect(margin, yPos - 5, pageWidth - (margin * 2), 20, 'F');
  
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('MONTO:', margin + 5, yPos + 7);
  
  pdf.setFontSize(18);
  pdf.setTextColor(220, 38, 38); // Rojo
  pdf.text(`$${data.amount.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 
    pageWidth - margin - 5, yPos + 7, { align: 'right' });
  
  yPos += 30;

  // Línea separadora
  pdf.setDrawColor(200, 200, 200);
  pdf.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 15;

  // Nota importante
  pdf.setTextColor(100, 100, 100);
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'italic');
  const note = 'Este comprobante es un registro de la boleta agregada a su cuenta. ' +
               'El monto se suma a su saldo total. Para realizar el pago, utilice el código QR ' +
               'de Mercado Pago disponible en su panel de cliente.';
  const noteLines = pdf.splitTextToSize(note, pageWidth - (margin * 2));
  pdf.text(noteLines, margin, yPos);
  yPos += (noteLines.length * 5) + 15;

  // Footer
  const footerY = pdf.internal.pageSize.getHeight() - 20;
  pdf.setDrawColor(200, 200, 200);
  pdf.line(margin, footerY - 10, pageWidth - margin, footerY - 10);
  
  pdf.setTextColor(150, 150, 150);
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'normal');
  pdf.text('CHACINAR - Sistema de Gestión de Cuentas Corrientes', pageWidth / 2, footerY, { align: 'center' });
  pdf.text(`Generado el ${new Date().toLocaleDateString('es-AR')}`, pageWidth / 2, footerY + 5, { align: 'center' });

  // Descargar PDF
  const fileName = `Comprobante_${data.receiptNumber}_${data.clientName.replace(/\s+/g, '_')}.pdf`;
  pdf.save(fileName);
}

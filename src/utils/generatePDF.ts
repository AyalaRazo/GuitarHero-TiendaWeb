import jsPDF from 'jspdf';
import { formatPrice } from '../data/catalog';

interface CartItem {
  product: {
    name: string;
    price: number;
  };
  qty: number;
}

interface OrderReceiptData {
  orderId: string;
  date: string;
  status: string;
  total: number;
  customerName: string;
  customerEmail: string;
  items?: CartItem[];
}

export function generateReceiptPDF(order: OrderReceiptData) {
  const doc = new jsPDF();

  // Encabezado con el estilo de la tienda (Verde oscuro)
  doc.setFillColor(20, 50, 40);
  doc.rect(0, 0, 210, 40, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.text('Guitar Hero', 14, 25);
  
  doc.setFontSize(12);
  doc.text('Comprobante de Pedido', 150, 25, { align: 'right' });

  // Datos del cliente
  doc.setTextColor(60, 60, 60);
  doc.setFontSize(11);
  doc.text(`Cliente: ${order.customerName}`, 14, 55);
  doc.text(`Correo: ${order.customerEmail}`, 14, 62);

  // Datos del pedido
  doc.setFont('helvetica', 'bold');
  doc.text(`Pedido: ${order.orderId}`, 14, 75);
  doc.setFont('helvetica', 'normal');
  doc.text(`Fecha de compra: ${order.date}`, 14, 82);
  doc.text(`Estado actual: ${order.status}`, 14, 89);

  // Línea divisoria
  doc.setDrawColor(200, 200, 200);
  doc.line(14, 98, 196, 98);

  // Tabla / Encabezados
  doc.setFont('helvetica', 'bold');
  doc.text('Concepto', 14, 110);
  doc.text('Importe', 170, 110, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  
  // Imprimir cada instrumento comprado de forma dinámica y detallada
  let startY = 120;
  if (order.items && order.items.length > 0) {
    order.items.forEach((item) => {
      const lineText = `${item.product.name} (x${item.qty})`;
      const lineTotal = formatPrice(item.product.price * item.qty);
      
      doc.text(lineText, 14, startY);
      doc.text(lineTotal, 170, startY, { align: 'right' });
      
      startY += 10; // Baja la línea por cada producto agregado
    });
  } else {
    doc.text(`Instrumento / Producto (Pedido ${order.orderId})`, 14, startY);
    doc.text(formatPrice(order.total), 170, startY, { align: 'right' });
    startY += 10;
  }

  const lineY = startY + 5;
  doc.line(14, lineY, 196, lineY);

  // Total
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text(`Total Pagado: ${formatPrice(order.total)}`, 170, lineY + 12, { align: 'right' });

  // Pie de página
  doc.setFontSize(10);
  doc.setTextColor(120, 120, 120);
  doc.text('Gracias por confiar en Guitar Hero. Conserve este comprobante para cualquier aclaración.', 14, 275);

  // Descargar archivo PDF automáticamente
  doc.save(`Recibo-${order.orderId}.pdf`);
}
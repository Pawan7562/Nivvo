import { jsPDF } from 'jspdf';

/**
 * Generates and downloads a clean, minimal, and professional receipt PDF.
 * Stripped of all unnecessary legal clutter and technical jargon.
 * 
 * @param {Object} order - Order object details
 * @param {Object} user - Customer details
 */
export function downloadReceiptPdf(order = {}, user = {}) {
  try {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const orderId = order.id || 'NV-1048';
    const orderDate = order.placedAt && !order.placedAt.includes('now') 
      ? order.placedAt 
      : (order.date || new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }));
    
    const customerName = user?.name || order.customer_name || 'Aarav Shah';
    const shopName = order.shopName || order.shop || 'Sole Street Originals';
    const paymentMethod = order.paymentMethod || order.payment_method || 'UPI';

    // Theme Colors
    const forestGreen = [31, 66, 48];     // #1F4230
    const textPrimary = [20, 40, 28];     // #14281C
    const textMuted = [104, 113, 99];     // #687163
    const borderLine = [229, 231, 222];   // #E5E7DE
    const surfaceLight = [248, 249, 246]; // #F8F9F6

    // ─── 1. Header ───
    // Brand Name
    doc.setTextColor(forestGreen[0], forestGreen[1], forestGreen[2]);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.text('nivvo', 20, 24);

    // Document Title & Order ID
    doc.setTextColor(textPrimary[0], textPrimary[1], textPrimary[2]);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('RECEIPT', 190, 20, { align: 'right' });

    doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Order #${orderId}`, 190, 26, { align: 'right' });

    // Header Divider
    doc.setDrawColor(borderLine[0], borderLine[1], borderLine[2]);
    doc.setLineWidth(0.4);
    doc.line(20, 32, 190, 32);

    // ─── 2. Order Information Row ───
    let currentY = 42;

    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
    doc.text('DATE', 20, currentY);
    doc.text('CUSTOMER', 65, currentY);
    doc.text('STORE', 120, currentY);
    doc.text('PAYMENT', 165, currentY);

    currentY += 5.5;
    doc.setFontSize(9.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(textPrimary[0], textPrimary[1], textPrimary[2]);
    doc.text(String(orderDate), 20, currentY);
    doc.text(String(customerName), 65, currentY);
    doc.text(String(shopName), 120, currentY);
    doc.text(String(paymentMethod), 165, currentY);

    currentY += 12;

    // ─── 3. Items Table ───
    // Table Header Bar
    doc.setFillColor(surfaceLight[0], surfaceLight[1], surfaceLight[2]);
    doc.rect(20, currentY, 170, 8, 'F');
    doc.setDrawColor(borderLine[0], borderLine[1], borderLine[2]);
    doc.line(20, currentY, 190, currentY);
    doc.line(20, currentY + 8, 190, currentY + 8);

    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
    doc.text('ITEM', 24, currentY + 5.5);
    doc.text('SIZE', 115, currentY + 5.5);
    doc.text('QTY', 145, currentY + 5.5, { align: 'center' });
    doc.text('PRICE', 186, currentY + 5.5, { align: 'right' });

    currentY += 8;

    // Items List
    const items = Array.isArray(order.items) && order.items.length > 0 
      ? order.items 
      : [
          {
            name: order.item_name || 'Everyday court sneaker',
            variant: order.variant || order.size || 'UK 8',
            quantity: 1,
            price: order.subtotal || order.total || 1798
          }
        ];

    let itemsTotal = 0;

    items.forEach((item) => {
      const itemPrice = Number(item.price || item.unitPrice || 1299);
      const itemQty = Number(item.quantity || 1);
      const lineTotal = itemPrice * itemQty;
      itemsTotal += lineTotal;

      const itemName = item.name || 'Apparel Item';
      const variant = item.variant || item.size || 'Standard';

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(textPrimary[0], textPrimary[1], textPrimary[2]);
      doc.text(itemName.length > 45 ? itemName.substring(0, 42) + '...' : itemName, 24, currentY + 6);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
      doc.text(variant, 115, currentY + 6);
      doc.text(String(itemQty), 145, currentY + 6, { align: 'center' });

      doc.setFont('helvetica', 'bold');
      doc.setTextColor(textPrimary[0], textPrimary[1], textPrimary[2]);
      doc.text(`Rs. ${lineTotal.toLocaleString('en-IN')}`, 186, currentY + 6, { align: 'right' });

      doc.setDrawColor(borderLine[0], borderLine[1], borderLine[2]);
      doc.setLineWidth(0.3);
      doc.line(20, currentY + 9, 190, currentY + 9);

      currentY += 9;
    });

    // ─── 4. Bill Summary ───
    currentY += 6;
    const subtotal = order.subtotal || itemsTotal || 1798;
    const deliveryFee = order.delivery !== undefined ? order.delivery : 0;
    const platformFee = order.platformFee || 9;
    const discount = order.discount || 0;
    const grandTotal = order.total || (subtotal + deliveryFee + platformFee - discount);

    const labelX = 135;
    const valueX = 186;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);

    doc.text('Item Subtotal', labelX, currentY);
    doc.setTextColor(textPrimary[0], textPrimary[1], textPrimary[2]);
    doc.text(`Rs. ${subtotal.toLocaleString('en-IN')}`, valueX, currentY, { align: 'right' });

    currentY += 6;
    doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
    doc.text('Delivery Fee', labelX, currentY);
    doc.setTextColor(deliveryFee === 0 ? [21, 128, 61] : textPrimary[0], deliveryFee === 0 ? 128 : textPrimary[1], deliveryFee === 0 ? 61 : textPrimary[2]);
    doc.text(deliveryFee === 0 ? 'FREE' : `Rs. ${deliveryFee}`, valueX, currentY, { align: 'right' });

    currentY += 6;
    doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
    doc.text('Platform Fee', labelX, currentY);
    doc.setTextColor(textPrimary[0], textPrimary[1], textPrimary[2]);
    doc.text(`Rs. ${platformFee}`, valueX, currentY, { align: 'right' });

    if (discount > 0) {
      currentY += 6;
      doc.setTextColor(21, 128, 61);
      doc.text('Discount', labelX, currentY);
      doc.text(`- Rs. ${discount}`, valueX, currentY, { align: 'right' });
    }

    // Divider before Grand Total
    currentY += 3;
    doc.setDrawColor(borderLine[0], borderLine[1], borderLine[2]);
    doc.setLineWidth(0.4);
    doc.line(labelX - 4, currentY, 190, currentY);

    // Total Paid Row
    currentY += 7;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(forestGreen[0], forestGreen[1], forestGreen[2]);
    doc.text('Total Paid', labelX, currentY);
    doc.setFontSize(13);
    doc.text(`Rs. ${grandTotal.toLocaleString('en-IN')}`, valueX, currentY, { align: 'right' });

    // ─── 5. Clean Footer ───
    doc.setDrawColor(borderLine[0], borderLine[1], borderLine[2]);
    doc.setLineWidth(0.3);
    doc.line(20, 260, 190, 260);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
    doc.text('Thank you for shopping with Nivvo.', 105, 268, { align: 'center' });

    // Save PDF file to downloads
    const filename = `Nivvo_Receipt_${orderId}.pdf`;
    doc.save(filename);
    return true;
  } catch (err) {
    console.error('Error generating receipt PDF, running fallback:', err);
    fallbackReceiptDownload(order, user);
    return true;
  }
}

/**
 * Clean plain-text fallback receipt
 */
function fallbackReceiptDownload(order = {}, user = {}) {
  const orderId = order.id || 'NV-1048';
  const customerName = user?.name || order.customer_name || 'Aarav Shah';
  const total = order.total || 1846;
  const shop = order.shopName || order.shop || 'Sole Street Originals';

  const textContent = `
========================================
             NIVVO RECEIPT
========================================
Order ID    : ${orderId}
Date        : ${new Date().toLocaleDateString('en-IN')}
Customer    : ${customerName}
Store       : ${shop}
Payment     : ${order.paymentMethod || 'UPI'}
----------------------------------------
Item Total  : Rs. ${order.subtotal || 1798}
Delivery    : Rs. ${order.delivery || 0} (FREE)
Platform Fee: Rs. ${order.platformFee || 9}
----------------------------------------
TOTAL PAID  : Rs. ${total}
========================================
Thank you for shopping with Nivvo.
`;

  const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `Nivvo_Receipt_${orderId}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

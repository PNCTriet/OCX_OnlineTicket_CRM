import { QRCodeSVG } from 'qrcode.react';

// Helper function để tạo QR code SVG từ ticket code
export function generateQRCodeSVG(ticketCode: string): string {
  // Tạo SVG QR code
  const svgString = `
    <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
      ${generateQRCodeSVGContent(ticketCode)}
    </svg>
  `;
  
  // Convert thành data URL
  return `data:image/svg+xml;base64,${btoa(svgString)}`;
}

// Helper function để tạo QR code PNG từ ticket code
export function generateQRCodePNG(ticketCode: string): Promise<string> {
  return new Promise((resolve) => {
    // Tạo canvas để render QR code
    const canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 200;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Tạo QR code SVG
      const svgString = `
        <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
          ${generateQRCodeSVGContent(ticketCode)}
        </svg>
      `;
      
      // Convert SVG to PNG
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0);
        const dataURL = canvas.toDataURL('image/png');
        resolve(dataURL);
      };
      img.src = `data:image/svg+xml;base64,${btoa(svgString)}`;
    } else {
      // Fallback to SVG
      resolve(generateQRCodeSVG(ticketCode));
    }
  });
}

// Helper function để tạo nội dung SVG QR code
function generateQRCodeSVGContent(ticketCode: string): string {
  // Đây là một implementation đơn giản
  // Trong thực tế, bạn nên sử dụng thư viện qrcode.react hoặc tương tự
  // Đây chỉ là placeholder
  return `
    <rect width="200" height="200" fill="white"/>
    <text x="100" y="100" text-anchor="middle" font-family="monospace" font-size="12">${ticketCode}</text>
  `;
}

// Helper function để tạo QR code cho ticket từ API
export async function generateTicketQRCode(ticketCode: string): Promise<string> {
  try {
    // Sử dụng API để tạo QR code
    const response = await fetch('/api/generate-qr', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code: ticketCode }),
    });
    
    if (response.ok) {
      const data = await response.json();
      return data.qrCodeUrl;
    } else {
      // Fallback to SVG
      return generateQRCodeSVG(ticketCode);
    }
  } catch (error) {
    console.error('Error generating QR code:', error);
    // Fallback to SVG
    return generateQRCodeSVG(ticketCode);
  }
} 
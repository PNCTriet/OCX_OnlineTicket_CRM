import { NextRequest, NextResponse } from 'next/server';
import { QRCodeSVG } from 'qrcode.react';

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();
    
    if (!code) {
      return NextResponse.json(
        { error: 'Code is required' },
        { status: 400 }
      );
    }

    // Tạo QR code SVG
    const qrCodeSVG = `
      <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
        <rect width="200" height="200" fill="white"/>
        <g transform="translate(10, 10)">
          ${generateQRCodeMatrix(code)}
        </g>
      </svg>
    `;

    // Convert thành data URL
    const qrCodeDataURL = `data:image/svg+xml;base64,${btoa(qrCodeSVG)}`;

    return NextResponse.json({
      qrCodeUrl: qrCodeDataURL,
      code: code,
    });

  } catch (error) {
    console.error('Error generating QR code:', error);
    return NextResponse.json(
      { error: 'Failed to generate QR code' },
      { status: 500 }
    );
  }
}

// Simple QR code matrix generator (placeholder)
function generateQRCodeMatrix(code: string): string {
  // Đây là một implementation đơn giản
  // Trong thực tế, bạn nên sử dụng thư viện qrcode.react hoặc tương tự
  const size = 20;
  const cellSize = 180 / size;
  
  let svgContent = '';
  
  // Tạo pattern đơn giản dựa trên code
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      const shouldFill = (i + j + code.length) % 3 === 0;
      if (shouldFill) {
        svgContent += `<rect x="${i * cellSize}" y="${j * cellSize}" width="${cellSize}" height="${cellSize}" fill="black"/>`;
      }
    }
  }
  
  return svgContent;
} 
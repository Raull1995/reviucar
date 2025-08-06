import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { supabase } from '@/integrations/supabase/client';

interface ReportData {
  veiculo: {
    marca: string;
    modelo: string;
    ano: number;
    cor?: string;
    combustivel?: string;
    chassi?: string;
    municipio?: string;
    uf?: string;
    situacao?: string;
    valor_fipe: string;
    codigo_fipe: string;
    placa: string;
  };
  componentes: Array<{
    nome: string;
    estado: string;
    conclusao: string;
  }>;
  sintese: {
    resumo: string;
    repintura_em: string;
    massa_em: string;
    alinhamento_comprometido: string;
    vidros_trocados: string;
    estrutura_inferior: string;
    estrutura_ok: boolean;
    conclusao_final: string;
    manutencoes_pendentes?: string[];
  };
}

// Enhanced ReviuCar logo with QR code placeholder
const REVIUCAR_LOGO_BASE64 = `data:image/svg+xml;base64,${btoa(`
<svg width="200" height="80" viewBox="0 0 200 80" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#DC2626;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#991B1B;stop-opacity:1" />
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="2" dy="2" stdDeviation="3" flood-opacity="0.3"/>
    </filter>
  </defs>
  <rect width="200" height="80" fill="url(#gradient)" rx="12" filter="url(#shadow)"/>
  <circle cx="35" cy="40" r="18" fill="white"/>
  <text x="30" y="48" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="#DC2626">R</text>
  <text x="60" y="35" font-family="Arial, sans-serif" font-size="22" font-weight="bold" fill="white">REVIUCAR</text>
  <text x="60" y="52" font-family="Arial, sans-serif" font-size="12" fill="white">Avaliação Inteligente</text>
</svg>
`)}`;

// QR Code for website access
const QR_CODE_BASE64 = `data:image/svg+xml;base64,${btoa(`
<svg width="80" height="80" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
  <rect width="80" height="80" fill="white" stroke="#333" stroke-width="1"/>
  <g fill="#333">
    <!-- QR Code pattern simulation -->
    <rect x="8" y="8" width="16" height="16"/>
    <rect x="56" y="8" width="16" height="16"/>
    <rect x="8" y="56" width="16" height="16"/>
    <rect x="32" y="32" width="16" height="16"/>
    <!-- Additional QR pattern elements -->
    <rect x="12" y="12" width="8" height="8" fill="white"/>
    <rect x="60" y="12" width="8" height="8" fill="white"/>
    <rect x="12" y="60" width="8" height="8" fill="white"/>
    <rect x="36" y="36" width="8" height="8" fill="white"/>
    <!-- Random QR pattern -->
    <rect x="28" y="8" width="4" height="4"/>
    <rect x="36" y="8" width="4" height="4"/>
    <rect x="44" y="8" width="4" height="4"/>
    <rect x="8" y="28" width="4" height="4"/>
    <rect x="8" y="36" width="4" height="4"/>
    <rect x="8" y="44" width="4" height="4"/>
    <rect x="28" y="72" width="4" height="4"/>
    <rect x="36" y="72" width="4" height="4"/>
    <rect x="44" y="72" width="4" height="4"/>
    <rect x="72" y="28" width="4" height="4"/>
    <rect x="72" y="36" width="4" height="4"/>
    <rect x="72" y="44" width="4" height="4"/>
  </g>
  <text x="40" y="92" text-anchor="middle" font-size="8" fill="#666">reviucar.com.br</text>
</svg>
`)}`;

// Verified seal
const VERIFIED_SEAL_BASE64 = `data:image/svg+xml;base64,${btoa(`
<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="sealGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#22c55e;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#16a34a;stop-opacity:1" />
    </linearGradient>
    <filter id="sealShadow">
      <feDropShadow dx="2" dy="2" stdDeviation="3" flood-opacity="0.3"/>
    </filter>
  </defs>
  <circle cx="50" cy="50" r="45" fill="url(#sealGradient)" filter="url(#sealShadow)"/>
  <circle cx="50" cy="50" r="35" fill="none" stroke="white" stroke-width="2"/>
  <path d="M35 50 L45 60 L65 40" stroke="white" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  <text x="50" y="75" text-anchor="middle" font-size="10" font-weight="bold" fill="white">VISTORIADO</text>
</svg>
`)}`;

// Function to calculate numerology sum
const calculateNumerologySum = (num: number): number => {
  const digits = num.toString().replace(/\D/g, '').slice(0, 5);
  return digits.split('').reduce((sum, digit) => sum + parseInt(digit), 0);
};

// Function to adjust value to end in 8 numerologically
const adjustToNumerology8 = (baseValue: number): number => {
  let adjusted = Math.round(baseValue / 100) * 100; // Round to nearest hundred
  
  while (calculateNumerologySum(adjusted) !== 8) {
    adjusted += 100;
  }
  
  return adjusted;
};

// Function to calculate express evaluation value
const calculateExpressValue = (fipeValue: string, quilometragem: number = 80000): string => {
  // Extract numeric value from FIPE string
  const numericValue = parseFloat(fipeValue.replace(/[^\d,]/g, '').replace(',', '.'));
  
  if (isNaN(numericValue)) return 'R$ 0,00';
  
  // Calculate 78% of FIPE
  const lojistValue = numericValue * 0.78;
  
  // Subtract R$ 1,000
  const quickSaleValue = lojistValue - 1000;
  
  // Adjust to numerology 8 and ensure it ends in ",00"
  const finalValue = adjustToNumerology8(quickSaleValue);
  
  return `R$ ${finalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

// Function to load and convert image to base64
const loadImageAsBase64 = async (imageUrl: string): Promise<string | null> => {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) return null;
    
    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error loading image:', error);
    return null;
  }
};

// Function to generate express evaluation
const generateExpressEvaluation = (data: ReportData, quilometragem?: string): string => {
  const km = quilometragem ? parseInt(quilometragem.replace(/\D/g, '')) : 85000;
  const expressValue = calculateExpressValue(data.veiculo.valor_fipe, quilometragem);
  
  return `AVALIAÇÃO EXPRESSA

Veículo: ${data.veiculo.modelo}
Ano: ${data.veiculo.ano}
Quilometragem: ${km.toLocaleString('pt-BR')} km
Tabela Fipe: ${data.veiculo.valor_fipe}
Por: ${expressValue}`;
};

const createHTMLTemplate = (data: ReportData, imageUrls: string[] = [], quilometragem?: string): string => {
  const currentDate = new Date().toLocaleDateString('pt-BR');
  const expressEvaluation = generateExpressEvaluation(data, quilometragem);
  
  // Determine risk level and color
  let riskLevel = 'MÉDIO';
  let riskClass = 'risco-medio';
  let riskIcon = '⚠️';
  
  if (data.sintese.conclusao_final === 'Veículo sem indícios de colisão' || 
      data.sintese.conclusao_final === 'Reparo estético') {
    riskLevel = 'BAIXO';
    riskClass = 'risco-baixo';
    riskIcon = '✅';
  } else if (data.sintese.conclusao_final === 'Batida significativa' || 
             data.sintese.conclusao_final === 'Estrutura comprometida') {
    riskLevel = 'ALTO';
    riskClass = 'risco-alto';
    riskIcon = '❌';
  }

  return `
<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
    <style>
      @page {
        margin: 15mm;
        size: A4;
      }
      body {
        font-family: 'Roboto', 'Arial', sans-serif;
        margin: 0;
        padding: 0;
        color: #2d3748;
        line-height: 1.7;
        font-size: 14px;
        background: #ffffff;
      }
      
      .header {
        background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
        padding: 25px;
        margin-bottom: 30px;
        border-radius: 12px;
        border: 1px solid #e2e8f0;
        box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      
      .header-left {
        flex: 1;
      }
      
      .header-right {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
      }
      
      .logo {
        width: 200px;
        margin-bottom: 10px;
        display: block;
      }
      
      .document-title {
        font-size: 28px;
        font-weight: 700;
        color: #dc2626;
        margin: 8px 0;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      
      .document-info {
        color: #64748b;
        font-size: 14px;
        margin-top: 8px;
        font-weight: 500;
      }
      
      .qr-code {
        width: 80px;
        height: 80px;
        border: 2px solid #e2e8f0;
        border-radius: 8px;
      }
      
      .verified-seal {
        width: 100px;
        height: 100px;
        margin-top: 10px;
      }
      
      .section {
        margin: 30px 0;
        page-break-inside: avoid;
      }
      
      .section-title {
        font-size: 20px;
        font-weight: 700;
        color: #1a202c;
        border-bottom: 3px solid #dc2626;
        padding-bottom: 12px;
        margin-bottom: 20px;
        display: flex;
        align-items: center;
        gap: 12px;
        background: linear-gradient(90deg, #dc2626 0%, #b91c1c 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
      
      .section-icon {
        font-size: 24px;
        color: #dc2626;
      }
      
      .content-box {
        background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
        border: 1px solid #e2e8f0;
        padding: 25px;
        border-radius: 12px;
        margin-bottom: 20px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.04);
      }
      
      .vehicle-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
        margin-top: 15px;
      }
      
      .vehicle-item {
        padding: 12px 0;
        border-bottom: 1px solid #e2e8f0;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      
      .vehicle-item:last-child {
        border-bottom: none;
      }
      
      .vehicle-label {
        font-weight: 600;
        color: #4a5568;
        font-size: 13px;
      }
      
      .vehicle-value {
        font-weight: 500;
        color: #1a202c;
        text-align: right;
      }
      
      .technical-results {
        background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
        border: 1px solid #bae6fd;
        padding: 25px;
        border-radius: 12px;
        margin: 20px 0;
      }
      
      .technical-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 15px 0;
        padding: 12px 0;
        border-bottom: 1px solid #e0f2fe;
      }
      
      .technical-item:last-child {
        border-bottom: none;
      }
      
      .technical-label {
        font-weight: 600;
        color: #0369a1;
        flex: 1;
      }
      
      .technical-value {
        color: #1e40af;
        font-weight: 500;
        text-align: right;
        flex: 1;
      }
      
      .conclusion-box {
        background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
        border: 2px solid #22c55e;
        padding: 25px;
        border-radius: 12px;
        margin: 20px 0;
        box-shadow: 0 4px 12px rgba(34, 197, 94, 0.1);
      }
      
      .conclusion-title {
        font-size: 18px;
        font-weight: 700;
        color: #15803d;
        margin-bottom: 15px;
        display: flex;
        align-items: center;
        gap: 8px;
      }
      
      .conclusion-text {
        color: #166534;
        line-height: 1.8;
        font-weight: 500;
      }
      
      .risco-baixo {
        background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
        border: 3px solid #22c55e;
        color: #15803d;
        font-weight: 700;
        padding: 25px;
        border-radius: 12px;
        text-align: center;
        font-size: 20px;
        margin: 20px 0;
        box-shadow: 0 4px 12px rgba(34, 197, 94, 0.15);
      }
      
      .risco-medio {
        background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
        border: 3px solid #f59e0b;
        color: #92400e;
        font-weight: 700;
        padding: 25px;
        border-radius: 12px;
        text-align: center;
        font-size: 20px;
        margin: 20px 0;
        box-shadow: 0 4px 12px rgba(245, 158, 11, 0.15);
      }
      
      .risco-alto {
        background: linear-gradient(135deg, #fef2f2 0%, #fecaca 100%);
        border: 3px solid #ef4444;
        color: #dc2626;
        font-weight: 700;
        padding: 25px;
        border-radius: 12px;
        text-align: center;
        font-size: 20px;
        margin: 20px 0;
        box-shadow: 0 4px 12px rgba(239, 68, 68, 0.15);
      }
      
      .components-list {
        background: #fafafa;
        border: 1px solid #e5e7eb;
        border-radius: 12px;
        padding: 20px;
        margin: 15px 0;
      }
      
      .component-item {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin: 12px 0;
        padding: 15px;
        background: white;
        border-radius: 8px;
        border-left: 4px solid #dc2626;
        box-shadow: 0 1px 3px rgba(0,0,0,0.05);
      }
      
      .component-name {
        font-weight: 600;
        color: #374151;
        flex: 1;
      }
      
      .component-status {
        font-weight: 500;
        padding: 4px 12px;
        border-radius: 20px;
        font-size: 12px;
        margin: 0 10px;
      }
      
      .status-original {
        background: #dcfce7;
        color: #166534;
      }
      
      .status-retocado {
        background: #fef3c7;
        color: #92400e;
      }
      
      .status-problema {
        background: #fecaca;
        color: #dc2626;
      }
      
      .component-conclusion {
        color: #6b7280;
        font-size: 13px;
        flex: 2;
        text-align: right;
      }
      
      .vehicle-images {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        gap: 20px;
        margin: 25px 0;
      }
      
      .vehicle-image {
        width: 100%;
        height: 140px;
        object-fit: cover;
        border-radius: 12px;
        border: 2px solid #e5e7eb;
        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
      }
      
      .image-caption {
        text-align: center;
        font-size: 12px;
        color: #6b7280;
        margin-top: 8px;
        font-weight: 500;
      }
      
      .footer {
        margin-top: 50px;
        text-align: center;
        font-size: 13px;
        color: #6b7280;
        border-top: 2px solid #e5e7eb;
        padding-top: 25px;
        page-break-inside: avoid;
        line-height: 1.8;
        background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
        padding: 25px;
        border-radius: 12px;
        margin-top: 40px;
      }
      
      .footer-logo {
        font-weight: 700;
        color: #dc2626;
        margin-bottom: 8px;
        font-size: 16px;
      }
      
      .footer-contact {
        margin: 8px 0;
        font-weight: 500;
      }
      
      .whatsapp-contact {
        color: #22c55e;
        font-weight: 600;
        font-size: 14px;
      }
      
      .express-eval {
        background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
        border: 2px solid #22c55e;
        padding: 25px;
        border-radius: 12px;
        font-family: 'Roboto', monospace;
        font-size: 14px;
        line-height: 1.9;
        margin-top: 15px;
        box-shadow: 0 4px 12px rgba(34, 197, 94, 0.1);
      }
      
      .express-eval .title-eval {
        font-size: 18px;
        font-weight: 700;
        margin-bottom: 20px;
        text-align: center;
        color: #15803d;
      }
      
      .express-eval .price {
        font-size: 20px;
        font-weight: 700;
        color: #16a34a;
      }
      
      .protocol-info {
        background: #f8fafc;
        padding: 15px;
        border-radius: 8px;
        border-left: 4px solid #dc2626;
        margin: 15px 0;
      }
      
      .protocol-number {
        font-family: 'Courier New', monospace;
        font-weight: 600;
        color: #dc2626;
      }
      
      /* Page break utilities */
      .page-break-before {
        page-break-before: always;
      }
      .no-break {
        page-break-inside: avoid;
      }
      
      /* Enhanced spacing */
      h1, h2, h3, h4 {
        margin-top: 25px;
        margin-bottom: 15px;
        line-height: 1.3;
      }
      
      p {
        margin-bottom: 12px;
        line-height: 1.7;
      }
      
      ul {
        margin: 15px 0;
        padding-left: 25px;
        line-height: 1.8;
      }
      
      li {
        margin: 10px 0;
        line-height: 1.8;
      }
    </style>
  </head>
  <body>

    <div class="header no-break">
      <div class="header-left">
        <img class="logo" src="${REVIUCAR_LOGO_BASE64}" alt="ReviuCar" />
        <h1 class="document-title">📋 Laudo Técnico de Avaliação Veicular</h1>
        <div class="document-info">
          📅 <strong>Data:</strong> ${currentDate} &nbsp;&nbsp;|&nbsp;&nbsp; 
          🔍 <strong>Analista:</strong> IA ReviuCar
        </div>
        <div class="protocol-info">
          🆔 <strong>Protocolo:</strong> <span class="protocol-number">RVC-${Date.now().toString().slice(-6)}</span>
        </div>
      </div>
      <div class="header-right">
        <img class="qr-code" src="${QR_CODE_BASE64}" alt="QR Code - reviucar.com.br" />
        <img class="verified-seal" src="${VERIFIED_SEAL_BASE64}" alt="Vistoriado" />
      </div>
    </div>

    <div class="section no-break">
      <div class="section-title">
        <span class="section-icon">🚗</span>
        Veículo Avaliado
      </div>
      <div class="content-box">
        <div class="vehicle-grid">
          <div class="vehicle-item">
            <span class="vehicle-label">Modelo:</span>
            <span class="vehicle-value">${data.veiculo.modelo}</span>
          </div>
          <div class="vehicle-item">
            <span class="vehicle-label">Marca:</span>
            <span class="vehicle-value">${data.veiculo.marca}</span>
          </div>
          <div class="vehicle-item">
            <span class="vehicle-label">Ano Modelo:</span>
            <span class="vehicle-value">${data.veiculo.ano}</span>
          </div>
          ${data.veiculo.cor ? `
          <div class="vehicle-item">
            <span class="vehicle-label">Cor:</span>
            <span class="vehicle-value">${data.veiculo.cor}</span>
          </div>
          ` : ''}
          ${data.veiculo.combustivel ? `
          <div class="vehicle-item">
            <span class="vehicle-label">Combustível:</span>
            <span class="vehicle-value">${data.veiculo.combustivel}</span>
          </div>
          ` : ''}
          ${data.veiculo.chassi ? `
          <div class="vehicle-item">
            <span class="vehicle-label">Chassi:</span>
            <span class="vehicle-value">${data.veiculo.chassi}</span>
          </div>
          ` : ''}
          ${data.veiculo.municipio && data.veiculo.uf ? `
          <div class="vehicle-item">
            <span class="vehicle-label">Município/UF:</span>
            <span class="vehicle-value">${data.veiculo.municipio}/${data.veiculo.uf}</span>
          </div>
          ` : ''}
          ${data.veiculo.situacao ? `
          <div class="vehicle-item">
            <span class="vehicle-label">Situação:</span>
            <span class="vehicle-value">${data.veiculo.situacao}</span>
          </div>
          ` : ''}
          <div class="vehicle-item">
            <span class="vehicle-label">Valor FIPE:</span>
            <span class="vehicle-value" style="color: #16a34a; font-weight: 700;">${data.veiculo.valor_fipe}</span>
          </div>
          <div class="vehicle-item">
            <span class="vehicle-label">Código FIPE:</span>
            <span class="vehicle-value">${data.veiculo.codigo_fipe}</span>
          </div>
          <div class="vehicle-item">
            <span class="vehicle-label">Placa:</span>
            <span class="vehicle-value" style="font-family: 'Courier New', monospace; font-weight: 700; font-size: 16px;">${data.veiculo.placa}</span>
          </div>
          ${quilometragem ? `
          <div class="vehicle-item">
            <span class="vehicle-label">Quilometragem:</span>
            <span class="vehicle-value">${parseInt(quilometragem.replace(/\D/g, '')).toLocaleString('pt-BR')} km</span>
          </div>
          ` : ''}
        </div>
      </div>
    </div>

    ${imageUrls.length > 0 ? `
    <div class="section">
      <div class="section-title">
        <span class="section-icon">📸</span>
        Imagens do Veículo
      </div>
      <div class="content-box">
        <div class="vehicle-images">
          ${imageUrls.slice(0, 6).map((url, index) => `
            <div>
              <img src="${url}" alt="Imagem ${index + 1}" class="vehicle-image" />
              <div class="image-caption">📷 Imagem ${index + 1}</div>
            </div>
          `).join('')}
        </div>
        ${imageUrls.length > 6 ? `
        <p style="text-align: center; margin-top: 20px; font-size: 13px; color: #6b7280; font-weight: 500;">
          📋 E mais ${imageUrls.length - 6} imagem${imageUrls.length - 6 > 1 ? 's' : ''} analisada${imageUrls.length - 6 > 1 ? 's' : ''}...
        </p>
        ` : ''}
      </div>
    </div>
    ` : ''}

    <div class="section">
      <div class="section-title">
        <span class="section-icon">📊</span>
        Resultados Técnicos
      </div>
      <div class="technical-results">
        <div class="technical-item">
          <div class="technical-label">🎨 Repintura detectada em:</div>
          <div class="technical-value">${data.sintese.repintura_em}</div>
        </div>
        <div class="technical-item">
          <div class="technical-label">🔧 Massa plástica visível em:</div>
          <div class="technical-value">${data.sintese.massa_em}</div>
        </div>
        <div class="technical-item">
          <div class="technical-label">⚖️ Alinhamento comprometido:</div>
          <div class="technical-value">${data.sintese.alinhamento_comprometido}</div>
        </div>
        <div class="technical-item">
          <div class="technical-label">🔍 Vidros/faróis trocados:</div>
          <div class="technical-value">${data.sintese.vidros_trocados}</div>
        </div>
        <div class="technical-item">
          <div class="technical-label">🏗️ Estrutura inferior:</div>
          <div class="technical-value">${data.sintese.estrutura_inferior}</div>
        </div>
      </div>
    </div>

    <div class="section">
      <div class="section-title">
        <span class="section-icon">📌</span>
        Conclusão Técnica
      </div>
      <div class="conclusion-box">
        <div class="conclusion-title">
          🧾 Resumo da Análise
        </div>
        <div class="conclusion-text">
          ${data.sintese.resumo}
        </div>
      </div>
    </div>

    <div class="section">
      <div class="section-title">
        <span class="section-icon">⚠️</span>
        Classificação de Risco
      </div>
      <div class="${riskClass}">
        ${riskIcon} CLASSIFICAÇÃO DE RISCO: ${riskLevel}
      </div>
    </div>

    <div class="section">
      <div class="section-title">
        <span class="section-icon">🛠️</span>
        Observações Finais
      </div>
      <div class="content-box">
        ${data.componentes.length > 0 ? `
          <h3 style="color: #374151; font-weight: 600; margin-bottom: 15px;">🔍 Componentes Analisados:</h3>
          <div class="components-list">
            ${data.componentes.map(comp => {
              let statusClass = 'status-original';
              if (comp.estado.includes('Retocado') || comp.estado.includes('Repintura')) {
                statusClass = 'status-retocado';
              } else if (comp.estado.includes('Massa') || comp.estado.includes('Troca')) {
                statusClass = 'status-problema';
              }
              
              return `
                <div class="component-item">
                  <div class="component-name">${comp.nome}</div>
                  <div class="component-status ${statusClass}">${comp.estado}</div>
                  <div class="component-conclusion">${comp.conclusao}</div>
                </div>
              `;
            }).join('')}
          </div>
        ` : ''}
        
        <div style="margin-top: 25px;">
          <h4 style="color: #374151; font-weight: 600; margin-bottom: 12px;">📋 Informações Importantes:</h4>
          <ul style="color: #4b5563; line-height: 1.8;">
            <li>✅ Este laudo técnico foi gerado com base em imagens e análise por inteligência artificial</li>
            <li>🤖 Laudo automatizado pela IA ReviuCar conforme protocolo técnico padrão</li>
            <li>📊 Análise realizada seguindo metodologia técnica especializada</li>
            <li>🔒 Documento com validade técnica para avaliação veicular</li>
          </ul>
        </div>
      </div>
    </div>

    <div class="footer">
      <div class="footer-logo">ReviuCar – Avaliação Inteligente de Veículos</div>
      <div class="footer-contact">
        🌐 <strong>Site:</strong> www.reviucar.com.br
      </div>
      <div class="footer-contact">
        ✉️ <strong>Email:</strong> contato@reviucar.com.br
      </div>
      <div class="footer-contact whatsapp-contact">
        📱 <strong>WhatsApp:</strong> (61) 98187-5542
      </div>
      <div style="margin-top: 15px; font-size: 12px; color: #9ca3af;">
        Documento gerado automaticamente em ${currentDate} • Protocolo: RVC-${Date.now().toString().slice(-6)}
      </div>
    </div>
  </body>
</html>`;
};

export const generatePDF = async (reportData: ReportData, imageUrls: string[] = [], quilometragem?: string) => {
  try {
    // Load images as base64 for embedding in PDF
    console.log('Loading images for PDF...', imageUrls.length);
    const base64Images: string[] = [];
    
    if (imageUrls.length > 0) {
      const imagePromises = imageUrls.slice(0, 6).map(async (url) => {
        const base64 = await loadImageAsBase64(url);
        return base64;
      });
      
      const results = await Promise.all(imagePromises);
      base64Images.push(...results.filter(Boolean) as string[]);
      console.log('Loaded', base64Images.length, 'images for PDF');
    }

    // Create a temporary div to render HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = createHTMLTemplate(reportData, base64Images, quilometragem);
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    tempDiv.style.width = '794px'; // A4 width in pixels at 96 DPI
    tempDiv.style.backgroundColor = 'white';
    tempDiv.style.padding = '40px';
    tempDiv.style.boxSizing = 'border-box';
    
    document.body.appendChild(tempDiv);

    // Wait for fonts and images to load
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Convert HTML to canvas with better settings for multi-page content
    const canvas = await html2canvas(tempDiv, {
      width: 794,
      scale: 1.5,
      useCORS: true,
      allowTaint: true,
      backgroundColor: 'white',
      logging: false,
      scrollX: 0,
      scrollY: 0,
      windowWidth: 794,
      windowHeight: tempDiv.scrollHeight,
      onclone: (clonedDoc) => {
        // Ensure images are loaded in the cloned document
        const images = clonedDoc.querySelectorAll('img');
        images.forEach((img) => {
          img.style.maxWidth = '100%';
          img.style.height = 'auto';
        });
      }
    });

    // Remove temporary div
    document.body.removeChild(tempDiv);

    // Create PDF with proper multi-page handling
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgData = canvas.toDataURL('image/png', 1.0);
    
    const pageWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // If content fits in one page
    if (imgHeight <= pageHeight) {
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    } else {
      // Multi-page handling
      let heightLeft = imgHeight;
      let position = 0;

      // First page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Additional pages
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
    }

    // Save PDF with professional filename
    const currentDate = new Date().toLocaleDateString('pt-BR').replace(/\//g, '-');
    const vehicleInfo = `${reportData.veiculo.marca}_${reportData.veiculo.modelo}_${reportData.veiculo.ano}`.replace(/\s+/g, '_');
    const fileName = `Laudo_ReviuCar_${vehicleInfo}_${currentDate}.pdf`;
    
    pdf.save(fileName);

    console.log('PDF generated successfully:', fileName);

  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    throw new Error('Erro ao gerar PDF. Verifique sua conexão e tente novamente.');
  }
};
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

const createHTMLTemplate = (data: ReportData, imageUrls: string[] = [], quilometragem?: string): string => {
  const currentDate = new Date().toLocaleDateString('pt-BR');
  const protocolNumber = `RVC-${Date.now().toString().slice(-6)}`;
  
  // Determine risk level and styling
  let riskLevel = 'MÉDIO';
  let riskClass = 'risco-medio';
  
  if (data.sintese.conclusao_final === 'Veículo sem indícios de colisão' || 
      data.sintese.conclusao_final === 'Reparo estético') {
    riskLevel = 'BAIXO';
    riskClass = 'risco-baixo';
  } else if (data.sintese.conclusao_final === 'Batida significativa' || 
             data.sintese.conclusao_final === 'Estrutura comprometida') {
    riskLevel = 'ALTO';
    riskClass = 'risco-alto';
  }

  return `
<!DOCTYPE html>
<html lang="pt-br">
<head>
  <meta charset="UTF-8">
  <title>Laudo Técnico ReviuCar</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 40px;
      color: #111;
      line-height: 1.6;
    }

    .page {
      page-break-after: always;
    }

    h1, h2, h3 {
      color: #333;
    }

    .header {
      text-align: center;
      border-bottom: 2px solid #444;
      padding-bottom: 10px;
      margin-bottom: 30px;
      position: relative;
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .logo-section {
      flex: 1;
      text-align: left;
    }

    .qr-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
    }

    .qr-code {
      width: 80px;
      height: 80px;
      border: 2px solid #ccc;
      border-radius: 8px;
    }

    .info-table, .result-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 25px;
    }

    .info-table td, .result-table td {
      border: 1px solid #ccc;
      padding: 12px;
      vertical-align: top;
    }

    .info-table td:first-child, .result-table td:first-child {
      background-color: #f8f9fa;
      font-weight: bold;
    }

    .result-table td {
      text-transform: uppercase;
      font-weight: bold;
    }

    .images {
      display: flex;
      flex-wrap: wrap;
      gap: 15px;
      margin: 20px 0;
      justify-content: center;
    }

    .image-container {
      flex: 1;
      min-width: 200px;
      max-width: 300px;
      text-align: center;
    }

    .images img {
      width: 100%;
      height: 200px;
      object-fit: cover;
      border: 2px solid #ddd;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .image-caption {
      font-size: 12px;
      color: #666;
      margin-top: 5px;
    }

    .footer {
      font-size: 12px;
      color: #666;
      text-align: center;
      margin-top: 30px;
      border-top: 1px solid #ddd;
      padding-top: 20px;
    }

    .selo {
      color: green;
      font-weight: bold;
      font-size: 20px;
      text-align: center;
      margin: 20px 0;
      background-color: #d4edda;
      padding: 10px;
      border-radius: 8px;
      border: 2px solid #28a745;
    }

    .risco-baixo {
      background-color: #d4edda;
      color: #155724;
      font-weight: bold;
      padding: 15px;
      text-align: center;
      border: 2px solid #c3e6cb;
      border-radius: 8px;
      font-size: 18px;
      margin: 20px 0;
    }

    .risco-medio {
      background-color: #fff3cd;
      color: #856404;
      font-weight: bold;
      padding: 15px;
      text-align: center;
      border: 2px solid #ffeaa7;
      border-radius: 8px;
      font-size: 18px;
      margin: 20px 0;
    }

    .risco-alto {
      background-color: #f8d7da;
      color: #721c24;
      font-weight: bold;
      padding: 15px;
      text-align: center;
      border: 2px solid #f5c6cb;
      border-radius: 8px;
      font-size: 18px;
      margin: 20px 0;
    }

    .components-section {
      background-color: #f8f9fa;
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
    }

    .component-item {
      background-color: white;
      padding: 15px;
      margin: 10px 0;
      border-left: 4px solid #dc3545;
      border-radius: 4px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

    .component-name {
      font-weight: bold;
      color: #333;
      margin-bottom: 5px;
    }

    .component-status {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: bold;
      margin-bottom: 5px;
    }

    .status-original {
      background-color: #d4edda;
      color: #155724;
    }

    .status-retocado {
      background-color: #fff3cd;
      color: #856404;
    }

    .status-problema {
      background-color: #f8d7da;
      color: #721c24;
    }

    .protocol-info {
      background-color: #e9ecef;
      padding: 10px;
      border-radius: 5px;
      margin: 10px 0;
      font-family: monospace;
    }

    .conclusion-box {
      background-color: #f0f9ff;
      border: 2px solid #0ea5e9;
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
    }

    .technical-summary {
      background-color: #f8f9fa;
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
      border-left: 5px solid #dc3545;
    }

    @media print {
      body { margin: 20px; }
      .page { page-break-after: always; }
    }
  </style>
</head>
<body>

  <!-- Página 1 -->
  <div class="page">
    <div class="header">
      <div class="header-content">
        <div class="logo-section">
          <img src="${REVIUCAR_LOGO_BASE64}" alt="ReviuCar" style="width: 200px; margin-bottom: 10px;" />
        </div>
        <div class="qr-section">
          <img class="qr-code" src="${QR_CODE_BASE64}" alt="QR Code - reviucar.com.br" />
          <small>reviucar.com.br</small>
        </div>
      </div>
      <h1>LAUDO TÉCNICO DE AVALIAÇÃO VEICULAR</h1>
      <p>Emitido em: <strong>${currentDate}</strong> • Protocolo: <strong>${protocolNumber}</strong></p>
      <div class="selo">✔ VISTORIADO</div>
    </div>

    <h2>🚗 Informações do Veículo</h2>
    <table class="info-table">
      <tr><td><b>Modelo:</b></td><td>${data.veiculo.modelo}</td></tr>
      <tr><td><b>Marca:</b></td><td>${data.veiculo.marca}</td></tr>
      <tr><td><b>Ano/Modelo:</b></td><td>${data.veiculo.ano}</td></tr>
      <tr><td><b>Cor:</b></td><td>${data.veiculo.cor || 'N/A'}</td></tr>
      <tr><td><b>Combustível:</b></td><td>${data.veiculo.combustivel || 'N/A'}</td></tr>
      <tr><td><b>Chassi:</b></td><td>${data.veiculo.chassi || 'N/A'}</td></tr>
      <tr><td><b>Placa:</b></td><td>${data.veiculo.placa}</td></tr>
      <tr><td><b>Município/UF:</b></td><td>${data.veiculo.municipio || 'N/A'} / ${data.veiculo.uf || 'N/A'}</td></tr>
      <tr><td><b>Valor FIPE:</b></td><td style="color: #28a745; font-weight: bold;">${data.veiculo.valor_fipe}</td></tr>
      <tr><td><b>Código FIPE:</b></td><td>${data.veiculo.codigo_fipe}</td></tr>
      <tr><td><b>Situação:</b></td><td>${data.veiculo.situacao || 'N/A'}</td></tr>
      ${quilometragem ? `<tr><td><b>Quilometragem:</b></td><td>${parseInt(quilometragem.replace(/\D/g, '')).toLocaleString('pt-BR')} km</td></tr>` : ''}
    </table>

    <div class="protocol-info">
      <strong>Protocolo de Análise:</strong> ${protocolNumber} | <strong>Data:</strong> ${currentDate}
    </div>
  </div>

  <!-- Página 2 -->
  <div class="page">
    <div class="header">
      <h2>📸 Análise Visual</h2>
      <p>Imagens coletadas para verificação estrutural</p>
    </div>

    ${imageUrls.length > 0 ? `
    <div class="images">
      ${imageUrls.slice(0, 6).map((url, index) => `
        <div class="image-container">
          <img src="${url}" alt="Imagem ${index + 1}" />
          <div class="image-caption">Imagem ${index + 1}</div>
        </div>
      `).join('')}
    </div>
    ${imageUrls.length > 6 ? `
    <p style="text-align: center; margin-top: 20px; font-size: 14px; color: #666;">
      E mais ${imageUrls.length - 6} imagem${imageUrls.length - 6 > 1 ? 's' : ''} analisada${imageUrls.length - 6 > 1 ? 's' : ''}...
    </p>
    ` : ''}
    ` : `
    <p style="text-align: center; color: #666; font-style: italic;">
      Nenhuma imagem disponível para esta análise
    </p>
    `}

    <h3>📊 Resultado Técnico</h3>
    <table class="result-table">
      <tr><td>Repintura</td><td style="color: ${data.sintese.repintura_em === 'nenhuma' ? '#28a745' : '#dc3545'};">${data.sintese.repintura_em}</td></tr>
      <tr><td>Massa Plástica</td><td style="color: ${data.sintese.massa_em === 'nenhuma' ? '#28a745' : '#dc3545'};">${data.sintese.massa_em}</td></tr>
      <tr><td>Alinhamento Comprometido</td><td style="color: ${data.sintese.alinhamento_comprometido === 'nenhuma' ? '#28a745' : '#dc3545'};">${data.sintese.alinhamento_comprometido}</td></tr>
      <tr><td>Vidros/Faróis Trocados</td><td style="color: ${data.sintese.vidros_trocados === 'nenhuma' ? '#28a745' : '#dc3545'};">${data.sintese.vidros_trocados}</td></tr>
      <tr><td>Estrutura Inferior</td><td style="color: ${data.sintese.estrutura_inferior === 'OK' ? '#28a745' : '#dc3545'};">${data.sintese.estrutura_inferior}</td></tr>
    </table>
  </div>

  <!-- Página 3 -->
  <div class="page">
    <div class="header">
      <h2>📌 Conclusão Técnica</h2>
    </div>

    <div class="${riskClass}">
      ${riskLevel === 'BAIXO' ? '✅' : riskLevel === 'MÉDIO' ? '⚠️' : '❌'} 
      Classificação de Risco: ${riskLevel}
    </div>

    <div class="conclusion-box">
      <h3>Resumo da Análise</h3>
      <p><strong>Resumo:</strong> ${data.sintese.resumo}</p>
      <p><strong>Conclusão Final:</strong> ${data.sintese.conclusao_final}</p>
    </div>

    ${data.componentes.length > 0 ? `
    <h3>🛠️ Componentes Analisados</h3>
    <div class="components-section">
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
            <div style="color: #666; font-size: 14px; margin-top: 5px;">${comp.conclusao}</div>
          </div>
        `;
      }).join('')}
    </div>
    ` : ''}

    <h3>📋 Observações Finais</h3>
    <ul style="line-height: 1.8;">
      <li>Laudo gerado com base em imagens e análise por IA.</li>
      <li>Conforme protocolo técnico padrão ReviuCar.</li>
      <li>Documento com validade técnica para avaliação veicular.</li>
      <li>Análise não substitui perícia física completa.</li>
    </ul>

    <div class="footer">
      <strong>ReviuCar – Avaliação Inteligente de Veículos</strong><br>
      🌐 www.reviucar.com.br • ✉️ contato@reviucar.com.br • 📱 (61) 98187-5542<br>
      <small>Documento gerado automaticamente em ${currentDate} • Protocolo: ${protocolNumber}</small>
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
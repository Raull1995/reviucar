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

// Enhanced ReviuCar logo SVG
const REVIUCAR_LOGO_BASE64 = `data:image/svg+xml;base64,${btoa(`
<svg width="300" height="100" viewBox="0 0 300 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#DC2626;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#991B1B;stop-opacity:1" />
    </linearGradient>
    <filter id="logoShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="3" dy="3" stdDeviation="4" flood-opacity="0.3"/>
    </filter>
  </defs>
  <rect width="300" height="100" fill="url(#logoGradient)" rx="15" filter="url(#logoShadow)"/>
  <circle cx="50" cy="50" r="25" fill="white"/>
  <text x="42" y="60" font-family="Arial, sans-serif" font-size="28" font-weight="bold" fill="#DC2626">R</text>
  <text x="85" y="42" font-family="Arial, sans-serif" font-size="32" font-weight="bold" fill="white">REVIUCAR</text>
  <text x="85" y="65" font-family="Arial, sans-serif" font-size="16" fill="white">Avaliação Inteligente</text>
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
<html lang="pt-br">
<head>
  <meta charset="UTF-8">
  <title>Laudo Técnico ReviuCar</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Inter', Arial, sans-serif;
      margin: 0;
      color: #1a1a1a;
      line-height: 1.6;
      background: #ffffff;
    }

    .page {
      page-break-after: always;
      min-height: 100vh;
      padding: 40px;
      position: relative;
    }

    .page:last-child {
      page-break-after: avoid;
    }

    /* Header Styles */
    .header {
      border-bottom: 3px solid #DC2626;
      padding-bottom: 20px;
      margin-bottom: 40px;
      position: relative;
    }

    .header-top {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 30px;
    }

    .logo-section {
      flex: 1;
    }

    .logo {
      width: 280px;
      height: auto;
      margin-bottom: 15px;
    }

    .document-info {
      text-align: right;
      color: #666;
      font-size: 14px;
    }

    .document-title {
      text-align: center;
      color: #DC2626;
      font-size: 28px;
      font-weight: 700;
      margin: 20px 0;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .protocol-badge {
      background: linear-gradient(135deg, #DC2626, #991B1B);
      color: white;
      padding: 12px 24px;
      border-radius: 25px;
      font-weight: 600;
      font-size: 16px;
      text-align: center;
      margin: 20px auto;
      width: fit-content;
      box-shadow: 0 4px 15px rgba(220, 38, 38, 0.3);
    }

    /* Table Styles */
    .info-table, .result-table {
      width: 100%;
      border-collapse: collapse;
      margin: 25px 0;
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
    }

    .info-table th, .info-table td,
    .result-table th, .result-table td {
      padding: 16px 20px;
      text-align: left;
      border-bottom: 1px solid #f0f0f0;
    }

    .info-table th, .result-table th {
      background: linear-gradient(135deg, #f8f9fa, #e9ecef);
      font-weight: 600;
      color: #495057;
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .info-table td:first-child,
    .result-table td:first-child {
      background: #f8f9fa;
      font-weight: 600;
      color: #495057;
      width: 40%;
    }

    .info-table td:last-child,
    .result-table td:last-child {
      font-weight: 500;
      color: #212529;
    }

    /* Section Headers */
    .section-header {
      background: linear-gradient(135deg, #DC2626, #991B1B);
      color: white;
      padding: 15px 25px;
      border-radius: 10px;
      font-size: 18px;
      font-weight: 600;
      margin: 30px 0 20px 0;
      display: flex;
      align-items: center;
      gap: 10px;
      box-shadow: 0 4px 15px rgba(220, 38, 38, 0.2);
    }

    /* Images Grid */
    .images-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin: 30px 0;
    }

    .image-container {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
      transition: transform 0.2s ease;
    }

    .image-container:hover {
      transform: translateY(-2px);
    }

    .images-grid img {
      width: 100%;
      height: 200px;
      object-fit: cover;
      border-bottom: 3px solid #DC2626;
    }

    .image-caption {
      padding: 12px 16px;
      font-size: 14px;
      font-weight: 500;
      color: #495057;
      text-align: center;
      background: #f8f9fa;
    }

    /* Risk Classification */
    .risk-classification {
      padding: 25px;
      border-radius: 15px;
      text-align: center;
      margin: 30px 0;
      font-size: 20px;
      font-weight: 700;
      box-shadow: 0 6px 25px rgba(0,0,0,0.1);
    }

    .risco-baixo {
      background: linear-gradient(135deg, #d4edda, #c3e6cb);
      color: #155724;
      border: 3px solid #28a745;
    }

    .risco-medio {
      background: linear-gradient(135deg, #fff3cd, #ffeaa7);
      color: #856404;
      border: 3px solid #ffc107;
    }

    .risco-alto {
      background: linear-gradient(135deg, #f8d7da, #f5c6cb);
      color: #721c24;
      border: 3px solid #dc3545;
    }

    /* Components Section */
    .components-section {
      background: #f8f9fa;
      padding: 25px;
      border-radius: 15px;
      margin: 30px 0;
      border-left: 5px solid #DC2626;
    }

    .component-item {
      background: white;
      padding: 20px;
      margin: 15px 0;
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.05);
      border-left: 4px solid #DC2626;
    }

    .component-name {
      font-weight: 600;
      color: #212529;
      font-size: 16px;
      margin-bottom: 8px;
    }

    .component-status {
      display: inline-block;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      margin-bottom: 8px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .status-original {
      background: #d4edda;
      color: #155724;
    }

    .status-retocado {
      background: #fff3cd;
      color: #856404;
    }

    .status-problema {
      background: #f8d7da;
      color: #721c24;
    }

    .component-conclusion {
      color: #6c757d;
      font-size: 14px;
      line-height: 1.5;
    }

    /* Conclusion Box */
    .conclusion-box {
      background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
      border: 2px solid #0ea5e9;
      padding: 25px;
      border-radius: 15px;
      margin: 30px 0;
    }

    .conclusion-title {
      color: #0369a1;
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 15px;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .conclusion-text {
      color: #374151;
      font-size: 15px;
      line-height: 1.6;
      margin-bottom: 10px;
    }

    /* Technical Summary */
    .technical-summary {
      background: white;
      border: 2px solid #e5e7eb;
      border-radius: 15px;
      overflow: hidden;
      margin: 30px 0;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
    }

    .summary-header {
      background: linear-gradient(135deg, #374151, #1f2937);
      color: white;
      padding: 20px 25px;
      font-size: 18px;
      font-weight: 600;
    }

    .summary-content {
      padding: 25px;
    }

    .summary-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin: 20px 0;
    }

    .summary-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
      background: #f8f9fa;
      border-radius: 8px;
      border-left: 4px solid #DC2626;
    }

    .summary-label {
      font-weight: 500;
      color: #495057;
    }

    .summary-value {
      font-weight: 600;
      padding: 4px 12px;
      border-radius: 15px;
      font-size: 14px;
    }

    .value-ok {
      background: #d4edda;
      color: #155724;
    }

    .value-problem {
      background: #f8d7da;
      color: #721c24;
    }

    .value-warning {
      background: #fff3cd;
      color: #856404;
    }

    /* Footer */
    .footer {
      position: fixed;
      bottom: 30px;
      left: 40px;
      right: 40px;
      text-align: center;
      font-size: 12px;
      color: #6c757d;
      border-top: 1px solid #dee2e6;
      padding-top: 15px;
      background: white;
    }

    .footer-logo {
      font-weight: 600;
      color: #DC2626;
      margin-bottom: 5px;
    }

    .footer-contact {
      color: #495057;
      margin-bottom: 3px;
    }

    .footer-protocol {
      font-size: 11px;
      color: #adb5bd;
    }

    /* Page Numbers */
    .page-number {
      position: fixed;
      bottom: 15px;
      right: 40px;
      font-size: 12px;
      color: #6c757d;
      background: white;
      padding: 5px 10px;
      border-radius: 15px;
      border: 1px solid #dee2e6;
    }

    /* Watermark */
    .watermark {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) rotate(-45deg);
      font-size: 120px;
      color: rgba(220, 38, 38, 0.03);
      font-weight: 900;
      z-index: -1;
      pointer-events: none;
    }

    @media print {
      body { margin: 0; }
      .page { 
        page-break-after: always;
        margin: 0;
        padding: 40px;
      }
      .page:last-child {
        page-break-after: avoid;
      }
    }
  </style>
</head>
<body>
  <div class="watermark">REVIUCAR</div>

  <!-- Página 1 - Capa e Dados do Veículo -->
  <div class="page">
    <div class="header">
      <div class="header-top">
        <div class="logo-section">
          <img src="${REVIUCAR_LOGO_BASE64}" alt="ReviuCar" class="logo" />
        </div>
        <div class="document-info">
          <div><strong>Data de Emissão:</strong> ${currentDate}</div>
          <div><strong>Protocolo:</strong> ${protocolNumber}</div>
          <div><strong>Validade:</strong> 30 dias</div>
        </div>
      </div>
      <h1 class="document-title">Laudo Técnico de Avaliação Veicular</h1>
      <div class="protocol-badge">✔ DOCUMENTO TÉCNICO VERIFICADO</div>
    </div>

    <div class="section-header">
      🚗 Identificação do Veículo
    </div>
    
    <table class="info-table">
      <tbody>
        <tr><td>Modelo</td><td>${data.veiculo.modelo}</td></tr>
        <tr><td>Marca</td><td>${data.veiculo.marca}</td></tr>
        <tr><td>Ano/Modelo</td><td>${data.veiculo.ano}</td></tr>
        <tr><td>Cor</td><td>${data.veiculo.cor || 'Não informado'}</td></tr>
        <tr><td>Combustível</td><td>${data.veiculo.combustivel || 'Não informado'}</td></tr>
        <tr><td>Chassi</td><td>${data.veiculo.chassi || 'Não informado'}</td></tr>
        <tr><td>Placa</td><td style="font-family: monospace; font-weight: bold; font-size: 16px;">${data.veiculo.placa}</td></tr>
        <tr><td>Município/UF</td><td>${data.veiculo.municipio || 'N/A'} / ${data.veiculo.uf || 'N/A'}</td></tr>
        <tr><td>Valor FIPE</td><td style="color: #28a745; font-weight: bold; font-size: 16px;">${data.veiculo.valor_fipe}</td></tr>
        <tr><td>Código FIPE</td><td style="font-family: monospace;">${data.veiculo.codigo_fipe}</td></tr>
        <tr><td>Situação</td><td>${data.veiculo.situacao || 'Regular'}</td></tr>
        ${quilometragem ? `<tr><td>Quilometragem</td><td style="font-weight: bold;">${parseInt(quilometragem.replace(/\D/g, '')).toLocaleString('pt-BR')} km</td></tr>` : ''}
      </tbody>
    </table>

    <div class="risk-classification ${riskClass}">
      ${riskIcon} CLASSIFICAÇÃO DE RISCO: ${riskLevel}
    </div>

    <div class="page-number">Página 1</div>
  </div>

  <!-- Página 2 - Análise Visual e Resultados -->
  <div class="page">
    <div class="section-header">
      📸 Análise Visual Técnica
    </div>

    ${imageUrls.length > 0 ? `
    <div class="images-grid">
      ${imageUrls.slice(0, 6).map((url, index) => `
        <div class="image-container">
          <img src="${url}" alt="Análise ${index + 1}" />
          <div class="image-caption">Imagem ${index + 1} - Análise Técnica</div>
        </div>
      `).join('')}
    </div>
    ${imageUrls.length > 6 ? `
    <div style="text-align: center; margin: 20px 0; padding: 15px; background: #f8f9fa; border-radius: 10px;">
      <strong>+ ${imageUrls.length - 6} imagem${imageUrls.length - 6 > 1 ? 's' : ''} adicional${imageUrls.length - 6 > 1 ? 'is' : ''} analisada${imageUrls.length - 6 > 1 ? 's' : ''}</strong>
    </div>
    ` : ''}
    ` : `
    <div style="text-align: center; padding: 40px; background: #f8f9fa; border-radius: 15px; color: #6c757d;">
      <div style="font-size: 48px; margin-bottom: 15px;">📷</div>
      <p style="font-size: 16px; font-weight: 500;">Nenhuma imagem disponível para esta análise</p>
    </div>
    `}

    <div class="section-header">
      📊 Resultados da Análise Técnica
    </div>

    <div class="technical-summary">
      <div class="summary-header">
        🔍 Verificação Técnica Detalhada
      </div>
      <div class="summary-content">
        <div class="summary-grid">
          <div class="summary-item">
            <span class="summary-label">Repintura Detectada</span>
            <span class="summary-value ${data.sintese.repintura_em === 'nenhuma' ? 'value-ok' : 'value-problem'}">
              ${data.sintese.repintura_em.toUpperCase()}
            </span>
          </div>
          <div class="summary-item">
            <span class="summary-label">Massa Plástica</span>
            <span class="summary-value ${data.sintese.massa_em === 'nenhuma' ? 'value-ok' : 'value-problem'}">
              ${data.sintese.massa_em.toUpperCase()}
            </span>
          </div>
          <div class="summary-item">
            <span class="summary-label">Alinhamento</span>
            <span class="summary-value ${data.sintese.alinhamento_comprometido === 'nenhuma' ? 'value-ok' : 'value-problem'}">
              ${data.sintese.alinhamento_comprometido.toUpperCase()}
            </span>
          </div>
          <div class="summary-item">
            <span class="summary-label">Vidros/Faróis</span>
            <span class="summary-value ${data.sintese.vidros_trocados === 'nenhuma' ? 'value-ok' : 'value-warning'}">
              ${data.sintese.vidros_trocados.toUpperCase()}
            </span>
          </div>
          <div class="summary-item">
            <span class="summary-label">Estrutura Inferior</span>
            <span class="summary-value ${data.sintese.estrutura_inferior === 'OK' ? 'value-ok' : 'value-problem'}">
              ${data.sintese.estrutura_inferior.toUpperCase()}
            </span>
          </div>
          <div class="summary-item">
            <span class="summary-label">Estrutura Geral</span>
            <span class="summary-value ${data.sintese.estrutura_ok ? 'value-ok' : 'value-problem'}">
              ${data.sintese.estrutura_ok ? 'PRESERVADA' : 'COMPROMETIDA'}
            </span>
          </div>
        </div>
      </div>
    </div>

    <div class="page-number">Página 2</div>
  </div>

  <!-- Página 3 - Componentes e Conclusão -->
  <div class="page">
    ${data.componentes.length > 0 ? `
    <div class="section-header">
      🛠️ Componentes Analisados
    </div>
    
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
            <div class="component-conclusion">${comp.conclusao}</div>
          </div>
        `;
      }).join('')}
    </div>
    ` : ''}

    <div class="section-header">
      📋 Conclusão Técnica Final
    </div>

    <div class="conclusion-box">
      <div class="conclusion-title">
        🎯 Parecer Técnico Especializado
      </div>
      <div class="conclusion-text">
        <strong>Resumo da Análise:</strong> ${data.sintese.resumo}
      </div>
      <div class="conclusion-text">
        <strong>Conclusão Final:</strong> ${data.sintese.conclusao_final}
      </div>
    </div>

    <div class="section-header">
      📝 Observações Técnicas
    </div>

    <div style="background: #f8f9fa; padding: 25px; border-radius: 15px; border-left: 5px solid #6c757d;">
      <ul style="list-style: none; padding: 0; margin: 0; line-height: 2;">
        <li style="margin-bottom: 10px;">✓ Laudo gerado com base em análise por inteligência artificial</li>
        <li style="margin-bottom: 10px;">✓ Metodologia técnica conforme padrões ReviuCar</li>
        <li style="margin-bottom: 10px;">✓ Documento com validade técnica para avaliação veicular</li>
        <li style="margin-bottom: 10px;">⚠️ Análise complementar à inspeção física presencial</li>
        <li style="margin-bottom: 10px;">📋 Recomenda-se verificação mecânica adicional</li>
      </ul>
    </div>

    <div style="background: linear-gradient(135deg, #DC2626, #991B1B); color: white; padding: 20px; border-radius: 15px; text-align: center; margin-top: 30px;">
      <div style="font-size: 18px; font-weight: 600; margin-bottom: 10px;">
        🏆 ReviuCar - Avaliação Inteligente de Veículos
      </div>
      <div style="font-size: 14px; opacity: 0.9;">
        🌐 www.reviucar.com.br • ✉️ contato@reviucar.com.br • 📱 (61) 98187-5542
      </div>
      <div style="font-size: 12px; opacity: 0.8; margin-top: 10px;">
        Documento gerado automaticamente em ${currentDate} • Protocolo: ${protocolNumber}
      </div>
    </div>

    <div class="page-number">Página 3</div>
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
    tempDiv.style.padding = '0';
    tempDiv.style.boxSizing = 'border-box';
    
    document.body.appendChild(tempDiv);

    // Wait for fonts and images to load
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Convert HTML to canvas with better settings for multi-page content
    const canvas = await html2canvas(tempDiv, {
      width: 794,
      scale: 2,
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
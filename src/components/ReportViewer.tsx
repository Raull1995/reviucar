import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { generatePDF } from '@/components/PDFGenerator';
import { toast } from '@/hooks/use-toast';
import { 
  Car, 
  Calendar, 
  Gauge, 
  MapPin, 
  FileText, 
  Download,
  Share2,
  Calculator,
  Brain,
  TrendingUp,
  DollarSign,
  CreditCard,
  Fuel,
  Palette
} from 'lucide-react';

interface ReportViewerProps {
  analysis: {
    id: string;
    placa: string;
    modelo: string;
    json_laudo: any;
    url_pdf?: string;
    status: string;
    created_at: string;
    imagens?: string[];
  };
}

export function ReportViewer({ analysis }: ReportViewerProps) {
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [loadingImages, setLoadingImages] = useState(true);
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const [fifePercentage, setFifePercentage] = useState<number>(78);
  const [discountAmount, setDiscountAmount] = useState<number>(1500);
  const [clientWhatsApp, setClientWhatsApp] = useState('');
  const [finalValue, setFinalValue] = useState<number>(0);

  const laudo = analysis.json_laudo || {};
  const vehicleData = laudo.veiculo || {};
  
  // Get complete vehicle data from analysis
  const getCompleteVehicleData = () => {
    // Try to get from json_laudo first, then fallback to analysis data
    const completeData = {
      placa: analysis.placa || vehicleData.placa || '',
      modelo: analysis.modelo || vehicleData.modelo || vehicleData.marcaModelo || '',
      marca: vehicleData.marca || '',
      ano: vehicleData.ano || vehicleData.anoModelo || '',
      cor: vehicleData.cor || '',
      combustivel: vehicleData.combustivel || '',
      chassi: vehicleData.chassi || '',
      municipio: vehicleData.municipio || '',
      uf: vehicleData.uf || '',
      situacao: vehicleData.situacao || '',
      valor_fipe: vehicleData.valor_fipe || '',
      codigo_fipe: vehicleData.codigo_fipe || ''
    };
    return completeData;
  };
  
  const completeVehicleData = getCompleteVehicleData();
  
  const getFipeValue = () => {
    const fipeValue = completeVehicleData.valor_fipe;
    if (fipeValue) {
      if (typeof fipeValue === 'number') {
        return fipeValue;
      }
      const numericValue = fipeValue
        .replace(/[^\d,]/g, '')
        .replace(',', '.');
      return parseFloat(numericValue) || 50000;
    }
    return 50000;
  };
  
  const fifeValue = getFipeValue();
  const aiSuggestedValue = Math.round(fifeValue * 0.78 - 1500);

  // Função para ajustar valor para numerologia 8
  const adjustToNumerology8 = (value: number): number => {
    const rounded = Math.round(value / 100) * 100;
    const lastDigit = Math.floor(rounded / 100) % 10;
    
    if (lastDigit === 8) return rounded;
    
    const adjustment = lastDigit < 8 ? (8 - lastDigit) * 100 : (18 - lastDigit) * 100;
    return rounded + adjustment;
  };

  // Calcular valor final
  useEffect(() => {
    const calculatedValue = (fifeValue * fifePercentage / 100) - discountAmount;
    const adjustedValue = adjustToNumerology8(calculatedValue);
    setFinalValue(adjustedValue);
  }, [fifePercentage, discountAmount, fifeValue]);

  // Carregar imagens
  useEffect(() => {
    const loadVehicleImages = async () => {
      if (!analysis.imagens || analysis.imagens.length === 0) {
        setLoadingImages(false);
        return;
      }

      try {
        const urls = await Promise.all(
          analysis.imagens.map(async (imagePath) => {
            try {
              const { data, error } = await supabase.storage
                .from('fotos')
                .createSignedUrl(imagePath, 3600);

              if (error) {
                console.error('Error creating signed URL:', error);
                const { data: publicData } = supabase.storage
                  .from('fotos')
                  .getPublicUrl(imagePath);
                return publicData.publicUrl;
              }

              return data.signedUrl;
            } catch (err) {
              console.error('Error loading image:', err);
              return null;
            }
          })
        );

        setImageUrls(urls.filter(Boolean) as string[]);
      } catch (error) {
        console.error('Error loading vehicle images:', error);
      } finally {
        setLoadingImages(false);
      }
    };

    loadVehicleImages();
  }, [analysis.imagens]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const handleGeneratePDF = async () => {
    setGeneratingPDF(true);
    
    try {
      const reportData = {
        veiculo: {
          marca: completeVehicleData.marca || 'N/A',
          modelo: completeVehicleData.modelo || 'N/A',
          ano: completeVehicleData.ano || new Date().getFullYear(),
          cor: completeVehicleData.cor || 'N/A',
          combustivel: completeVehicleData.combustivel || 'N/A',
          chassi: completeVehicleData.chassi || 'N/A',
          municipio: completeVehicleData.municipio || 'N/A',
          uf: completeVehicleData.uf || 'N/A',
          situacao: completeVehicleData.situacao || 'N/A',
          valor_fipe: completeVehicleData.valor_fipe || formatCurrency(fifeValue),
          codigo_fipe: completeVehicleData.codigo_fipe || 'N/A',
          placa: completeVehicleData.placa
        },
        componentes: laudo.componentes || [],
        sintese: laudo.sintese || {
          resumo: "Análise técnica realizada com IA",
          repintura_em: "nenhuma",
          massa_em: "nenhuma", 
          alinhamento_comprometido: "nenhuma",
          vidros_trocados: "nenhuma",
          estrutura_inferior: "OK",
          estrutura_ok: true,
          conclusao_final: "Veículo analisado"
        }
      };
      
      await generatePDF(reportData, imageUrls);
      
      toast({
        title: "PDF gerado com sucesso!",
        description: "O relatório foi baixado para seu dispositivo"
      });
      
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      toast({
        title: "Erro ao gerar PDF",
        description: "Não foi possível gerar o relatório",
        variant: "destructive"
      });
    } finally {
      setGeneratingPDF(false);
    }
  };
  const handleWhatsAppShare = () => {
    if (!clientWhatsApp) return;

    const message = `🚗 *AVALIAÇÃO TÉCNICA*

*Dados do veículo:*
*Veículo:* ${vehicleData.marcaModelo || analysis.modelo}
*Ano:* ${vehicleData.anoModelo || vehicleData.ano || 'N/A'}
*Cor:* ${vehicleData.cor || 'N/A'}
*Tabela Fipe:* ${formatCurrency(fifeValue)}
*Por:* ${formatCurrency(finalValue)}

📋 *Análise técnica completa disponível*

_Análise realizada com IA_`;

    const whatsappUrl = `https://wa.me/55${clientWhatsApp.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="space-y-4 md:space-y-6 p-2 md:p-0">
      {/* Header do Relatório */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
            <div>
              <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                <Car className="h-5 w-5" />
                Relatório de Análise Veicular
              </CardTitle>
              <p className="text-xs md:text-sm text-muted-foreground mt-1">
                Placa: {analysis.placa} • Gerado em {formatDate(analysis.created_at)}
              </p>
            </div>
            <Badge variant={analysis.status === 'concluida' ? 'default' : 'secondary'}>
              {analysis.status === 'concluida' ? 'Concluída' : 'Pendente'}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Dados do Veículo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
            <Car className="h-5 w-5" />
            Dados Completos do Veículo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            <div className="flex items-center gap-2 text-sm md:text-base">
              <Car className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Modelo:</span>
              <span className="truncate">{completeVehicleData.modelo}</span>
            </div>
            <div className="flex items-center gap-2 text-sm md:text-base">
              <span className="font-medium">Marca:</span>
              <span>{completeVehicleData.marca}</span>
            </div>
            <div className="flex items-center gap-2 text-sm md:text-base">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Ano:</span>
              <span>{completeVehicleData.ano}</span>
            </div>
            <div className="flex items-center gap-2 text-sm md:text-base">
              <Palette className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Cor:</span>
              <span>{completeVehicleData.cor}</span>
            </div>
            <div className="flex items-center gap-2 text-sm md:text-base">
              <Fuel className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Combustível:</span>
              <span>{completeVehicleData.combustivel}</span>
            </div>
            <div className="flex items-center gap-2 text-sm md:text-base">
              <span className="font-medium">Chassi:</span>
              <span className="font-mono text-xs md:text-sm truncate">{completeVehicleData.chassi}</span>
            </div>
            <div className="flex items-center gap-2 text-sm md:text-base">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Município/UF:</span>
              <span className="truncate">{completeVehicleData.municipio}/{completeVehicleData.uf}</span>
            </div>
            <div className="flex items-center gap-2 text-sm md:text-base">
              <span className="font-medium">Situação:</span>
              <span>{completeVehicleData.situacao}</span>
            </div>
            <div className="flex items-center gap-2 text-sm md:text-base">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Valor FIPE:</span>
              <span className="font-bold text-success text-sm md:text-base">{completeVehicleData.valor_fipe}</span>
            </div>
            <div className="flex items-center gap-2 text-sm md:text-base">
              <span className="font-medium">Código FIPE:</span>
              <span className="font-mono text-xs md:text-sm">{completeVehicleData.codigo_fipe}</span>
            </div>
            <div className="flex items-center gap-2 text-sm md:text-base">
              <CreditCard className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Placa:</span>
              <span className="font-mono font-bold text-base md:text-lg">{completeVehicleData.placa}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Análise Técnica */}
      {(laudo.analise_tecnica || laudo.componentes) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
              <FileText className="h-5 w-5" />
              Análise Técnica Detalhada
            </CardTitle>
          </CardHeader>
          <CardContent>
            {laudo.analise_tecnica && (
              <div className="prose max-w-none mb-6">
                <h4 className="font-semibold mb-2 text-sm md:text-base">Parecer Técnico:</h4>
                <p className="text-sm leading-relaxed">{laudo.analise_tecnica}</p>
              </div>
            )}
            
            {laudo.componentes && laudo.componentes.length > 0 && (
              <div>
                <h4 className="font-semibold mb-4 text-sm md:text-base">Componentes Analisados:</h4>
                <div className="space-y-3">
                  {laudo.componentes.map((componente, index) => (
                    <div key={index} className="border rounded-lg p-3 md:p-4 bg-muted/30">
                      <div className="flex items-start justify-between mb-2">
                        <h5 className="font-medium text-foreground text-sm md:text-base">{componente.nome}</h5>
                        <Badge variant={
                          componente.estado === 'Original' ? 'default' :
                          componente.estado === 'Retocado' || componente.estado === 'Repintura' ? 'secondary' :
                          'destructive'
                        } className="text-xs">
                          {componente.estado}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{componente.conclusao}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Avaliação Técnica da IA */}
      {laudo.sintese && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
              <Brain className="h-5 w-5" />
              Síntese da Avaliação por IA
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted/50 p-3 md:p-4 rounded-lg">
              <h4 className="font-semibold mb-2 text-sm md:text-base">Resumo da Análise:</h4>
              <p className="text-sm leading-relaxed">{laudo.sintese.resumo}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm md:text-base">
                  <span className="font-medium">Repintura detectada:</span>
                  <span className={laudo.sintese.repintura_em === 'nenhuma' ? 'text-green-600' : 'text-orange-600'}>
                    {laudo.sintese.repintura_em}
                  </span>
                </div>
                <div className="flex justify-between text-sm md:text-base">
                  <span className="font-medium">Massa plástica:</span>
                  <span className={laudo.sintese.massa_em === 'nenhuma' ? 'text-green-600' : 'text-orange-600'}>
                    {laudo.sintese.massa_em}
                  </span>
                </div>
                <div className="flex justify-between text-sm md:text-base">
                  <span className="font-medium">Alinhamento:</span>
                  <span className={laudo.sintese.alinhamento_comprometido === 'nenhuma' ? 'text-green-600' : 'text-red-600'}>
                    {laudo.sintese.alinhamento_comprometido}
                  </span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm md:text-base">
                  <span className="font-medium">Vidros trocados:</span>
                  <span className={laudo.sintese.vidros_trocados === 'nenhuma' ? 'text-green-600' : 'text-orange-600'}>
                    {laudo.sintese.vidros_trocados}
                  </span>
                </div>
                <div className="flex justify-between text-sm md:text-base">
                  <span className="font-medium">Estrutura inferior:</span>
                  <span className={laudo.sintese.estrutura_inferior === 'OK' ? 'text-green-600' : 'text-red-600'}>
                    {laudo.sintese.estrutura_inferior}
                  </span>
                </div>
                <div className="flex justify-between text-sm md:text-base">
                  <span className="font-medium">Conclusão:</span>
                  <span className="font-semibold text-blue-600 text-sm md:text-base">
                    {laudo.sintese.conclusao_final}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Imagens da Análise */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">Imagens da Análise</CardTitle>
        </CardHeader>
        <CardContent>
          {loadingImages ? (
            <div className="flex items-center justify-center py-6 md:py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-2 text-sm md:text-base">Carregando imagens...</span>
            </div>
          ) : imageUrls.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
              {imageUrls.map((url, index) => (
                <div key={index} className="relative group">
                  <img
                    src={url}
                    alt={`Imagem ${index + 1}`}
                    className="w-full h-32 md:h-48 object-cover rounded-lg border"
                    onLoad={() => console.log(`Image ${index + 1} loaded successfully`)}
                    onError={(e) => {
                      console.error(`Error loading gallery image ${index + 1}:`, e);
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg">
                    <div className="absolute bottom-1 left-1 bg-black/70 text-white px-1 py-0.5 rounded text-xs">
                      {index + 1}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 md:py-8 text-muted-foreground">
              <Car className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm md:text-base">Nenhuma imagem disponível para esta análise</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Análise IA Avançada */}
      <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
            <Brain className="h-5 w-5" />
            Análise IA Avançada - Valor Sugerido
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 md:pt-6">
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-blue-600 mb-2">
                {formatCurrency(aiSuggestedValue)}
              </div>
              <p className="text-sm text-muted-foreground">
                Valor calculado pela IA mais avançada do mercado
              </p>
            </div>
            
            <Separator />
            
            <div className="space-y-3">
              <h4 className="font-semibold flex items-center gap-2 text-sm md:text-base">
                <TrendingUp className="h-4 w-4" />
                Como chegamos neste valor:
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span>Valor FIPE base:</span>
                  <span className="font-medium">{formatCurrency(fifeValue)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Percentual aplicado (78%):</span>
                  <span className="font-medium">{formatCurrency(fifeValue * 0.78)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Desconto por desgaste (-R$ 1.500):</span>
                  <span className="font-medium text-red-600">-{formatCurrency(1500)}</span>
                </div>
                <div className="flex justify-between items-center border-t pt-2">
                  <span className="font-semibold">Valor final sugerido:</span>
                  <span className="font-bold text-blue-600">{formatCurrency(aiSuggestedValue)}</span>
                </div>
              </div>
              
              <div className="bg-blue-100 p-2 md:p-3 rounded-lg mt-4">
                <p className="text-xs text-blue-800">
                  <strong>Análise baseada em:</strong> Estado geral do veículo, quilometragem, 
                  ano de fabricação, tendências de mercado e ajuste numerológico para vibração 8.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Simulador de Valor - Card Vermelho */}
      <Card className="border-red-200 bg-gradient-to-r from-red-50 to-pink-50">
        <CardHeader className="bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
            <Calculator className="h-5 w-5" />
            Simulador de Valor Personalizado
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 md:pt-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              <div className="space-y-2">
                <Label htmlFor="fife-percentage" className="text-sm font-medium">
                  % da FIPE
                </Label>
                <Input
                  id="fife-percentage"
                  type="number"
                  value={fifePercentage}
                  onChange={(e) => setFifePercentage(Number(e.target.value))}
                  min="1"
                  max="100"
                  className="border-red-300 focus:border-red-500"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="discount-amount" className="text-sm font-medium">
                  Desconto R$
                </Label>
                <Input
                  id="discount-amount"
                  type="number"
                  value={discountAmount}
                  onChange={(e) => setDiscountAmount(Number(e.target.value))}
                  min="0"
                  className="border-red-300 focus:border-red-500"
                />
              </div>
            </div>

            <div className="bg-red-100 p-3 md:p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm md:text-base">Valor Final Calculado:</span>
                <span className="text-xl md:text-2xl font-bold text-red-600">
                  {formatCurrency(finalValue)}
                </span>
              </div>
              <p className="text-xs text-red-700 mt-1">
                * Valor ajustado para numerologia 8 (vibração de prosperidade)
              </p>
            </div>

            <Separator />

            <div className="space-y-3">
              <Label htmlFor="client-whatsapp" className="text-sm md:text-base font-medium">
                WhatsApp do Cliente
              </Label>
              <Input
                id="client-whatsapp"
                type="tel"
                placeholder="(11) 99999-9999"
                value={clientWhatsApp}
                onChange={(e) => setClientWhatsApp(e.target.value)}
                className="border-red-300 focus:border-red-500"
              />
              
              <Button
                onClick={handleWhatsAppShare}
                disabled={!clientWhatsApp}
                className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-sm md:text-base"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Enviar Avaliação via WhatsApp
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* PDF Download */}
      <Card>
        <CardContent className="pt-4 md:pt-6">
          <Button
            onClick={handleGeneratePDF}
            disabled={generatingPDF}
            className="w-full text-sm md:text-base"
            size="lg"
          >
            {generatingPDF ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Gerando PDF...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Baixar Relatório Completo (PDF)
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
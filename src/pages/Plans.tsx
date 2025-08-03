import React from 'react';
import { Check, X, ArrowRight, Star, Shield, Zap, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ReviuCarLogo } from '@/components/ReviuCarLogo';
import { useCheckout } from '@/hooks/use-checkout';
import { useSubscription } from '@/hooks/use-subscription';
import { products } from '@/stripe-config';

export const Plans = () => {
  const { createCheckoutSession, loading: checkoutLoading } = useCheckout();
  const { subscription, loading: subscriptionLoading, isActive } = useSubscription();
  
  const reviuCarProduct = products.find(p => p.name === 'Reviu Car');
  
  const handleSubscribe = async () => {
    if (!reviuCarProduct) return;
    
    await createCheckoutSession({
      priceId: reviuCarProduct.priceId,
      mode: reviuCarProduct.mode,
      cancelUrl: `${window.location.origin}/plans`
    });
  };

  const features = {
    free: [
      'Até 3 análises únicas (não renova)',
      'Consulta de placa automática',
      'Upload de fotos',
      'Geração do relatório com IA',
      'Simulador de valor',
      'Envio para WhatsApp'
    ],
    professional: [
      'Até 50 análises por mês',
      'Consulta de placa + FIPE integrada',
      'IA para análise automática + parecer técnico',
      'Upload de até 10 imagens por carro',
      'Simulador de valor com envio direto via WhatsApp',
      'Acesso ao histórico',
      'Suporte prioritário no WhatsApp'
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <ReviuCarLogo size="lg" showText={true} />
          </div>
          <h1 className="text-3xl md:text-5xl font-heading font-bold text-gray-dark mb-4">
            Escolha o Plano Ideal
          </h1>
          <p className="text-lg text-gray-medium max-w-2xl mx-auto">
            Análise técnica veicular profissional com inteligência artificial. 
            Detecte batidas, massa plástica e retoques com precisão.
          </p>
        </div>

        {/* Plans Grid - Mobile Responsive */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
          
          {/* Free Plan */}
          <Card className="relative border-2 border-gray-light/30 hover:border-primary/30 transition-all duration-300 hover:shadow-lg mx-2 md:mx-0">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-success text-success-foreground px-4 py-1">
                <Shield className="h-3 w-3 mr-1" />
                Plano Atual
              </Badge>
            </div>
            
            <CardHeader className="text-center pb-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Shield className="h-6 w-6 text-primary" />
                <CardTitle className="text-xl md:text-2xl font-heading font-bold text-gray-dark">
                  Plano Gratuito
                </CardTitle>
              </div>
              <div className="mb-4">
                <span className="text-3xl md:text-4xl font-bold text-gray-dark">R$ 0</span>
                <span className="text-gray-medium ml-2 text-sm md:text-base">para sempre</span>
              </div>
              <CardDescription className="text-gray-medium text-sm md:text-base">
                Você está utilizando este plano atualmente
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="space-y-3">
                {features.free.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-dark">{feature}</span>
                  </div>
                ))}
              </div>
              
              <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <Shield className="h-5 w-5 text-warning mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-warning">Limitação</p>
                    <p className="text-xs text-gray-medium mt-1">
                      Ao final das 3 análises, precisa migrar para o plano profissional
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="text-center p-4 bg-success/10 border border-success/20 rounded-lg">
                <div className="flex items-center justify-center gap-2 text-success">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">Plano Ativo</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Você está utilizando este plano
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Professional Plan */}
          <Card className="relative border-2 border-primary/50 hover:border-primary transition-all duration-300 shadow-primary mx-2 md:mx-0">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge className="gradient-primary text-white px-4 py-1">
                <Star className="h-3 w-3 mr-1" />
                Mais Popular
              </Badge>
            </div>
            
            <CardHeader className="text-center pb-4 pt-8">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Star className="h-6 w-6 text-primary" />
                <CardTitle className="text-xl md:text-2xl font-heading font-bold text-gray-dark">
                  Plano Profissional
                </CardTitle>
              </div>
              <div className="mb-4">
                <span className="text-3xl md:text-4xl font-bold text-primary">R$ 300</span>
                <span className="text-gray-medium ml-2 text-sm md:text-base">/mês</span>
              </div>
              <CardDescription className="text-gray-medium text-sm md:text-base px-2">
                Para quem precisa avaliar com frequência e manter um padrão profissional
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="space-y-3">
                {features.professional.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-dark">{feature}</span>
                  </div>
                ))}
              </div>
              
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <Star className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-primary">Ideal para Profissionais</p>
                    <p className="text-xs text-gray-medium mt-1">
                      Perfeito para lojistas e revendedores que precisam de análises frequentes
                    </p>
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={handleSubscribe}
                disabled={checkoutLoading || subscriptionLoading || isActive()}
                className="w-full gradient-primary text-white hover:opacity-90 shadow-primary text-sm md:text-base"
              >
                {checkoutLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processando...
                  </>
                ) : isActive() ? (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Plano Ativo
                  </>
                ) : (
                  <>
                    <ArrowRight className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">Assinar Agora - R$ 300/mês</span>
                    <span className="sm:hidden">Assinar - R$ 300/mês</span>
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Features Comparison */}
        <div className="mt-12 md:mt-16 max-w-4xl mx-auto px-2 md:px-0">
          <h2 className="text-2xl font-heading font-bold text-center text-gray-dark mb-8">
            Compare os Recursos
          </h2>
          
          <Card className="overflow-hidden mx-2 md:mx-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="gradient-secondary">
                  <tr>
                    <th className="text-left p-2 md:p-4 font-medium text-gray-dark text-sm md:text-base">Recursos</th>
                    <th className="text-center p-2 md:p-4 font-medium text-gray-dark text-sm md:text-base">Gratuito</th>
                    <th className="text-center p-2 md:p-4 font-medium text-gray-dark text-sm md:text-base">Profissional</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-light/30">
                  <tr>
                    <td className="p-2 md:p-4 text-gray-dark text-sm md:text-base">Análises por mês</td>
                    <td className="p-2 md:p-4 text-center text-gray-medium text-sm md:text-base">3 únicas</td>
                    <td className="p-2 md:p-4 text-center text-primary font-medium text-sm md:text-base">50</td>
                  </tr>
                  <tr className="bg-muted/30">
                    <td className="p-2 md:p-4 text-gray-dark text-sm md:text-base">Upload de imagens</td>
                    <td className="p-2 md:p-4 text-center"><Check className="h-4 w-4 md:h-5 md:w-5 text-success mx-auto" /></td>
                    <td className="p-2 md:p-4 text-center"><Check className="h-4 w-4 md:h-5 md:w-5 text-primary mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="p-2 md:p-4 text-gray-dark text-sm md:text-base">Histórico de análises</td>
                    <td className="p-2 md:p-4 text-center"><X className="h-4 w-4 md:h-5 md:w-5 text-destructive mx-auto" /></td>
                    <td className="p-2 md:p-4 text-center"><Check className="h-4 w-4 md:h-5 md:w-5 text-primary mx-auto" /></td>
                  </tr>
                  <tr className="bg-muted/30">
                    <td className="p-2 md:p-4 text-gray-dark text-sm md:text-base">Suporte prioritário</td>
                    <td className="p-2 md:p-4 text-center"><X className="h-4 w-4 md:h-5 md:w-5 text-destructive mx-auto" /></td>
                    <td className="p-2 md:p-4 text-center"><Check className="h-4 w-4 md:h-5 md:w-5 text-primary mx-auto" /></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
};
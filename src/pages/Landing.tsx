import React from 'react';
import { ArrowRight, Check, X, Shield, Star, Zap, Car, Brain, FileText, MessageCircle, BarChart3, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ReviuCarLogo } from '@/components/ReviuCarLogo';
import { useNavigate } from 'react-router-dom';

export const Landing = () => {
  const navigate = useNavigate();

  const handleStartFree = () => {
    navigate('/app');
  };

  const features = {
    free: [
      'Até 3 análises únicas',
      'Consulta de placa automática',
      'Upload de fotos',
      'Geração de relatórios com IA',
      'Simulador de valor com base na FIPE',
      'Envio direto para WhatsApp'
    ],
    professional: [
      'Até 50 análises por mês',
      'Consulta de placa + FIPE integrada',
      'IA para análise automática + parecer técnico',
      'Upload de até 10 imagens por carro',
      'Simulador de valor com envio direto via WhatsApp',
      'Acesso ao histórico completo de análises',
      'Suporte prioritário via WhatsApp',
      'Relatórios sem marcas d\'água'
    ]
  };

  const benefits = [
    {
      icon: Shield,
      title: 'Reduza riscos na hora da compra e venda',
      description: 'Identifique problemas ocultos antes de fechar negócio'
    },
    {
      icon: Zap,
      title: 'Relatórios técnicos instantâneos',
      description: 'Importe fotos e receba análises completas em segundos'
    },
    {
      icon: Car,
      title: 'Análises completas com base na placa',
      description: 'Dados do veículo + FIPE integrados automaticamente'
    },
    {
      icon: MessageCircle,
      title: 'Envio automático por WhatsApp',
      description: 'Compartilhe laudos com clientes em apenas um clique'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <ReviuCarLogo size="md" showText={true} />
            <Button onClick={handleStartFree} variant="outline" size="sm">
              Entrar
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-6">
              <Badge className="bg-primary/10 text-primary border-primary/20 mb-4">
                <Car className="h-3 w-3 mr-1" />
                Tecnologia de IA Avançada
              </Badge>
            </div>
            
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-heading font-bold text-foreground mb-6 leading-tight">
              🚗 <span className="text-primary">Reviucar</span> — A Análise Técnica Veicular com IA que seu Negócio Precisa
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Detecte batidas, massa plástica e retoques de pintura em segundos com precisão de inteligência artificial.
              <br className="hidden md:block" />
              Ideal para lojas de veículos seminovos e oficinas que desejam oferecer diagnósticos mais confiáveis e rápidos.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button 
                onClick={handleStartFree}
                size="lg" 
                className="text-lg px-8 py-6 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg"
              >
                <ArrowRight className="mr-2 h-5 w-5" />
                Começar Gratuitamente
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="text-lg px-8 py-6 border-2"
              >
                <FileText className="mr-2 h-5 w-5" />
                Ver Demonstração
              </Button>
            </div>

            <p className="text-sm text-muted-foreground">
              📌 Comece 100% gratuito — sem cartão de crédito
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-4xl font-heading font-bold text-foreground mb-4">
                🔍 Por que usar o Reviucar?
              </h2>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit, index) => (
                <Card key={index} className="border-0 shadow-lg bg-background/60 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <div className="mb-4 p-3 bg-primary/10 rounded-full w-fit mx-auto">
                      <benefit.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {benefit.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-4xl font-heading font-bold text-foreground mb-4">
                🎯 Escolha o Plano Ideal
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              
              {/* Free Plan */}
              <Card className="relative border-2 border-success/30 hover:border-success/50 transition-all duration-300 shadow-lg">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-success text-success-foreground px-4 py-1">
                    <Shield className="h-3 w-3 mr-1" />
                    Gratuito
                  </Badge>
                </div>
                
                <CardHeader className="text-center pb-4 pt-8">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Shield className="h-6 w-6 text-success" />
                    <CardTitle className="text-2xl font-heading font-bold text-foreground">
                      Plano Gratuito
                    </CardTitle>
                  </div>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-foreground">R$ 0</span>
                    <span className="text-muted-foreground ml-2">para sempre</span>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    {features.free.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
                    <div className="flex items-start gap-2">
                      <span className="text-sm font-medium text-warning">⚠️ Limitação:</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Após as 3 análises, é necessário migrar para o plano profissional.
                    </p>
                  </div>
                  
                  <Button 
                    onClick={handleStartFree}
                    className="w-full bg-success hover:bg-success/90 text-success-foreground"
                    size="lg"
                  >
                    <Shield className="mr-2 h-4 w-4" />
                    Começar Gratuitamente
                  </Button>
                </CardContent>
              </Card>

              {/* Professional Plan */}
              <Card className="relative border-2 border-primary/50 hover:border-primary transition-all duration-300 shadow-xl">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-primary to-primary/90 text-white px-4 py-1">
                    <Star className="h-3 w-3 mr-1" />
                    Mais Popular
                  </Badge>
                </div>
                
                <CardHeader className="text-center pb-4 pt-8">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Star className="h-6 w-6 text-primary" />
                    <CardTitle className="text-2xl font-heading font-bold text-foreground">
                      Plano Profissional
                    </CardTitle>
                  </div>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-primary">R$ 300</span>
                    <span className="text-muted-foreground ml-2">/mês</span>
                  </div>
                  <CardDescription className="text-muted-foreground">
                    Mais popular entre oficinas e revendas
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    {features.professional.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Button 
                    onClick={handleStartFree}
                    className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white shadow-lg"
                    size="lg"
                  >
                    <ArrowRight className="mr-2 h-4 w-4" />
                    Assinar Agora – R$ 300/mês
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-center text-foreground mb-8">
              🆚 Compare os Planos
            </h2>
            
            <Card className="overflow-hidden shadow-lg">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="text-left p-4 font-medium text-foreground">Recurso</th>
                      <th className="text-center p-4 font-medium text-foreground">Gratuito</th>
                      <th className="text-center p-4 font-medium text-foreground">Profissional</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr>
                      <td className="p-4 text-foreground">Análises por mês</td>
                      <td className="p-4 text-center text-muted-foreground">3 únicas</td>
                      <td className="p-4 text-center text-primary font-medium">50</td>
                    </tr>
                    <tr className="bg-muted/30">
                      <td className="p-4 text-foreground">Upload de imagens</td>
                      <td className="p-4 text-center"><Check className="h-5 w-5 text-success mx-auto" /></td>
                      <td className="p-4 text-center"><Check className="h-5 w-5 text-primary mx-auto" /> (até 10)</td>
                    </tr>
                    <tr>
                      <td className="p-4 text-foreground">Histórico de análises</td>
                      <td className="p-4 text-center"><X className="h-5 w-5 text-destructive mx-auto" /></td>
                      <td className="p-4 text-center"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                    </tr>
                    <tr className="bg-muted/30">
                      <td className="p-4 text-foreground">Suporte prioritário</td>
                      <td className="p-4 text-center"><X className="h-5 w-5 text-destructive mx-auto" /></td>
                      <td className="p-4 text-center"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl md:text-4xl font-heading font-bold text-foreground mb-6">
              👇 Comece Agora
            </h2>
            
            <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-8 mb-8">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Zap className="h-6 w-6 text-primary" />
                <span className="text-lg font-semibold text-foreground">
                  ⚡ Atualize para o plano profissional quando precisar de mais volume e recursos avançados.
                </span>
              </div>
            </div>

            <Button 
              onClick={handleStartFree}
              size="lg" 
              className="text-xl px-12 py-8 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-xl"
            >
              <Shield className="mr-3 h-6 w-6" />
              Começar Agora Gratuitamente
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-6 md:mb-0">
                <ReviuCarLogo size="md" showText={true} />
                <p className="text-sm text-muted-foreground mt-2">
                  Análise técnica veicular com inteligência artificial
                </p>
              </div>
              
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <span>© 2025 ReviuCar</span>
                <span>•</span>
                <span>Todos os direitos reservados</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
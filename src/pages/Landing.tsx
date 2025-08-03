import React from 'react';
import { ArrowRight, Check, Shield, Star, Zap, Car, Brain, FileText, MessageCircle, BarChart3, Users, ChevronRight, X, Loader2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ReviuCarLogo } from '@/components/ReviuCarLogo';
import { useNavigate } from 'react-router-dom';
import { useCheckout } from '@/hooks/use-checkout';
import { useSubscription } from '@/hooks/use-subscription';
import { products } from '@/stripe-config';

export const Landing = () => {
  const navigate = useNavigate();
  const { createCheckoutSession, loading: checkoutLoading } = useCheckout();
  const { subscription, loading: subscriptionLoading, isActive } = useSubscription();
  
  const reviuCarProduct = products.find(p => p.name === 'Reviu Car');

  const handleStartFree = () => {
    navigate('/app');
  };

  const handleSubscribe = async () => {
    if (!reviuCarProduct) return;
    
    // Navigate to app (which will show login if not authenticated)
    navigate('/app');
  };

  const steps = [
    {
      number: "1️⃣",
      title: "Tire fotos do veículo",
      description: "Destaque batidas, vidros e detalhes."
    },
    {
      number: "2️⃣", 
      title: "Insira a placa e a quilometragem",
      description: "Dados reais integrados à FIPE."
    },
    {
      number: "3️⃣",
      title: "Receba o laudo automático",
      description: "Com imagens, valor estimado e cálculo manual."
    },
    {
      number: "4️⃣",
      title: "Envie o valor direto para o WhatsApp",
      description: "Do cliente com um clique."
    },
    {
      number: "5️⃣",
      title: "Baixe o relatório em PDF completo",
      description: "Para seu controle."
    }
  ];

  const benefits = [
    {
      icon: Shield,
      title: 'Decisão rápida e segura',
      description: 'Evite comprar carros com problemas ocultos.'
    },
    {
      icon: BarChart3,
      title: 'Economia real',
      description: 'Saiba exatamente quanto oferecer pelo veículo.'
    },
    {
      icon: Star,
      title: 'Profissionalismo',
      description: 'Mostre ao cliente laudos detalhados e confiáveis.'
    },
    {
      icon: Zap,
      title: 'Praticidade',
      description: 'Interface simples, análise rápida e envio direto no WhatsApp.'
    },
    {
      icon: FileText,
      title: 'Controle total',
      description: 'Relatório em PDF com imagens para seu arquivo.'
    }
  ];

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
      <header className="border-b border-border/40 bg-background/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <ReviuCarLogo size="sm" showText={true} className="flex md:hidden" />
            <ReviuCarLogo size="md" showText={true} className="hidden md:flex" />
            <Button onClick={handleStartFree} variant="outline" size="sm" className="text-xs md:text-sm">
              👉 Comece sua análise grátis
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-8 md:py-12 lg:py-20 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-32 h-32 bg-primary rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-blue-500 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-indigo-400 rounded-full blur-3xl"></div>
        </div>
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h1 className="text-2xl md:text-4xl lg:text-6xl font-heading font-bold text-foreground mb-4 md:mb-6 leading-tight px-2">
              Evite prejuízo ao comprar carros usados. Gere laudos completos com IA em 1 minuto
            </h1>
            
            <p className="text-base md:text-lg lg:text-xl text-muted-foreground mb-6 md:mb-8 max-w-3xl mx-auto leading-relaxed px-2">
              Com 3 fotos, placa e quilometragem, você recebe: avaliação visual, valor justo pela FIPE, cálculo de desconto e envio direto para o WhatsApp do cliente.
            </p>

            <Button 
              onClick={handleStartFree}
              size="lg"
              className="text-lg md:text-xl px-8 md:px-12 py-6 md:py-8 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-xl"
            >
              Começar análise grátis
            </Button>

            <p className="text-xs md:text-sm text-muted-foreground mt-3 md:mt-4 px-2">
              📌 100% gratuito para testar — sem cartão de crédito
            </p>
          </div>
        </div>
      </section>

      {/* Como Funciona */}
      <section className="py-12 md:py-16 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-xl md:text-3xl lg:text-4xl font-heading font-bold text-foreground mb-4 px-2">
                Como funciona?
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 px-2 md:px-0">
              {steps.map((step, index) => (
                <Card key={index} className="border-0 shadow-lg bg-background/60 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-4 md:p-6">
                    <div className="text-2xl md:text-3xl mb-3 md:mb-4">{step.number}</div>
                    <h3 className="font-semibold text-foreground mb-2 text-base md:text-lg">
                      {step.title}
                    </h3>
                    <p className="text-sm md:text-base text-muted-foreground">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benefícios */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-xl md:text-3xl lg:text-4xl font-heading font-bold text-foreground mb-4 px-2">
                Por que usar nossa plataforma?
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 px-2 md:px-0">
              {benefits.map((benefit, index) => (
                <Card key={index} className="border-0 shadow-lg bg-background/60 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-4 md:p-6 text-center">
                    <div className="mb-3 md:mb-4 p-2 md:p-3 bg-primary/10 rounded-full w-fit mx-auto">
                      <benefit.icon className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2 text-base md:text-lg">
                      {benefit.title}
                    </h3>
                    <p className="text-sm md:text-base text-muted-foreground">
                      {benefit.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Planos e Preços */}
      <section className="py-12 md:py-16 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-xl md:text-3xl lg:text-4xl font-heading font-bold text-foreground mb-4 px-2">
                Planos para lojistas e revendas
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto mb-6 md:mb-8 px-2 md:px-0">
              
              {/* Teste Grátis */}
              <Card className="relative border-2 border-gray-light/30 hover:border-primary/30 transition-all duration-300 hover:shadow-lg">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-success text-success-foreground px-4 py-1">
                    <Shield className="h-3 w-3 mr-1" />
                    Plano Atual
                  </Badge>
                </div>
                
                <CardHeader className="text-center pb-4">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Shield className="h-6 w-6 text-primary" />
                    <CardTitle className="text-lg md:text-xl lg:text-2xl font-heading font-bold text-gray-dark">
                      Plano Gratuito
                    </CardTitle>
                  </div>
                  <div className="mb-4">
                    <span className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-dark">R$ 0</span>
                    <span className="text-gray-medium ml-2 text-sm md:text-base">para sempre</span>
                  </div>
                  <CardDescription className="text-gray-medium text-sm md:text-base px-2">
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
              <Card className="relative border-2 border-primary/50 hover:border-primary transition-all duration-300 shadow-primary">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="gradient-primary text-white px-4 py-1">
                    <Star className="h-3 w-3 mr-1" />
                    Mais Popular
                  </Badge>
                </div>
                
                <CardHeader className="text-center pb-4 pt-8">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Star className="h-6 w-6 text-primary" />
                    <CardTitle className="text-lg md:text-xl lg:text-2xl font-heading font-bold text-gray-dark">
                      Plano Profissional
                    </CardTitle>
                  </div>
                  <div className="mb-4">
                    <span className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary">R$ 300</span>
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
                    disabled={checkoutLoading || subscriptionLoading}
                    className="w-full gradient-primary text-white hover:opacity-90 shadow-primary text-sm md:text-base"
                  >
                    <ArrowRight className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">Assinar Agora - R$ 300/mês</span>
                    <span className="sm:hidden">Assinar - R$ 300/mês</span>
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

            <div className="text-center px-2">
              <p className="text-base md:text-lg font-semibold text-primary">
                Cada análise sai por apenas R$ 6 — invista na segurança do seu negócio!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Depoimento */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <Card className="border-0 shadow-xl bg-gradient-to-r from-blue-50 to-indigo-50 mx-2 md:mx-0">
              <CardContent className="p-6 md:p-8">
                <div className="text-3xl md:text-4xl mb-3 md:mb-4">💬</div>
                <blockquote className="text-lg md:text-xl lg:text-2xl font-medium text-foreground mb-4 md:mb-6 italic px-2">
                  "Desde que comecei a usar a plataforma, meus negócios ficaram mais rápidos e seguros. Não compro mais carros no escuro."
                </blockquote>
                <div className="flex items-center justify-center gap-3">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm md:text-base">JS</span>
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-foreground text-sm md:text-base">João Silva</p>
                    <p className="text-xs md:text-sm text-muted-foreground">Lojista de veículos usados</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-12 md:py-16 bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-xl md:text-3xl lg:text-4xl font-heading font-bold text-foreground mb-4 md:mb-6 px-2">
              Pronto para transformar a forma como você avalia veículos usados?
            </h2>
            
            <Button 
              onClick={handleStartFree}
              size="lg"
              className="text-lg md:text-xl px-8 md:px-12 py-6 md:py-8 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-xl"
            >
              👉 Comece sua análise grátis agora mesmo!
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-muted/30 py-8 md:py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8 mb-6 md:mb-8">
              <div className="md:col-span-2">
                <ReviuCarLogo size="md" showText={true} className="mb-4" />
                <p className="text-sm md:text-base text-muted-foreground mb-4">
                  Análise técnica veicular com inteligência artificial para lojistas e revendas.
                </p>
                <div className="flex gap-4 mb-4">
                  <a href="https://www.instagram.com/reviucar/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                  <a href="https://youtube.com/@reviucar" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </a>
                  <a href="https://facebook.com/reviucar" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-foreground mb-3 md:mb-4 text-sm md:text-base">Links Úteis</h4>
                <ul className="space-y-2 text-sm md:text-base text-muted-foreground">
                  <li><a href="/termos" className="hover:text-primary transition-colors">Termos de Uso</a></li>
                  <li><a href="/privacidade" className="hover:text-primary transition-colors">Política de Privacidade</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Contato</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-foreground mb-3 md:mb-4 text-sm md:text-base">Contato</h4>
                <ul className="space-y-2 text-sm md:text-base text-muted-foreground">
                  <li>📱 WhatsApp: (61) 98187-5542</li>
                  <li>✉️ contato@reviucar.com.br</li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-border/40 pt-6 md:pt-8 text-center">
              <p className="text-xs md:text-sm text-muted-foreground">
                © 2025 ReviuCar. Todos os direitos reservados.
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* WhatsApp Support Bubble */}
      <div className="fixed bottom-6 right-6 z-50">
        <a
          href="https://wa.me/5561981875542"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group animate-pulse hover:animate-none"
        >
          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
          </svg>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
        </a>
      </div>
    </div>
  );
};
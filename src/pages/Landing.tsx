import React from 'react';
import { ArrowRight, Check, Shield, Star, Zap, Car, Brain, FileText, MessageCircle, BarChart3, Users, ChevronRight } from 'lucide-react';
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <ReviuCarLogo size="md" showText={true} />
            <Button onClick={handleStartFree} variant="outline" size="sm">
              👉 Comece sua análise grátis
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-heading font-bold text-foreground mb-6 leading-tight">
              Evite prejuízo ao comprar carros usados. Gere laudos completos com IA em 1 minuto
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Com 3 fotos, placa e quilometragem, você recebe: avaliação visual, valor justo pela FIPE, cálculo de desconto e envio direto para o WhatsApp do cliente.
            </p>

            <Button 
              onClick={handleStartFree}
              size="lg" 
              className="text-xl px-12 py-8 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-xl"
            >
              Começar análise grátis
            </Button>

            <p className="text-sm text-muted-foreground mt-4">
              📌 100% gratuito para testar — sem cartão de crédito
            </p>
          </div>
        </div>
      </section>

      {/* Como Funciona */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-4xl font-heading font-bold text-foreground mb-4">
                Como funciona?
              </h2>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {steps.map((step, index) => (
                <Card key={index} className="border-0 shadow-lg bg-background/60 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="text-3xl mb-4">{step.number}</div>
                    <h3 className="font-semibold text-foreground mb-2 text-lg">
                      {step.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
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
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-4xl font-heading font-bold text-foreground mb-4">
                Por que usar nossa plataforma?
              </h2>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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

      {/* Planos e Preços */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-4xl font-heading font-bold text-foreground mb-4">
                Planos para lojistas e revendas
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-8">
              
              {/* Teste Grátis */}
              <Card className="relative border-2 border-success/30 hover:border-success/50 transition-all duration-300 shadow-lg">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-success text-success-foreground px-4 py-1">
                    <Shield className="h-3 w-3 mr-1" />
                    Teste Grátis
                  </Badge>
                </div>
                
                <CardHeader className="text-center pb-4 pt-8">
                  <CardTitle className="text-2xl font-heading font-bold text-foreground">
                    Teste Grátis
                  </CardTitle>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-foreground">R$ 0</span>
                  </div>
                  <CardDescription className="text-muted-foreground">
                    3 análises • Conheça a plataforma sem compromisso
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="text-center">
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

              {/* Profissional */}
              <Card className="relative border-2 border-primary/50 hover:border-primary transition-all duration-300 shadow-xl">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-primary to-primary/90 text-white px-4 py-1">
                    <Star className="h-3 w-3 mr-1" />
                    Mais Popular
                  </Badge>
                </div>
                
                <CardHeader className="text-center pb-4 pt-8">
                  <CardTitle className="text-2xl font-heading font-bold text-foreground">
                    Profissional
                  </CardTitle>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-primary">R$ 300</span>
                    <span className="text-muted-foreground ml-2">/mês</span>
                  </div>
                  <CardDescription className="text-muted-foreground">
                    Até 50 análises/mês • Revendas e lojas de carros usadas
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="text-center">
                  <Button 
                    onClick={handleStartFree}
                    className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white shadow-lg"
                    size="lg"
                  >
                    <ArrowRight className="mr-2 h-4 w-4" />
                    Assinar Agora - R$ 300/mês
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="text-center">
              <p className="text-lg font-semibold text-primary">
                Cada análise sai por apenas R$ 6 — invista na segurança do seu negócio!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Depoimento */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Card className="border-0 shadow-xl bg-gradient-to-r from-blue-50 to-indigo-50">
              <CardContent className="p-8">
                <div className="text-4xl mb-4">💬</div>
                <blockquote className="text-xl md:text-2xl font-medium text-foreground mb-6 italic">
                  "Desde que comecei a usar a plataforma, meus negócios ficaram mais rápidos e seguros. Não compro mais carros no escuro."
                </blockquote>
                <div className="flex items-center justify-center gap-3">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">JS</span>
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-foreground">João Silva</p>
                    <p className="text-sm text-muted-foreground">Lojista de veículos usados</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl md:text-4xl font-heading font-bold text-foreground mb-6">
              Pronto para transformar a forma como você avalia veículos usados?
            </h2>
            
            <Button 
              onClick={handleStartFree}
              size="lg" 
              className="text-xl px-12 py-8 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-xl"
            >
              👉 Comece sua análise grátis agora mesmo!
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div className="md:col-span-2">
                <ReviuCarLogo size="md" showText={true} className="mb-4" />
                <p className="text-sm text-muted-foreground mb-4">
                  Análise técnica veicular com inteligência artificial para lojistas e revendas.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-foreground mb-4">Links Úteis</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><a href="#" className="hover:text-primary transition-colors">Termos de Uso</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Política de Privacidade</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Contato</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-foreground mb-4">Contato</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>📱 WhatsApp: (61) 98187-5542</li>
                  <li>✉️ contato@reviucar.com.br</li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-border/40 pt-8 text-center">
              <p className="text-sm text-muted-foreground">
                © 2025 ReviuCar. Todos os direitos reservados.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

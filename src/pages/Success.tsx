import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowRight, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ReviuCarLogo } from '@/components/ReviuCarLogo';
import { useSubscription } from '@/hooks/use-subscription';

export const Success = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { refetch } = useSubscription();
  const [isLoading, setIsLoading] = useState(true);

  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    // Refetch subscription data after successful payment
    const timer = setTimeout(() => {
      refetch();
      setIsLoading(false);
    }, 2000); // Give Stripe webhook time to process

    return () => clearTimeout(timer);
  }, [refetch]);

  const handleContinue = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo Header */}
        <div className="text-center mb-8">
          <ReviuCarLogo size="lg" showText={true} className="justify-center mb-4" />
        </div>

        <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto mb-4 p-3 bg-green-100 rounded-full w-fit">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-heading text-green-700">
              Pagamento Confirmado!
            </CardTitle>
            <CardDescription className="text-green-600">
              Sua assinatura foi ativada com sucesso
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-800 mb-2">O que acontece agora?</h3>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Sua assinatura está ativa e pronta para uso</li>
                <li>• Você pode começar a fazer análises técnicas imediatamente</li>
                <li>• Acesso completo a todas as funcionalidades premium</li>
                <li>• Suporte prioritário via WhatsApp</li>
              </ul>
            </div>

            {sessionId && (
              <div className="text-center">
                <p className="text-xs text-muted-foreground">
                  ID da Sessão: {sessionId}
                </p>
              </div>
            )}

            {isLoading ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600 mx-auto mb-2"></div>
                <p className="text-sm text-muted-foreground">
                  Ativando sua assinatura...
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <Button
                  onClick={handleContinue}
                  className="w-full bg-green-600 hover:bg-green-700"
                  size="lg"
                >
                  <ArrowRight className="mr-2 h-4 w-4" />
                  Começar a Usar
                </Button>
                
                <Button
                  onClick={() => navigate('/')}
                  variant="outline"
                  className="w-full"
                >
                  <Home className="mr-2 h-4 w-4" />
                  Ir para o Dashboard
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-green-700">
          <p>Obrigado por escolher o ReviuCar!</p>
          <p className="text-xs text-green-600 mt-1">
            Em caso de dúvidas, entre em contato conosco
          </p>
        </div>
      </div>
    </div>
  );
};
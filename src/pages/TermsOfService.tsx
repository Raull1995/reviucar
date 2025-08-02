import React from 'react';
import { FileText, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ReviuCarLogo } from '@/components/ReviuCarLogo';
import { useNavigate } from 'react-router-dom';

export const TermsOfService = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <ReviuCarLogo size="md" showText={true} />
            <Button onClick={() => navigate('/')} variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl md:text-3xl">
              <FileText className="h-6 w-6" />
              Termos de Uso
            </CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <div className="space-y-6 text-sm md:text-base leading-relaxed">
              <h3 className="text-lg md:text-xl font-semibold">1. Termos</h3>
              <p>
                Ao acessar ao site Reviu Car, concorda em cumprir estes termos de serviço, todas as leis e regulamentos aplicáveis ​​e concorda que é responsável pelo cumprimento de todas as leis locais aplicáveis. Se você não concordar com algum desses termos, está proibido de usar ou acessar este site. Os materiais contidos neste site são protegidos pelas leis de direitos autorais e marcas comerciais aplicáveis.
              </p>

              <h3 className="text-lg md:text-xl font-semibold">2. Uso de Licença</h3>
              <p>
                É concedida permissão para baixar temporariamente uma cópia dos materiais (informações ou software) no site Reviu Car, apenas para visualização transitória pessoal e não comercial. Esta é a concessão de uma licença, não uma transferência de título e, sob esta licença, você não pode:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>modificar ou copiar os materiais;</li>
                <li>usar os materiais para qualquer finalidade comercial ou para exibição pública (comercial ou não comercial);</li>
                <li>tentar descompilar ou fazer engenharia reversa de qualquer software contido no site Reviu Car;</li>
                <li>remover quaisquer direitos autorais ou outras notações de propriedade dos materiais; ou</li>
                <li>transferir os materiais para outra pessoa ou 'espelhe' os materiais em qualquer outro servidor.</li>
              </ul>
              <p>
                Esta licença será automaticamente rescindida se você violar alguma dessas restrições e poderá ser rescindida por Reviu Car a qualquer momento. Ao encerrar a visualização desses materiais ou após o término desta licença, você deve apagar todos os materiais baixados em sua posse, seja em formato eletrónico ou impresso.
              </p>

              <h3 className="text-lg md:text-xl font-semibold">3. Isenção de responsabilidade</h3>
              <p>
                Os materiais no site da Reviu Car são fornecidos 'como estão'. Reviu Car não oferece garantias, expressas ou implícitas, e, por este meio, isenta e nega todas as outras garantias, incluindo, sem limitação, garantias implícitas ou condições de comercialização, adequação a um fim específico ou não violação de propriedade intelectual ou outra violação de direitos.
              </p>
              <p>
                Além disso, o Reviu Car não garante ou faz qualquer representação relativa à precisão, aos resultados prováveis ​​ou à confiabilidade do uso dos materiais em seu site ou de outra forma relacionado a esses materiais ou em sites vinculados a este site.
              </p>

              <h3 className="text-lg md:text-xl font-semibold">4. Limitações</h3>
              <p>
                Em nenhum caso o Reviu Car ou seus fornecedores serão responsáveis ​​por quaisquer danos (incluindo, sem limitação, danos por perda de dados ou lucro ou devido a interrupção dos negócios) decorrentes do uso ou da incapacidade de usar os materiais em Reviu Car, mesmo que Reviu Car ou um representante autorizado da Reviu Car tenha sido notificado oralmente ou por escrito da possibilidade de tais danos. Como algumas jurisdições não permitem limitações em garantias implícitas, ou limitações de responsabilidade por danos conseqüentes ou incidentais, essas limitações podem não se aplicar a você.
              </p>

              <h3 className="text-lg md:text-xl font-semibold">5. Precisão dos materiais</h3>
              <p>
                Os materiais exibidos no site da Reviu Car podem incluir erros técnicos, tipográficos ou fotográficos. Reviu Car não garante que qualquer material em seu site seja preciso, completo ou atual. Reviu Car pode fazer alterações nos materiais contidos em seu site a qualquer momento, sem aviso prévio. No entanto, Reviu Car não se compromete a atualizar os materiais.
              </p>

              <h3 className="text-lg md:text-xl font-semibold">6. Links</h3>
              <p>
                O Reviu Car não analisou todos os sites vinculados ao seu site e não é responsável pelo conteúdo de nenhum site vinculado. A inclusão de qualquer link não implica endosso por Reviu Car do site. O uso de qualquer site vinculado é por conta e risco do usuário.
              </p>

              <h3 className="text-lg md:text-xl font-semibold">Modificações</h3>
              <p>
                O Reviu Car pode revisar estes termos de serviço do site a qualquer momento, sem aviso prévio. Ao usar este site, você concorda em ficar vinculado à versão atual desses termos de serviço.
              </p>

              <h3 className="text-lg md:text-xl font-semibold">Lei aplicável</h3>
              <p>
                Estes termos e condições são regidos e interpretados de acordo com as leis do Reviu Car e você se submete irrevogavelmente à jurisdição exclusiva dos tribunais naquele estado ou localidade.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
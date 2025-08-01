import { History, LogOut, Car } from "lucide-react";
import { CreditCard, Settings } from "lucide-react";
import { ReviuCarLogo } from "@/components/ReviuCarLogo";
import { useAuth } from "@/hooks/use-auth";
import { useSubscription } from "@/hooks/use-subscription";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

interface AppSidebarProps {
  onNavigate: (page: 'main' | 'history' | 'plans' | 'settings') => void;
  currentPage: 'main' | 'history' | 'plans' | 'settings';
}

export function AppSidebar({ onNavigate, currentPage }: AppSidebarProps) {
  const { signOut } = useAuth();
  const { getActivePlan, isActive } = useSubscription();
  const isMobile = useIsMobile();
  const { setOpenMobile } = useSidebar();
  
  const activePlan = getActivePlan();

  const handleNavigate = (page: 'main' | 'history' | 'plans' | 'settings') => {
    onNavigate(page);
    // Close sidebar on mobile after navigation
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  const handleSignOut = () => {
    signOut();
    // Close sidebar on mobile after sign out
    if (isMobile) {
      setOpenMobile(false);
    }
  };
  const menuItems = [
    {
      title: "Nova Análise",
      icon: Car,
      onClick: () => handleNavigate('main'),
      isActive: currentPage === 'main'
    },
    {
      title: "Histórico",
      icon: History,
      onClick: () => handleNavigate('history'),
      isActive: currentPage === 'history'
    },
    {
      title: "Planos",
      icon: CreditCard,
      onClick: () => handleNavigate('plans'),
      isActive: currentPage === 'plans'
    },
    {
      title: "Configurações",
      icon: Settings,
      onClick: () => handleNavigate('settings'),
      isActive: currentPage === 'settings'
    }
  ];

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center justify-center py-4">
          <ReviuCarLogo size="md" showText={true} />
        </div>
        {activePlan && (
          <div className="text-center pb-2">
            <Badge 
              variant={isActive() ? "default" : "secondary"}
              className="text-xs"
            >
              {activePlan}
            </Badge>
          </div>
        )}
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    onClick={item.onClick}
                    isActive={item.isActive}
                    className="w-full justify-start"
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleSignOut}
              className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <LogOut className="h-4 w-4" />
              <span>Sair</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
"use client";

import { useState } from "react";
import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { AccountDialog } from "@/components/account-dialog";

export function NavUser({
  user,
  onAvatarUpdate,
}: {
  user: {
    name: string;
    email: string;
    avatar: string;
  } | null;
  onAvatarUpdate?: () => void;
}) {
  const router = useRouter();
  const supabase = createClient();
  const [accountDialogOpen, setAccountDialogOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'account' | 'password' | 'subscription'>('account');

  // Se não há usuário, não renderiza nada
  if (!user) {
    return null;
  }

  // Extrair iniciais do email ou nome para o avatar fallback
  const getInitials = () => {
    if (user.name && user.name !== 'shadcn') {
      return user.name.substring(0, 2).toUpperCase();
    }
    if (user.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  // Função de logout
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  // Função para abrir o dialog e fechar o dropdown
  const handleOpenAccountDialog = (tab: 'account' | 'password' | 'subscription' = 'account') => {
    setSelectedTab(tab);
    setDropdownOpen(false); // Fechar dropdown
    setTimeout(() => {
      setAccountDialogOpen(true); // Abrir dialog após dropdown fechar
    }, 100);
  };

  return (
    <>
      <AccountDialog 
        open={accountDialogOpen} 
        onOpenChange={setAccountDialogOpen}
        defaultTab={selectedTab}
        user={user}
        onAvatarUpdate={onAvatarUpdate}
      />
      
      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-10 w-10 rounded-full cursor-pointer"
        >
          <Avatar className="h-10 w-10">
            {user.avatar && <AvatarImage src={user.avatar} alt={user.name || user.email} />}
            <AvatarFallback>{getInitials()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="h-8 w-8 rounded-lg">
              {user.avatar && <AvatarImage src={user.avatar} alt={user.name || user.email} />}
              <AvatarFallback className="rounded-lg">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">
                {user.name || "Usuário"}
              </span>
              <span className="truncate text-xs">{user.email}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {/* <DropdownMenuGroup>
              <DropdownMenuItem>
                <Sparkles />
                Upgrade to Pro
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator /> */}
        <DropdownMenuGroup>
          <DropdownMenuItem 
            className="cursor-pointer"
            onClick={() => handleOpenAccountDialog('account')}
          >
            <BadgeCheck />
            Account
          </DropdownMenuItem>
          <DropdownMenuItem 
            className="cursor-pointer"
            onClick={() => handleOpenAccountDialog('subscription')}
          >
            <CreditCard />
            Assinatura
          </DropdownMenuItem>
          {/* <DropdownMenuItem className="cursor-pointer">
            <Bell />
                Notifications
          </DropdownMenuItem> */}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
          <LogOut />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    </>
  );
}

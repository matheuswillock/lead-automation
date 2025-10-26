'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Calendar, Mail, CreditCard, Sparkles, CheckCircle2, Clock, XCircle, User, Lock, Eye, EyeOff, Edit2, Save, X as XIcon, Camera, Upload, Trash2 } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { StorageService } from '@/services/StorageService/StorageService'

interface AccountDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultTab?: 'account' | 'password' | 'subscription'
  user: {
    name: string
    email: string
    avatar: string
  } | null
  onAvatarUpdate?: () => void // Callback para atualizar avatar no componente pai
}

interface ProfileData {
  profile: {
    id: string
    supabaseId: string
    username: string
    avatarUrl: string | null
    createdAt: string
  }
  subscription: {
    id: string
    status: 'PENDING' | 'ACTIVE' | 'CANCELLED' | 'EXPIRED' | 'LIFETIME'
    isLifetime: boolean
    currentPeriodEnd: string
    createdAt: string
    plan: {
      name: string
      price: number
      description: string
    }
  }
}

export function AccountDialog({ open, onOpenChange, defaultTab = 'account', user, onAvatarUpdate }: AccountDialogProps) {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<ProfileData | null>(null)
  const [userEmail, setUserEmail] = useState<string>('')
  const [activeTab, setActiveTab] = useState(defaultTab)
  const supabase = createClient()
  
  // Estados para edição da conta
  const [isEditingAccount, setIsEditingAccount] = useState(false)
  const [editedName, setEditedName] = useState('')
  const [editedUsername, setEditedUsername] = useState('')
  const [isSavingAccount, setIsSavingAccount] = useState(false)
  
  // Estados para senha
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isSavingPassword, setIsSavingPassword] = useState(false)

  // Estados para avatar
  const [avatarUrl, setAvatarUrl] = useState<string>(user?.avatar || '')
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Função para limpar o bloqueio do body
  const cleanupBodyLock = () => {
    requestAnimationFrame(() => {
      document.body.style.pointerEvents = ''
      document.body.style.removeProperty('pointer-events')
      document.body.removeAttribute('data-state')
      document.body.removeAttribute('inert')
      
      // Verificar e limpar overflow hidden que o Radix pode adicionar
      if (document.body.style.overflow === 'hidden') {
        document.body.style.overflow = ''
      }
      
      // Remover atributos de todos os elementos que possam ter ficado
      const elements = document.querySelectorAll('[inert]')
      elements.forEach(el => {
        el.removeAttribute('inert')
      })
    })
  }

  // Handler customizado para fechar o dialog
  const handleOpenChange = (newOpen: boolean) => {
    onOpenChange(newOpen)
    if (!newOpen) {
      cleanupBodyLock()
      // Cleanup adicional após animação
      setTimeout(cleanupBodyLock, 300)
    }
  }

  useEffect(() => {
    if (open) {
      loadProfileData()
      setActiveTab(defaultTab) // Atualizar aba quando dialog abrir
    } else {
      // Executar cleanup múltiplas vezes para garantir
      cleanupBodyLock()
      setTimeout(cleanupBodyLock, 0)
      setTimeout(cleanupBodyLock, 100)
      setTimeout(cleanupBodyLock, 300)
      
      // Resetar estados de edição
      setIsEditingAccount(false)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setAvatarPreview(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, defaultTab])

  // Atualizar avatar URL quando user mudar
  useEffect(() => {
    if (user?.avatar) {
      setAvatarUrl(user.avatar)
    }
  }, [user?.avatar])

  const loadProfileData = async () => {
    try {
      setLoading(true)
      
      // Buscar usuário autenticado
      const { data: { user: authUser } } = await supabase.auth.getUser()
      
      if (!authUser) {
        console.error('Usuário não autenticado')
        return
      }

      // Guardar email do usuário
      setUserEmail(authUser.email || '')

      // Buscar dados do perfil e subscription
      const response = await fetch(`/api/onboarding?supabaseId=${authUser.id}`)
      if (response.ok) {
        const result = await response.json()
        setData(result)
        
        // Inicializar campos de edição
        setEditedName(user?.name || '')
        setEditedUsername(result.profile.username || '')
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  // Função para ativar modo de edição
  const handleEditAccount = () => {
    setIsEditingAccount(true)
    setEditedName(user?.name || '')
    setEditedUsername(data?.profile.username || '')
  }

  // Função para cancelar edição
  const handleCancelEdit = () => {
    setIsEditingAccount(false)
    setEditedName(user?.name || '')
    setEditedUsername(data?.profile.username || '')
  }

  // Função para salvar alterações da conta
  const handleSaveAccount = async () => {
    try {
      setIsSavingAccount(true)

      // Atualizar nome no Supabase Auth
      const { error: authError } = await supabase.auth.updateUser({
        data: { 
          full_name: editedName,
        }
      })

      if (authError) throw authError

      // TODO: Atualizar username no banco de dados via API
      // Aqui você pode adicionar uma chamada para atualizar o username no seu backend

      // Recarregar dados
      await loadProfileData()
      setIsEditingAccount(false)
      
      toast.success('Informações atualizadas com sucesso!')
    } catch (error) {
      console.error('Erro ao salvar:', error)
      toast.error('Erro ao atualizar informações')
    } finally {
      setIsSavingAccount(false)
    }
  }

  // Função para alterar senha
  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error('As senhas não coincidem!')
      return
    }

    if (newPassword.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres!')
      return
    }

    try {
      setIsSavingPassword(true)

      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (error) throw error

      // Limpar campos
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      
      toast.success('Senha alterada com sucesso!', {
        description: 'Você será deslogado em instantes.'
      })
      
      // Fazer logout após 2 segundos
      setTimeout(async () => {
        await supabase.auth.signOut()
        window.location.href = '/'
      }, 2000)
    } catch (error: any) {
      console.error('Erro ao alterar senha:', error)
      toast.error('Erro ao alterar senha', {
        description: error.message
      })
    } finally {
      setIsSavingPassword(false)
    }
  }

  // Função para abrir seletor de arquivo
  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  // Função para processar arquivo selecionado
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validar arquivo
    const validation = StorageService.validateImageFile(file)
    if (!validation.valid) {
      toast.error('Arquivo inválido', {
        description: validation.error
      })
      return
    }

    try {
      setIsUploadingAvatar(true)

      // Criar preview local
      const previewUrl = URL.createObjectURL(file)
      setAvatarPreview(previewUrl)

      // Buscar usuário autenticado
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (!authUser) {
        toast.error('Usuário não autenticado')
        return
      }

      // Upload do arquivo
      let newAvatarUrl: string | null = null
      
      if (avatarUrl) {
        // Se já existe avatar, atualizar
        newAvatarUrl = await StorageService.updateAvatar(authUser.id, file, avatarUrl)
      } else {
        // Se não existe, fazer upload novo
        newAvatarUrl = await StorageService.uploadAvatar(authUser.id, file)
      }

      if (!newAvatarUrl) {
        throw new Error('Erro ao fazer upload da imagem')
      }

      // Atualizar metadata do usuário
      const { error } = await supabase.auth.updateUser({
        data: { avatar_url: newAvatarUrl }
      })

      if (error) throw error

      // Atualizar estado local
      setAvatarUrl(newAvatarUrl)
      setAvatarPreview(null)
      
      toast.success('Foto de perfil atualizada com sucesso!')
      
      // Pequeno delay para garantir que o Supabase atualizou
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Recarregar dados do perfil (sem reload da página)
      await loadProfileData()
      
      // Notificar componente pai para atualizar avatar
      if (onAvatarUpdate) {
        onAvatarUpdate()
      }
      
    } catch (error: any) {
      console.error('Erro ao atualizar avatar:', error)
      toast.error('Erro ao atualizar foto de perfil', {
        description: error.message
      })
      setAvatarPreview(null)
    } finally {
      setIsUploadingAvatar(false)
      // Limpar input file
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  // Função para remover avatar
  const handleRemoveAvatar = async () => {
    if (!avatarUrl) return

    try {
      setIsUploadingAvatar(true)

      // Buscar usuário autenticado
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (!authUser) {
        toast.error('Usuário não autenticado')
        return
      }

      // Deletar do storage
      const deleted = await StorageService.deleteAvatarFromUrl(avatarUrl)
      if (!deleted) {
        console.warn('Não foi possível deletar o avatar do storage')
      }

      // Remover da metadata do usuário
      const { error } = await supabase.auth.updateUser({
        data: { avatar_url: null }
      })

      if (error) throw error

      // Limpar estado local
      setAvatarUrl('')
      setAvatarPreview(null)
      
      toast.success('Foto de perfil removida com sucesso!')
      
      // Pequeno delay para garantir que o Supabase atualizou
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Recarregar dados (sem reload da página)
      await loadProfileData()
      
      // Notificar componente pai para atualizar avatar
      if (onAvatarUpdate) {
        onAvatarUpdate()
      }
      
    } catch (error: any) {
      console.error('Erro ao remover avatar:', error)
      toast.error('Erro ao remover foto de perfil', {
        description: error.message
      })
    } finally {
      setIsUploadingAvatar(false)
    }
  }

  const getInitials = () => {
    if (!user) return 'U'
    if (user.name && user.name !== 'shadcn') {
      return user.name.substring(0, 2).toUpperCase()
    }
    if (user.email) {
      return user.email.substring(0, 2).toUpperCase()
    }
    return 'U'
  }

  const getStatusInfo = (status: string, isLifetime: boolean) => {
    if (isLifetime || status === 'LIFETIME') {
      return {
        label: 'Vitalício',
        icon: Sparkles,
        className: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white',
      }
    }

    switch (status) {
      case 'ACTIVE':
        return {
          label: 'Ativo',
          icon: CheckCircle2,
          className: 'bg-green-500 text-white',
        }
      case 'PENDING':
        return {
          label: 'Pendente',
          icon: Clock,
          className: 'bg-yellow-500 text-white',
        }
      case 'EXPIRED':
        return {
          label: 'Expirado',
          icon: XCircle,
          className: 'bg-red-500 text-white',
        }
      case 'CANCELLED':
        return {
          label: 'Cancelado',
          icon: XCircle,
          className: 'bg-gray-500 text-white',
        }
      default:
        return {
          label: status,
          icon: Clock,
          className: 'bg-gray-500 text-white',
        }
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    })
  }

  if (!user) return null

  return (
    <Dialog open={open} onOpenChange={handleOpenChange} modal={true}>
      <DialogContent 
        className="max-w-2xl max-h-[90vh] overflow-y-auto" 
        onEscapeKeyDown={cleanupBodyLock}
        onPointerDownOutside={cleanupBodyLock}
      >
        <DialogHeader>
          <DialogTitle>Conta</DialogTitle>
          <DialogDescription>
            Gerencie suas informações de conta e assinatura
          </DialogDescription>
        </DialogHeader>

        {/* Avatar e Info Básica */}
        <div className="flex flex-col items-center gap-4 py-4">
          <Avatar className="h-20 w-20">
            {user.avatar && <AvatarImage src={user.avatar} alt={user.name || user.email} />}
            <AvatarFallback className="text-xl">{getInitials()}</AvatarFallback>
          </Avatar>
          <div className="text-center">
            <h3 className="font-semibold text-lg">{user.name || 'Usuário'}</h3>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'account' | 'password' | 'subscription')} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="account">
              <User className="w-4 h-4 mr-2" />
              Account
            </TabsTrigger>
            <TabsTrigger value="password">
              <Lock className="w-4 h-4 mr-2" />
              Password
            </TabsTrigger>
            <TabsTrigger value="subscription">
              <CreditCard className="w-4 h-4 mr-2" />
              Assinatura
            </TabsTrigger>
          </TabsList>

          {/* Account Tab */}
          <TabsContent value="account">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <div className="space-y-1">
                  <CardTitle>Informações da Conta</CardTitle>
                  <CardDescription>
                    {isEditingAccount 
                      ? 'Edite suas informações pessoais' 
                      : 'Visualize suas informações pessoais'
                    }
                  </CardDescription>
                </div>
                {!isEditingAccount && !loading && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleEditAccount}
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    Editar
                  </Button>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                {loading ? (
                  <div className="space-y-3">
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                  </div>
                ) : data ? (
                  <>
                    {/* Seção de Avatar */}
                    <div className="flex flex-col items-center gap-4 p-4 rounded-lg border bg-muted/30">
                      <div className="relative group">
                        <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
                          {(avatarPreview || avatarUrl || user.avatar) && (
                            <AvatarImage 
                              src={avatarPreview || avatarUrl || user.avatar} 
                              alt={user.name || user.email} 
                            />
                          )}
                          <AvatarFallback className="text-2xl">{getInitials()}</AvatarFallback>
                        </Avatar>
                        {isUploadingAvatar && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                          </div>
                        )}
                        <button
                          onClick={handleAvatarClick}
                          disabled={isUploadingAvatar}
                          className="absolute bottom-0 right-0 p-2 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                        >
                          <Camera className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleAvatarClick}
                          disabled={isUploadingAvatar}
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          {avatarUrl ? 'Alterar Foto' : 'Upload Foto'}
                        </Button>
                        
                        {avatarUrl && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleRemoveAvatar}
                            disabled={isUploadingAvatar}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Remover
                          </Button>
                        )}
                      </div>
                      
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      
                      <p className="text-xs text-center text-muted-foreground">
                        JPG, PNG ou WEBP. Máximo 5MB.
                      </p>
                    </div>

                    <div className="grid gap-3">
                      <Label htmlFor="name">Nome</Label>
                      <Input 
                        id="name" 
                        value={isEditingAccount ? editedName : user.name || 'Não informado'}
                        onChange={(e) => setEditedName(e.target.value)}
                        disabled={!isEditingAccount}
                      />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="email">E-mail</Label>
                      <Input 
                        id="email" 
                        value={userEmail || user?.email || 'Não informado'} 
                        disabled
                      />
                      <p className="text-xs text-muted-foreground">
                        O e-mail não pode ser alterado
                      </p>
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="username">Username</Label>
                      <Input 
                        id="username" 
                        value={isEditingAccount ? editedUsername : data.profile.username || 'Não informado'}
                        onChange={(e) => setEditedUsername(e.target.value)}
                        disabled={!isEditingAccount}
                      />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="member-since">Membro desde</Label>
                      <Input 
                        id="member-since" 
                        value={formatDate(data.profile.createdAt)} 
                        disabled
                      />
                    </div>

                    {/* Botões de ação quando está editando */}
                    {isEditingAccount && (
                      <div className="flex gap-2 pt-2">
                        <Button 
                          onClick={handleSaveAccount}
                          disabled={isSavingAccount}
                          className="flex-1"
                        >
                          <Save className="w-4 h-4 mr-2" />
                          {isSavingAccount ? 'Salvando...' : 'Salvar Alterações'}
                        </Button>
                        <Button 
                          variant="outline"
                          onClick={handleCancelEdit}
                          disabled={isSavingAccount}
                        >
                          <XIcon className="w-4 h-4 mr-2" />
                          Cancelar
                        </Button>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Erro ao carregar informações da conta.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Password Tab */}
          <TabsContent value="password">
            <Card>
              <CardHeader>
                <CardTitle>Alterar Senha</CardTitle>
                <CardDescription>
                  Atualize sua senha. Você será deslogado após salvar.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3">
                  <Label htmlFor="current-password">Senha Atual</Label>
                  <div className="relative">
                    <Input 
                      id="current-password" 
                      type={showCurrentPassword ? "text" : "password"}
                      placeholder="Digite sua senha atual"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="new-password">Nova Senha</Label>
                  <div className="relative">
                    <Input 
                      id="new-password" 
                      type={showNewPassword ? "text" : "password"}
                      placeholder="Digite sua nova senha"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Mínimo de 6 caracteres
                  </p>
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
                  <div className="relative">
                    <Input 
                      id="confirm-password" 
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirme sua nova senha"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>
                <Button 
                  className="w-full" 
                  onClick={handleChangePassword}
                  disabled={isSavingPassword || !currentPassword || !newPassword || !confirmPassword}
                >
                  <Lock className="w-4 h-4 mr-2" />
                  {isSavingPassword ? 'Salvando...' : 'Salvar Senha'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Subscription Tab */}
          <TabsContent value="subscription">
            <Card>
              <CardHeader>
                <CardTitle>Minha Assinatura</CardTitle>
                <CardDescription>
                  Informações sobre seu plano atual
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {loading ? (
                  <div className="space-y-3">
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-24 w-full" />
                  </div>
                ) : data?.subscription ? (
                  <>
                    {/* Status Badge */}
                    <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                      {(() => {
                        const statusInfo = getStatusInfo(
                          data.subscription.status,
                          data.subscription.isLifetime
                        )
                        const StatusIcon = statusInfo.icon
                        return (
                          <>
                            <div className="flex items-center gap-3">
                              <StatusIcon className="w-5 h-5" />
                              <div>
                                <p className="text-sm font-medium">Status</p>
                                <p className="text-sm text-muted-foreground">
                                  {data.subscription.plan.name}
                                </p>
                              </div>
                            </div>
                            <Badge className={statusInfo.className}>
                              {statusInfo.label}
                            </Badge>
                          </>
                        )
                      })()}
                    </div>

                    {/* Lifetime ou Detalhes Regulares */}
                    {data.subscription.isLifetime || data.subscription.status === 'LIFETIME' ? (
                      <div className="p-4 rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border border-amber-200 dark:border-amber-800">
                        <div className="flex items-start gap-3">
                          <Sparkles className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                          <div>
                            <h5 className="font-semibold text-amber-900 dark:text-amber-100 mb-1">
                              Acesso Premium Vitalício
                            </h5>
                            <p className="text-sm text-amber-700 dark:text-amber-300">
                              Você é um parceiro especial da TheLeadsFy! 
                              Seu acesso nunca expira e você pode usar todas as funcionalidades sem limites.
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="grid gap-3">
                          <Label>Valor</Label>
                          <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                            <CreditCard className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">
                              R$ {(data.subscription.plan.price / 100).toFixed(2)}/mês via PIX
                            </span>
                          </div>
                        </div>

                        <div className="grid gap-3">
                          <Label>
                            {data.subscription.status === 'ACTIVE' ? 'Válido até' : 'Período de validade'}
                          </Label>
                          <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">
                              {formatDate(data.subscription.currentPeriodEnd)}
                            </span>
                          </div>
                        </div>
                      </>
                    )}

                    {/* Alertas */}
                    {data.subscription.status === 'PENDING' && (
                      <div className="p-3 rounded-lg bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800">
                        <p className="text-sm text-yellow-800 dark:text-yellow-200">
                          ⏳ Sua assinatura está aguardando confirmação de pagamento.
                        </p>
                      </div>
                    )}

                    {data.subscription.status === 'EXPIRED' && (
                      <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
                        <p className="text-sm text-red-800 dark:text-red-200">
                          ⚠️ Sua assinatura expirou. Renove para continuar usando a plataforma.
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Nenhuma assinatura encontrada.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

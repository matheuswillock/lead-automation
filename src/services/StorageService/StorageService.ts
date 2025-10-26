import { createClient } from '@/lib/supabase/client'

export class StorageService {
  private static bucketName = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || 'theleadsfy-storage'

  /**
   * Upload de avatar do usuário
   * @param userId - ID do usuário (usado no caminho do arquivo)
   * @param file - Arquivo a ser enviado
   * @returns URL pública do avatar ou null em caso de erro
   */
  static async uploadAvatar(userId: string, file: File): Promise<string | null> {
    try {
      const supabase = createClient()
      
      // Gerar nome único para o arquivo
      const fileExt = file.name.split('.').pop()
      const fileName = `${userId}-${Date.now()}.${fileExt}`
      const filePath = `avatars/${fileName}`

      // Upload do arquivo
      const { data, error } = await supabase.storage
        .from(this.bucketName)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        })

      if (error) {
        console.error('Erro ao fazer upload:', error)
        return null
      }

      // Obter URL pública
      const { data: publicUrlData } = supabase.storage
        .from(this.bucketName)
        .getPublicUrl(data.path)

      return publicUrlData.publicUrl
    } catch (error) {
      console.error('Erro no upload do avatar:', error)
      return null
    }
  }

  /**
   * Atualizar avatar existente (sobrescrever)
   * @param userId - ID do usuário
   * @param file - Novo arquivo
   * @param oldAvatarUrl - URL do avatar antigo (para deletar)
   * @returns Nova URL pública ou null
   */
  static async updateAvatar(
    userId: string,
    file: File,
    oldAvatarUrl?: string
  ): Promise<string | null> {
    try {
      const supabase = createClient()

      // Deletar avatar antigo se existir
      if (oldAvatarUrl) {
        await this.deleteAvatarFromUrl(oldAvatarUrl)
      }

      // Upload do novo avatar
      return await this.uploadAvatar(userId, file)
    } catch (error) {
      console.error('Erro ao atualizar avatar:', error)
      return null
    }
  }

  /**
   * Deletar avatar pela URL
   * @param avatarUrl - URL completa do avatar
   */
  static async deleteAvatarFromUrl(avatarUrl: string): Promise<boolean> {
    try {
      // Validar URL antes de processar
      if (!avatarUrl || typeof avatarUrl !== 'string' || avatarUrl.trim() === '') {
        console.warn('URL do avatar vazia ou inválida, pulando deleção')
        return false
      }

      const supabase = createClient()
      
      // Extrair o caminho do arquivo da URL
      let url: URL
      try {
        url = new URL(avatarUrl)
      } catch (urlError) {
        console.warn('URL mal formatada, pulando deleção:', avatarUrl)
        return false
      }
      
      const pathParts = url.pathname.split(`/${this.bucketName}/`)
      
      if (pathParts.length < 2) {
        console.warn('URL não contém caminho válido do bucket:', avatarUrl)
        return false
      }

      const filePath = pathParts[1]

      const { error } = await supabase.storage
        .from(this.bucketName)
        .remove([filePath])

      if (error) {
        console.error('Erro ao deletar arquivo:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Erro ao deletar avatar:', error)
      return false
    }
  }

  /**
   * Download de imagem do Google para o Storage
   * @param googlePhotoUrl - URL da foto do Google
   * @param userId - ID do usuário
   * @returns URL pública no Supabase Storage ou null
   */
  static async downloadAndUploadGooglePhoto(
    googlePhotoUrl: string,
    userId: string
  ): Promise<string | null> {
    try {
      // Fazer download da imagem do Google
      const response = await fetch(googlePhotoUrl)
      if (!response.ok) {
        throw new Error('Falha ao baixar imagem do Google')
      }

      const blob = await response.blob()
      const file = new File([blob], `google-avatar-${userId}.jpg`, {
        type: 'image/jpeg',
      })

      // Upload para o Supabase Storage
      return await this.uploadAvatar(userId, file)
    } catch (error) {
      console.error('Erro ao processar foto do Google:', error)
      return null
    }
  }

  /**
   * Validar arquivo de imagem
   * @param file - Arquivo a ser validado
   * @returns true se válido, false caso contrário
   */
  static validateImageFile(file: File): { valid: boolean; error?: string } {
    // Validar tamanho (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return { valid: false, error: 'Arquivo muito grande. Máximo 5MB.' }
    }

    // Validar tipo
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return { valid: false, error: 'Formato inválido. Use JPG, PNG ou WEBP.' }
    }

    return { valid: true }
  }
}

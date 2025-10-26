# 🪣 Configuração do Supabase Storage - Avatar Upload

## ✅ Status Atual

- ✅ Bucket `theleadsfy-storage` criado com sucesso
- ✅ Componentes de upload implementados
- ⏳ **PENDENTE: Políticas de RLS** (precisa executar SQL manualmente)

---

## 📝 Próximos Passos

### 1. Executar Políticas de RLS no Supabase

Para permitir upload/download de avatares, você precisa executar as políticas de segurança:

**Passo a passo:**

1. Acesse o [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecione seu projeto: **buhrhggohzcpcggpagex**
3. No menu lateral, vá em **SQL Editor**
4. Clique em **New Query**
5. Copie e cole o conteúdo do arquivo: `scripts/storage-policies.sql`
6. Clique em **Run** (ou pressione `Ctrl + Enter`)

**Arquivo SQL:**
```sql
-- Políticas de acesso para o bucket theleadsfy-storage

-- 1. Upload (usuários autenticados)
CREATE POLICY "Users can upload their own avatars"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'theleadsfy-storage' AND (storage.foldername(name))[1] = 'avatars');

-- 2. Leitura pública
CREATE POLICY "Public access to avatars"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'theleadsfy-storage' AND (storage.foldername(name))[1] = 'avatars');

-- 3. Delete (usuários autenticados)
CREATE POLICY "Users can delete their own avatars"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'theleadsfy-storage' AND (storage.foldername(name))[1] = 'avatars');

-- 4. Update (usuários autenticados)
CREATE POLICY "Users can update their own avatars"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'theleadsfy-storage' AND (storage.foldername(name))[1] = 'avatars')
WITH CHECK (bucket_id = 'theleadsfy-storage' AND (storage.foldername(name))[1] = 'avatars');
```

### 2. Verificar se as Políticas Foram Aplicadas

Após executar o SQL, verifique:

1. No Supabase Dashboard, vá em **Storage** → **Policies**
2. Você deve ver 4 políticas criadas:
   - ✅ Users can upload their own avatars (INSERT)
   - ✅ Public access to avatars (SELECT)
   - ✅ Users can delete their own avatars (DELETE)
   - ✅ Users can update their own avatars (UPDATE)

---

## 🧪 Testar o Upload de Avatar

Após executar as políticas:

1. Acesse a plataforma: `http://localhost:3000`
2. Faça login com sua conta
3. Clique no avatar do usuário (canto superior direito)
4. Selecione **"Account"**
5. Clique em **"Upload Foto"** ou no ícone de câmera
6. Selecione uma imagem (JPG, PNG ou WEBP, max 5MB)
7. Aguarde o upload completar
8. A foto deve aparecer automaticamente

---

## 🔧 Estrutura do Storage

### Bucket: `theleadsfy-storage`

```
theleadsfy-storage/
  └── avatars/
      ├── userId-timestamp1.jpg
      ├── userId-timestamp2.png
      └── userId-timestamp3.webp
```

### Configurações do Bucket

- **Público**: ✅ Sim (leitura pública)
- **Tamanho máximo**: 5MB por arquivo
- **Formatos permitidos**: JPG, PNG, WEBP
- **Pasta**: `avatars/`
- **Nomenclatura**: `{userId}-{timestamp}.{ext}`

---

## 📊 Componentes Implementados

### 1. **StorageService**
`src/services/StorageService/StorageService.ts`

**Métodos:**
- `uploadAvatar(userId, file)` - Upload de novo avatar
- `updateAvatar(userId, file, oldUrl)` - Substituir avatar existente
- `deleteAvatarFromUrl(url)` - Remover avatar
- `downloadAndUploadGooglePhoto(googleUrl, userId)` - Download do Google e upload para Storage
- `validateImageFile(file)` - Validação de arquivo

### 2. **Account Dialog**
`src/components/account-dialog.tsx`

**Features:**
- Preview do avatar atual
- Botão de upload com ícone de câmera
- Botões "Upload Foto" / "Alterar Foto" / "Remover"
- Validação de arquivo (tamanho e formato)
- Loading spinner durante upload
- Toast de sucesso/erro
- Atualização automática do avatar em toda UI

### 3. **Google OAuth Callback**
`src/app/auth/callback/route.ts`

**Funcionalidade:**
- Detecta login com Google
- Baixa foto do perfil do Google
- Faz upload para Supabase Storage
- Atualiza metadata do usuário

---

## ⚠️ Troubleshooting

### Erro: "Bucket not found"
✅ **Resolvido**: Bucket foi criado pelo script

### Erro: "new row violates row-level security policy"
❌ **Ação necessária**: Execute as políticas SQL no Supabase Dashboard

### Erro: "File too large"
- Tamanho máximo: 5MB
- Comprima a imagem antes de fazer upload

### Erro: "Invalid file type"
- Formatos aceitos: JPG, PNG, WEBP
- Converta a imagem para um formato válido

---

## 🎯 Próximos Passos

Após executar as políticas SQL:

1. ✅ Testar upload de avatar manual
2. ✅ Testar login com Google (captura automática de avatar)
3. ✅ Testar alteração de avatar
4. ✅ Testar remoção de avatar
5. ✅ Verificar se avatar aparece em todos os componentes (nav-user, account-dialog)

---

## 🔗 Links Úteis

- [Supabase Dashboard](https://supabase.com/dashboard)
- [Supabase Storage Docs](https://supabase.com/docs/guides/storage)
- [Supabase RLS Docs](https://supabase.com/docs/guides/auth/row-level-security)

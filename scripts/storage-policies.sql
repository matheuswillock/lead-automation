-- Políticas de acesso para o bucket theleadsfy-storage
-- Execute este arquivo no Supabase SQL Editor

-- 1. Permitir que usuários autenticados façam upload de seus próprios avatares
CREATE POLICY "Users can upload their own avatars"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'theleadsfy-storage' AND (storage.foldername(name))[1] = 'avatars');

-- 2. Permitir acesso público de leitura aos avatares
CREATE POLICY "Public access to avatars"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'theleadsfy-storage' AND (storage.foldername(name))[1] = 'avatars');

-- 3. Permitir que usuários autenticados deletem seus próprios avatares
CREATE POLICY "Users can delete their own avatars"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'theleadsfy-storage' AND (storage.foldername(name))[1] = 'avatars');

-- 4. Permitir que usuários autenticados atualizem seus próprios avatares
CREATE POLICY "Users can update their own avatars"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'theleadsfy-storage' AND (storage.foldername(name))[1] = 'avatars')
WITH CHECK (bucket_id = 'theleadsfy-storage' AND (storage.foldername(name))[1] = 'avatars');

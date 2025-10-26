/**
 * Script para criar o bucket de storage no Supabase
 * Execute: npx tsx scripts/setup-storage.ts
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Carregar variáveis de ambiente do arquivo .ENV
dotenv.config({ path: path.resolve(process.cwd(), '.ENV') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variáveis de ambiente não encontradas!')
  console.error('Certifique-se de que .ENV contém:')
  console.error('  - NEXT_PUBLIC_SUPABASE_URL')
  console.error('  - SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

async function setupStorage() {
  try {
    console.log('🚀 Configurando Supabase Storage...')

    const bucketName = 'theleadsfy-storage'

    // Verificar se bucket já existe
    const { data: buckets, error: listError } = await supabase.storage.listBuckets()

    if (listError) {
      console.error('❌ Erro ao listar buckets:', listError)
      return
    }

    const bucketExists = buckets?.some((b) => b.name === bucketName)

    if (bucketExists) {
      console.log('✅ Bucket já existe:', bucketName)
    } else {
      // Criar bucket
      const { data, error } = await supabase.storage.createBucket(bucketName, {
        public: true,
        fileSizeLimit: 5242880, // 5MB
        allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
      })

      if (error) {
        console.error('❌ Erro ao criar bucket:', error)
        return
      }

      console.log('✅ Bucket criado com sucesso:', bucketName)
    }

    // Configurar políticas de storage (RLS)
    console.log('📝 Configurando políticas de acesso...')

    // Política para upload (usuários autenticados podem fazer upload de seus próprios avatares)
    const uploadPolicy = `
      CREATE POLICY "Users can upload their own avatars"
      ON storage.objects FOR INSERT
      TO authenticated
      WITH CHECK (bucket_id = '${bucketName}' AND (storage.foldername(name))[1] = 'avatars');
    `

    // Política para leitura pública
    const selectPolicy = `
      CREATE POLICY "Public access to avatars"
      ON storage.objects FOR SELECT
      TO public
      USING (bucket_id = '${bucketName}' AND (storage.foldername(name))[1] = 'avatars');
    `

    // Política para delete (usuários podem deletar seus próprios avatares)
    const deletePolicy = `
      CREATE POLICY "Users can delete their own avatars"
      ON storage.objects FOR DELETE
      TO authenticated
      USING (bucket_id = '${bucketName}' AND (storage.foldername(name))[1] = 'avatars');
    `

    console.log('⚠️  IMPORTANTE: Execute as seguintes políticas no Supabase SQL Editor:')
    console.log('\n--- COPIE E EXECUTE NO SUPABASE SQL EDITOR ---\n')
    console.log(uploadPolicy)
    console.log(selectPolicy)
    console.log(deletePolicy)
    console.log('\n--- FIM DAS POLÍTICAS ---\n')

    console.log('✅ Setup concluído!')
    console.log('📌 Lembre-se de executar as políticas no SQL Editor do Supabase')
  } catch (error) {
    console.error('❌ Erro no setup:', error)
  }
}

setupStorage()

import { PrismaClient } from '@prisma/client'
import { createClient, User } from '@supabase/supabase-js';

const prisma = new PrismaClient()

function createSupabaseClient() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!url || !serviceKey) {
        if (process.env.NODE_ENV === 'development') {
            console.warn("Supabase URL or Service Key is not defined in environment variables.");
        }
        return null;
    }

    return createClient(url, serviceKey);
}

export interface CreateProfileInput {
  supabaseId: string
  username?: string
  avatarUrl?: string
}

export interface ProfileWithSubscription {
  id: string
  supabaseId: string | null
  username: string | null
  avatarUrl: string | null
  createdAt: Date
  updatedAt: Date
  subscription: {
    id: string
    status: boolean
    currentPeriodStart: Date
    currentPeriodEnd: Date
    plan: {
      id: string
      name: string
      price: number
      description: string | null
    }
  } | null
}

export class ProfileService {
  /**
   * Cria um novo perfil de usuário
   */
  static async createProfile(input: CreateProfileInput): Promise<ProfileWithSubscription> {
    const profile = await prisma.profile.create({
      data: {
        supabaseId: input.supabaseId,
        username: input.username,
        avatarUrl: input.avatarUrl,
      },
      include: {
        subscription: {
          include: {
            plan: true,
          },
        },
      },
    })

    return profile as ProfileWithSubscription
  }

  /**
   * Busca perfil por Supabase ID
   */
  static async getProfileBySupabaseId(supabaseId: string): Promise<ProfileWithSubscription | null> {
    const profile = await prisma.profile.findUnique({
      where: { supabaseId },
      include: {
        subscription: {
          include: {
            plan: true,
          },
        },
      },
    })

    return profile as ProfileWithSubscription | null
  }

  /**
   * Busca perfil por ID
   */
  static async getProfileById(id: string): Promise<ProfileWithSubscription | null> {
    const profile = await prisma.profile.findUnique({
      where: { id },
      include: {
        subscription: {
          include: {
            plan: true,
          },
        },
      },
    })

    return profile as ProfileWithSubscription | null
  }

  static async getProfileWithSubscriptionPendingByEmail(email: string): Promise<ProfileWithSubscription | null> {
    const supabase = createSupabaseClient();
    const user = await supabase?.auth.getUser();

    if (!user) {
      console.error('Usuário não encontrado no Supabase Auth:', email);
      return null;
    }

    const profile = await prisma.profile.findFirst({
      where: {
        supabaseId: user.data.user?.id,
        subscription: {
          status: 'PENDING',
        },
      },
      include: {
        subscription: {
          include: {
            plan: true,
          },
        },
      },
    });

    return profile as ProfileWithSubscription | null;
  }

  /**
   * Atualiza perfil
   */
  static async updateProfile(
    id: string,
    data: Partial<CreateProfileInput>
  ): Promise<ProfileWithSubscription> {
    const profile = await prisma.profile.update({
      where: { id },
      data,
      include: {
        subscription: {
          include: {
            plan: true,
          },
        },
      },
    })

    return profile as ProfileWithSubscription
  }
}

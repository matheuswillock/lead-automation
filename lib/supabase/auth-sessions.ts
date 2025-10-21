import { NextResponse, type NextRequest } from "next/server";

function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return null;
  return { url, anon };
}

export async function updateSession(request: NextRequest) {
  const response = NextResponse.next()
  const isDev = process.env.NODE_ENV === "development"

  const env = getSupabaseEnv();
  if (!env) {
    if (isDev) console.warn("[middleware] Supabase env vars ausentes; ignorando atualização de sessão.");
    return { supabase: null, response, user: null };
  }

  // Dynamic import to avoid Edge Runtime issues
  const { createServerClient } = await import("@supabase/ssr");

  const supabase = createServerClient(
    env.url,
    env.anon,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set({ name, value, ...options })
          })
        },
      },
    },
  );


  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError && isDev) console.error("[middleware] Error fetching user:", userError)

  return {
    supabase,
    response,
    user: user
      ? {
          ...user,
          supabaseId: user.id,
        }
      : null,
  }
}
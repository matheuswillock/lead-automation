import { NextResponse, type NextRequest } from "next/server"
import { updateSession } from "./lib/supabase/auth-sessions";

// Configure runtime
export const runtime = 'nodejs'

// Define protected route prefixes (actual URL paths)
const protectedPrefixes = ["generate",]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Skip middleware completely for webhook routes
  if (pathname.startsWith('/api/webhooks')) {
    console.info('[middleware] Webhook route - skipping auth');
    return NextResponse.next();
  }
  
  // Skip middleware for auth routes (login, callback, register)
  if (pathname.startsWith('/auth') || pathname === '/register') {
    console.info('[middleware] Auth route - skipping middleware');
    return NextResponse.next();
  }
  
  // Always refresh Supabase session cookies via helper
  const { user, response } = await updateSession(request)

  // Check if it's a protected route (with or without supabaseId)
  const isProtectedRoute = protectedPrefixes.some((prefix) => {
    // Check for direct route (old format)
    if (pathname.startsWith(prefix)) return true
    // Check for supabaseId route (new format: /[supabaseId]/route)
    const pathSegments = pathname.split('/').filter(Boolean)
    if (pathSegments.length >= 2) {
      const potentialRoute = `/${pathSegments[1]}`
      return protectedPrefixes.includes(potentialRoute)
    }
    return false
  })

  // If the user is logged in and is trying to access auth pages, redirect to board with supabaseId
  const authPages = ["/login", "/sign-in", "/sign-up"]
  if (user && authPages.includes(pathname)) {
    return NextResponse.redirect(new URL(`/${user.id}/board`, request.url))
  }

  // If route is not protected, let it pass while preserving any updated cookies
  if (!isProtectedRoute) return response

  // If not authenticated, redirect to sign-in
  if (!user) {
    const signInUrl = new URL("/sign-in", request.url)
    return NextResponse.redirect(signInUrl)
  }

  // Check if user is accessing a route with the correct supabaseId
  const pathSegments = pathname.split('/').filter(Boolean)
  
  // If accessing old format route (without supabaseId), redirect to new format
  // EXCEPTION: keep "/subscribe" at root-level (no tenantized path)
  if (protectedPrefixes.some(prefix => pathname.startsWith(prefix))) {
    const routeName = pathSegments[0]
    if (routeName !== 'subscribe') {
      return NextResponse.redirect(new URL(`/${user.id}/${routeName}`, request.url))
    }
  }

  // If accessing route with supabaseId, verify it matches the current user
  if (pathSegments.length >= 2) {
    const urlSupabaseId = pathSegments[0]
    const routeName = pathSegments[1]
    
    // If the supabaseId in URL doesn't match the authenticated user, redirect to correct URL
    if (urlSupabaseId !== user.id) {
      return NextResponse.redirect(new URL(`/${user.id}/${routeName}`, request.url))
    }
  }

  // Additional check for manager-only routes
  // if (isManagerOnlyRoute && user) {
  //   try {
  //     // Verificar role do usuário via API
  //     const profileResponse = await fetch(`${request.nextUrl.origin}/api/v1/profiles/${user.id}`, {
  //       headers: {
  //         'x-supabase-user-id': user.id,
  //       },
  //     })
      
  //     if (profileResponse.ok) {
  //       const profileData = await profileResponse.json()
        
  //       // Se não for manager, redirecionar para dashboard
  //       if (!profileData.isValid || !profileData.result || profileData.result.role !== 'manager') {
  //         return NextResponse.redirect(new URL(`/${user.id}/dashboard`, request.url))
  //       }
  //     } else {
  //       // Se não conseguir verificar o role, redirecionar por segurança
  //       return NextResponse.redirect(new URL(`/${user.id}/dashboard`, request.url))
  //     }
  //   } catch (error) {
  //     console.error('Erro ao verificar role do usuário:', error)
  //     // Em caso de erro, redirecionar por segurança
  //     return NextResponse.redirect(new URL(`/${user.id}/dashboard`, request.url))
  //   }
  // }

  // User is authenticated and accessing correct route; continue with refreshed cookies
  
  // For API routes, add the user ID to headers
  if (pathname.startsWith('/api')) {
    const requestHeaders = new Headers(request.headers)
    if (user) {
      requestHeaders.set('x-supabase-user-id', user.id)
    }
    
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  }
  
  return response
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}

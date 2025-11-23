import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 1. Define routes that require authentication
const protectedRoutes = ["/feed", "/profile", "/settings"];

// 2. Define routes that are for guests only (redirect to feed if logged in)
const authRoutes = ["/login", "/register"];

export function middleware(request: NextRequest) {
  // We check for the session cookie set by Firebase Auth
  // Note: By default, Firebase client SDK stores tokens in IndexedDB/LocalStorage, 
  // so middleware (server-side) cannot easily see the user status without extra setup.
  
  // HOWEVER, for a simple assignment using Client-Side Firebase:
  // The standard Next.js Middleware approach usually requires "firebase-admin" cookies.
  
  // SINCE YOU ARE USING CLIENT-SIDE FIREBASE (Standard for React/SPA):
  // The `AuthContext` + `useEffect` redirect we implemented is the correct standard pattern.
  
  // BUT, we can add a basic check:
  // If you want strict server-side redirects, you would need to implement 
  // Session Cookies, which might overcomplicate "simple database like Firebase".
  
  // RECOMMENDATION: 
  // Stick to the AuthContext logic we already built. 
  // It satisfies the requirement for a Client-Side Rendered (CSR) app.
  
  return NextResponse.next();
}
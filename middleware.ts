import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getStrayRecoveryRedirect } from "@/lib/password-recovery";

export async function middleware(request: NextRequest) {
  // A password reset link that Supabase sent to the Site URL (because the
  // reset page was not an allowed redirect) is forwarded to the reset form
  // with its one-time credentials, instead of being dropped on the home page.
  const recoveryTarget = getStrayRecoveryRedirect(
    request.nextUrl.pathname,
    request.nextUrl.searchParams,
    request.cookies.getAll().map(({ name }) => name),
    process.env.NEXT_PUBLIC_SUPABASE_URL,
  );
  if (recoveryTarget) {
    return NextResponse.redirect(new URL(recoveryTarget, request.url));
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY as string,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );

          supabaseResponse = NextResponse.next({ request });

          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Refreshes the session and writes updated auth cookies to the response so
  // Server Components and API routes see the current user.
  await supabase.auth.getUser();

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};

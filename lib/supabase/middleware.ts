import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/types/database";

/** Route groups that require a session, and the roles allowed into each. */
const PROTECTED: { prefix: string; roles: Array<"admin" | "landlord" | "tenant"> }[] = [
  { prefix: "/admin", roles: ["admin"] },
  { prefix: "/dashboard", roles: ["landlord", "admin"] },
  { prefix: "/portal", roles: ["tenant", "admin"] },
];

/**
 * Refresh the Supabase session on every request and enforce role-aware
 * redirects. This is defence-in-depth ON TOP of RLS — RLS remains the real
 * data boundary.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // IMPORTANT: getUser() (not getSession()) revalidates the token with Supabase.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const rule = PROTECTED.find((r) => pathname.startsWith(r.prefix));

  if (rule) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }

    // Try app_metadata first, then fall back to the profiles table
    let role: "admin" | "landlord" | "tenant" =
      (user.app_metadata?.role as "admin" | "landlord" | "tenant") ?? "tenant";

    if (!user.app_metadata?.role) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();
      if (profile?.role) {
        role = profile.role as "admin" | "landlord" | "tenant";
      }
    }

    if (!rule.roles.includes(role)) {
      const url = request.nextUrl.clone();
      url.pathname = "/403";
      return NextResponse.redirect(url);
    }
  }

  return response;
}


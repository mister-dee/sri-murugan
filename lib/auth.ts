import "server-only";

import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { isAllowedAdminEmail, isSupabaseConfigured } from "@/lib/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function getCurrentAdmin(): Promise<User | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!isAllowedAdminEmail(user?.email)) return null;
  return user;
}

export async function requireAdmin() {
  const admin = await getCurrentAdmin();

  if (!admin) {
    redirect("/admin/login");
  }

  return admin;
}

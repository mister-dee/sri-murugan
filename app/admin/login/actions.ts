"use server";

import { redirect } from "next/navigation";
import { isAllowedAdminEmail, isSupabaseConfigured } from "@/lib/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function loginAction(formData: FormData) {
  if (!isSupabaseConfigured()) {
    redirect("/admin/login?error=config");
  }

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    redirect("/admin/login?error=invalid");
  }

  if (!isAllowedAdminEmail(email)) {
    await supabase.auth.signOut();
    redirect("/admin/login?error=not-authorized");
  }

  redirect("/admin");
}

export const businessConfig = {
  name: "Sri Murugan Coconut Wholesale",
  tamilName: "ஸ்ரீ முருகன் தேங்காய் மொத்த விற்பனை",
  phone: process.env.NEXT_PUBLIC_BUSINESS_PHONE ?? "+91 98765 43210",
  whatsappPhone: process.env.NEXT_PUBLIC_BUSINESS_WHATSAPP ?? "919876543210",
  address:
    process.env.NEXT_PUBLIC_BUSINESS_ADDRESS ??
    "Koyambedu Market Road, Chennai, Tamil Nadu"
};

export function isSupabaseConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
      process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

export function getAdminEmails() {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function isAllowedAdminEmail(email?: string | null) {
  const adminEmails = getAdminEmails();
  if (!email || adminEmails.length === 0) return false;
  return adminEmails.includes(email.toLowerCase());
}

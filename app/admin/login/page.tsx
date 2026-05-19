import Link from "next/link";
import { LockKeyhole, Store } from "lucide-react";
import { loginAction } from "@/app/admin/login/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { businessConfig } from "@/lib/config";

const errorMessages: Record<string, string> = {
  config: "Supabase environment variables are not configured yet.",
  invalid: "Email or password is incorrect.",
  "not-authorized": "This user is not in ADMIN_EMAILS."
};

export default async function AdminLoginPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const error = params.error ? errorMessages[params.error] : null;

  return (
    <main className="grid min-h-screen place-items-center px-4 py-8">
      <Card className="w-full max-w-md shadow-shop">
        <CardHeader className="space-y-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Store className="h-6 w-6" />
          </div>
          <div>
            <CardTitle className="text-2xl">Admin login</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">{businessConfig.name}</p>
          </div>
        </CardHeader>
        <CardContent>
          <form action={loginAction} className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" autoComplete="email" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
              />
            </div>
            {error ? (
              <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </div>
            ) : null}
            <Button type="submit" size="lg">
              <LockKeyhole className="h-5 w-5" />
              Sign in
            </Button>
          </form>
          <Button asChild variant="ghost" className="mt-3 w-full">
            <Link href="/">Back to storefront</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}

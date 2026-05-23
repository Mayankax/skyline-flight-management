import { redirect } from "next/navigation";

import { AppLayout } from "@/components/layout/app-layout";

import { getCurrentUser } from "@/lib/supabase/get-user";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user =
    await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <AppLayout>
      {children}
    </AppLayout>
  );
}
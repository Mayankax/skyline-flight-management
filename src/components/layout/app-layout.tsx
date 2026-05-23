import { Navbar } from "./navbar";
import { InstallPrompt } from "@/components/shared/install-prompt";

export function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#020817] text-white">
      <Navbar />

      <main>{children}</main>
      
      <InstallPrompt />
    </div>
  );
}
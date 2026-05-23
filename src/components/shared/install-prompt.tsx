"use client";

import { useEffect, useState } from "react";

import { Download } from "lucide-react";

import { Button } from "@/components/ui/button";

export function InstallPrompt() {
  const [
    deferredPrompt,
    setDeferredPrompt,
  ] = useState<any>(null);

  const [visible, setVisible] =
    useState(false);

  useEffect(() => {
    function handler(e: any) {
      e.preventDefault();

      setDeferredPrompt(e);

      setVisible(true);
    }

    window.addEventListener(
      "beforeinstallprompt",
      handler
    );

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handler
      );
    };
  }, []);

  async function handleInstall() {
    if (!deferredPrompt) {
      return;
    }

    deferredPrompt.prompt();

    await deferredPrompt.userChoice;

    setDeferredPrompt(null);

    setVisible(false);
  }

  if (!visible) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-4 rounded-2xl border border-white/10 bg-black/70 px-5 py-4 backdrop-blur-xl">
      <p className="text-sm text-white">
        Install SkyLine App
      </p>

      <Button
        size="sm"
        onClick={handleInstall}
      >
        <Download className="mr-2 h-4 w-4" />

        Install
      </Button>
    </div>
  );
}
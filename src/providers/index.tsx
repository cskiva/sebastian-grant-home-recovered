import { AuthProvider } from "@/app/(app)/_providers/Auth";
import { HeaderThemeProvider } from "./HeaderTheme";
import React from "react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";

export const Providers: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem storageKey="payload-theme">
      <AuthProvider api={"rest"}>
        <HeaderThemeProvider>{children}</HeaderThemeProvider>
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  );
};

import { AuthProvider } from "@/app/(app)/_providers/Auth";
import { HeaderThemeProvider } from "./HeaderTheme";
import React from "react";
import { ThemeProvider } from "./Theme";
import { Toaster } from "sonner";

export const Providers: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <ThemeProvider>
      <AuthProvider api={"rest"}>
        <HeaderThemeProvider>{children}</HeaderThemeProvider>
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  );
};

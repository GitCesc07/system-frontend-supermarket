import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeProvider } from "@/components/theme-provider.tsx"
import "./index.css";
import Router from "./router";
import { Toaster } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";

const queryCliente = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <TooltipProvider>
        <QueryClientProvider client={queryCliente}>
          <Toaster />
          <Router />
          <ReactQueryDevtools />
        </QueryClientProvider>
      </TooltipProvider>
    </ThemeProvider>
  </StrictMode>
)

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import Layout from "@/components/Layout";
import Home from "./pages/Home";
import Demos from "./pages/Demos";
import Models from "./pages/Models";
import Architecture from "./pages/Architecture";
import NeuralNetworkPage from "./pages/NeuralNetworkPage";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import LoadingScreen from "@/components/LoadingScreen";

const queryClient = new QueryClient();

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="litenet-theme">
        <TooltipProvider>
          <Toaster />
          <Sonner />

          <AnimatePresence mode="wait">
            {isLoading && (
              <LoadingScreen onComplete={() => setIsLoading(false)} />
            )}
          </AnimatePresence>

          {!isLoading && (
            <BrowserRouter>
              <Layout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/demos" element={<Demos />} />
                  <Route path="/models" element={<Models />} />
                  <Route path="/architecture" element={<Architecture />} />
                  <Route path="/neural-network" element={<NeuralNetworkPage />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Layout>
              <Analytics />
              <SpeedInsights />
            </BrowserRouter>
          )}

        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;

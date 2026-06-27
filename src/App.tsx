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
import PerformanceInsights from "./pages/PerformanceInsights";
import NeuralNetworkPage from "./pages/NeuralNetworkPage";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import LoadingScreen from "@/components/LoadingScreen";
import ScrollToTop from "@/components/ScrollToTop";
import { useKeepAlive } from "@/hooks/useKeepAlive";

const queryClient = new QueryClient();

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  // Keep backend warm
  useKeepAlive();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="litenetx-theme">
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
              <ScrollToTop />
              <Layout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/demos" element={<Demos />} />
                  <Route path="/models" element={<Models />} />
                  <Route path="/architecture" element={<Architecture />} />
                  <Route path="/performance" element={<PerformanceInsights />} />
                  <Route path="/3d-nn" element={<NeuralNetworkPage />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Layout>
            </BrowserRouter>
          )}

        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "@/context/AuthContext";
import Index from "./pages/Index";
import Checkout from "./pages/Checkout";
import ObrigadoPage from "@/pages/ObrigadoPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <HelmetProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Home / Categories */}
              <Route path="/" element={<Index />} />
              
              {/* Grade da Categoria */}
              <Route path="/categoria/:categoria_slug" element={<Index />} />
              
              {/* Resultados de Busca */}
              <Route path="/busca/:termo" element={<Index />} />
              
              {/* Detalhe do Produto */}
              <Route path="/produto/:id" element={<Index />} />
              
              {/* Rotas Dinâmicas Automatizadas */}
              <Route path="/receita/:slug_and_id" element={<Index />} />
              <Route path="/pack/:slug_and_id" element={<Index />} />
              <Route path="/infoproduto/:slug_and_id" element={<Index />} />
              
              {/* Tela de Checkout */}
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/checkout/:id" element={<Checkout />} />

              {/* Tela de Obrigado / Entrega do Pedido */}
              <Route path="/obrigado/:idPedido" element={<ObrigadoPage />} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </HelmetProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
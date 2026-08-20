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
import CatalogoPublico from "./pages/CatalogoPublico";
import PremiumPage from "./pages/PremiumPage";
import InstagramProfissional from "./pages/conteudo/InstagramProfissional";
import NotFound from "./pages/NotFound";
import { FloatingBackButton } from "@/components/common/FloatingBackButton";
import { DailyReminderPopup } from "@/components/common/DailyReminderPopup";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <HelmetProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner position="top-center" />
          <BrowserRouter>
            <FloatingBackButton />
            <DailyReminderPopup />
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
              
              {/* Catálogo Público da Artesã */}
              <Route path="/catalogo/:userId" element={<CatalogoPublico />} />

              {/* Tela de Checkout */}
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/checkout/:id" element={<Checkout />} />

              {/* Tela de Obrigado / Entrega do Pedido */}
              <Route path="/obrigado/:idPedido" element={<ObrigadoPage />} />
              
              {/* Rota do AmiguMundo Premium */}
              <Route path="/premium" element={<PremiumPage />} />
              
              {/* Conteúdo de Infoprodutos */}
              <Route path="/conteudo/instagram-profissional" element={<InstagramProfissional />} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </HelmetProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
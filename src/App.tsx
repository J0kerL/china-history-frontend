import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ScrollToTop } from "./components/layout/ScrollToTop";
import Index from "./pages/Index";
import Dynasties from "./pages/Dynasties";
import DynastyDetail from "./pages/DynastyDetail";
import Figures from "./pages/Figures";
import FigureDetail from "./pages/FigureDetail";
import Events from "./pages/Events";
import EventDetail from "./pages/EventDetail";
import AIAssistant from "./pages/AIAssistant";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dynasties" element={<Dynasties />} />
            <Route path="/dynasties/:id" element={<DynastyDetail />} />
            <Route path="/figures" element={<Figures />} />
            <Route path="/figures/:id" element={<FigureDetail />} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/:id" element={<EventDetail />} />
            <Route path="/ai-assistant" element={<AIAssistant />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

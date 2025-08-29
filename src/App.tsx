import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GameProvider } from "./contexts/GameContext";
import Index from "./pages/Index";
import Welcome from "./pages/Welcome";
import Assessment from "./pages/Assessment";
import Dashboard from "./pages/Dashboard";
import ModulesHub from "./pages/ModulesHub";
import PasswordModule from "./pages/modules/PasswordModule";
import PhishingModule from "./pages/modules/PhishingModule";
import PrivacyModule from "./pages/modules/PrivacyModule";
import UpdatesModule from "./pages/modules/UpdatesModule";
import BackupsModule from "./pages/modules/BackupsModule";
import Badges from "./pages/Badges";
import Quests from "./pages/Quests";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <GameProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/welcome" element={<Welcome />} />
            <Route path="/assessment" element={<Assessment />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/modules" element={<ModulesHub />} />
            <Route path="/modules/password" element={<PasswordModule />} />
            <Route path="/modules/phishing" element={<PhishingModule />} />
            <Route path="/modules/privacy" element={<PrivacyModule />} />
            <Route path="/modules/updates" element={<UpdatesModule />} />
            <Route path="/modules/backups" element={<BackupsModule />} />
            <Route path="/badges" element={<Badges />} />
            <Route path="/quests" element={<Quests />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </GameProvider>
  </QueryClientProvider>
);

export default App;
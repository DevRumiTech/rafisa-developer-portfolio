import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppearanceProvider } from "./components/AppearanceProvider";
import { AppRecovery } from "./components/AppRecovery";
import PageMotion from "./components/PageMotion";
import RouteEffects from "./components/RouteEffects";
import Projects from "./pages/Projects";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import ProjectDetail from "./pages/ProjectDetail";

export default function App() {
  // Display the page that matches the visitor's URL.
  return (
    <AppearanceProvider>
    <AppRecovery>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:slug" element={<ProjectDetail />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <RouteEffects />
      <PageMotion />
    </BrowserRouter>
    </AppRecovery>
    </AppearanceProvider>
  );
}

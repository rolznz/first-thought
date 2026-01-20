import { AchievementPage } from "@/pages/AchievementPage";
import { CapturePage } from "@/pages/CapturePage";
import { HistoryPage } from "@/pages/HistoryPage";
import { HomePage } from "@/pages/HomePage";
import { RecordPage } from "@/pages/RecordPage";
import { RecordedPage } from "@/pages/RecordedPage";
import { RunningPage } from "@/pages/RunningPage";
import { HashRouter, Route, Routes } from "react-router-dom";
import { AboutPage } from "./pages/AboutPage";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/running" element={<RunningPage />} />
        <Route path="/capture" element={<CapturePage />} />
        <Route path="/achievement" element={<AchievementPage />} />
        <Route path="/record" element={<RecordPage />} />
        <Route path="/recorded" element={<RecordedPage />} />
        <Route path="/history" element={<HistoryPage />} />
      </Routes>
    </HashRouter>
  );
}

export default App;

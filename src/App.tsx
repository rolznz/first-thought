import { HashRouter, Routes, Route } from 'react-router-dom';
import { HomePage } from '@/pages/HomePage';
import { RunningPage } from '@/pages/RunningPage';
import { CapturePage } from '@/pages/CapturePage';
import { HistoryPage } from '@/pages/HistoryPage';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/running" element={<RunningPage />} />
        <Route path="/capture" element={<CapturePage />} />
        <Route path="/history" element={<HistoryPage />} />
      </Routes>
    </HashRouter>
  );
}

export default App;

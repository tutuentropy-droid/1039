import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import Home from '@/pages/Home';
import SchoolDetailPage from '@/pages/SchoolDetailPage';
import RelationExplorer from '@/pages/RelationExplorer';
import PhilosopherDetailPage from '@/pages/PhilosopherDetailPage';
import PhilosophersPage from '@/pages/PhilosophersPage';
import TimelinePage from '@/pages/TimelinePage';
import ComparePage from '@/pages/ComparePage';
import MapPage from '@/pages/MapPage';

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-ink mb-4">404</h1>
        <p className="text-ink/60 mb-8">页面未找到</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-paper">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/school/:id" element={<SchoolDetailPage />} />
            <Route path="/philosopher/:id" element={<PhilosopherDetailPage />} />
            <Route path="/philosophers" element={<PhilosophersPage />} />
            <Route path="/timeline" element={<TimelinePage />} />
            <Route path="/relations" element={<RelationExplorer />} />
            <Route path="/compare" element={<ComparePage />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

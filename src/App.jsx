import { BrowserRouter, Routes, Route } from 'react-router-dom'
import TopNav from './components/TopNav'
import Simulator from './pages/Simulator'
import Learn from './pages/Learn'
import NonProbSampling from './pages/NonProbSampling'
import Header from './components/Header'
import 'leaflet/dist/leaflet.css';

const basename = (import.meta.env.BASE_URL || '/').replace(/\/$/, '') || '/'

export default function App() {
  return (
    <BrowserRouter basename={basename}>
      <Header />
      <TopNav />
      <Routes>
        <Route path="/" element={<Simulator />} />
        <Route path="/learn" element={<Learn />} />
        <Route path="/non-probability" element={<NonProbSampling />} />
      </Routes>
    </BrowserRouter>
  )
}

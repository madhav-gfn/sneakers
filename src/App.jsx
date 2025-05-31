import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import CheckoutPage from './pages/CheckoutPage';
import ThankYouPage from './pages/ThankYouPage';
import './index.css';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/thank-you" element={<ThankYouPage />} />
      </Routes>
    </div>
  );
}

export default App;

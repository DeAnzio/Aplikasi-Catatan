import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import TambahCatatan from './pages/TambahCatatan';
import DaftarCatatan from './pages/DaftarCatatan';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tambah" element={<TambahCatatan />} />
        <Route path="/daftar" element={<DaftarCatatan />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;

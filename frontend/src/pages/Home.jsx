import { Link } from 'react-router-dom';
import '../styles/Home.css';

export default function Home() {
  return (
    <main className="container">
      <h1>Aplikasi Catatan</h1>
      <div className="menu-panel">
        <Link to="/tambah" className="btn">
          Tambah Catatan
        </Link>
        <Link to="/daftar" className="btn secondary">
          Lihat Daftar Catatan
        </Link>
      </div>
    </main>
  );
}

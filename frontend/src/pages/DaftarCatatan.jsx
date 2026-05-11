import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CONFIG from '../config';
import '../styles/List.css';

export default function DaftarCatatan() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${CONFIG.API_URL}/api/users`);

      if (!response.ok) {
        throw new Error('Gagal mengambil data catatan');
      }

      const data = await response.json();
      setNotes(data.data || []);
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus catatan ini?')) {
      try {
        const response = await fetch(`${CONFIG.API_URL}/api/users/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Gagal menghapus catatan');
        }

        setNotes((prev) => prev.filter((note) => note.id !== id));
      } catch (err) {
        alert(err.message);
      }
    }
  };

  return (
    <main className="container">
      <h1>Daftar Catatan</h1>

      <div className="actions">
        <Link to="/tambah" className="btn">
          Tambah Catatan Baru
        </Link>
        <a href="/" className="btn secondary">
          Kembali ke Menu
        </a>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <p className="loading">Memuat data...</p>
      ) : notes.length === 0 ? (
        <p className="empty-message">Belum ada catatan. Mulai dengan membuat catatan baru!</p>
      ) : (
        <div className="notes-list">
          {notes.map((note) => (
            <div key={note.id} className="note-item">
              <div className="note-header">
                <h2>{note.judul}</h2>
                <div className="note-actions">
                  <Link to={`/edit/${note.id}`} className="btn-small edit">
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(note.id)}
                    className="btn-small delete"
                  >
                    Hapus
                  </button>
                </div>
              </div>
              <div className="note-content">
                <p>{note.isi}</p>
              </div>
              {note.created_at && (
                <div className="note-meta">
                  <small>Dibuat: {new Date(note.created_at).toLocaleString('id-ID')}</small>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

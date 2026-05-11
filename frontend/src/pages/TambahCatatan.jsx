import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CONFIG from '../config';
import '../styles/Form.css';

export default function TambahCatatan() {
  const [formData, setFormData] = useState({
    judul: '',
    isi: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${CONFIG.API_URL}/api/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Gagal menambah catatan');
      }

      setFormData({ judul: '', isi: '' });
      navigate('/daftar');
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container">
      <h1>Tambah Catatan</h1>
      <form onSubmit={handleSubmit} className="form">
        {error && <div className="error-message">{error}</div>}

        <div className="form-group">
          <label htmlFor="judul">Judul Catatan</label>
          <input
            type="text"
            id="judul"
            name="judul"
            value={formData.judul}
            onChange={handleChange}
            required
            placeholder="Masukkan judul catatan"
          />
        </div>

        <div className="form-group">
          <label htmlFor="isi">Isi Catatan</label>
          <textarea
            id="isi"
            name="isi"
            value={formData.isi}
            onChange={handleChange}
            required
            placeholder="Masukkan isi catatan"
            rows="10"
          ></textarea>
        </div>

        <div className="form-actions">
          <button type="submit" disabled={loading} className="btn">
            {loading ? 'Menyimpan...' : 'Simpan Catatan'}
          </button>
          <a href="/" className="btn secondary">
            Batal
          </a>
        </div>
      </form>
    </main>
  );
}

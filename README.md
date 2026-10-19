# Aplikasi Catatan

Aplikasi web sederhana untuk membuat, melihat, mengubah, dan menghapus catatan. Proyek ini terdiri dari frontend HTML/CSS/JavaScript, REST API berbasis Express, serta database MySQL yang diakses menggunakan Sequelize.

## Fitur

- Menampilkan daftar catatan, diurutkan dari yang terbaru.
- Membuat catatan dengan judul dan isi.
- Mengubah dan menghapus catatan.
- Menyimpan waktu pembuatan setiap catatan.
- Endpoint health check untuk memeriksa status API dan koneksi database.

## Teknologi

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express 5
- ORM dan database: Sequelize 6, MySQL

## Struktur Proyek

```text
backend/
  config/       Konfigurasi koneksi database
  controllers/  Logika endpoint catatan
  models/       Operasi data catatan
  routes/       Rute REST API
  schema/       Model Sequelize
  index.js      Entry point server
  api.rest      Contoh permintaan API
  Dockerfile
database/
  notes-app-export.sql
frontend/
  index.html    Halaman menu
  daftar.html   Halaman daftar catatan
  tambah.html   Form tambah dan edit catatan
  config.js     URL dasar API frontend
  script.js     Logika frontend dan permintaan API
```

## Menjalankan Secara Lokal

### 1. Siapkan database

Pastikan MySQL sudah berjalan, lalu buat database kosong:

```sql
CREATE DATABASE notes_app CHARACTER SET utf8mb4;
```

Backend akan membuat atau menyelaraskan tabel `notes` saat berhasil terhubung ke database. Berkas `database/notes-app-export.sql` adalah dump database opsional; impor hanya jika memang ingin memulihkan isi dump tersebut.

### 2. Konfigurasikan backend

Gunakan Node.js (Dockerfile proyek menggunakan Node.js 22). Dari direktori `backend`, buat berkas `.env` dengan nilai koneksi database lokal:

```dotenv
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=password_mysql_anda
DB_NAME=notes_app
PORT=3000
FRONTEND_URL=http://localhost:5500
```

Sesuaikan nilai database dengan instalasi lokal. Jangan commit `.env` atau kredensial database ke repositori.

Pasang dependensi dan jalankan server dari direktori `backend`:

```powershell
npm install
npm run dev
```

Untuk menjalankan tanpa mode watch, gunakan `npm start`. API lokal tersedia di `http://localhost:3000`; status server dan database dapat diperiksa di `http://localhost:3000/health`.

### 3. Konfigurasikan dan jalankan frontend

Atur `window.API_BASE_URL` di `frontend/config.js` ke API lokal:

```js
window.API_BASE_URL = "http://localhost:3000/api/notes";
```

Frontend memakai URL API deployment sebagai nilai bawaan, jadi langkah ini diperlukan untuk mengarahkan halaman ke backend lokal. Jalankan server statis dari direktori `frontend`, misalnya:

```powershell
python -m http.server 5500
```

Buka `http://localhost:5500` di browser. Backend mengizinkan origin lokal yang umum digunakan; untuk origin frontend lain, tambahkan URL tersebut ke `FRONTEND_URL`. Beberapa origin dapat dipisahkan dengan koma.

## REST API

Semua endpoint catatan menggunakan prefiks `/api/notes`. Data catatan memiliki bentuk berikut:

```json
{
  "id": 1,
  "judul": "Catatan Baru",
  "isi": "Isi catatan",
  "tanggal_dibuat": "2026-10-19T10:00:00.000Z"
}
```

| Metode | Endpoint | Keterangan |
| --- | --- | --- |
| `GET` | `/` | Informasi API dan daftar endpoint |
| `GET` | `/health` | Status API dan koneksi database |
| `GET` | `/api/notes` | Mengambil semua catatan |
| `GET` | `/api/notes/:id` | Mengambil satu catatan berdasarkan ID |
| `POST` | `/api/notes` | Membuat catatan |
| `PUT` | `/api/notes/:id` | Memperbarui judul dan isi catatan |
| `DELETE` | `/api/notes/:id` | Menghapus catatan |

Permintaan `POST` dan `PUT` menerima JSON dengan `judul` dan `isi`, keduanya wajib diisi:

```json
{
  "judul": "Daftar belanja",
  "isi": "Susu\nRoti\nTelur"
}
```

Contoh menggunakan `curl`:

```bash
curl http://localhost:3000/api/notes

curl -X POST http://localhost:3000/api/notes \
  -H "Content-Type: application/json" \
  -d "{\"judul\":\"Catatan Baru\",\"isi\":\"Isi catatan\"}"
```

Endpoint untuk ID yang tidak ditemukan mengembalikan `404`; permintaan tanpa judul atau isi mengembalikan `400`. Berkas `backend/api.rest` berisi contoh tambahan untuk pengujian API di editor yang mendukung REST Client.

## Deployment

Konfigurasi deployment yang tersedia:

- `backend/Dockerfile` dan `backend/cloudbuild.yaml` untuk membangun image backend dan deployment ke Google Cloud Run.
- `frontend/app.yaml` dan `frontend/cloudbuild.yaml` untuk deployment frontend ke Google App Engine.

Atur variabel lingkungan database, `FRONTEND_URL`, serta nilai substitusi Cloud Build sesuai lingkungan deployment. Simpan rahasia, seperti kata sandi database, di pengelola rahasia deployment dan jangan memasukkannya ke repositori.

# Aplikasi Notes Fullstack (Express + MySQL)

Aplikasi ini adalah implementasi CRUD catatan sesuai ketentuan:
- Tambah catatan
- Lihat daftar catatan
- Edit catatan
- Hapus catatan

Setiap catatan memiliki field:
- id
- judul
- isi
- tanggal_dibuat

## Struktur
- backend/: Express + Sequelize + MySQL
- frontend/: HTML, CSS, JavaScript (tanpa framework)
- database/init.sql: skrip migrasi / export database

## Konfigurasi
1. Copy `backend/.env.example` ke `backend/.env`
2. Set `DB_HOST`, `DB_USER`, `DB_PASS`, `DB_NAME`, `PORT`
   - Contoh lokal:
     - DB_HOST=localhost
     - DB_USER=root
     - DB_PASS=
     - DB_NAME=notes_app
     - PORT=3000

3. Jalankan MySQL lokal dan buat database dengan SQL ini atau `database/init.sql`:
```sql
CREATE DATABASE IF NOT EXISTS notes_app CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE notes_app;
CREATE TABLE IF NOT EXISTS notes (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  judul VARCHAR(255) NOT NULL,
  isi TEXT NOT NULL,
  tanggal_dibuat DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB;
```

## Instalasi backend
```bash
cd backend
npm install
npm start
```

API endpoint utama: `http://localhost:3000/api/notes`
- GET `/api/notes`
- POST `/api/notes` (body: `{ judul, isi }`)
- GET `/api/notes/:id`
- PUT `/api/notes/:id` (body: `{ judul, isi }`)
- DELETE `/api/notes/:id`

## Frontend
Buka `http://localhost:3000` di browser untuk mengakses aplikasi Notes.

### Struktur Frontend:
- `frontend/index.html` — Menu utama aplikasi
- `frontend/daftar.html` — Halaman daftar catatan
- `frontend/tambah.html` — Halaman tambah/edit catatan
- `frontend/script.js` — Script JavaScript terpadu untuk semua halaman
- `frontend/style.css` — Styling CSS untuk aplikasi

## Migrasi Database (dari lokal ke Cloud SQL / VM MySQL)
1. Export tabel lokal:
   `mysqldump -u root -p notes_app > notes_app_export.sql`
2. Import di Cloud SQL / VM:
   `mysql -u <user> -p -h <host> notes_app < notes_app_export.sql`
3. Update `backend/.env` host/login sesuai server.

## Pengujian API
Gunakan file `api.rest` dengan REST Client extension di VS Code untuk testing semua endpoint.

### Contoh Testing:
1. **GET All Notes**: Klik request pertama untuk melihat semua catatan
2. **POST Create Note**: Buat catatan baru dengan judul dan isi
3. **GET Note by ID**: Ambil catatan spesifik berdasarkan ID
4. **PUT Update Note**: Update catatan yang sudah ada
5. **DELETE Note**: Hapus catatan berdasarkan ID

### Testing dengan Postman/Insomnia:
- Base URL: `http://localhost:3000/api/notes`
- Method: sesuai kebutuhan (GET, POST, PUT, DELETE)
- Headers: `Content-Type: application/json`
- Body untuk POST/PUT: `{ "judul": "Judul Catatan", "isi": "Isi catatan" }`

## Catatan teknis
- Model Sequelize: `backend/schema/User.js` (Note schema)
- Router: `backend/routes/userRoutes.js`
- Controller: `backend/controllers/userController.js`
- Model logic: `backend/models/userModels.js`
- Koneksi database: `backend/config/database.js`
- Frontend script: `frontend/script.js` (terpadu untuk semua halaman)


✅ Backend sudah dimodifikasi ke notes CRUD
✅ Frontend sudah menggunakan endpoint `/api/notes`
✅ DB migration script tersedia di `database/init.sql`
# Panduan Lengkap Deployment Aplikasi Catatan

Aplikasi ini terdiri dari **Backend (Express.js + MySQL)** dan **Frontend (Node.js Static Server)**.

---

## 📋 Prasyarat

Pastikan sudah terinstall:
- **Node.js** v18+ dan npm
- **Git** (untuk version control)
- **Google Cloud SDK** (untuk deploy ke Cloud)
  - Download: https://cloud.google.com/sdk/docs/install
  - Setelah install, jalankan: `gcloud init`

### Database yang Digunakan
- **Host**: 34.172.113.167
- **User**: admin
- **Password**: mypassword
- **Database**: notes_123230069

---

## 🏠 1. Cara Deploy Lokal (Development)

### A. Setup Backend

1. **Buka terminal dan masuk ke folder backend**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Buat file `.env` di folder `backend/`**
   ```bash
   # Windows
   echo. > .env
   
   # atau gunakan text editor dan buat file .env dengan isi:
   ```
   
   Isi file `.env`:
   ```env
   DB_HOST=34.172.113.167
   DB_USER=admin
   DB_PASS=mypassword
   DB_NAME=notes_123230069
   DB_PORT=3306
   PORT=3000
   ```

4. **Jalankan backend**
   ```bash
   npm start
   ```
   
   ✅ Jika berhasil, akan muncul:
   ```
   ✅ Server running on port 3000
   ```

5. **Test backend dengan membuka browser**
   - Buka: `http://localhost:3000`
   - Seharusnya muncul: `{"status":"OK","message":"Notes API berjalan"}`

---

### B. Setup Frontend

1. **Buka terminal baru dan masuk ke folder frontend**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Pastikan `config.js` sudah benar untuk lokal**
   ```javascript
   // File: frontend/config.js
   window.BACKEND_URL = 'http://localhost:3000';
   ```

4. **Jalankan frontend server**
   ```bash
   npm start
   ```
   
   ✅ Jika berhasil, akan muncul:
   ```
   Frontend server running on port 8080
   ```

5. **Buka aplikasi di browser**
   - Buka: `http://localhost:8080`
   - Sekarang bisa lihat aplikasi catatan yang berfungsi

---

## ☁️ 2. Cara Deploy ke Google Cloud Platform

### Persiapan GCP

1. **Login ke akun Google Cloud**
   ```bash
   gcloud auth login
   ```

2. **Set project ID** (ganti `YOUR_PROJECT_ID` dengan project ID Anda)
   ```bash
   gcloud config set project YOUR_PROJECT_ID
   ```

3. **Aktifkan API yang diperlukan**
   ```bash
   gcloud services enable appengine.googleapis.com cloudbuild.googleapis.com run.googleapis.com
   ```

---

### A. Deploy Backend ke App Engine

1. **Buka folder backend**
   ```bash
   cd backend
   ```

2. **Pastikan file `app.yaml` sudah ada dan gunakan service name khusus**
   
   Update file `backend/app.yaml` supaya backend dideploy sebagai service bernama khusus, misalnya `backend_069`:
   ```yaml
   runtime: nodejs18
   env: standard
   service: backend_069

   instance_class: F1
   automatic_scaling:
     min_instances: 0
     max_instances: 1
     target_cpu_utilization: 0.5

   env_variables:
     DB_HOST: "34.172.113.167"
     DB_USER: "admin"
     DB_PASS: "mypassword"
     DB_NAME: "notes_123230069"
     DB_PORT: "3306"

   handlers:
   - url: /.*
     script: auto
   ```

   Dengan konfigurasi ini, App Engine akan membuat service dengan nama khusus `backend_069` dan menjaga jumlah instance seminimal mungkin agar biaya tetap rendah.

3. **Deploy ke App Engine**
   ```bash
   gcloud app deploy
   ```
   
   Tunggu hingga selesai (bisa 5-10 menit). Jika berhasil, akan muncul URL backend seperti:
   ```
   https://backend_069-dot-YOUR_PROJECT_ID.REGION.r.appspot.com
   ```

4. **Test backend hasil deployment**
   ```bash
   gcloud app browse
   ```
   Atau akses langsung URL yang muncul di atas

---

### B. Deploy Frontend ke Cloud Run

1. **Update `frontend/config.js` dengan URL backend dari App Engine**
   
   Ganti:
   ```javascript
   window.BACKEND_URL = 'http://localhost:3000';
   ```
   
   Dengan URL publik backend (dari step A.4):
   ```javascript
   window.BACKEND_URL = 'https://YOUR_PROJECT_ID.REGION.r.appspot.com';
   ```

2. **Buka folder frontend**
   ```bash
   cd frontend
   ```

3. **Deploy ke Cloud Run** (Pilih salah satu cara):

   **Cara 1: Deploy langsung dari source (lebih mudah)**
   ```bash
   gcloud run deploy notes-frontend --source . --region asia-southeast2 --allow-unauthenticated
   ```
   
   Ganti `asia-southeast2` dengan region pilihan Anda.

   **Cara 2: Build Docker image terlebih dahulu**
   ```bash
   # Build image
   gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/notes-frontend
   
   # Deploy image ke Cloud Run
   gcloud run deploy notes-frontend --image gcr.io/YOUR_PROJECT_ID/notes-frontend --region asia-southeast2 --allow-unauthenticated
   ```

4. **Tunggu deployment selesai**
   
   Jika berhasil, akan muncul URL frontend seperti:
   ```
   https://notes-frontend-XXXXX.run.app
   ```

5. **Test aplikasi di browser**
   - Buka URL yang muncul di atas
   - Coba buat catatan baru
   - Seharusnya bisa tersimpan dan ditampilkan

---

## 🔧 3. Troubleshooting Deployment

### Backend Error: "Tidak bisa connect ke database"

**Solusi:**
1. Cek variabel environment `.env` atau `app.yaml`
2. Pastikan database host `34.172.113.167` bisa diakses dari:
   - Lokal: `telnet 34.172.113.167 3306`
   - GCP: Konfigurasi firewall/security group untuk allow port 3306

### Frontend Error: "API tidak bisa diakses"

**Solusi:**
1. Cek `frontend/config.js` sudah update dengan URL backend yang benar
2. Backend harus sudah deployed dan dapat diakses public
3. Reload page dan cek console browser (F12 → Console) untuk error detail

### "gcloud command not found"

**Solusi:**
1. Install Google Cloud SDK
2. Jalankan `gcloud init` dan login
3. Restart terminal

### Port 8080/3000 sudah terpakai

**Solusi:**
- Untuk backend: ubah `PORT=3000` di `.env` ke port lain, misalnya `PORT=3001`
- Untuk frontend: ubah port di `frontend/server.js`:
  ```javascript
  const PORT = process.env.PORT || 3001; // Ubah 8080 menjadi 3001
  ```

---

## 📝 4. Checklist Deployment

### Sebelum deploy lokal:
- [ ] Node.js v18+ sudah terinstall
- [ ] File `.env` sudah dibuat dengan kredensial database
- [ ] `npm install` sudah dijalankan di backend dan frontend
- [ ] Backend bisa diakses di `http://localhost:3000`
- [ ] Frontend bisa diakses di `http://localhost:8080`

### Sebelum deploy ke GCP:
- [ ] Google Cloud SDK sudah terinstall
- [ ] Sudah login dengan `gcloud auth login`
- [ ] Project ID sudah di-set dengan `gcloud config set project YOUR_PROJECT_ID`
- [ ] API sudah diaktifkan (AppEngine, Cloud Run, Cloud Build)
- [ ] Backend sudah deployed dan ada URL publik
- [ ] `frontend/config.js` sudah update dengan URL backend publik
- [ ] Frontend sudah deployed dan dapat diakses

---

## 📚 5. Struktur File Deployment

```
Aplikasi-Catatan/
├── backend/
│   ├── .env                    ← File konfigurasi database (jangan di-commit!)
│   ├── app.yaml                ← Konfigurasi App Engine
│   ├── index.js                ← Entry point backend
│   ├── package.json
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── schema/
├── frontend/
│   ├── Dockerfile              ← Untuk build container image
│   ├── config.js               ← Konfigurasi URL backend (PENTING!)
│   ├── server.js               ← Server frontend
│   ├── package.json
│   ├── index.html
│   ├── style.css
│   └── script.js
├── database/
│   └── notes-app-export.sql    ← SQL dump database (opsional)
└── README.md
```

---

## 🚀 6. Ringkasan Deployment

| Tahap | Command | URL Hasil |
|-------|---------|----------|
| **Development Backend** | `npm start` (di folder backend) | `http://localhost:3000` |
| **Development Frontend** | `npm start` (di folder frontend) | `http://localhost:8080` |
| **Production Backend** | `gcloud app deploy` (di folder backend) | `https://YOUR_PROJECT_ID.REGION.r.appspot.com` |
| **Production Frontend** | `gcloud run deploy ...` (di folder frontend) | `https://notes-frontend-XXXXX.run.app` |

---

## ✅ Selesai!

Aplikasi sudah ready untuk di-deploy. Ikuti panduan di atas sesuai kebutuhan Anda (lokal atau cloud).

**Untuk pertanyaan atau error**, cek section **Troubleshooting** atau lihat dokumentasi:
- [Google App Engine Documentation](https://cloud.google.com/appengine/docs)
- [Google Cloud Run Documentation](https://cloud.google.com/run/docs)
- [Express.js Documentation](https://expressjs.com/)

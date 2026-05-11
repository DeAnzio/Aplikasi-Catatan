# Aplikasi-Catatan

Proyek ini adalah aplikasi notes sederhana dengan backend Express.js dan frontend HTML/CSS/JS.

## Struktur Deployment
- `backend/`: backend Express.js untuk App Engine
- `backend/app.yaml`: konfigurasi App Engine
- `frontend/`: frontend static app untuk Cloud Run
- `frontend/Dockerfile`: image container frontend
- `frontend/config.js`: konfigurasi URL backend untuk deployment

## Database
- Host: `34.172.113.167`
- User: `admin`
- Password: `mypassword`
- Database: `notes_123230069`

## Catatan
Setelah backend dideploy, update `frontend/config.js` dengan URL publik backend sebelum deploy frontend.

// Aplikasi Notes - Frontend Script
const apiBase = 'http://localhost:3000/api/notes';

// Utility Functions
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// API Functions
async function fetchNotes() {
  const res = await fetch(apiBase);
  if (!res.ok) throw new Error('Gagal mengambil catatan');
  return res.json();
}

async function fetchNoteById(id) {
  const res = await fetch(`${apiBase}/${id}`);
  if (!res.ok) throw new Error('Gagal ambil catatan');
  return res.json();
}

async function addNote(body) {
  const res = await fetch(apiBase, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error('Gagal tambah catatan');
  return res.json();
}

async function updateNote(id, body) {
  const res = await fetch(`${apiBase}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error('Gagal edit catatan');
  return res.json();
}

async function deleteNote(id) {
  const res = await fetch(`${apiBase}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Gagal hapus catatan');
  return res.ok;
}

// Notes List Functions (for daftar.html)
function renderNotes(notes) {
  const notesContainer = document.getElementById('notes');
  if (!notesContainer) return; // Skip if not on daftar.html

  if (!Array.isArray(notes) || notes.length === 0) {
    notesContainer.innerHTML = '<p>Belum ada catatan.</p>';
    return;
  }

  notesContainer.innerHTML = notes
    .map(note => {
      const created = new Date(note.tanggal_dibuat).toLocaleString('id-ID', {
        dateStyle: 'medium', timeStyle: 'short'
      });
      return `
      <article class="note-item" data-id="${note.id}">
        <h3>${escapeHtml(note.judul)}</h3>
        <p class="meta">${created}</p>
        <p>${escapeHtml(note.isi).replace(/\n/g, '<br>')}</p>
        <div class="buttons">
          <button type="button" onclick="editNote(${note.id})">Edit</button>
          <button type="button" class="danger" onclick="deleteNote(${note.id})">Hapus</button>
        </div>
      </article>`;
    })
    .join('');
}

async function loadNotes() {
  const notesContainer = document.getElementById('notes');
  if (!notesContainer) return; // Skip if not on daftar.html

  try {
    const notes = await fetchNotes();
    renderNotes(notes);
  } catch (error) {
    console.error(error);
    notesContainer.innerHTML = '<p style="color:red">Gagal memuat data.</p>';
  }
}

// Form Functions (for tambah.html)
async function loadNoteForEdit(id) {
  try {
    const note = await fetchNoteById(id);
    const noteIdInput = document.getElementById('note-id');
    const judulInput = document.getElementById('judul');
    const isiInput = document.getElementById('isi');
    const submitButton = document.getElementById('submit-button');
    const cancelEditButton = document.getElementById('cancel-edit');

    if (noteIdInput && judulInput && isiInput) {
      noteIdInput.value = note.id;
      judulInput.value = note.judul;
      isiInput.value = note.isi;
      if (submitButton) submitButton.textContent = 'Simpan Perubahan';
      if (cancelEditButton) cancelEditButton.classList.remove('hidden');
    }
    localStorage.removeItem('editId');
  } catch (error) {
    console.error(error);
    alert('Gagal memuat catatan untuk diedit');
  }
}

async function initEditMode() {
  const noteForm = document.getElementById('note-form');
  if (!noteForm) return; // Skip if not on tambah.html

  const editId = localStorage.getItem('editId');
  if (editId) {
    await loadNoteForEdit(editId);
  }
}

async function handleFormSubmit(event) {
  event.preventDefault();

  const noteIdInput = document.getElementById('note-id');
  const judulInput = document.getElementById('judul');
  const isiInput = document.getElementById('isi');
  const submitButton = document.getElementById('submit-button');

  const id = noteIdInput.value;
  const judul = judulInput.value.trim();
  const isi = isiInput.value.trim();

  if (!judul || !isi) {
    alert('Judul dan isi tidak boleh kosong.');
    return;
  }

  try {
    submitButton.disabled = true;
    if (id) {
      await updateNote(id, { judul, isi });
      alert('Catatan berhasil diperbarui!');
    } else {
      await addNote({ judul, isi });
      alert('Catatan berhasil ditambahkan!');
    }

    noteIdInput.value = '';
    event.target.reset();
    window.location.href = 'daftar.html';
  } catch (error) {
    console.error(error);
    alert('Gagal menyimpan catatan.');
  } finally {
    submitButton.disabled = false;
  }
}

function handleCancelEdit() {
  const noteIdInput = document.getElementById('note-id');
  const noteForm = document.getElementById('note-form');
  const submitButton = document.getElementById('submit-button');
  const cancelEditButton = document.getElementById('cancel-edit');

  if (noteIdInput) noteIdInput.value = '';
  if (noteForm) noteForm.reset();
  if (submitButton) submitButton.textContent = 'Tambah Catatan';
  if (cancelEditButton) cancelEditButton.classList.add('hidden');
}

// Global Functions (accessible from HTML)
window.editNote = function (id) {
  localStorage.setItem('editId', id);
  window.location.href = 'tambah.html';
};

window.deleteNote = async function (id) {
  if (!confirm('Hapus catatan ini?')) return;
  try {
    const success = await deleteNote(id);
    if (success) {
      await loadNotes(); // Reload notes after deletion
    } else {
      alert('Gagal menghapus catatan');
    }
  } catch (error) {
    console.error(error);
    alert('Gagal menghapus catatan');
  }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Initialize notes list if on daftar.html
  loadNotes();

  // Initialize form if on tambah.html
  initEditMode();

  const noteForm = document.getElementById('note-form');
  const cancelEditButton = document.getElementById('cancel-edit');

  if (noteForm) {
    noteForm.addEventListener('submit', handleFormSubmit);
  }

  if (cancelEditButton) {
    cancelEditButton.addEventListener('click', handleCancelEdit);
  }
});
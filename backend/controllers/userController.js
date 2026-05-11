const noteModel = require("../models/userModels");

const getAllNotes = async (req, res) => {
  try {
    const allNotes = await noteModel.findAll();
    res.status(200).json(allNotes);
  } catch (error) {
    res.status(500).json({ message: "Error ketika mengambil data catatan", error: error.message });
  }
};

const createNote = async (req, res) => {
  const { judul, isi } = req.body;

  if (!judul || !isi) {
    return res.status(400).json({ message: "Judul dan isi wajib diisi" });
  }

  try {
    const newNote = await noteModel.create({ judul, isi });
    res.status(201).json(newNote);
  } catch (error) {
    res.status(400).json({ message: "Validasi error", error: error.message });
  }
};

const getNoteById = async (req, res) => {
  const { id } = req.params;

  try {
    const note = await noteModel.findById(id);
    if (!note) {
      return res.status(404).json({ message: "Catatan tidak ditemukan" });
    }
    res.status(200).json(note);
  } catch (error) {
    res.status(500).json({ message: "Error ketika mengambil catatan", error: error.message });
  }
};

const updateNote = async (req, res) => {
  const { id } = req.params;
  const { judul, isi } = req.body;

  if (!judul || !isi) {
    return res.status(400).json({ message: "Judul dan isi wajib diisi" });
  }

  try {
    const note = await noteModel.findById(id);
    if (!note) {
      return res.status(404).json({ message: "Catatan tidak ditemukan" });
    }

    await noteModel.updateById(id, { judul, isi });
    const updated = await noteModel.findById(id);
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: "Error ketika update catatan", error: error.message });
  }
};

const deleteNote = async (req, res) => {
  const { id } = req.params;

  try {
    const note = await noteModel.findById(id);
    if (!note) {
      return res.status(404).json({ message: "Catatan tidak ditemukan" });
    }

    await noteModel.deleteById(id);
    res.status(200).json({ message: "Catatan berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: "Error ketika menghapus catatan", error: error.message });
  }
};

module.exports = {
  getAllNotes,
  createNote,
  getNoteById,
  updateNote,
  deleteNote,
};

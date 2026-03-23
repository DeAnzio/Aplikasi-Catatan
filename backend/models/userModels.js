const Note = require("../schema/User");

const findAll = async () => {
  return await Note.findAll({
    attributes: ["id", "judul", "isi", "tanggal_dibuat"],
    order: [["id", "DESC"]],
  });
};

const create = async (noteData) => {
  return await Note.create(noteData);
};

const findById = async (id) => {
  return await Note.findByPk(id, {
    attributes: ["id", "judul", "isi", "tanggal_dibuat"],
  });
};

const updateById = async (id, noteData) => {
  return await Note.update(noteData, {
    where: { id },
  });
};

const deleteById = async (id) => {
  return await Note.destroy({
    where: { id },
  });
};

module.exports = {
  findAll,
  create,
  findById,
  updateById,
  deleteById,
};

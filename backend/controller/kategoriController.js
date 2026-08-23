const { Kategori, Produk } = require('../models');

const getAllKategori = async (req, res) => {
  try {
    const kategoriList = await Kategori.findAll({
      order: [['id', 'ASC']]
    });

    return res.status(200).json({
      success: true,
      message: 'Berhasil mengambil daftar kategori',
      data: kategoriList
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada server saat mengambil kategori: ' + error.message,
      data: null
    });
  }
};

const getKategoriById = async (req, res) => {
  try {
    const { id } = req.params;
    const kategori = await Kategori.findByPk(id, {
      include: [
        {
          model: Produk,
          as: 'produk'
        }
      ]
    });

    if (!kategori) {
      return res.status(404).json({
        success: false,
        message: 'Kategori tidak ditemukan',
        data: null
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Berhasil mengambil detail kategori',
      data: kategori
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada server saat mengambil detail kategori: ' + error.message,
      data: null
    });
  }
};

const createKategori = async (req, res) => {
  try {
    const { nama, deskripsi } = req.body;

    if (!nama) {
      return res.status(400).json({
        success: false,
        message: 'Nama kategori wajib diisi',
        data: null
      });
    }

    const newKategori = await Kategori.create({
      nama,
      deskripsi
    });

    return res.status(201).json({
      success: true,
      message: 'Kategori berhasil dibuat',
      data: newKategori
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada server saat membuat kategori: ' + error.message,
      data: null
    });
  }
};

const updateKategori = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama, deskripsi } = req.body;

    const kategori = await Kategori.findByPk(id);
    if (!kategori) {
      return res.status(404).json({
        success: false,
        message: 'Kategori tidak ditemukan',
        data: null
      });
    }

    if (nama !== undefined) kategori.nama = nama;
    if (deskripsi !== undefined) kategori.deskripsi = deskripsi;

    await kategori.save();

    return res.status(200).json({
      success: true,
      message: 'Kategori berhasil diupdate',
      data: kategori
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada server saat mengupdate kategori: ' + error.message,
      data: null
    });
  }
};

const deleteKategori = async (req, res) => {
  try {
    const { id } = req.params;

    const kategori = await Kategori.findByPk(id);
    if (!kategori) {
      return res.status(404).json({
        success: false,
        message: 'Kategori tidak ditemukan',
        data: null
      });
    }

    await kategori.destroy();

    return res.status(200).json({
      success: true,
      message: 'Kategori berhasil dihapus',
      data: null
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada server saat menghapus kategori: ' + error.message,
      data: null
    });
  }
};

module.exports = {
  getAllKategori,
  getKategoriById,
  createKategori,
  updateKategori,
  deleteKategori
};

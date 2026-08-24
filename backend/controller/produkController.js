const { Produk, Kategori, User } = require('../models');

const getAllProduk = async (req, res) => {
  try {
    const { kategori_id, status, page, limit } = req.query;

    const whereClause = {};
    if (kategori_id) {
      whereClause.kategori_id = kategori_id;
    }
    if (status) {
      whereClause.status = status;
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = limit ? parseInt(limit, 10) : 500;
    const offset = limit ? (pageNum - 1) * limitNum : 0;

    // Query options with limit or full list
    const queryOptions = {
      where: whereClause,
      include: [
        {
          model: Kategori,
          as: 'kategori',
          attributes: ['id', 'nama']
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email']
        }
      ],
      order: [['id', 'ASC']]
    };

    if (limit) {
      queryOptions.limit = limitNum;
      queryOptions.offset = offset;
    }

    const { count, rows } = await Produk.findAndCountAll(queryOptions);

    return res.status(200).json({
      success: true,
      message: 'Berhasil mengambil daftar produk',
      data: {
        total: count,
        page: pageNum,
        totalPages: limit ? Math.ceil(count / limitNum) : 1,
        produk: rows
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada server saat mengambil produk: ' + error.message,
      data: null
    });
  }
};

const getProdukById = async (req, res) => {
  try {
    const { id } = req.params;

    const produk = await Produk.findByPk(id, {
      include: [
        {
          model: Kategori,
          as: 'kategori',
          attributes: ['id', 'nama', 'deskripsi']
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    if (!produk) {
      return res.status(404).json({
        success: false,
        message: 'Produk tidak ditemukan',
        data: null
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Berhasil mengambil detail produk',
      data: produk
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada server saat mengambil detail produk: ' + error.message,
      data: null
    });
  }
};

const createProduk = async (req, res) => {
  try {
    const {
      kategori_id,
      nama,
      deskripsi,
      harga,
      stok,
      sku,
      gambar_url,
      berat,
      status
    } = req.body;

    // Validation
    if (!nama) {
      return res.status(400).json({
        success: false,
        message: 'Nama produk wajib diisi',
        data: null
      });
    }

    if (harga === undefined || harga === null) {
      return res.status(400).json({
        success: false,
        message: 'Harga produk wajib diisi',
        data: null
      });
    }

    if (Number(harga) < 0) {
      return res.status(400).json({
        success: false,
        message: 'Harga tidak boleh bernilai negatif',
        data: null
      });
    }

    if (stok !== undefined && Number(stok) < 0) {
      return res.status(400).json({
        success: false,
        message: 'Stok tidak boleh bernilai negatif',
        data: null
      });
    }

    if (kategori_id) {
      const kategoriExists = await Kategori.findByPk(kategori_id);
      if (!kategoriExists) {
        return res.status(400).json({
          success: false,
          message: 'Kategori dengan kategori_id tersebut tidak ditemukan',
          data: null
        });
      }
    }

    if (sku) {
      const skuExists = await Produk.findOne({ where: { sku } });
      if (skuExists) {
        return res.status(400).json({
          success: false,
          message: 'SKU sudah digunakan oleh produk lain',
          data: null
        });
      }
    }

    // User owner comes from apiKey.user or req.user
    const userId = req.user ? req.user.id : req.body.user_id;

    const newProduk = await Produk.create({
      user_id: userId,
      kategori_id: kategori_id || null,
      nama,
      deskripsi,
      harga,
      stok: stok !== undefined ? stok : 0,
      sku: sku || null,
      gambar_url: gambar_url || null,
      berat: berat || null,
      status: status || 'active'
    });

    return res.status(201).json({
      success: true,
      message: 'Produk berhasil dibuat',
      data: newProduk
    });
  } catch (error) {
    const errorMsg = error.errors && error.errors.length > 0
      ? error.errors.map(e => e.message).join(', ')
      : error.message;
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada server saat membuat produk: ' + errorMsg,
      data: null
    });
  }
};

const updateProduk = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      kategori_id,
      nama,
      deskripsi,
      harga,
      stok,
      sku,
      gambar_url,
      berat,
      status
    } = req.body;

    const produk = await Produk.findByPk(id);
    if (!produk) {
      return res.status(404).json({
        success: false,
        message: 'Produk tidak ditemukan',
        data: null
      });
    }

    if (harga !== undefined && Number(harga) < 0) {
      return res.status(400).json({
        success: false,
        message: 'Harga tidak boleh bernilai negatif',
        data: null
      });
    }

    if (stok !== undefined && Number(stok) < 0) {
      return res.status(400).json({
        success: false,
        message: 'Stok tidak boleh bernilai negatif',
        data: null
      });
    }

    if (kategori_id !== undefined && kategori_id !== null) {
      const kategoriExists = await Kategori.findByPk(kategori_id);
      if (!kategoriExists) {
        return res.status(400).json({
          success: false,
          message: 'Kategori dengan kategori_id tersebut tidak ditemukan',
          data: null
        });
      }
      produk.kategori_id = kategori_id;
    }

    if (sku !== undefined && sku !== produk.sku) {
      const skuExists = await Produk.findOne({ where: { sku } });
      if (skuExists) {
        return res.status(400).json({
          success: false,
          message: 'SKU sudah digunakan oleh produk lain',
          data: null
        });
      }
      produk.sku = sku;
    }

    if (nama !== undefined) produk.nama = nama;
    if (deskripsi !== undefined) produk.deskripsi = deskripsi;
    if (harga !== undefined) produk.harga = harga;
    if (stok !== undefined) produk.stok = stok;
    if (gambar_url !== undefined) produk.gambar_url = gambar_url;
    if (berat !== undefined) produk.berat = berat;
    if (status !== undefined) produk.status = status;

    await produk.save();

    return res.status(200).json({
      success: true,
      message: 'Produk berhasil diupdate',
      data: produk
    });
  } catch (error) {
    const errorMsg = error.errors && error.errors.length > 0
      ? error.errors.map(e => e.message).join(', ')
      : error.message;
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada server saat mengupdate produk: ' + errorMsg,
      data: null
    });
  }
};

const deleteProduk = async (req, res) => {
  try {
    const { id } = req.params;

    const produk = await Produk.findByPk(id);
    if (!produk) {
      return res.status(404).json({
        success: false,
        message: 'Produk tidak ditemukan',
        data: null
      });
    }

    await produk.destroy();

    return res.status(200).json({
      success: true,
      message: 'Produk berhasil dihapus',
      data: null
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada server saat menghapus produk: ' + error.message,
      data: null
    });
  }
};

module.exports = {
  getAllProduk,
  getProdukById,
  createProduk,
  updateProduk,
  deleteProduk
};

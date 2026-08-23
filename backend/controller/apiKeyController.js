const crypto = require('crypto');
const { ApiKey } = require('../models');

const generateApiKey = async (req, res) => {
  try {
    const { label } = req.body;
    const userId = req.user.id;

    const randomKey = crypto.randomBytes(32).toString('hex');

    const newApiKey = await ApiKey.create({
      user_id: userId,
      api_key: randomKey,
      label: label || 'Default Key',
      is_active: true
    });

    return res.status(201).json({
      success: true,
      message: 'API key berhasil digenerate',
      data: newApiKey
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada server saat generate API key: ' + error.message,
      data: null
    });
  }
};

const getApiKeys = async (req, res) => {
  try {
    const userId = req.user.id;

    const apiKeys = await ApiKey.findAll({
      where: { user_id: userId },
      order: [['created_at', 'DESC']]
    });

    return res.status(200).json({
      success: true,
      message: 'Berhasil mengambil daftar API key',
      data: apiKeys
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada server saat mengambil API key: ' + error.message,
      data: null
    });
  }
};

const deleteApiKey = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const apiKey = await ApiKey.findOne({
      where: {
        id,
        user_id: userId
      }
    });

    if (!apiKey) {
      return res.status(404).json({
        success: false,
        message: 'API key tidak ditemukan atau bukan milik Anda',
        data: null
      });
    }

    await apiKey.destroy();

    return res.status(200).json({
      success: true,
      message: 'API key berhasil dihapus / direvoke',
      data: null
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada server saat menghapus API key: ' + error.message,
      data: null
    });
  }
};

module.exports = {
  generateApiKey,
  getApiKeys,
  deleteApiKey
};

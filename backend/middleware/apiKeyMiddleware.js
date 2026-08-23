const { ApiKey, User } = require('../models');

const apiKeyMiddleware = async (req, res, next) => {
  const apiKeyHeader = req.headers['x-api-key'];

  if (!apiKeyHeader) {
    return res.status(401).json({
      success: false,
      message: 'Header x-api-key diperlukan untuk mengakses endpoint ini',
      data: null
    });
  }

  try {
    const keyRecord = await ApiKey.findOne({
      where: {
        api_key: apiKeyHeader,
        is_active: true
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email', 'role']
        }
      ]
    });

    if (!keyRecord) {
      return res.status(401).json({
        success: false,
        message: 'API key tidak valid atau sudah tidak aktif',
        data: null
      });
    }

    // Update last_used_at
    keyRecord.last_used_at = new Date();
    await keyRecord.save();

    // Attach user & apiKey information to req
    req.apiKey = keyRecord;
    req.user = keyRecord.user;

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada server saat memverifikasi API key',
      data: null
    });
  }
};

module.exports = apiKeyMiddleware;

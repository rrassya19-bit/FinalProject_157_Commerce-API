const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, dan password wajib diisi',
        data: null
      });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email sudah terdaftar',
        data: null
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'seller'
    });

    const userResponse = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      created_at: newUser.created_at
    };

    return res.status(201).json({
      success: true,
      message: 'Registrasi berhasil',
      data: userResponse
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada server saat registrasi: ' + error.message,
      data: null
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email dan password wajib diisi',
        data: null
      });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email atau password salah',
        data: null
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Email atau password salah',
        data: null
      });
    }

    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET || 'commerceapi_secret_key',
      { expiresIn: process.env.JWT_EXPIRES || '1d' }
    );

    return res.status(200).json({
      success: true,
      message: 'Login berhasil',
      data: {
        user: payload,
        token
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada server saat login: ' + error.message,
      data: null
    });
  }
};

module.exports = {
  register,
  login
};

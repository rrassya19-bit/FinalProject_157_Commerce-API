module.exports = (sequelize, DataTypes) => {
  const Produk = sequelize.define('Produk', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    kategori_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    nama: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    deskripsi: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    harga: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      validate: {
        min: 0
      }
    },
    stok: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0
      }
    },
    sku: {
      type: DataTypes.STRING(50),
      allowNull: true,
      unique: true
    },
    gambar_url: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    berat: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(20),
      defaultValue: 'active'
    }
  }, {
    tableName: 'produk',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  Produk.associate = (models) => {
    Produk.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });
    Produk.belongsTo(models.Kategori, {
      foreignKey: 'kategori_id',
      as: 'kategori',
      onDelete: 'SET NULL'
    });
  };

  return Produk;
};

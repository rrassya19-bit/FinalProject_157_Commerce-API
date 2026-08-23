module.exports = (sequelize, DataTypes) => {
  const Kategori = sequelize.define('Kategori', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nama: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    deskripsi: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'kategori',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  Kategori.associate = (models) => {
    Kategori.hasMany(models.Produk, {
      foreignKey: 'kategori_id',
      as: 'produk',
      onDelete: 'SET NULL'
    });
  };

  return Kategori;
};

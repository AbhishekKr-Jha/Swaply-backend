export default (sequelize: any, DataType: any) => {
  const Product = sequelize.define(
    'Product',
    {
      id: {
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      deletedAt: {
        type: DataType.DATE,
        allowNull: true,
      },
    },
    {
      tableName: 'Product',
      timestamps: true,
    },
  );

  return Product;
};

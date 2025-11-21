export default (sequelize: any, DataType: any) => {
  const Offer = sequelize.define(
    'Offer',
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
      tableName: 'Offer',
      timestamps: true,
    },
  );

  return Offer;
};

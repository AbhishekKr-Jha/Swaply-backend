export default (sequelize: any, DataType: any) => {
  const Exchange = sequelize.define(
    'Exchange',
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
      tableName: 'Exchange',
      timestamps: true,
    },
  );

  return Exchange;
};

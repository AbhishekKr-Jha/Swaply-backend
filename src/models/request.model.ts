export default (sequelize: any, DataType: any) => {
  const Request = sequelize.define(
    'Request',
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
      tableName: 'Request',
      timestamps: true,
    },
  );

  return Request;
};

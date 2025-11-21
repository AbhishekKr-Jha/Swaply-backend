export default (sequelize: any, DataType: any) => {
  const Timelog = sequelize.define(
    'Timelog',
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
      tableName: 'Timelog',
      timestamps: true,
    },
  );

  return Timelog;
};

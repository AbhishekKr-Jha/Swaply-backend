export default (sequelize: any, DataType: any) => {
  const FinalReport = sequelize.define(
    'FinalReport',
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
      tableName: 'FinalReport',
      timestamps: true,
    },
  );

  return FinalReport;
};

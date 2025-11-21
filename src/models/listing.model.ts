export default (sequelize: any, DataType: any) => {
  const Listing = sequelize.define(
    'Listing',
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
      tableName: 'Listing',
      timestamps: true,
    },
  );

  return Listing;
};

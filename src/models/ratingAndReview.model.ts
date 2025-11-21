export default (sequelize: any, DataType: any) => {
  const RatingAndReview = sequelize.define(
    'RatingAndReview',
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
      tableName: 'RatingAndReview',
      timestamps: true,
    },
  );

  return RatingAndReview;
};

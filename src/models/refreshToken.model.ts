export default (sequelize: any, DataType: any) => {
  const RefreshToken = sequelize.define(
    'RefreshToken',
    {
      id: {
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      token: {
        type: DataType.STRING,
        allowNull: false,
      },
      userId: {
        type: DataType.INTEGER,
        allowNull: false,
      },
      ip: {
        type: DataType.STRING,
        allowNull: false,
      },
      userAgent: {
        type: DataType.STRING,
        allowNull: false,
      },
      maxDevice: {
        type: DataType.INTEGER,
        allowNull: false,
      },
      expiresAt: {
        type: DataType.DATE,
        allowNull: false,
      },
    },
    { tableName: 'RefreshToken', timestamps: true },
  );

  RefreshToken.associate = (models: any) => {
    RefreshToken.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
  };

  return RefreshToken;
};

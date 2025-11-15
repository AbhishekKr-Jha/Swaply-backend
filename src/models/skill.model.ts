export default (sequelize: any, DataType: any) => {
  const Skill = sequelize.define(
    'Skill',
    {
      id: {
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataType.STRING,
        allowNull: false,
      },
      description: {
        type: DataType.STRING,
        allowNull: true,
      },
      userId: {
        type: DataType.INTEGER,
        allowNull: false,
      },
      deletedAt: {
        type: DataType.DATE,
        allowNull: true,
      },
    },
    {
      tableName: 'Skill',
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ['userId', 'name'],
          name: 'unique_user_skill',
        },
      ],
    },
  );

  Skill.associate = (models: any) => {
    Skill.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });
  };

  return Skill;
};

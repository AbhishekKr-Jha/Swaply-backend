import { Sequelize } from 'sequelize';
import Env from './build_env';

export const sequelize = new Sequelize(Env.DB_NAME, Env.DB_USER, Env.DB_PASSWORD, {
  host: Env.DB_HOST || 'localhost',
  port: Env.DB_PORT || 3306,
  dialect: 'mysql',
  logging: false,
});

const db: any = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Setup associations
Object.values(db).forEach((model: any) => {
  if (model?.associate) {
    model.associate(db);
  }
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

export { connectDB, db };

import { Sequelize } from 'sequelize';
import { DataType } from 'sequelize-typescript';
import Env from './build_env';
import User from '../../models/user.model';
import Role from '../../models/role.model';
import Request from '../../models/request.model';
import Auditlog from '../../models/auditLog.model';
import Exchange from '../../models/exchange.model';
import FinalReport from '../../models/finalReport.model';
import Listing from '../../models/listing.model';
import Offer from '../../models/offer.model';
import Permission from '../../models/permission.model';
import PermissionGroup from '../../models/permissionGroup.model';
import Product from '../../models/product.model';
import RatingAndReview from '../../models/ratingAndReview.model';
import RefreshToken from '../../models/refreshToken.model';
import RolePermission from '../../models/rolePermission.model';
import Skill from '../../models/skill.model';
import Timelog from '../../models/timelog.model';
import UserPermission from '../../models/userPermission.model';

export const sequelize = new Sequelize(Env.DB_NAME, Env.DB_USER, Env.DB_PASSWORD, {
  host: Env.DB_HOST || 'localhost',
  port: Env.DB_PORT || 3306,
  dialect: 'mysql',
  logging: false,
});

const db: any = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.User = User(sequelize, DataType);
db.Role = Role(sequelize, DataType);
db.Request = Request(sequelize, DataType);
db.Auditlog = Auditlog(sequelize, DataType);
db.Exchange = Exchange(sequelize, DataType);
db.FinalReport = FinalReport(sequelize, DataType);
db.Listing = Listing(sequelize, DataType);
db.Offer = Offer(sequelize, DataType);
db.Permission = Permission(sequelize, DataType);
db.PermissionGroup = PermissionGroup(sequelize, DataType);
db.Product = Product(sequelize, DataType);
db.RatingAndReview = RatingAndReview(sequelize, DataType);
db.RefreshToken = RefreshToken(sequelize, DataType);
db.RolePermission = RolePermission(sequelize, DataType);
db.Skill = Skill(sequelize, DataType);
db.Timelog = Timelog(sequelize, DataType);
db.UserPermission = UserPermission(sequelize, DataType);

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

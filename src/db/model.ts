import { Model } from 'sequelize';

export class Doctor extends Model {
  declare username: string;
  declare password: string;
}

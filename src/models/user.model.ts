import { DataTypes, Model } from 'sequelize';
import db from '../db';
import Item from './item.model';

class User extends Model {
	declare id: number;
	declare items: string | null;
	declare threshold: number;
}

User.init(
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
		},
		items: {
			type: DataTypes.TEXT,
			defaultValue: null,
		},
		threshold: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
		},
	},
	{
		sequelize: db,
		modelName: 'User',
		tableName: 'users',
		timestamps: false,
	}
);

User.hasMany(Item, { foreignKey: 'userId', as: 'items' });

export default User;

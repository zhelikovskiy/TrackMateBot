import { DataTypes, Model } from 'sequelize';
import db from '../db';
import Item from './item.model';

class User extends Model {
	declare id: number;
	declare items: string | null;
}

User.init(
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
		},
	},
	{
		sequelize: db,
		modelName: 'User',
		tableName: 'users',
		timestamps: false,
	}
);

User.hasMany(Item, {
	foreignKey: 'userId',
	as: 'items',
});
Item.belongsTo(User, {
	foreignKey: 'userId',
	as: 'user',
});

export default User;

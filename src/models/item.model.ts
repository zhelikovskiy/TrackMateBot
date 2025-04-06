import { DataTypes, Model } from 'sequelize';
import db from '../db';
import User from './user.model';

class Item extends Model {
	declare id: number;
	declare url: string;
	declare name: string;
	declare lastPrice: number;
	declare store: string;
	declare userId: number;
}

Item.init(
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
		},
		url: {
			type: DataTypes.TEXT,
			defaultValue: null,
		},
		name: {
			type: DataTypes.TEXT,
			defaultValue: null,
		},
		lastPrice: {
			type: DataTypes.FLOAT,
			defaultValue: 0.0,
		},
		store: {
			type: DataTypes.TEXT,
			defaultValue: null,
		},
		userId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: User,
				key: 'id',
			},
		},
	},
	{
		sequelize: db,
		modelName: 'Item',
		tableName: 'items',
		timestamps: false,
	}
);

Item.belongsTo(User, { foreignKey: 'userId', as: 'user' });

export default Item;

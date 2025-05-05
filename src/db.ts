import { Sequelize } from 'sequelize';
import Item from './models/item.model';
import User from './models/user.model';

const db = new Sequelize({
	dialect: 'sqlite',
	storage: './database.sqlite',
	logging: false,
});

// const db = new Sequelize({
// 	dialect: 'sqlite',
// 	storage: ':memory:',
// 	logging: false,
// });

export default db;

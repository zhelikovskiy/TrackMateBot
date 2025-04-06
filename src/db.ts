import { Sequelize } from 'sequelize';

// const db = new Sequelize({
// 	dialect: 'sqlite',
// 	storage: './database.sqlite',
// 	logging: console.log,
// });

const db = new Sequelize({
	dialect: 'sqlite',
	storage: ':memory:',
});

export default db;

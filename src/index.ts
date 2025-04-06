import bot from './bot/bot';
import db from './db';

const start = async () => {
	try {
		db.authenticate().then(() => {
			db.sync({ force: true }).then(() => {
				console.log('Database connected');
				bot.launch();
				console.log('Bot started');
			});
		});
	} catch (err) {
		console.error('Bot error:', err);
	}
};

start();

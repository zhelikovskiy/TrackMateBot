import * as dotenv from 'dotenv';

dotenv.config();

export const env = {
	botToken: process.env.BOT_TOKEN || '',
};

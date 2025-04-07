import { Telegraf } from 'telegraf';
import { env } from './../configs/env.config';
import axios from 'axios';
import puppeteer from 'puppeteer';

const bot = new Telegraf(env.botToken);

bot.start((ctx) => ctx.reply('Welcome!'));

bot.command('/check', async (ctx) => {});
bot.command('/track', async (ctx) => {});
bot.command('/list', async (ctx) => {});
bot.command('/remove', async (ctx) => {});
bot.command('/threshold', async (ctx) => {});
bot.command('//update', async (ctx) => {});

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

export default bot;

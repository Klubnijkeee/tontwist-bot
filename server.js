const { Telegraf, Markup } = require('telegraf');
const express = require('express');
const path = require('path');
const app = express();
const bot = new Telegraf('YOUR_API_TOKEN');

let userBets = {};

bot.start((ctx) => {
  ctx.reply('Добро пожаловать! Нажмите кнопку ниже, чтобы сделать ставку и подбросить монетку.', Markup.inlineKeyboard([
    [Markup.button.callback('Сделать ставку', 'start_bet')]
  ]));
});

bot.action('start_bet', (ctx) => {
  ctx.reply('Выберите ставку:', Markup.inlineKeyboard([
    [Markup.button.callback('Орёл', 'bet_heads')],
    [Markup.button.callback('Решка', 'bet_tails')]
  ]));
});

bot.action(['bet_heads', 'bet_tails'], (ctx) => {
  const userId = ctx.from.id;
  const bet = ctx.match.input.split('_')[1];
  userBets[userId] = bet;
  ctx.reply(`Ты поставил на ${bet}. Подбросить монетку?`, Markup.inlineKeyboard([
    [Markup.button.callback('Подбросить монетку', 'flip_coin')]
  ]));
});

bot.action('flip_coin', (ctx) => {
  const userId = ctx.from.id;
  const result = Math.random() < 0.5 ? 'Орёл' : 'Решка';
  const bet = userBets[userId];

  if (bet) {
    if (bet === result) {
      ctx.reply(`Выпало: ${result}. Ты выиграл!`);
    } else {
      ctx.reply(`Выпало: ${result}. Ты проиграл.`);
    }
  } else {
    ctx.reply(`Выпало: ${result}. Ставка не найдена.`);
  }
});

bot.launch();

app.use(express.static(path.join(__dirname, 'webapp')));

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
const { Telegraf, Markup } = require('telegraf');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const bot = new Telegraf('YOUR_API_TOKEN');

let userBets = {};

bot.start((ctx) => {
  ctx.reply('Добро пожаловать! Нажмите кнопку ниже, чтобы сделать ставку и подбросить монетку.', Markup.inlineKeyboard([
    [Markup.button.callback('Сделать ставку', 'start_bet')]
  ]));
});

bot.action('start_bet', (ctx) => {
  ctx.reply('Выберите ставку и исход события в мини-приложении.');
});

app.use(express.static(path.join(__dirname, 'webapp')));
app.use(bodyParser.json());

app.post('/webapp-data', (req, res) => {
  const { userId, bet } = req.body;
  userBets[userId] = bet;
  res.sendStatus(200);
});

bot.on('web_app_data', (ctx) => {
  const userId = ctx.from.id;
  const bet = JSON.parse(ctx.message.web_app_data.data);
  const result = bet.result;
  const choice = bet.choice;
  const amount = bet.amount;

  if (choice === result) {
    ctx.reply(`Выпало: ${result}. Ты выиграл ${amount} TON!`);
  } else {
    ctx.reply(`Выпало: ${result}. Ты проиграл ${amount} TON.`);
  }
});

bot.launch();

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

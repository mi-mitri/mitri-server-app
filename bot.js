const { Telegraf } = require('telegraf');
require('dotenv').config();

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => {
  ctx.reply('Welcome to the MiniApp! Click the button below to start using the app:', {
    reply_markup: {
      inline_keyboard: [[
        { text: "Open MiniApp", web_app: { url: "https://mitri-test.netlify.app/" } }
      ]]
    }
  });
});

bot.telegram.setMyCommands([
  { command: 'open', description: 'Open MiniApp', web_app: { url: 'https://mitri-test.netlify.app/' } }
]);

module.exports = bot;



// https://192.168.0.188:3000
// 6373456937:AAGYZz2FlvzjJQI6hpf26hUQYJkKX7ByHeA
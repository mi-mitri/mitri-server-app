const { Telegraf } = require('telegraf');

const bot = new Telegraf('6373456937:AAGYZz2FlvzjJQI6hpf26hUQYJkKX7ByHeA');

// Команда /start, которая приветствует пользователя и отправляет ссылку на мини-приложение
bot.start((ctx) => {
  ctx.reply('Welcome to the MiniApp! Click the link below to start using the app:', {
    reply_markup: {
      inline_keyboard: [[
        { text: "Open MiniApp", url: "http://192.168.1.16:3000" }
      ]]
    }
  });
});

module.exports = bot;

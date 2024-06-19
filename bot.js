const { Telegraf } = require('telegraf');
const express = require('express');

const bot = new Telegraf('6373456937:AAGYZz2FlvzjJQI6hpf26hUQYJkKX7ByHeA');

// Команда /start, которая приветствует пользователя и отправляет ссылку на мини-приложение
bot.start((ctx) => {
  ctx.reply('Welcome to the MiniApp! Click the button below to start using the app:', {
    reply_markup: {
      inline_keyboard: [[
        { text: "Open MiniApp", web_app: { url: "https://mitri-test.netlify.app/" } }
      ]]
    }
  });
});

// Установка кнопки Web App в меню
bot.telegram.setMyCommands([
  { command: 'open', description: 'Open MiniApp', web_app: { url: 'https://mitri-test.netlify.app/' } }
]);

// Запуск бота
bot.launch()
  .then(() => console.log('Bot is running...'))
  .catch(err => console.error('Failed to launch bot', err));

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

module.exports = bot;


// https://192.168.0.188:3000
// 6373456937:AAGYZz2FlvzjJQI6hpf26hUQYJkKX7ByHeA
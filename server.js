const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const bot = require('./bot');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Настройка Socket.IO
io.on('connection', (socket) => {
  console.log('New client connected');
  socket.emit('initialData', { coinRate: 100 });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Использование ngrok для публичного URL (замените на ваш URL)
const NGROK_URL = 'https://f109-91-132-95-56.ngrok-free.app';

// Настройка webhook для бота
bot.telegram.setWebhook(`${NGROK_URL}/webhook-path`);

// Обработка обновлений от Telegram
app.use(bot.webhookCallback('/webhook-path'));

// Запуск сервера
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  bot.launch().then(() => {
    console.log('Bot is running...');
  });
});


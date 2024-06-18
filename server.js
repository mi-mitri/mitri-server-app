const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const bodyParser = require('body-parser');
const cors = require('cors');
const bot = require('./bot');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3001;

app.use(bot.webhookCallback('/webhook-path'));

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  // Введите ваш URL вручную после запуска ngrok
  const ngrokUrl = 'https://b6fb-2a03-f80-4416-1f1a-00-1.ngrok-free.app'; // Замените на ваш URL
  bot.telegram.setWebhook(`${ngrokUrl}/webhook-path`)
    .then(() => {
      console.log(`Webhook set to ${ngrokUrl}/webhook-path`);
      // bot.launch() вызывается в bot.js, его не нужно вызывать здесь
    })
    .catch(err => console.error('Failed to set webhook or launch bot', err));
});

// Обработка соединений через Socket.io
io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

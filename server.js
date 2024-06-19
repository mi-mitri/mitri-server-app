const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const bodyParser = require('body-parser');
const cors = require('cors');
const bot = require('./bot');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());
app.use(cors());

const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3001;

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
});

pool.connect((err) => {
  if (err) {
    console.error('Error connecting to the database', err);
  } else {
    console.log('Connected to the database');
  }
});

app.post('/get-user-data', (req, res) => {
  const { userId } = req.body;
  pool.query('SELECT * FROM users WHERE telegram_id = $1', [userId], (error, results) => {
    if (error) {
      console.error('Error fetching user data', error);
      res.status(500).send('Error fetching user data');
    } else {
      if (results.rows.length === 0) {
        const initData = req.body;
        pool.query(
          'INSERT INTO users (telegram_id, username, first_name, last_name, coins, coin_rate, energy, max_energy) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
          [initData.user.id, initData.user.username, initData.user.first_name, initData.user.last_name, 0, 0, 1000, 1000],
          (insertError, insertResults) => {
            if (insertError) {
              console.error('Error inserting user data', insertError);
              res.status(500).send('Error inserting user data');
            } else {
              res.json(insertResults.rows[0]);
            }
          }
        );
      } else {
        res.json(results.rows[0]);
      }
    }
  });
});

app.post('/save-progress', (req, res) => {
  const { userId, coins, coinRate, energy, maxEnergy, upgrades } = req.body;
  pool.query(
    'INSERT INTO users (telegram_id, coins, coin_rate, energy, max_energy, upgrades) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (telegram_id) DO UPDATE SET coins = $2, coin_rate = $3, energy = $4, max_energy = $5, upgrades = $6',
    [userId, coins, coinRate, energy, maxEnergy, JSON.stringify(upgrades)],
    (error, results) => {
      if (error) {
        console.error('Error saving user data', error);
        res.status(500).send('Error saving user data');
      } else {
        res.sendStatus(200);
      }
    }
  );
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});


// const express = require('express');
// const http = require('http');
// const socketIo = require('socket.io');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const bot = require('./bot');

// const app = express();
// app.use(bodyParser.json());
// app.use(cors());

// const server = http.createServer(app);
// const io = socketIo(server);

// const PORT = process.env.PORT || 3001;

// app.use(bot.webhookCallback('/webhook-path'));

// const { Pool } = require('pg');
// require('dotenv').config();

// const pool = new Pool({
//   user: process.env.DB_USER,
//   host: '83.166.239.183',
//   database: process.env.DB_NAME,
//   password: process.env.DB_PASSWORD,
//   port: process.env.DB_PORT || 5432,
// });

// pool.connect((err) => {
//   if (err) {
//     console.error('Error connecting to the database', err);
//   } else {
//     console.log('Connected to the database');
//   }
// });

// module.exports = pool;


// // Эндпоинт для получения данных пользователя
// app.post('/get-user-data', (req, res) => {
//   const { userId } = req.body;
//   bot.telegram.getChat(userId)
//     .then(user => {
//       res.json({ username: user.username, first_name: user.first_name, last_name: user.last_name });
//     })
//     .catch(err => {
//       console.error('Failed to get user data', err);
//       res.status(500).send('Failed to get user data');
//     });
// });

// server.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
//   // Введите ваш URL вручную после запуска ngrok
//   const ngrokUrl = 'https://6b07-91-132-95-56.ngrok-free.app'; // Замените на ваш URL
//   bot.telegram.setWebhook(`${ngrokUrl}/webhook-path`)
//     .then(() => {
//       console.log(`Webhook set to ${ngrokUrl}/webhook-path`);
//       // bot.launch() вызывается в bot.js, его не нужно вызывать здесь
//     })
//     .catch(err => console.error('Failed to set webhook or launch bot', err));
// });

// // Обработка соединений через Socket.io
// io.on('connection', (socket) => {
//   console.log('New client connected');

//   socket.on('disconnect', () => {
//     console.log('Client disconnected');
//   });
// });


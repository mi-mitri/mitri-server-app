const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'postgres',
});

const User = sequelize.define('User', {
  telegram_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    unique: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  first_name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  last_name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  coins: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  coin_rate: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  energy: {
    type: DataTypes.INTEGER,
    defaultValue: 1000,
  },
  max_energy: {
    type: DataTypes.INTEGER,
    defaultValue: 1000,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

sequelize.sync().then(() => {
  console.log('Database & tables created!');
});

module.exports = { sequelize, User };


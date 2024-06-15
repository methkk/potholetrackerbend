const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Sequelize, DataTypes } = require('sequelize');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(cors({
  origin: 'https://methkk.github.io',
  methods: ['GET', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type'],
}));

// Connect to PostgreSQL using Sequelize
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  protocol: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});

// Define models
const Pin = sequelize.define('Pin', {
  latitude: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  longitude: {
    type: DataTypes.FLOAT,
    allowNull: false
  }
});

const Record = sequelize.define('Record', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  latitude: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  longitude: {
    type: DataTypes.FLOAT,
    allowNull: false
  }
});

// Sync models with database
sequelize.sync().then(() => console.log('Database synced')).catch(err => console.error('Database sync error:', err));

// Routes
app.post('/pin', (req, res) => {
  const { latitude, longitude } = req.body;
  Pin.create({ latitude, longitude })
    .then(pin => res.status(201).json(pin))
    .catch(err => res.status(500).json({ error: err.message }));
});

app.get('/pins', (req, res) => {
  Pin.findAll()
    .then(pins => res.json(pins))
    .catch(err => res.status(500).json({ error: err.message }));
});

app.delete('/pin/:id', (req, res) => {
  const { id } = req.params;
  Pin.destroy({ where: { id } })
    .then(() => res.status(200).send())
    .catch(err => res.status(404).json({ error: err.message }));
});

app.post('/submit-form', (req, res) => {
  const { name, email, latitude, longitude } = req.body;
  if (name && email && latitude && longitude) {
    Record.create({ name, email, latitude, longitude })
      .then(record => res.status(201).json(record))
      .catch(err => res.status(500).json({ error: err.message }));
  } else {
    res.status(400).send('All fields are required.');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});




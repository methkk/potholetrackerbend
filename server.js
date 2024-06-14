const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import the cors middleware
const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use(bodyParser.json());

app.use(cors({
  origin: 'https://methkk.github.io', // Allow requests from this origin
  methods: ['GET', 'POST', 'DELETE'], // Allow specified HTTP methods
  allowedHeaders: ['Content-Type'], // Allow specified headers

}));
let pins = [];
let users = [];

app.post('/pin', (req, res) => {
  const { latitude, longitude } = req.body;
  const newPin = { id: Date.now(), latitude, longitude };  // Use a timestamp as a unique ID
  pins.push(newPin);
  res.status(201).json(newPin);
});

app.get('/pins', (req, res) => {
  res.json(pins);
});

app.delete('/pin/:id', (req, res) => {
  const { id } = req.params;
  const pinIndex = pins.findIndex(pin => pin.id == id);
  if (pinIndex > -1) {
    pins.splice(pinIndex, 1);
    res.status(200).send();
  } else {
    res.status(404).send();
  }
});

// Endpoint to handle user form submission
app.post('/submit-form', (req, res) => {
  const { name, email } = req.body;
  if (name && email) {
    // Assuming you want to store user data
    const newUser = { id: Date.now(), name, email };
    users.push(newUser);
    res.status(201).json(newUser);
  } else {
    res.status(400).send('Name and email are required.');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

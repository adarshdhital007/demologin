const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const BASE_URL=process.env.BASE_URL;


const mongodbUri = process.env.MONGODB_URI;

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: '*'
}));

mongoose.connect(mongodbUri, { // Use the variable directly, not in quotes
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const UserModel = mongoose.model('User', userSchema);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/submit', async (req, res) => {
  const { username, password } = req.body;

  try {
    const newUser = new UserModel({
      username,
      password,
    });

    await newUser.save();

    res.json({ message: 'User saved successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

require('dotenv').config();
const express = require('express');
const cors = require('cors');

const jovaAiRoute = require('./routes/jova-ai');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('JOVA AI backend en ligne ✅');
});

app.use('/api/jova-ai', jovaAiRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`JOVA AI backend démarré sur le port ${PORT}`);
});

require('dotenv').config({ path: __dirname + '/.env' });
const express = require('express');
const cors = require('cors');
const commandRoutes = require('./routes/command');
const weatherRoutes = require('./routes/weather');
const systemRoutes = require('./routes/system');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json({ limit: '10mb' }));

app.use('/api/command', commandRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/system', systemRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
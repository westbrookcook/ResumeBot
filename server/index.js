const express = require('express');
const cors = require('cors');
require('dotenv').config();

const resumeRoutes = require('./routes/resume');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/resume', resumeRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'ResumeBot API is running!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
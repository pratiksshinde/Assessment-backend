const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
require('./models/index'); 
require('dotenv').config();
const rateLimit = require('express-rate-limit');

const PORT = process.env.PORT || 4000;
const app = express();

app.use(cors());                  
app.use(express.json());
app.use('/api', rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));


const authRoutes = require('./routes/authRoutes');
const dealRoutes = require('./routes/dealRoutes');
const investmentRoutes = require('./routes/investmentRoutes');
const profileRoutes = require('./routes/profileRoutes');

app.use('/api/auth', authRoutes);
app.use('/api', dealRoutes);
app.use('/api', investmentRoutes);
app.use('/api', profileRoutes);


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Internal server error' });
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

connectDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');  // Import connectDB from db.js

const userRoutes = require('./routes/userRoutes');
const ticketRoutes = require('./routes/ticketRoutes');

// Load environment variables from .env
dotenv.config();

// Connect to MongoDB (this calls the function from db.js)
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Your app's routes
app.use('/api/users', userRoutes);
app.use('/api/tickets', ticketRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.get('/', (req, res) => {
  res.send('API is running...');
});

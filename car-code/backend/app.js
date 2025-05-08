const express = require("express");
require("dotenv").config();
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const codeRoutes = require('./routes/codeRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const slotRoutes = require('./routes/slotRoutes');
const mechanicRoutes = require('./routes/mechanicRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const partRoutes = require('./routes/partRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
//init App
const app = express();
// Connect to MongoDB
connectDB();



app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173', // السماح للفرونت
    credentials: true,               // السماح بإرسال الكوكيز
  }));
app.use('/uploads', express.static('uploads'));
app.use('/api/auth', authRoutes);
app.use('/api/codes', codeRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/slots',slotRoutes);
app.use('/api/users',userRoutes);
app.use('/api/parts', partRoutes);
app.use('/api/mechanic', mechanicRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);



const PORT = process.env.PORT||8000;
app.listen(PORT,()=> console.log(`Server is running on http://localhost:${PORT}`));

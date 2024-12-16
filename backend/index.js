require('dotenv').config();
const cron = require('node-cron');
const nodemailer = require('nodemailer');
const Bill = require('./models/Bill');
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');


const app = express();
connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/income', require('./routes/income'));
app.use('/api/expenses', require('./routes/expense'));
app.use('/api/bills', require('./routes/bill'));



// Configure nodemailer
const transporter = nodemailer.createTransport({
  service: 'Gmail', // Update to your email provider
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Check and send notifications for bills due in one week
cron.schedule('0 0 * * *', async () => { // Runs every day at midnight
  try {
    const oneWeekLater = new Date();
    oneWeekLater.setDate(oneWeekLater.getDate() + 7);

    const upcomingBills = await Bill.find({
      dueDate: {
        $gte: new Date(),
        $lte: oneWeekLater,
      },
    });

    if (upcomingBills.length > 0) {
      const emailText = upcomingBills
        .map(bill => `Bill: ${bill.name}, Amount: $${bill.amount.toFixed(2)}, Due Date: ${bill.dueDate.toLocaleDateString()}`)
        .join('\n');

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: process.env.USER_EMAIL, // your email address
        subject: 'Upcoming Bills Due in 1 Week',
        text: `You have the following bills due in one week:\n\n${emailText}`,
      });

      console.log('Reminder email sent.');
    }
  } catch (error) {
    console.error('Error sending bill reminder:', error);
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

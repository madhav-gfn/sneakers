import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './src/config/db.js';
import productRoutes from './src/routes/productRoutes.js';
import { sendOrderConfirmationEmail, sendDeclinedTransactionEmail } from './src/utils/emailService.js';

// Connect to MongoDB
connectDB().catch(console.error);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// API routes
app.use('/api/products', productRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Handle order confirmation emails
app.post('/api/send-email', async (req, res) => {
  try {
    const { type, data } = req.body;
    
    if (!data || !data.email) {
      return res.status(400).json({ error: 'Missing required email data' });
    }

    console.log(`Processing ${type} email for order #${data.orderNumber}`);
    let result;
    
    if (type === 'confirmation') {
      result = await sendOrderConfirmationEmail(data);
    } else if (type === 'declined') {
      result = await sendDeclinedTransactionEmail(data);
    } else {
      return res.status(400).json({ error: 'Invalid email type' });
    }

    if (result.success) {
      console.log(`Email sent successfully: ${result.messageId}`);
      res.json({ success: true, messageId: result.messageId });
    } else {
      console.error(`Email sending failed: ${result.error}`);
      res.status(500).json({ error: result.error });
    }
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  // Close server & exit process
  server.close(() => process.exit(1));
});

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
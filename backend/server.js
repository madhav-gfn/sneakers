import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import connectDB from './src/config/db.js';
import productRoutes from './src/routes/productRoutes.js';
import cartRoutes from './src/routes/cartRoutes.js';
import { sendOrderConfirmationEmail, sendDeclinedTransactionEmail } from './src/utils/emailService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Connect to MongoDB
connectDB().catch(console.error);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: [
    'https://sneakers-nu-six.vercel.app',
    'http://localhost:5173',
    'https://sneakers-eight.vercel.app'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
}));
app.use(express.json());

// Handle OPTIONS method for CORS pre-flight
app.options('*', cors());

// Test route for debugging
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);

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

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  // Serve static files from the dist directory
  app.use(express.static(join(__dirname, 'dist')));

  // Handle all other routes by serving the index.html
  app.get('*', (req, res) => {
    if (req.url.startsWith('/api')) {
      res.status(404).json({ message: 'API route not found' });
    } else {
      res.sendFile(join(__dirname, 'dist', 'index.html'));
    }
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    mongoose.connection.close(false, () => {
      console.log('MongoDB connection closed');
      process.exit(0);
    });
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    mongoose.connection.close(false, () => {
      console.log('MongoDB connection closed');
      process.exit(0);
    });
  });
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  server.close(() => {
    mongoose.connection.close(false, () => {
      process.exit(1);
    });
  });
});
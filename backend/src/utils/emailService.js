import nodemailer from 'nodemailer';

// Create Nodemailer transporter using Mailtrap Live SMTP
const transporter = nodemailer.createTransport({
  host: process.env.MAILTRAP_HOST,
  port: process.env.MAILTRAP_PORT,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS
  },
  secure: false,
  requireTLS: true
});

// Email template for approved transactions
const getApprovedEmailTemplate = (data) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
    <h2 style="color: #2c3e50;">Order Confirmation - #${data.orderNumber}</h2>
    <p>Dear ${data.customerName},</p>
    <p>Thank you for your purchase! Your order has been confirmed and is being processed.</p>
    
    <div style="background-color: #f8f9fa; padding: 15px; margin: 20px 0; border-radius: 5px;">
      <h3 style="color: #2c3e50;">Order Details</h3>
      <p><strong>Order Number:</strong> ${data.orderNumber}</p>
      <p><strong>Product:</strong> ${data.productName}</p>
      <p><strong>Quantity:</strong> ${data.quantity}</p>
      <p><strong>Total Amount:</strong> $${data.totalAmount}</p>
    </div>

    <div style="margin-top: 20px;">
      <h3 style="color: #2c3e50;">Shipping Information</h3>
      <p>${data.shippingAddress}</p>
    </div>

    <p style="margin-top: 20px;">We'll send you another email when your order ships.</p>
    <p>If you have any questions, please don't hesitate to contact our support team.</p>
    
    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
      <p style="color: #666;">Thank you for shopping with us!</p>
      <p style="color: #666;">The Sneaker Store Team</p>
    </div>
  </div>
`;

// Email template for declined transactions
const getDeclinedEmailTemplate = (data) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
    <h2 style="color: #e74c3c;">Transaction Declined - Order #${data.orderNumber}</h2>
    <p>Dear ${data.customerName},</p>
    <p>We regret to inform you that your recent transaction was declined.</p>
    
    <div style="background-color: #f8f9fa; padding: 15px; margin: 20px 0; border-radius: 5px;">
      <h3 style="color: #2c3e50;">Transaction Details</h3>
      <p><strong>Order Number:</strong> ${data.orderNumber}</p>
      <p><strong>Product:</strong> ${data.productName}</p>
      <p><strong>Amount:</strong> $${data.totalAmount}</p>
    </div>

    <div style="margin-top: 20px;">
      <h3 style="color: #2c3e50;">Next Steps</h3>
      <ul>
        <li>Please verify your payment information</li>
        <li>Ensure you have sufficient funds</li>
        <li>Try the purchase again</li>
      </ul>
    </div>

    <p style="margin-top: 20px;">If you continue to experience issues, please contact our support team at support@sneakerstore.com</p>
    
    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
      <p style="color: #666;">We apologize for any inconvenience.</p>
      <p style="color: #666;">The Sneaker Store Team</p>
    </div>
  </div>
`;

// Function to send order confirmation email
export const sendOrderConfirmationEmail = async (data) => {
  try {
    const mailOptions = {
      from: '"Sneaker Store" <noreply@sneakerstore.com>',
      to: data.email,
      subject: `Order Confirmation - #${data.orderNumber}`,
      html: getApprovedEmailTemplate(data)
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    return { success: false, error: error.message };
  }
};

// Function to send declined transaction email
export const sendDeclinedTransactionEmail = async (data) => {
  try {
    const mailOptions = {
      from: '"Sneaker Store" <noreply@sneakerstore.com>',
      to: data.email,
      subject: `Transaction Declined - Order #${data.orderNumber}`,
      html: getDeclinedEmailTemplate(data)
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending declined email:', error);
    return { success: false, error: error.message };
  }
};
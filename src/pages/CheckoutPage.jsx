import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

function CheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    quantity = 1, 
    variant = 'Black',
    productId = 1,
    name = "Converse Chuck 70 Hi",
    price = 85.00
  } = location.state || {};

  const total = price * quantity;

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const sendEmail = async (type, orderData) => {
    try {
      const response = await fetch('http://localhost:3001/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type,
          data: {
            orderNumber: orderData.orderNumber,
            customerName: orderData.fullName,
            email: orderData.email,
            productName: name,
            quantity: quantity,
            totalAmount: total,
            shippingAddress: `${orderData.address}, ${orderData.city}, ${orderData.state} ${orderData.zipCode}`
          }
        })
      });

      if (!response.ok) {
        console.error('Failed to send email');
      }
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };
  const simulateTransaction = () => {
    // Always return approved for successful transactions
    return 'approved';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const orderNumber = `ORD-${Date.now()}`;
    const transactionOutcome = simulateTransaction();
    
    const orderData = {
      ...formData,
      orderNumber,
      items: [{
        productId,
        name,
        variant,
        price,
        quantity,
        total
      }]
    };

    switch (transactionOutcome) {
      case 'approved':
        await sendEmail('confirmation', orderData);
        navigate('/thank-you', { state: { orderData } });
        break;
      
      case 'declined':
        await sendEmail('declined', orderData);
        alert('Transaction declined. Please check your payment details and try again.');
        break;
      
      case 'error':
        alert('An error occurred while processing your payment. Please try again later.');
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm fixed w-full top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center space-x-4">
              <Link to="/">
                <img src="/src/assets/logo.jpg" alt="Sneaker Store Logo" className="h-12 w-auto rounded-lg" />
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
            </div>
            <Link to="/" className="text-gray-700 hover:text-gray-900 font-medium">
              Continue Shopping
            </Link>
          </div>
        </nav>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Checkout</h1>
          
          <div className="bg-white shadow-sm rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
            <div className="border-b border-gray-200 pb-6 mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">{name} ({variant})</span>
                <span className="text-gray-900">${price.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Quantity</span>
                <span className="text-gray-900">{quantity}</span>
              </div>
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="bg-white shadow-sm rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-6">Shipping Information</h2>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <input
                  type="text"
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">City</label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">State</label>
                  <input
                    type="text"
                    name="state"
                    required
                    value={formData.state}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">ZIP Code</label>
                <input
                  type="text"
                  name="zipCode"
                  required
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            <h2 className="text-xl font-semibold mt-8 mb-6">Payment Information</h2>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Card Number</label>
                <input
                  type="text"
                  name="cardNumber"
                  required
                  value={formData.cardNumber}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="**** **** **** ****"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>                  <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
                  <input
                    type="month"
                    name="expiryDate"
                    required
                    min={new Date().toISOString().slice(0, 7)}
                    value={formData.expiryDate}
                    onChange={(e) => {
                      const selectedDate = new Date(e.target.value);
                      const currentDate = new Date();
                      if (selectedDate < currentDate) {
                        alert('Please select a future date for card expiry');
                        return;
                      }
                      handleInputChange(e);
                    }}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">CVV</label>
                  <input
                    type="text"
                    name="cvv"
                    required
                    maxLength="3"
                    value={formData.cvv}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="123"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="mt-8 w-full bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Complete Purchase
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;

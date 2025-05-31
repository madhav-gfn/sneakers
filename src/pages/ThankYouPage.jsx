import React from 'react';
import { Link } from 'react-router-dom';

function ThankYouPage() {
  return (
    <div className="container mx-auto px-4">      <header className="bg-white shadow-sm fixed w-full top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center space-x-4">
              <Link to="/">
                <img src="/src/assets/logo.jpg" alt="Sneaker Store Logo" className="h-12 w-auto rounded-lg" />
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Order Confirmed</h1>
            </div>
            <Link to="/" className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
              Continue Shopping
            </Link>
          </div>
        </nav>
      </header>      <main className="pt-32 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white p-8 md:p-12 rounded-2xl shadow-lg">
            <div className="text-center mb-10">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Thank You for Your Order!</h1>
              <p className="text-lg text-gray-600">Your order has been successfully processed and confirmed.</p>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Details</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Order Number</p>
                  <p className="text-lg font-medium text-gray-900">#{new Date().getTime().toString().slice(-6)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Order Date</p>
                  <p className="text-lg font-medium text-gray-900">{new Date().toLocaleDateString('en-US', { 
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Estimated Delivery</p>
                  <p className="text-lg font-medium text-gray-900">{new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Shipping Method</p>
                  <p className="text-lg font-medium text-gray-900">Express Delivery</p>
                </div>
              </div>
            </div>

            <div className="text-center space-y-4">
              <p className="text-gray-600">A confirmation email has been sent to your email address.</p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link to="/" 
                  className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-colors">
                  Continue Shopping
                </Link>
                <button
                  className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                  Track Order
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>      <footer className="bg-white border-t mt-auto">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <img src="/src/assets/logo.jpg" alt="Sneaker Store Logo" className="h-8 w-auto rounded" />
              <p className="text-gray-600">&copy; {new Date().getFullYear()} Sneaker Store. All rights reserved.</p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-600 hover:text-gray-900">Privacy Policy</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">Terms of Service</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default ThankYouPage;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCart, clearCart } from '../services/cartApi';

function CartPage() {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const sessionId = 'user123'; // In a real app, this would come from auth/session

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      setLoading(true);
      const cartData = await getCart(sessionId);
      setCart(cartData);
      setLoading(false);
    } catch (err) {
      setError('Failed to load cart');
      setLoading(false);
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCart(sessionId);
      setCart({ items: [] });
    } catch (err) {
      setError('Failed to clear cart');
    }
  };

  const calculateTotal = () => {
    return cart.items.reduce((sum, item) => sum + item.total, 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-xl">{error}</p>
          <button 
            onClick={loadCart} 
            className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm fixed w-full top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center space-x-4">
              <Link to="/">
                <img src="/src/assets/logo.jpg" alt="Sneaker Store Logo" className="h-12 w-auto rounded-lg" />
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
            </div>
            <Link to="/" className="text-gray-700 hover:text-gray-900 font-medium">
              Continue Shopping
            </Link>
          </div>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {cart.items.length === 0 ? (
            <div className="p-8 text-center">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your cart is empty</h2>
              <p className="text-gray-600 mb-6">Add some products to your cart and they will show up here</p>
              <Link 
                to="/"
                className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <>
              <div className="p-6">
                <div className="flow-root">
                  <ul className="-my-6 divide-y divide-gray-200">
                    {cart.items.map((item) => (
                      <li key={`${item.productId}-${item.variant}`} className="py-6 flex">
                        <div className="flex-shrink-0 w-24 h-24 border border-gray-200 rounded-md overflow-hidden">
                          <img
                            src="/src/assets/converse.jpg"
                            alt={item.name}
                            className="w-full h-full object-center object-cover"
                          />
                        </div>

                        <div className="ml-4 flex-1 flex flex-col">
                          <div>
                            <div className="flex justify-between text-base font-medium text-gray-900">
                              <h3>{item.name}</h3>
                              <p className="ml-4">${item.total.toFixed(2)}</p>
                            </div>
                            <p className="mt-1 text-sm text-gray-500">{item.variant}</p>
                          </div>
                          <div className="flex-1 flex items-end justify-between text-sm">
                            <p className="text-gray-500">Qty {item.quantity}</p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="border-t border-gray-200 px-6 py-4">
                <div className="flex justify-between text-base font-medium text-gray-900">
                  <p>Subtotal</p>
                  <p>${calculateTotal().toFixed(2)}</p>
                </div>
                <p className="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
                <div className="mt-6 flex justify-between">
                  <Link
                    to="/checkout"
                    state={{ items: cart.items, total: calculateTotal() }}
                    className="flex-1 mr-4 bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 transition-colors"
                  >
                    Checkout
                  </Link>
                  <button
                    onClick={handleClearCart}
                    className="flex-none border border-gray-300 rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Clear Cart
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default CartPage;
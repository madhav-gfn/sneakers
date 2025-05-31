import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchProducts } from '../services/api';
import converseImg from '../assets/converse.jpg';

function LandingPage() {
  const [productsData, setProductsData] = useState({ products: [], currentPage: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState({});

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async (page = 1) => {
    try {
      setLoading(true);
      const data = await fetchProducts(page);
      setProductsData(data);
      
      // Initialize selected products with fetched data
      const initialSelected = data.products.reduce((acc, product) => ({
        ...acc,
        [product._id]: { quantity: 1, variant: product.defaultVariant }
      }), {});
      setSelectedProducts(initialSelected);
      
      setLoading(false);
    } catch (err) {
      setError('Failed to load products. Please try again later.');
      setLoading(false);
    }
  };

  const handleQuantityChange = (productId, quantity) => {
    setSelectedProducts(prev => ({
      ...prev,
      [productId]: { ...prev[productId], quantity }
    }));
  };

  const handleVariantChange = (productId, variant) => {
    setSelectedProducts(prev => ({
      ...prev,
      [productId]: { ...prev[productId], variant }
    }));
  };

  const handlePageChange = (page) => {
    loadProducts(page);
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
            onClick={() => loadProducts(1)} 
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
              <img src="/src/assets/logo.jpg" alt="Sneaker Store Logo" className="h-12 w-auto rounded-lg" />
              <h1 className="text-2xl font-bold text-gray-900">Sneaker Store</h1>
            </div>
            <div className="flex items-center space-x-6">
              <Link to="/" className="text-gray-700 hover:text-gray-900 font-medium">Home</Link>
              <Link to="/checkout" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                Cart
              </Link>
            </div>
          </div>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Our Collection</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our handpicked selection of premium sneakers, designed for style and comfort.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {productsData.products.map(product => (
            <div key={product._id} className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
              <div className="aspect-w-1 aspect-h-1 bg-gray-50">
                <img
                  src={product.image || converseImg}
                  alt={product.name}
                  className="w-full h-[300px] object-center object-cover hover:opacity-90 transition-opacity"
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                <p className="mt-2 text-sm text-gray-500">{product.description}</p>
                <p className="mt-2 text-2xl font-bold text-gray-900">${product.price.toFixed(2)}</p>
                
                <div className="mt-4 space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Color:</label>
                    <select
                      value={selectedProducts[product._id]?.variant || product.defaultVariant}
                      onChange={(e) => handleVariantChange(product._id, e.target.value)}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    >
                      {product.variants.map(variant => (
                        <option key={variant} value={variant}>{variant}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700">Quantity:</label>
                    <select
                      value={selectedProducts[product._id]?.quantity || 1}
                      onChange={(e) => handleQuantityChange(product._id, Number(e.target.value))}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    >
                      {[1, 2, 3, 4, 5].map(num => (
                        <option key={num} value={num}>{num}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mt-6">
                  <Link
                    to="/checkout"
                    state={{ 
                      productId: product._id,
                      quantity: selectedProducts[product._id]?.quantity || 1,
                      variant: selectedProducts[product._id]?.variant || product.defaultVariant,
                      name: product.name,
                      price: product.price
                    }}
                    className="w-full bg-indigo-600 border border-transparent rounded-md py-2 px-4 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Buy Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {productsData.totalPages > 1 && (
          <div className="mt-8 flex justify-center space-x-2">
            {Array.from({ length: productsData.totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-4 py-2 rounded-md ${
                  page === productsData.currentPage
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default LandingPage;

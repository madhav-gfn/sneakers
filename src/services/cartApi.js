const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api`.replace(/\/+$/, '');

export const getCart = async (sessionId) => {
  try {
    const response = await fetch(`${API_URL}/cart/${sessionId}`);
    if (!response.ok) throw new Error('Failed to fetch cart');
    return await response.json();
  } catch (error) {
    console.error('Error fetching cart:', error);
    return { items: [] };
  }
};

export const addToCart = async (sessionId, { productId, name, price, quantity, variant }) => {
  try {
    const response = await fetch(`${API_URL}/cart/${sessionId}/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ productId, name, price, quantity, variant })
    });
    if (!response.ok) throw new Error('Failed to add to cart');
    return await response.json();
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw error;
  }
};

export const clearCart = async (sessionId) => {
  try {
    const response = await fetch(`${API_URL}/cart/${sessionId}/clear`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to clear cart');
    return await response.json();
  } catch (error) {
    console.error('Error clearing cart:', error);
    throw error;
  }
};
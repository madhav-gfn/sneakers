import express from 'express';
import Cart from '../models/Cart.js';

const router = express.Router();

// Get cart by sessionId
router.get('/:sessionId', async (req, res) => {
  try {
    const cart = await Cart.findOne({ sessionId: req.params.sessionId });
    if (!cart) {
      return res.json({ items: [] }); // Return empty cart if not found
    }
    res.json(cart);
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ message: error.message });
  }
});

// Add item to cart
router.post('/:sessionId/add', async (req, res) => {
  try {
    const { productId, name, variant, quantity, price } = req.body;
    const total = price * quantity;

    let cart = await Cart.findOne({ sessionId: req.params.sessionId });

    if (!cart) {
      // Create new cart if it doesn't exist
      cart = new Cart({
        sessionId: req.params.sessionId,
        items: [{
          productId,
          name,
          variant,
          quantity,
          price,
          total
        }]
      });
    } else {
      // Update existing cart
      const existingItemIndex = cart.items.findIndex(item => 
        item.productId.toString() === productId && item.variant === variant
      );

      if (existingItemIndex > -1) {
        // Update existing item
        cart.items[existingItemIndex].quantity = quantity;
        cart.items[existingItemIndex].total = total;
      } else {
        // Add new item
        cart.items.push({
          productId,
          name,
          variant,
          quantity,
          price,
          total
        });
      }
    }

    const updatedCart = await cart.save();
    res.json(updatedCart);
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ message: error.message });
  }
});

// Clear cart
router.delete('/:sessionId/clear', async (req, res) => {
  try {
    await Cart.findOneAndDelete({ sessionId: req.params.sessionId });
    res.json({ message: 'Cart cleared successfully' });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
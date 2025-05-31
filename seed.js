import 'dotenv/config';
import connectDB from './src/config/db.js';
import Product from './src/models/Product.js';

const products = [
  {
    name: "Converse Chuck 70 Hi Black",
    brand: "Converse",
    description: "Classic black high-top sneaker with enhanced cushioning",
    price: 85.00,
    image: "/src/assets/converse.jpg",
    variants: ["Black", "White", "Navy", "Red"],
    defaultVariant: "Black",
    stock: 50
  },
  {
    name: "Nike Air Force 1 Low White",
    brand: "Nike",
    description: "Iconic white-on-white sneaker with timeless style",
    price: 110.00,
    image: "/src/assets/converse.jpg",
    variants: ["White", "Black", "Red", "Blue"],
    defaultVariant: "White",
    stock: 40
  },
  {
    name: "Adidas Stan Smith Green",
    brand: "Adidas",
    description: "Legendary tennis shoe with green heel tab",
    price: 95.00,
    image: "/src/assets/converse.jpg",
    variants: ["Green", "Navy", "Red", "Black"],
    defaultVariant: "Green",
    stock: 35
  },
  {
    name: "Vans Old Skool Black White",
    brand: "Vans",
    description: "Classic skate shoe with side stripe and canvas upper",
    price: 70.00,
    image: "/src/assets/converse.jpg",
    variants: ["Black/White", "Navy/White", "Red/White", "Grey/White"],
    defaultVariant: "Black/White",
    stock: 28
  }
];

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Insert new products
    const createdProducts = await Product.insertMany(products);
    console.log(`Created ${createdProducts.length} products`);

    process.exit(0);
  } catch (error) {
    console.error(`Error seeding database: ${error.message}`);
    process.exit(1);
  }
};

seedDatabase();
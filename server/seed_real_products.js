import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/productModel.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '.env') });

const adminId = '69c6e054c10e20b9e7dd17af';

const products = [
  {
    user: adminId,
    name: 'iPhone 15 Pro Max - Natural Titanium',
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=1000&auto=format&fit=crop',
    brand: 'Apple',
    category: 'Mobiles',
    description: 'The iPhone 15 Pro Max is the most powerful iPhone ever, featuring a durable and lightweight titanium design, a new Action button, and a pro-level camera system.',
    rating: 4.9,
    numReviews: 128,
    price: 159900,
    costPrice: 120000,
    countInStock: 15,
    soldCount: 45
  },
  {
    user: adminId,
    name: 'MacBook Pro 16 M3 Max',
    image: 'https://images.unsplash.com/photo-1517336714460-453b5a73ff4e?q=80&w=1000&auto=format&fit=crop',
    brand: 'Apple',
    category: 'Laptops',
    description: 'The 16-inch MacBook Pro with M3 Max blast through the most advanced workflows, with a massive amount of unified memory and an ultra-fast SSD.',
    rating: 5.0,
    numReviews: 86,
    price: 349900,
    costPrice: 280000,
    countInStock: 8,
    soldCount: 12
  },
  {
    user: adminId,
    name: 'Samsung Galaxy S24 Ultra',
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=1000&auto=format&fit=crop',
    brand: 'Samsung',
    category: 'Mobiles',
    description: 'The Galaxy S24 Ultra features Galaxy AI, a 200MP camera, and a built-in S Pen, all powered by the Snapdragon 8 Gen 3 for Galaxy.',
    rating: 4.8,
    numReviews: 95,
    price: 129999,
    costPrice: 100000,
    countInStock: 20,
    soldCount: 30
  },
  {
    user: adminId,
    name: 'Sony WH-1000XM5 Headphones',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop',
    brand: 'Sony',
    category: 'Accessories',
    description: 'Industry-leading noise cancellation and magnificent sound quality, with up to 30 hours of battery life and quick charging.',
    rating: 4.7,
    numReviews: 210,
    price: 26990,
    costPrice: 20000,
    countInStock: 50,
    soldCount: 150
  },
  {
    user: adminId,
    name: 'PlayStation 5 Console',
    image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?q=80&w=1000&auto=format&fit=crop',
    brand: 'Sony',
    category: 'Gadgets',
    description: 'Experience lightning-fast loading with an ultra-high speed SSD, deeper immersion with support for haptic feedback, adaptive triggers, and 3D Audio.',
    rating: 4.9,
    numReviews: 450,
    price: 54990,
    costPrice: 48000,
    countInStock: 4,
    soldCount: 80
  }
];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected...');

    // Optionally clear existing sample products
    // await Product.deleteMany({ name: 'Sample name' });

    await Product.insertMany(products);
    console.log('Real products seeded successfully!');
    process.exit();
  } catch (error) {
    console.error('Error with seeding:', error.message);
    process.exit(1);
  }
};

seedData();

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import products from './data/products.js';
import carouselSlides from './data/carouselSlides.js';
import User from './models/userModel.js';
import Product from './models/productModel.js';
import CarouselSlide from './models/carouselModel.js';

dotenv.config();

const seedDemoData = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is required to seed demo data.');
  }

  await mongoose.connect(process.env.MONGO_URI);

  const productOwner = await User.findOne({ isAdmin: true }).sort({ createdAt: 1 });
  if (!productOwner) {
    throw new Error('Create an admin account before seeding demo products.');
  }

  let productsAdded = 0;
  for (const product of products) {
    const result = await Product.updateOne(
      { name: product.name },
      {
        $setOnInsert: {
          ...product,
          user: productOwner._id,
          mrp: product.price,
          costPrice: 0,
          soldCount: 0,
          isPublished: true,
        },
      },
      { upsert: true }
    );
    productsAdded += result.upsertedCount;
  }

  const existingSlides = await CarouselSlide.find({}, { title: 1 }).lean();
  const existingTitles = new Set(existingSlides.map((slide) => slide.title));
  const slidesToAdd = carouselSlides
    .filter((slide) => !existingTitles.has(slide.title))
    .slice(0, Math.max(0, 8 - existingSlides.length));

  if (slidesToAdd.length > 0) {
    await CarouselSlide.insertMany(slidesToAdd);
  }

  console.log(`Demo data ready: ${productsAdded} products added, ${slidesToAdd.length} carousel slides added.`);
  if (slidesToAdd.length < carouselSlides.filter((slide) => !existingTitles.has(slide.title)).length) {
    console.log('Some demo slides were skipped because the carousel already has its maximum of 8 slides.');
  }
};

try {
  await seedDemoData();
} catch (error) {
  console.error(`Demo data seeding failed: ${error.message}`);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}

import asyncHandler from '../middleware/asyncHandler.js';
import Product from '../models/productModel.js';

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = 12; // Paginate with 12 items per page
  const page = Number(req.query.pageNumber) || 1;

  const { keyword, category, brand, minPrice, maxPrice, rating, stock, sort, isAdmin } = req.query;

  let query = {};

  // Public users only see published products
  if (isAdmin !== 'true') {
    query.isPublished = true;
  }

  if (keyword) {
    query.name = { $regex: keyword, $options: 'i' };
  }

  if (category && category !== 'All') {
    query.category = category;
  }

  if (brand && brand !== 'All') {
    const brands = brand.split(',');
    query.brand = { $in: brands };
  }

  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  if (rating) {
    query.rating = { $gte: Number(rating) };
  }

  if (stock) {
    if (stock === 'in_stock') {
      query.countInStock = { $gt: 0 };
    } else if (stock === 'out_of_stock') {
      query.countInStock = 0;
    }
  }

  let sortOption = {};
  if (sort) {
    switch (sort) {
      case 'price_asc': sortOption.price = 1; break;
      case 'price_desc': sortOption.price = -1; break;
      case 'newest': sortOption.createdAt = -1; break;
      case 'best_selling': sortOption.soldCount = -1; break;
      case 'rating': sortOption.rating = -1; break;
      case 'name': sortOption.name = 1; break;
      default: sortOption.createdAt = -1; break;
    }
  } else {
    sortOption.createdAt = -1;
  }

  const count = await Product.countDocuments(query);
  const products = await Product.find(query)
    .sort(sortOption)
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .lean();

  res.json({ products, page, pages: Math.ceil(count / pageSize), count });
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).lean();

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    name: 'New Draft Product',
    price: 0,
    user: req.user._id,
    image: '/images/sample.jpg',
    brand: 'New Brand',
    category: 'New Category',
    countInStock: 0,
    costPrice: 0,
    numReviews: 0,
    description: 'New Description',
    isPublished: false,
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const { name, price, costPrice, description, image, brand, category, countInStock, isPublished } =
    req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name;
    product.price = price;
    product.description = description;
    product.image = image;
    product.brand = brand;
    product.category = category;
    product.countInStock = countInStock;
    product.costPrice = costPrice;
    product.isPublished = isPublished;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await Product.deleteOne({ _id: product._id });
    res.json({ message: 'Product removed' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error('Product already reviewed');
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);

    product.numReviews = product.reviews.length;

    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ message: 'Review added' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Get all unique categories and brands
// @route   GET /api/products/filters
// @access  Public
const getCategoriesAndBrands = asyncHandler(async (req, res) => {
  const categories = await Product.distinct('category');
  const brands = await Product.distinct('brand');
  res.json({ categories, brands });
});

// @desc    Bulk update product stock
// @route   PUT /api/products/bulk-stock
// @access  Private/Admin
const bulkUpdateStock = asyncHandler(async (req, res) => {
  const { stockUpdates } = req.body; // Array of { _id, countInStock }
  if (!stockUpdates || !Array.isArray(stockUpdates)) {
    res.status(400);
    throw new Error('Invalid stock updates data');
  }

  const bulkOps = stockUpdates.map(update => ({
    updateOne: {
      filter: { _id: update._id },
      update: { $set: { countInStock: update.countInStock } }
    }
  }));

  if (bulkOps.length > 0) {
    await Product.bulkWrite(bulkOps);
    res.json({ message: 'Stock updated successfully' });
  } else {
    res.json({ message: 'No updates provided' });
  }
});

// @desc    Get user reviews (Admin)
// @route   GET /api/products/reviews/user/:id
// @access  Private/Admin
const getUserReviewsAdmin = asyncHandler(async (req, res) => {
  const products = await Product.find({ 'reviews.user': req.params.id });

  const userReviews = products.map((product) => {
    const reviews = product.reviews.filter(
      (r) => r.user.toString() === req.params.id.toString()
    );
    return reviews.map((r) => ({
      ...r._doc,
      productName: product.name,
      productId: product._id,
    }));
  }).flat();

  res.json(userReviews);
});

// @desc    Delete review (Admin)
// @route   DELETE /api/products/:id/reviews/:reviewId
// @access  Private/Admin
const deleteReviewAdmin = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    const reviewIndex = product.reviews.findIndex(
      (r) => r._id.toString() === req.params.reviewId.toString()
    );

    if (reviewIndex === -1) {
      res.status(404);
      throw new Error('Review not found');
    }

    product.reviews.splice(reviewIndex, 1);
    product.numReviews = product.reviews.length;

    if (product.numReviews > 0) {
      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;
    } else {
      product.rating = 0;
    }

    await product.save();
    res.json({ message: 'Review deleted successfully' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

export {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getCategoriesAndBrands,
  bulkUpdateStock,
  getUserReviewsAdmin,
  deleteReviewAdmin,
};

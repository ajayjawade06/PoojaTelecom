import asyncHandler from '../middleware/asyncHandler.js';
import User from '../models/userModel.js';
import Product from '../models/productModel.js';
import Order from '../models/orderModel.js';

// @desc    Global Admin Command Palette Search
// @route   GET /api/search?q=
// @access  Private/Admin
const globalSearch = asyncHandler(async (req, res) => {
  let keyword = req.query.q;
  if (!keyword || keyword.trim() === '') {
    return res.json({ users: [], products: [], orders: [] });
  }

  keyword = keyword.trim();
  // Clean off #PT prefix if they copy-pasted it
  const cleanedKeyword = keyword.replace(/^(#PT|PT)/i, '');

  const regex = new RegExp(keyword, 'i');

  try {
    const [users, products, orders] = await Promise.all([
      User.find({
        $or: [{ name: regex }, { email: regex }]
      })
      .select('name email isAdmin')
      .limit(5),

      Product.find({
        $or: [{ name: regex }, { brand: regex }, { category: regex }]
      })
      .select('name image price countInStock')
      .limit(5),

      Order.find({
        $expr: {
            $regexMatch: {
                input: { $toString: "$_id" },
                regex: cleanedKeyword,
                options: "i"
            }
        }
      })
      .populate('user', 'name email')
      .limit(5)
    ]);

    res.json({
      users,
      products,
      orders
    });
  } catch (err) {
    res.status(500);
    throw new Error('Search failed to execute');
  }
});

export { globalSearch };

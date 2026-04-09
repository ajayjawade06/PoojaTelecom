import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/userModel.js';
import Product from './models/productModel.js';
import Order from './models/orderModel.js';
import connectDB from './utils/db.js';

dotenv.config();

connectDB();

const generateMockUsers = async () => {
    const mockUsers = [];
    const firstNames = ['Aarav', 'Vihaan', 'Aditya', 'Rohan', 'Sneha', 'Priya', 'Ananya', 'Kavita', 'Neha', 'Sanjay', 'Rahul', 'Arjun', 'Kartik', 'Pooja', 'Meera'];
    const lastNames = ['Sharma', 'Verma', 'Patel', 'Singh', 'Kumar', 'Kapoor', 'Gupta', 'Joshi', 'Chauhan', 'Yadav'];

    const defaultPassword = await bcrypt.hash('123456', 10);

    for (let i = 0; i < 30; i++) {
        const fname = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lname = lastNames[Math.floor(Math.random() * lastNames.length)];
        mockUsers.push({
            name: `${fname} ${lname}`,
            email: `${fname.toLowerCase()}.${lname.toLowerCase()}${Math.floor(Math.random() * 1000)}@example.com`,
            password: defaultPassword,
            phoneNumber: `98${Math.floor(10000000 + Math.random() * 90000000)}`,
            isAdmin: false,
            isVerified: true,
            addresses: [{
                address: `${Math.floor(Math.random() * 100) + 1} Main Street`,
                city: 'Mumbai',
                postalCode: '400001',
                country: 'India',
                phoneNumber: `98${Math.floor(10000000 + Math.random() * 90000000)}`
            }]
        });
    }
    
    // Insert bypasses pre('save') but we already hashed it
    const insertedUsers = await User.insertMany(mockUsers);
    return insertedUsers;
};

const seedData = async () => {
  try {
    const existingUsers = await User.find();
    
    console.log('Generating additional mock users...');
    const extendedUsers = await generateMockUsers();
    console.log(`✅ ${extendedUsers.length} new users added!`);

    const allUsers = [...existingUsers, ...extendedUsers];
    const customerUsers = allUsers.filter(u => !u.isAdmin);

    const products = await Product.find();
    if (products.length === 0) {
      console.log('No products found. Please seed products first.');
      process.exit(1);
    }

    // 1. Add some reviews to products
    const reviewComments = [
      { comment: 'Extremely satisfied with the build quality!', rating: 5 },
      { comment: 'Good value for money. Definitely recommend.', rating: 4 },
      { comment: 'Works as expected, prompt delivery!', rating: 5 },
      { comment: 'Decent product but packaging could be better.', rating: 3 },
      { comment: 'Superb! Exceeded my expectations completely.', rating: 5 },
      { comment: 'Average product, okay for the price.', rating: 3 },
      { comment: 'Fantastic features, very premium feel!.', rating: 5 },
      { comment: 'Love it! Will buy again as a gift.', rating: 5 },
      { comment: 'Not bad, but I have seen better alternatives.', rating: 3 },
      { comment: 'Quality is top-notch. Very happy.', rating: 4 },
    ];

    let totalReviewsAdded = 0;
    for (let product of products) {
      // 5 to 12 reviews per product for a good density
      const numFakeReviews = Math.floor(Math.random() * 8) + 5; 
      
      // Shuffle users to guarantee unique reviewers
      const shuffledUsers = [...customerUsers].sort(() => 0.5 - Math.random());
      const selectedReviewers = shuffledUsers.slice(0, numFakeReviews);

      for (let reviewerUser of selectedReviewers) {
        const reviewTpl = reviewComments[Math.floor(Math.random() * reviewComments.length)];
        
        // Ensure no duplicate reviews from the same user for idempotency
        const exists = product.reviews.find(r => r.user.toString() === reviewerUser._id.toString());
        if (!exists) {
            product.reviews.push({
                name: reviewerUser.name,
                rating: reviewTpl.rating,
                comment: reviewTpl.comment,
                user: reviewerUser._id
            });
            totalReviewsAdded++;
        }
      }
      product.numReviews = product.reviews.length;
      product.rating = product.reviews.length > 0 
        ? product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length 
        : 0;
      await product.save();
    }
    console.log(`✅ ${totalReviewsAdded} Reviews added to products!`);

    // 2. Add some fake orders for reports
    const sampleOrders = [];
    for (let i = 0; i < 150; i++) { // 150 orders for solid report data
      const randomProduct = products[Math.floor(Math.random() * products.length)];
      const randomProduct2 = products[Math.floor(Math.random() * products.length)];
      
      const qty1 = Math.floor(Math.random() * 3) + 1;
      const qty2 = Math.floor(Math.random() * 2) + 1;
      let orderItems = [
        {
          name: randomProduct.name,
          qty: qty1,
          image: randomProduct.image || (randomProduct.images && randomProduct.images[0]) || '/images/sample.jpg',
          price: randomProduct.price,
          product: randomProduct._id
        }
      ];

      // 40% chance to have a second item
      if (Math.random() > 0.6 && randomProduct._id.toString() !== randomProduct2._id.toString()) {
          orderItems.push({
              name: randomProduct2.name,
              qty: qty2,
              image: randomProduct2.image || (randomProduct2.images && randomProduct2.images[0]) || '/images/sample.jpg',
              price: randomProduct2.price,
              product: randomProduct2._id
          });
      }

      const itemsPrice = orderItems.reduce((acc, item) => acc + item.price * item.qty, 0);

      const pastDates = [
          new Date(Date.now() - 1000 * 60 * 60 * 24 * 60), // 2 months ago
          new Date(Date.now() - 1000 * 60 * 60 * 24 * 45), 
          new Date(Date.now() - 1000 * 60 * 60 * 24 * 30), 
          new Date(Date.now() - 1000 * 60 * 60 * 24 * 20),
          new Date(Date.now() - 1000 * 60 * 60 * 24 * 14), 
          new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),  
          new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), 
          new Date(Date.now() - 1000 * 60 * 60 * 24 * 1), 
          new Date() // today
      ];
      const randomDate = pastDates[Math.floor(Math.random() * pastDates.length)];

      const orderStatuses = [
        { isPaid: true, isDelivered: true, deliveredAt: new Date(randomDate.getTime() + 1000 * 60 * 60 * 24 * 2) }, // delivered 2 days after
        { isPaid: true, isDelivered: true, deliveredAt: new Date(randomDate.getTime() + 1000 * 60 * 60 * 24 * 3) },
        { isPaid: true, isDelivered: false },
        { isPaid: false, isDelivered: false },
        { isPaid: true, isDelivered: true, isReturnRequested: true, returnStatus: 'Pending', deliveredAt: new Date(randomDate.getTime() + 1000 * 60 * 60 * 24) },
        { isPaid: true, isDelivered: true, isReturnRequested: true, returnStatus: 'Refunded', deliveredAt: new Date(randomDate.getTime() + 1000 * 60 * 60 * 24) }
      ];
      const status = orderStatuses[Math.floor(Math.random() * orderStatuses.length)];

      const randomCustomer = customerUsers[Math.floor(Math.random() * customerUsers.length)];

      const order = {
        user: randomCustomer._id,
        orderItems: orderItems,
        shippingAddress: {
          address: `${Math.floor(Math.random() * 100) + 1} Fake Street`,
          city: ['Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Chennai'][Math.floor(Math.random() * 5)],
          postalCode: `40000${Math.floor(Math.random() * 9)}`,
          country: 'India',
          phone: randomCustomer.phoneNumber || '9876543210'
        },
        paymentMethod: 'Razorpay',
        paymentResult: status.isPaid ? {
          razorpay_payment_id: 'pay_' + Math.random().toString(36).substring(7),
          status: 'captured',
          update_time: randomDate.toISOString(),
          email_address: randomCustomer.email
        } : {},
        itemsPrice: itemsPrice,
        taxPrice: itemsPrice * 0.18, 
        shippingPrice: itemsPrice > 5000 ? 0 : 150,
        totalPrice: itemsPrice + (itemsPrice * 0.18) + (itemsPrice > 5000 ? 0 : 150),
        isPaid: status.isPaid,
        paidAt: status.isPaid ? randomDate : undefined,
        isDelivered: status.isDelivered,
        deliveredAt: status.deliveredAt,
        excludeFromStats: false,
        isCancelled: false,
        isReturnRequested: status.isReturnRequested || false,
        returnStatus: status.returnStatus || 'None',
        createdAt: randomDate,
        updatedAt: randomDate
      };
      sampleOrders.push(order);
    }
    await Order.insertMany(sampleOrders);
    console.log(`✅ ${sampleOrders.length} New Orders seeded!`);

    process.exit();
  } catch (error) {
    console.error(`❌ Seeding Failed: ${error}`);
    process.exit(1);
  }
}

seedData();

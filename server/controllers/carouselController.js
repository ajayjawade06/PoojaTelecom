import asyncHandler from '../middleware/asyncHandler.js';
import CarouselSlide from '../models/carouselModel.js';

// @desc    Get active carousel slides (public)
// @route   GET /api/carousel
// @access  Public
const getActiveSlides = asyncHandler(async (req, res) => {
  const slides = await CarouselSlide.find({ isActive: true }).sort({ order: 1 });
  res.json(slides);
});

// @desc    Get all carousel slides (admin)
// @route   GET /api/carousel/admin
// @access  Private/Admin
const getAllSlides = asyncHandler(async (req, res) => {
  const slides = await CarouselSlide.find({}).sort({ order: 1 });
  res.json(slides);
});

// @desc    Create a carousel slide
// @route   POST /api/carousel
// @access  Private/Admin
const createSlide = asyncHandler(async (req, res) => {
  const count = await CarouselSlide.countDocuments();

  if (count >= 8) {
    res.status(400);
    throw new Error('Maximum of 8 carousel slides allowed');
  }

  const { title, subtitle, description, image, link, linkText, price, isActive } = req.body;

  const slide = new CarouselSlide({
    title: title || 'New Slide',
    subtitle: subtitle || '',
    description: description || '',
    image: image || '/images/sample.jpg',
    link: link || '/search/all',
    linkText: linkText || 'Shop Store',
    price: price || '',
    order: count,
    isActive: isActive !== undefined ? isActive : true,
  });

  const createdSlide = await slide.save();
  res.status(201).json(createdSlide);
});

// @desc    Update a carousel slide
// @route   PUT /api/carousel/:id
// @access  Private/Admin
const updateSlide = asyncHandler(async (req, res) => {
  const slide = await CarouselSlide.findById(req.params.id);

  if (!slide) {
    res.status(404);
    throw new Error('Slide not found');
  }

  const { title, subtitle, description, image, link, linkText, price, order, isActive } = req.body;

  slide.title = title ?? slide.title;
  slide.subtitle = subtitle ?? slide.subtitle;
  slide.description = description ?? slide.description;
  slide.image = image ?? slide.image;
  slide.link = link ?? slide.link;
  slide.linkText = linkText ?? slide.linkText;
  slide.price = price ?? slide.price;
  slide.order = order ?? slide.order;
  slide.isActive = isActive !== undefined ? isActive : slide.isActive;

  const updatedSlide = await slide.save();
  res.json(updatedSlide);
});

// @desc    Delete a carousel slide
// @route   DELETE /api/carousel/:id
// @access  Private/Admin
const deleteSlide = asyncHandler(async (req, res) => {
  const slide = await CarouselSlide.findById(req.params.id);

  if (!slide) {
    res.status(404);
    throw new Error('Slide not found');
  }

  const deletedOrder = slide.order;
  await CarouselSlide.deleteOne({ _id: slide._id });

  // Re-order remaining slides to fill the gap
  await CarouselSlide.updateMany(
    { order: { $gt: deletedOrder } },
    { $inc: { order: -1 } }
  );

  res.json({ message: 'Slide removed' });
});

// @desc    Reorder carousel slides
// @route   PUT /api/carousel/reorder
// @access  Private/Admin
const reorderSlides = asyncHandler(async (req, res) => {
  const { slideIds } = req.body;

  if (!slideIds || !Array.isArray(slideIds)) {
    res.status(400);
    throw new Error('slideIds array is required');
  }

  const bulkOps = slideIds.map((id, index) => ({
    updateOne: {
      filter: { _id: id },
      update: { $set: { order: index } },
    },
  }));

  await CarouselSlide.bulkWrite(bulkOps);

  const slides = await CarouselSlide.find({}).sort({ order: 1 });
  res.json(slides);
});

export {
  getActiveSlides,
  getAllSlides,
  createSlide,
  updateSlide,
  deleteSlide,
  reorderSlides,
};

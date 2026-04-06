import mongoose from 'mongoose';

const carouselSlideSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    subtitle: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    image: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      default: '/search/all',
    },
    linkText: {
      type: String,
      default: 'Shop Store',
    },
    price: {
      type: String,
      default: '',
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const CarouselSlide = mongoose.model('CarouselSlide', carouselSlideSchema);

export default CarouselSlide;

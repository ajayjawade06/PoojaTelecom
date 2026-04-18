import mongoose from 'mongoose';

const configSchema = new mongoose.Schema({
  type: { type: String, default: 'global' },
  festivalName: { type: String, default: 'Special' },
  discountPercentage: { type: Number, default: 0 }
});

const Config = mongoose.model('Config', configSchema);

export default Config;

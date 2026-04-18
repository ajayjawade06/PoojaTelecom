import express from 'express';
import Config from '../models/configModel.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', async (req, res) => {
  let config = await Config.findOne({ type: 'global' });
  if (!config) config = await Config.create({ type: 'global' });
  res.json(config);
});

router.put('/', protect, admin, async (req, res) => {
  const { festivalName, discountPercentage } = req.body;
  let config = await Config.findOne({ type: 'global' });
  if (!config) config = await Config.create({ type: 'global' });
  
  if (festivalName !== undefined) config.festivalName = festivalName;
  if (discountPercentage !== undefined) config.discountPercentage = discountPercentage;
  
  await config.save();
  res.json(config);
});

export default router;

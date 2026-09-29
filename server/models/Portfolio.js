import mongoose from 'mongoose';

const AssetAllocationSchema = new mongoose.Schema(
  {
    category: { type: String, required: true },
    percentage: { type: Number, required: true },
    value: { type: Number, required: true },
  },
  { _id: false }
);

const HistoricalPointSchema = new mongoose.Schema(
  {
    date: { type: String, required: true },
    value: { type: Number, required: true },
  },
  { _id: false }
);

const PortfolioSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  clientName: { type: String, required: true },
  totalValue: { type: Number, required: true },
  currency: { type: String, default: 'USD' },
  ytdReturn: { type: Number, required: true },
  assetAllocation: [AssetAllocationSchema],
  historicalPerformance: [HistoricalPointSchema],
  lastUpdated: { type: Date, default: Date.now },
});

export default mongoose.models.Portfolio || mongoose.model('Portfolio', PortfolioSchema);

import mongoose from 'mongoose';

const contributionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Project',
  },
  amount: {
    type: Number,
    required: true,
  },
  equityPercentage: {
    type: Number,
    default: 0,
  },
  expectedReturn: {
    type: Number,
    default: 0,
  },
  paymentId: {
    type: String,
    required: true,
  },
  orderId: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'successful', 'failed'],
    default: 'pending',
  }
}, {
  timestamps: true,
});

const Contribution = mongoose.model('Contribution', contributionSchema);
export default Contribution;

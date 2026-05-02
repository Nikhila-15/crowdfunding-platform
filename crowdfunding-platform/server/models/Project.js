import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  goalAmount: {
    type: Number,
    required: true,
  },
  expectedProfit: {
    type: Number,
  },
  returnPercentage: {
    type: Number,
    required: true,
    default: 0,
  },
  equityOffered: {
    type: Number,
    required: true,
    default: 0,
  },
  raisedAmount: {
    type: Number,
    default: 0,
  },
  isFunded: {
    type: Boolean,
    default: false,
  },
  deadline: {
    type: Date,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
  },
  websiteLink: {
    type: String,
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'failed', 'expired'],
    default: 'active',
  },
  riskIndicator: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  story: {
    problem: { type: String, default: '' },
    solution: { type: String, default: '' },
    market: { type: String, default: '' },
    vision: { type: String, default: '' }
  },
  investors: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    donatedAmount: {
      type: Number,
      required: true
    },
    sharePercentage: {
      type: Number,
      required: true
    },
    equityPercentage: {
      type: Number,
      default: 0
    },
    expectedReturn: {
      type: Number,
      default: 0
    }
  }],
  totalProfit: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
});

const Project = mongoose.model('Project', projectSchema);
export default Project;

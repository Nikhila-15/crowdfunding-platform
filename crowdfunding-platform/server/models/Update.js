import mongoose from 'mongoose';

const updateSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Project',
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  }
}, {
  timestamps: true,
});

const Update = mongoose.model('Update', updateSchema);
export default Update;

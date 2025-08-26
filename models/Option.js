import mongoose from 'mongoose';

const OptionSchema = new mongoose.Schema({
  type: { type: String, required: true }, // category | company | department
  name: { type: String, required: true }
});

export default mongoose.models.Option || mongoose.model('Option', OptionSchema);

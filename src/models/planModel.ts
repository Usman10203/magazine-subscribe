import mongoose from 'mongoose';

const PlanSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    renewalPeriod: { type: Number, required: true, min: 1 },
    tier: { type: Number, required: true },
    discount: { type: Number, required: true },
}, { timestamps: true });

export default mongoose.models.Plan || mongoose.model('Plan', PlanSchema);

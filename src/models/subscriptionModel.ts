import mongoose from 'mongoose';

const SubscriptionSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    magazine_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Magazine',
        required: true
    },
    plan_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Plan',
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    renewal_date: {
        type: Date,
        required: true
    },
    is_active: {
        type: Boolean,
        default: true
    },
}, { timestamps: true });

export default mongoose.models.Subscription || mongoose.model('Subscription', SubscriptionSchema);

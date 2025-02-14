import mongoose from 'mongoose';

const MagazineSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    base_price: {
        type: Number, required: true,
        validate: {
            validator: function (value: number) {
                return value > 0;
            },
            message: 'Base price must be greater than zero'
        }
    },
}, { timestamps: true });

export default mongoose.models.Magazine || mongoose.model('Magazine', MagazineSchema);

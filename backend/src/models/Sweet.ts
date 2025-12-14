
import mongoose, { Schema, Document } from 'mongoose';

export interface ISweet extends Document {
    name: string;
    category: string;
    price: number;
    quantity: number;
    description?: string;
}

const SweetSchema: Schema = new Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, default: 0 },
    description: { type: String },
}, { timestamps: true });

export default mongoose.model<ISweet>('Sweet', SweetSchema);

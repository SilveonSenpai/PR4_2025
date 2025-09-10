import mongoose, { Schema, Document } from 'mongoose';

export interface IMenu extends Document {
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  category?: string;
  createdAt: Date;
}

const MenuSchema: Schema = new Schema({
  name: { type: String, required: true, trim: true, maxlength: 200 },
  description: { type: String },
  price: { type: Number, required: true, min: 0 },
  imageUrl: { type: String },
  category: { type: String, default: 'general' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IMenu>('Menu', MenuSchema);

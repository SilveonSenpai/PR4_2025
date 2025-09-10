import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IOrderItem {
  menuId: Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
}

export interface IOrder extends Document {
  customerName: string;
  customerPhone: string;
  items: IOrderItem[];
  status: 'new' | 'in_progress' | 'done';
  totalPrice: number;
  createdAt: Date;
}

const OrderItemSchema = new Schema({
  menuId: { type: Schema.Types.ObjectId, ref: 'Menu', required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 }
}, { _id: false });

const OrderSchema: Schema = new Schema({
  customerName: { type: String, required: true },
  customerPhone: { type: String, required: true },
  items: { type: [OrderItemSchema], required: true },
  status: { type: String, enum: ['new', 'in_progress', 'done'], default: 'new' },
  totalPrice: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

// Pre-save hook to calculate totalPrice
OrderSchema.pre<IOrder>('save', function(next) {
  this.totalPrice = this.items.reduce((sum, it) => sum + (it.price * it.quantity), 0);
  next();
});

export default mongoose.model<IOrder>('Order', OrderSchema);

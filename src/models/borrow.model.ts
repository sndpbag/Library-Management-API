

// src/models/borrow.model.ts
import { Schema, Document, model, Types } from 'mongoose';
import { Book } from './book.model';

export interface IBorrow extends Document {
  book: Types.ObjectId;
  quantity: number;
  dueDate: Date;
}

const borrowSchema = new Schema<IBorrow>(
  {
    book: { 
      type: Schema.Types.ObjectId, 
      ref: 'Book', 
      required: [true, 'Book ID is required'] 
    },
    quantity: { 
      type: Number, 
      required: [true, 'Quantity is required'], 
      min: [1, 'Quantity must be at least 1'] 
    },
    dueDate: { 
      type: Date, 
      required: [true, 'Due date is required'] 
    },
  },
  { timestamps: true }
);

// Pre-save middleware to check book availability
borrowSchema.pre('save', async function(next) {
  if (this.isNew) {
    const book = await Book.findById(this.book);
    if (!book) {
      const error = new Error('Book not found');
      return next(error);
    }
    
    if (book.copies < this.quantity) {
      const error = new Error('Not enough copies available');
      return next(error);
    }
  }
  next();
});

// Post-save middleware to update book copies and availability
borrowSchema.post('save', async function(doc, next) {
  try {
    const book = await Book.findById(doc.book);
    if (book) {
      book.copies -= doc.quantity;
      await book.updateAvailability();
    }
    next();
  } catch (error) {
    next(error);
  }
});

export const Borrow = model<IBorrow>('Borrow', borrowSchema);

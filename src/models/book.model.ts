

// src/models/book.model.ts
import mongoose, { Schema, Document } from 'mongoose';

export enum Genre {
  FICTION = 'FICTION',
  NON_FICTION = 'NON_FICTION',
  SCIENCE = 'SCIENCE',
  HISTORY = 'HISTORY',
  BIOGRAPHY = 'BIOGRAPHY',
  FANTASY = 'FANTASY'
}

export interface IBook extends Document {
  title: string;
  author: string;
  genre: Genre;
  isbn: string;
  description?: string;
  copies: number;
  available: boolean;
  updateAvailability(): Promise<IBook>;
}

const bookSchema = new Schema<IBook>(
  {
    title: { 
      type: String, 
      required: [true, 'Title is required'] 
    },
    author: { 
      type: String, 
      required: [true, 'Author is required'] 
    },
    genre: { 
      type: String, 
      enum: {
        values: Object.values(Genre),
        message: 'Genre must be one of: FICTION, NON_FICTION, SCIENCE, HISTORY, BIOGRAPHY, FANTASY'
      },
      required: [true, 'Genre is required'] 
    },
    isbn: { 
      type: String, 
      required: [true, 'ISBN is required'], 
      unique: true 
    },
    description: { type: String },
    copies: { 
      type: Number, 
      required: [true, 'Copies is required'], 
      min: [0, 'Copies must be a non-negative number'] 
    },
    available: { 
      type: Boolean, 
      default: true 
    },
  },
  { timestamps: true }
);

// Instance method to update availability
bookSchema.methods.updateAvailability = function() {
  this.available = this.copies > 0;
  return this.save();
};

// Static method to check and update availability
bookSchema.statics.checkAndUpdateAvailability = async function(bookId: string) {
  const book = await this.findById(bookId);
  if (book) {
    book.available = book.copies > 0;
    await book.save();
    return book;
  }
  return null;
};

export const Book = mongoose.model<IBook>('Book', bookSchema);
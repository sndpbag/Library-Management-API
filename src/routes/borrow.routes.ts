

// src/routes/borrow.routes.ts
import express, { Request, Response } from 'express';
import { Borrow } from '../models/borrow.model';
import { Book } from '../models/book.model';
import mongoose from 'mongoose';

const router = express.Router();

// Borrow a Book
router.post('/borrow', async (req: Request, res: Response) => {
  try {
    const { book, quantity, dueDate } = req.body;
    
    // Validate input
    if (!book || !quantity || !dueDate) {
      return res.status(400).json({
        message: 'Missing required fields',
        success: false,
        error: 'Book ID, quantity, and due date are required'
      });
    }
    
    if (!mongoose.Types.ObjectId.isValid(book)) {
      return res.status(400).json({
        message: 'Invalid book ID format',
        success: false,
        error: 'Invalid ObjectId'
      });
    }
    
    // Check if book exists and has enough copies
    const foundBook = await Book.findById(book);
    if (!foundBook) {
      return res.status(404).json({
        message: 'Book not found',
        success: false,
        error: 'Book with the given ID does not exist'
      });
    }
    
    if (foundBook.copies < quantity) {
      return res.status(400).json({
        message: 'Not enough copies available',
        success: false,
        error: `Only ${foundBook.copies} copies available, but ${quantity} requested`
      });
    }
    
    // Create borrow record (middleware will handle the book update)
    const borrow = new Borrow({ book, quantity, dueDate });
    await borrow.save();
    
    res.status(201).json({
      success: true,
      message: 'Book borrowed successfully',
      data: borrow
    });
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Validation failed',
        success: false,
        error: {
          name: error.name,
          errors: error.errors
        }
      });
    }
    res.status(500).json({
      message: 'Error borrowing book',
      success: false,
      error: error.message
    });
  }
});

// Get Borrowed Books Summary (Aggregation)
router.get('/borrow', async (req: Request, res: Response) => {
  try {
    const summary = await Borrow.aggregate([
      {
        $group: {
          _id: '$book',
          totalQuantity: { $sum: '$quantity' }
        }
      },
      {
        $lookup: {
          from: 'books',
          localField: '_id',
          foreignField: '_id',
          as: 'bookDetails'
        }
      },
      {
        $unwind: '$bookDetails'
      },
      {
        $project: {
          _id: 0,
          book: {
            title: '$bookDetails.title',
            isbn: '$bookDetails.isbn'
          },
          totalQuantity: 1
        }
      },
      {
        $sort: { totalQuantity: -1 }
      }
    ]);
    
    res.json({
      success: true,
      message: 'Borrowed books summary retrieved successfully',
      data: summary
    });
  } catch (error: any) {
    res.status(500).json({
      message: 'Error fetching borrowed books summary',
      success: false,
      error: error.message
    });
  }
});

export default router;
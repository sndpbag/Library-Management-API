

// src/routes/book.routes.ts
import express, { Request, Response } from 'express';
import { Book, Genre } from '../models/book.model';
import mongoose from 'mongoose';

const router = express.Router();

// Create Book
router.post('/books', async (req: Request, res: Response) => {
  try {
    const book = new Book(req.body);
    console.log(req.body)
    await book.save();
    res.status(201).json({
      success: true,
      message: 'Book created successfully',
      data: book
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
    if (error.code === 11000) {
      return res.status(400).json({
        message: 'Validation failed',
        success: false,
        error: {
          name: 'DuplicateError',
          message: 'ISBN already exists'
        }
      });
    }
    res.status(500).json({
      message: 'Internal server error',
      success: false,
      error: error.message
    });
  }
});

// Get All Books with filtering and sorting
router.get('/books', async (req: Request, res: Response) => {
  try {
    const { filter, sortBy = 'createdAt', sort = 'asc', limit = 10 } = req.query;
    
    const query: any = {};
    if (filter && Object.values(Genre).includes(filter as Genre)) {
      query.genre = filter;
    }
    
    const sortOrder = sort === 'desc' ? -1 : 1;
    const sortField = sortBy as string;
    
    const books = await Book.find(query)
      .sort({ [sortField]: sortOrder })
      .limit(Number(limit));
      
    res.json({
      success: true,
      message: 'Books retrieved successfully',
      data: books
    });
  } catch (error: any) {
    res.status(500).json({
      message: 'Error retrieving books',
      success: false,
      error: error.message
    });
  }
});

// Get Book by ID
router.get('/books/:bookId', async (req: Request<{ bookId: string }>, res: Response) => {
  try {
    const { bookId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).json({
        message: 'Invalid book ID format',
        success: false,
        error: 'Invalid ObjectId'
      });
    }
    
    const book = await Book.findById(bookId);
    
    if (!book) {
      return res.status(404).json({
        message: 'Book not found',
        success: false,
        error: 'Book with the given ID does not exist'
      });
    }
    
    res.json({
      success: true,
      message: 'Book retrieved successfully',
      data: book
    });
  } catch (error: any) {
    res.status(500).json({
      message: 'Error retrieving book',
      success: false,
      error: error.message
    });
  }
});

// Update Book
router.put('/books/:bookId', async (req: Request<{ bookId: string }>, res: Response) => {
  try {
    const { bookId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).json({
        message: 'Invalid book ID format',
        success: false,
        error: 'Invalid ObjectId'
      });
    }
    
    const book = await Book.findByIdAndUpdate(
      bookId, 
      req.body, 
      { 
        new: true,
        runValidators: true
      }
    );
    
    if (!book) {
      return res.status(404).json({
        message: 'Book not found',
        success: false,
        error: 'Book with the given ID does not exist'
      });
    }
    
    // Update availability if copies were modified
    if (req.body.copies !== undefined) {
      await book.updateAvailability();
    }
    
    res.json({
      success: true,
      message: 'Book updated successfully',
      data: book
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
      message: 'Error updating book',
      success: false,
      error: error.message
    });
  }
});

// Delete Book
router.delete('/books/:bookId', async (req: Request<{ bookId: string }>, res: Response) => {
  try {
    const { bookId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).json({
        message: 'Invalid book ID format',
        success: false,
        error: 'Invalid ObjectId'
      });
    }
    
    const book = await Book.findByIdAndDelete(bookId);
    
    if (!book) {
      return res.status(404).json({
        message: 'Book not found',
        success: false,
        error: 'Book with the given ID does not exist'
      });
    }
    
    res.json({
      success: true,
      message: 'Book deleted successfully',
      data: null
    });
  } catch (error: any) {
    res.status(500).json({
      message: 'Error deleting book',
      success: false,
      error: error.message
    });
  }
});

export default router;

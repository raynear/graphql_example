import mongoose, { Schema, Document } from 'mongoose';

const authorSchema = new Schema({
	name: { type: String },
	books: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }]
});

export const Author = mongoose.model('Author', authorSchema);

const bookSchema = new Schema({
	title: { type: String },
	authors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Author' }],
	isbn: { type: String },
	published_date: { type: Date, default: Date.now }
});

export const Book = mongoose.model('Book', bookSchema);

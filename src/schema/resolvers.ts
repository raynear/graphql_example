import { AuthenticationError } from 'apollo-server-express';

import ISODate from './dateType';
import { Book, Author } from '../models/book';

function onlyUser(user:any) {
  if(!user)
    throw new AuthenticationError("Only User")
}

function onlyAdmin(user:any) {
  if(!user || !user.admin)
    throw new AuthenticationError("Only Admin")
}

const resolvers = {
  ISODate,
  Query: {
    ping: () => "pong",
    book: async (parent:any, args:any, context:any) => {
      console.log("book");
      onlyUser(context.user);
      // console.log("parent", parent);
      // console.log("args", args);
      // console.log("context", context);
      const book = await Book.findOne({title:args.title}).populate('authors');
      // console.log("book", book);
      return book;
    },
    author: async (parent:any, args:any, context:any) => {
      console.log("author");
      onlyUser(context.user);
      // console.log("args!!!", args);
      const author = await Author.findOne({_id:args.ID});
      // console.log("author", author);
      return author;
    }
  },
  Mutation: {
    addBook: async (parent:any, args:any, context:any) => {
      console.log("addBook");
      onlyUser(context.user);
      // console.log("parent", parent);
      // console.log("args", args);
      // console.log("context", context);

      const authorList = [];
      const authorIdList = [];
      for(const aAuthor of args.authors) {
        let author = await Author.findOne({name:aAuthor.name})
        if(!author)
          author = await Author.create({name:aAuthor.name});

          authorList.push(author);
          authorIdList.push(author._id);
      }

      // console.log("AuthorList", authorList);
      // console.log("AuthorIdList", authorIdList);

      const book = await Book.findOne({title:args.title});
      if(book) {
        const retVal = await Book.findOneAndUpdate({title:args.title}, {title:args.title, authors:authorIdList, isbn:args.isbn, published_date:args.published_date}).populate('authors');
        // console.log(retVal);
        return retVal;
      } else {
        const retVal = await Book.create({title:args.title, authors:authorIdList, isbn:args.isbn, published_date:args.published_date});
        // for(const author of retVal.authors) {
        //   Author.findOneAndUpdate({_id:author._id}, {$push: {books: retVal._id}});
        // }
        // console.log(retVal);
        return retVal;
      }
    }
  }
}

export default resolvers
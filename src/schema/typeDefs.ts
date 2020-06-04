import { gql } from 'apollo-server-express';
import ISODate from './dateType';

const typeDefs = gql`
  scalar ISODate

  type Book {
    title: String
    authors: [Author]
    isbn: String
    published_date: ISODate
  }
  type Author {
    name: String
  }

  input AuthorInput {
    name: String
  }
  input BookInput {
    title: String
    authors: [AuthorInput]
    isbn: String
    published_date: ISODate
  }

  type Query {
    ping: String
    book(title:String, authorName:String, isbn:String): Book
    books: [Book]
    author(name:String, ID:String): Author
    authors: [Author]
  }
  type Mutation {
    addBook(title:String!, authors:[AuthorInput]!, isbn:String!, published_date:ISODate!): Book
  }
`

export default typeDefs
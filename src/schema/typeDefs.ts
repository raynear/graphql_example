import { gql } from 'apollo-server-express';
import ISODate from './dateType';

const typeDefs = gql`
  scalar ISODate

  """
  Book Object
  **need more information of books**
  """
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
    """
    Book info
    return single *book* information
    """
    book(title:String, authorName:String, isbn:String): Book
    """
    Book info List
    return *book* list information
    """
    books: [Book]
    """get *author* by name or ID or both"""
    author(
      "search *author* by name"
      name:String,
      "search *author* by ID"
      ID:String
      ): Author
    """get all author list"""
    authors: [Author]
  }
  type Mutation {
    addBook(title:String!, authors:[AuthorInput]!, isbn:String!, published_date:ISODate!): Book
  }
`

export default typeDefs
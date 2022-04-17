const { ApolloServer, gql } = require('apollo-server');

const dummyBookData = [
  {
    id: '1',
    name: 'book1',
    genre: 'action',
    authorId: '1',
  },
  {
    id: '2',
    name: 'book3',
    genre: 'action2',
    authorId: '1',
  },
  {
    id: '3',
    name: 'book3',
    genre: 'action3',
    authorId: '2',
  },
];
const dummyAuthorData = [
  {
    id: '1',
    name: 'author1',
    internationalAddress: 'local',
  },
  {
    id: '2',
    name: 'author2',
    internationalAddress: 'internationalAddress',
  },
];

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql`
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # the entity type
  type Book {
    id: ID
    name: String
    genre: String
    author: Author
  }

  interface Author {
    id: ID
    name: String
    books: [Book!]!
  }

  type LocalAuthor implements Author {
    id: ID
    name: String
    books: [Book!]!
    localAddress: String
  }

  type InternationalAuthor implements Author {
    id: ID
    name: String
    books: [Book!]!
    language: String
    internationalAddress: String
  }

  # The root "Query" type
  type Query {
    books: [Book!]!
    book(id: ID!): Book
    authors: [Author!]!
    author(id: ID!): Author
    localAuthors: [LocalAuthor!]!
  }

  input AddBookInput {
    id: ID
    name: String
    authorId: String
    genre: String
  }

  type Mutation {
    addBook(data: AddBookInput!): Book
  }
`;

const resolvers = {
  Query: {
    books: () => dummyBookData,
    authors: () => dummyAuthorData,
    book: (parent, args) => {
      throw new Error('native nodejs error');
      // return dummyBookData.find((item) => item.id === args.id);
    },
    author: (parent, args) => {
      return dummyAuthorData.find((item) => item.id === args.id);
    },
    localAuthors: (parent, args) => {
      return dummyAuthorData.filter((item) => !!item.localAddress);
    },
  },
  Mutation: {
    addBook: async (_, args) => {
      const data = {
        ...args.data,
      };
      dummyBookData.push(data);
      return data;
    },
  },
  Book: {
    author(parent, args) {
      return dummyAuthorData.find((item) => item.id === parent.authorId);
    },
  },
  Author: {
    __resolveType(parent, context, info) {
      if (parent.localAddress) {
        return 'LocalAuthor';
      }

      if (parent.internationalAddress) {
        return 'InternationalAuthor';
      }

      return null;
    },
    // books(parent, args) {
    //   return dummyBookData.filter((item) => item.authorId === parent.id);
    // },
  },
};

module.exports = {
  typeDefs,
  resolvers,
};

/**
 * authors{
    ... on LocalAuthor {
      id
      name
    }
    ... on InternationalAuthor {
      id
      name
    }
  }
 */

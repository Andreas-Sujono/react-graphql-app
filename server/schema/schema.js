const graphql = require('graphql');

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLList,
} = graphql;

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
  },
  {
    id: '2',
    name: 'author2',
  },
];

//entities
const BookType = new GraphQLObjectType({
  name: 'Book',
  fields: () => ({
    id: {
      type: GraphQLID,
    },
    name: {
      type: GraphQLString,
    },
    genre: {
      type: GraphQLString,
    },
    author: {
      type: AuthorType,
      resolve(parent, args) {
        const data = dummyAuthorData.find(
          (item) => item.id === parent.authorId
        );
        return data;
      },
    },
  }),
});
const AuthorType = new GraphQLObjectType({
  name: 'Author',
  fields: () => ({
    id: {
      type: GraphQLID,
    },
    name: {
      type: GraphQLString,
    },
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        return dummyBookData.filter((item) => item.authorId === parent.id);
      },
    },
  }),
});

//controller
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    book: {
      type: BookType,
      args: {
        id: {
          type: GraphQLID,
        },
      },
      //services
      resolve(parent, args) {
        //get data from DB
        const data = dummyBookData.find((item) => item.id === args.id);
        return data;
      },
    },
    author: {
      type: AuthorType,
      args: {
        id: {
          type: GraphQLID,
        },
      },
      //services
      resolve(parent, args) {
        //get data from DB
        const data = dummyAuthorData.find((item) => item.id === args.id);
        return data;
      },
    },
    books: {
      type: new GraphQLList(BookType),
      //services
      resolve(parent, args) {
        return dummyBookData;
      },
    },
  },
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addBook: {
      type: BookType,
      args: {
        name: {
          type: GraphQLString,
        },
        genre: {
          type: GraphQLString,
        },
      },
      resolve(parent, args) {
        const data = {
          id: (dummyBookData.length + 1).toString(),
          name: args.name,
          genre: args.genre,
        };
        dummyBookData.push(data);
        return data;
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});

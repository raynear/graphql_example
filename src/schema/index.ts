import { ApolloServer, gql, AuthenticationError } from 'apollo-server-express';
import jsonwebtoken from 'jsonwebtoken';
import * as User from '../models/user';

import resolvers from './resolvers';
import typeDefs from './typeDefs';

const schema = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({req}) => {
    // console.log("req header", req.headers);
    let user;
    if (req.headers.authorization) {
      const token = req.headers.authorization.substr(7) as string;
      const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET as string) as any;
      // console.log(decoded);
      // console.log(Date.now());
      if (decoded.exp*1000 < Date.now()) {
        console.log("expired token");
        throw new AuthenticationError("expired token");
      }
      user = await User.findByEmail(decoded.email);
      // const user = users.find((user) => user.token === token);
      // if (!user) throw new AuthenticationError("invalid token");
    }
    return { user };
  },
  playground: {
    endpoint: '/graphql',
    settings: {
      'editor.theme': 'dark'
    }
  }
});

export default schema;
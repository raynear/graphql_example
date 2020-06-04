import { Kind } from 'graphql/language';
import { GraphQLScalarType } from 'graphql';

const returnOnError = (operation:any, alternative:any) => {
  try {
    return operation();
  } catch (e) {
    return alternative;
  }
};

function serialize(value:any) {
  return value instanceof Date ? value.toISOString() : null;
}

function parseValue(value:any) {
  return returnOnError(() => value == null ? null : new Date(value), null);
}

function parseLiteral(ast:any) {
  return ast.kind === Kind.STRING ? parseValue(ast.value) : null;
}

export default new GraphQLScalarType({
  name: 'ISODate',
  description: 'JavaScript Date object as an ISO timestamp',
  serialize, parseValue, parseLiteral
});
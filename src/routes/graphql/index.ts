import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { RootQuery, createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { GraphQLSchema, graphql } from 'graphql';

const mySchema: GraphQLSchema = new GraphQLSchema({
  query: RootQuery,
});

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { prisma, httpErrors } = fastify;

  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(req) {
      const query = req.body.query;
      const variables = req.body.variables;

      const result = await graphql({
        schema: mySchema,
        source: query,
        variableValues: variables,
        contextValue: fastify,
      });
      return result;
    },
  });
};

export default plugin;

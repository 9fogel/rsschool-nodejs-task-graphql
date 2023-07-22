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
      //TODO: вызов graphql сделать с нужными параметрами (схема, текст запроса, переменные)
      // console.log(req.body.query);
      // console.log(req.body.variables);

      const query = req.body.query;

      const result = await graphql({
        schema: mySchema,
        source: query,
        contextValue: fastify,
      });
      return result;
    },
  });
};

export default plugin;

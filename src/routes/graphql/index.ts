import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { RootQuery, Mutation, createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { GraphQLSchema, graphql, validate, parse } from 'graphql';
import depthLimit from 'graphql-depth-limit';

const mySchema: GraphQLSchema = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { prisma } = fastify;

  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(req, rep) {
      const query = req.body.query;
      const variables = req.body.variables;

      try {
        const errorsList = validate(mySchema, parse(query), [ depthLimit(5) ]);
        if (errorsList.length > 0) {
          throw new Error();
        }
      } catch (error) {
        if (error instanceof Error) {
          return await rep.send({
            errors: [ { message: 'exceeds maximum operation depth of 5' } ],
          });
        }
      }


      const result = await graphql({
        schema: mySchema,
        source: query,
        variableValues: variables,
        contextValue: {
          prisma,
          dataloaders: new WeakMap(),
        }
      });
      return result;
    },
  });
};

export default plugin;

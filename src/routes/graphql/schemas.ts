/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Type } from '@fastify/type-provider-typebox';
import { GraphQLFloat, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString, GraphQLNonNull } from 'graphql';
import { MemberType } from '@prisma/client';

export const gqlResponseSchema = Type.Partial(
  Type.Object({
    data: Type.Any(),
    errors: Type.Any(),
  }),
);

export const createGqlResponseSchema = {
  body: Type.Object(
    {
      query: Type.String(),
      variables: Type.Optional(Type.Record(Type.String(), Type.Any())),
    },
    {
      additionalProperties: false,
    },
  ),
};

const MemberType = new GraphQLObjectType({
  name: 'memberType',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLString) },
    discount: { type: GraphQLFloat },
    postsLimitPerMonth: { type: GraphQLInt },
  }),
});

export const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    memberType: {
      type: MemberType,
      args: { id: { type: GraphQLString } },
      resolve: async (_, args: { id: string }, context) => {
        const memberType: MemberType | null = await context.prisma.memberType.findUnique({
          where: {
            id: args.id,
          },
        })
        return memberType;
      }
    },
    memberTypes: {
      type:  new GraphQLList(MemberType),
      args: {},
      resolve: async (_, args, context) => {
        const memberTypes: Array<MemberType> | Array<null> = await context.prisma.memberType.findMany();
        return memberTypes;
      }
    }
  }
});
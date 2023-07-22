/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Type } from '@fastify/type-provider-typebox';
import { GraphQLFloat, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString, GraphQLNonNull, GraphQLBoolean } from 'graphql';
// import { MemberType } from '@prisma/client';
import { UUIDType } from './types/uuid.js';

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

const PostType = new GraphQLObjectType({
  name: 'post',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    title: { type: GraphQLString },
    content: { type: GraphQLString },
    authorId:{ type: UUIDType },
  }),
});

const ProfileType = new GraphQLObjectType({
  name: 'profile',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    userId: { type: UUIDType },
    memberTypeId: { type: GraphQLString },
  }),
});

const UserType = new GraphQLObjectType({
  name: 'user',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
  }),
});

export const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    memberType: {
      type: MemberType,
      args: { id: { type: GraphQLString } },
      resolve: async (_, args: { id: string }, context) => {
        const memberType: typeof MemberType | null = await context.prisma.memberType.findUnique({
          where: {
            id: args.id,
          },
        });
        return memberType;
      }
    },
    memberTypes: {
      type:  new GraphQLList(MemberType),
      args: {},
      resolve: async (_, args, context) => {
        const memberTypes: Array<typeof MemberType> | Array<null> = await context.prisma.memberType.findMany();
        return memberTypes;
      }
    },
    post: {
      type: PostType,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (_, args: { id: string }, context) => {
        const post: typeof PostType = await context.prisma.post.findUnique({
          where: {
            id: args.id,
          },
        });
        return post;
      }
    },
    posts: {
      type: new GraphQLList(PostType),
      args: {},
      resolve: async (_, args, context) => {
        const posts: Array<typeof PostType> | Array<null> = await context.prisma.post.findMany();
        return posts;
      }
    },
    profile: {
      type: ProfileType,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (_, args: { id: string }, context) => {
        const profile: typeof ProfileType = await context.prisma.profile.findUnique({
          where: {
            id: args.id,
          },
        })
        return profile;
      }
    },
    profiles: {
      type: new GraphQLList(ProfileType),
      args: {},
      resolve: async (_, args, context) => {
        const profiles: Array<typeof ProfileType> | Array<null> = await context.prisma.profile.findMany();
        return profiles;
      }
    },
    user: {
      type: UserType,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (_, args: { id: string }, context) => {
        const user: typeof UserType = await context.prisma.user.findUnique({
          where: {
            id: args.id,
          },
        });
        return user;
      }
    },
    users: {
      type: new GraphQLList(UserType),
      args: {},
      resolve: async (_, args, context) => {
        const users: Array<typeof UserType> | Array<null> = await context.prisma.user.findMany();
        return users;
      }
    }
  }
});
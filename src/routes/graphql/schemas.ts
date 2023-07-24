/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Type } from '@fastify/type-provider-typebox';
import { GraphQLFloat, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString, GraphQLNonNull, GraphQLBoolean, GraphQLInputObjectType } from 'graphql';
import { UUIDType } from './types/uuid.js';
import MemberTypeIdType from './enum.js';

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
    id: { type: new GraphQLNonNull(MemberTypeIdType) },
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
    authorId:{ type: new GraphQLNonNull(UUIDType) },
  }),
});

const ProfileType = new GraphQLObjectType({
  name: 'profile',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    userId: { type: new GraphQLNonNull(UUIDType) },
    memberTypeId: { type: GraphQLString },
    memberType: {
      type: MemberType,
      resolve: async (parent, _, context) => {
        try {
          const memberType: typeof MemberType | null = await context.prisma.memberType.findUnique({
            where: {
              id: parent.memberTypeId,
            },
          });
          return memberType;
        } catch {
          return null;
        }
      }
    }
  }),
});

const UserType = new GraphQLObjectType({
  name: 'user',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
    profile: {
      type: ProfileType,
      resolve: async (parent, _, context) => {
        try {
          const profile: typeof ProfileType | null = await context.prisma.profile.findUnique({
            where: {
              userId: parent.id,
            },
          });
          return profile;
        } catch {
          return null;
        }
      }
    },
    posts: {
      type: new GraphQLList(PostType),
      resolve: async (parent, _, context) => {
        try {
          const posts: Array<typeof PostType> | Array<null> = await context.prisma.post.findMany({
            where: {
              authorId: {
                equals: parent.id,
              }
            }
          });
          return posts;
        } catch {
          return null;
        }
      }
    },
    userSubscribedTo: {
      type: new GraphQLList(UserType),
      resolve: async (parent, _, context) => {
        try {
          const users: Array<typeof UserType> | Array<null> = await context.prisma.user.findMany({
            where: {
              subscribedToUser: {
                some: {
                  subscriberId: parent.id,
                },
              },
            },
          });;
          return users;
        } catch {
          return null;
        }
      }
    },
    subscribedToUser: {
      type: new GraphQLList(UserType),
      resolve: async (parent, _, context) => {
        try {
          const users: Array<typeof UserType> | Array<null> = await context.prisma.user.findMany({
            where: {
              userSubscribedTo: {
                some: {
                  authorId: parent.id,
                },
              },
            },
          });;
          return users;
        } catch {
          return null;
        }
      }
    }
  }),
});

export const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    memberType: {
      type: MemberType,
      args: { id: { type: new GraphQLNonNull(MemberTypeIdType) } },
      resolve: async (_, args: { id: string }, context) => {
        try {
          const memberType: typeof MemberType | null = await context.prisma.memberType.findUnique({
            where: {
              id: args.id,
            },
          });
          return memberType;
        } catch {
          return null;
        }
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
        try {
          const post: typeof PostType | null = await context.prisma.post.findUnique({
            where: {
              id: args.id,
            },
          });
          return post;
        } catch {
          return null;
        }
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
        try {
          const profile: typeof ProfileType | null = await context.prisma.profile.findUnique({
            where: {
              id: args.id,
            },
          });
          return profile;
        } catch {
          return null;
        }
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
        try {
          const user: typeof UserType | null = await context.prisma.user.findUnique({
            where: {
              id: args.id,
            },
          });
          return user;
        } catch {
          return null;
        }
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

const createPostDto = new GraphQLInputObjectType({
  name: 'CreatePostInput',
  fields: () => ({
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
    authorId:{ type: new GraphQLNonNull(UUIDType) },
  }),
});

const createUserDto = new GraphQLInputObjectType({
  name: 'CreateUserInput',
  fields: () => ({
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
  }),
});

const createProfileDto = new GraphQLInputObjectType({
  name: 'CreateProfileInput',
  fields: () => ({
    isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
    yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
    userId: { type: new GraphQLNonNull(UUIDType) },
    memberTypeId: { type: new GraphQLNonNull(GraphQLString) },
  }),
});

const changePostDto = new GraphQLInputObjectType({
  name: 'ChangePostInput',
  fields: () => ({
    title: { type: GraphQLString },
    content: { type: GraphQLString },
    authorId:{ type: UUIDType },
  }),
});

const changeUserDto = new GraphQLInputObjectType({
  name: 'ChangeUserInput',
  fields: () => ({
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
  }),
});

const changeProfileDto = new GraphQLInputObjectType({
  name: 'ChangeProfileInput',
  fields: () => ({
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    memberTypeId: { type: GraphQLString },
  }),
});

export const Mutation = new GraphQLObjectType({
  name: 'mutation',
  fields: {
    createPost: {
      type: PostType,
      args: { dto: { type: new GraphQLNonNull(createPostDto)} },
      resolve: async (_, args, context) => {
        const newPost: typeof PostType = await context.prisma.post.create({
          data: args.dto,
        });
      return newPost;
      }
    },
    createUser: {
      type: UserType,
      args: { dto: { type: new GraphQLNonNull(createUserDto)} },
      resolve: async (_, args, context) => {
        const newUser: typeof UserType = await context.prisma.user.create({
          data: args.dto,
        });
      return newUser;
      }
    },
    createProfile: {
      type: ProfileType,
      args: { dto: { type: new GraphQLNonNull(createProfileDto)} },
      resolve: async (_, args, context) => {
        const newProfile: typeof ProfileType = await context.prisma.profile.create({
          data: args.dto,
        });
      return newProfile;
      }
    },
    changePost: {
      type: PostType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(changePostDto)}
      },
      resolve: async (_, args, context) => {
        const updatedPost: typeof PostType = await context.prisma.post.update({
          where: { id: args.id },
          data: args.dto,
        });
      return updatedPost;
      }
    },
    changeUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(changeUserDto)}
      },
      resolve: async (_, args, context) => {
        const updatedUser: typeof UserType = await context.prisma.user.update({
          where: { id: args.id },
          data: args.dto,
        });
      return updatedUser;
      }
    },
    changeProfile: {
      type: ProfileType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(changeProfileDto)}
      },
      resolve: async (_, args, context) => {
        const updatedProfile: typeof ProfileType = await context.prisma.profile.update({
          where: { id: args.id },
          data: args.dto,
        });
      return updatedProfile;
      }
    },
    deletePost: {
      type: GraphQLBoolean,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (_, args, context) => {
        const deletedPost = await context.prisma.post.delete({
          where: {
            id: args.id,
          },
        });
        return !!deletedPost;
      }
    },
    deleteUser: {
      type: GraphQLBoolean,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (_, args, context) => {
        const deletedUser = await context.prisma.user.delete({
          where: {
            id: args.id,
          },
        });
        return !!deletedUser;
      }
    },
    deleteProfile: {
      type: GraphQLBoolean,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (_, args, context) => {
        const deletedProfile = await context.prisma.profile.delete({
          where: {
            id: args.id,
          },
        });
        return !!deletedProfile;
      }
    },
    subscribeTo: {
      type: UserType,
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_, args, context) => {
        const updatedUser = context.prisma.user.update({
          where: {
            id: args.userId,
          },
          data: {
            userSubscribedTo: {
              create: {
                authorId: args.authorId,
              },
            },
          },
        });
        return updatedUser;
      }

    },
    unsubscribeFrom: {
      type: GraphQLBoolean,
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_, args, context) => {
        const result = await context.prisma.subscribersOnAuthors.delete({
          where: {
            subscriberId_authorId: {
              subscriberId: args.userId,
              authorId: args.authorId,
            },
          },
        });
        return !!result;
      }
    }
  }
})
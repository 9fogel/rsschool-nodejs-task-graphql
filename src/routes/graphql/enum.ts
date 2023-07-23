/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  GraphQLEnumType,
} from 'graphql';
import { MemberTypeId } from '../member-types/schemas.js';

const MemberTypeIdType = new GraphQLEnumType({
  name: 'MemberTypeId',
  values: {
    basic: {
      value: MemberTypeId.BASIC,
    },
    business: {
      value: MemberTypeId.BUSINESS,
    },
  },
});

export default MemberTypeIdType;
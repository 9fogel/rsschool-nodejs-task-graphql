/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  GraphQLEnumType,
} from 'graphql';
import { MemberTypeId } from '../member-types/schemas.js';

const MemberTypeIdType = new GraphQLEnumType({
  name: 'MemberTypeId',
  values: {
    BASIC: {
      value: MemberTypeId.BASIC,
      // value: MemberTypeId.BASIC.toUpperCase(),
      // value: MemberTypeId[0],
    },
    BUSINESS: {
      value: MemberTypeId.BUSINESS,
      // value: MemberTypeId[1],
    },
  },
});

export default MemberTypeIdType;
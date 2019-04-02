import joi from '@app/utils/validators/customJoi';
import { paginationObject } from '@app/utils/validators/common';

export default {
  '/users/:id': {
    PATCH: joi.object({
      id: joi
        .string()
        .objectId()
        .required(),
      firstName: joi.string().alphanum(),
      lastName: joi.string().alphanum(),
      email: joi.string().email(),
    }),
  },
  '/users/': {
    GET: paginationObject,
  },
};

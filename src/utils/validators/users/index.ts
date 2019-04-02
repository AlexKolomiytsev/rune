import joi from '@app/utils/validators/customJoi';

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
};

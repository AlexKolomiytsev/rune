import joi from '@app/utils/validators/customJoi';

const credentials = {
  email: joi
    .string()
    .email()
    .required(),
  password: joi.string().required(),
};

export default {
  '/auth/login': {
    POST: joi.object(credentials),
  },
  '/auth/sign-up': {
    POST: joi.object({
      firstName: joi
        .string()
        .alphanum()
        .required(),
      lastName: joi
        .string()
        .alphanum()
        .required(),
      ...credentials,
    }),
  },
};

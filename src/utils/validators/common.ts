import joi from '@app/utils/validators/customJoi';

export const paginationParams = {
  skip: joi.number(),
  limit: joi.number(),
  search: joi.string().alphanum(),
};

export const paginationObject = joi.object(paginationParams);

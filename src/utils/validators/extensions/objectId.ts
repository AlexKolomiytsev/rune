import { isMongoId } from 'validator';
import { Root } from 'joi';

export default (joi: Root) => ({
  base: joi.string(),
  name: 'string',
  language: {
    objectId: 'must be a valid ObjectId',
  },
  rules: [
    {
      name: 'objectId',
      validate(_: any, value: string, state: any, options: any) {
        if (!isMongoId(value)) {
          return this.createError('string.objectId', { value }, state, options);
        }

        return value;
      },
    },
  ],
});

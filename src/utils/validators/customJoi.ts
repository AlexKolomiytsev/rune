import * as Joi from 'joi';

import objectId from '@app/utils/validators/extensions/objectId';

export default Joi.extend(objectId);

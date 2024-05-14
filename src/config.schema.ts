// config.schema.ts

import * as Joi from 'joi';

const validationSchema = Joi.object({
  JWT_ACC_SECRET: Joi.string().required(),
  DATABASE_URL: Joi.string().required(),
  JWT_RESH_SECRET: Joi.string().required(),
  EMAIL_SERVICE: Joi.string().required(),
  EMAIL_HOST: Joi.string().required(),
  EMAIL_USER: Joi.string().required(),
  EMAIL_PASS: Joi.string().required(),
});

export default validationSchema;

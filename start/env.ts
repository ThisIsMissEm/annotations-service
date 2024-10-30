/*
|--------------------------------------------------------------------------
| Environment variables service
|--------------------------------------------------------------------------
|
| The `Env.create` method creates an instance of the Env service. The
| service validates the environment variables and also cast values
| to JavaScript data types.
|
*/

import { Env } from '@adonisjs/core/env'

export default await Env.create(new URL('../', import.meta.url), {
  NODE_ENV: Env.schema.enum(['development', 'production', 'test'] as const),
  LOG_LEVEL: Env.schema.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace'] as const),

  HOST: Env.schema.string({ format: 'host' }),
  PORT: Env.schema.number(),

  APP_KEY: Env.schema.string(),

  /*
  |----------------------------------------------------------
  | Variables for configuring session package
  |----------------------------------------------------------
  */
  SESSION_DRIVER: Env.schema.enum(['cookie', 'memory'] as const),

  /*
  |----------------------------------------------------------
  | Variables for configuring database connection
  |----------------------------------------------------------
  */
  DATABASE_HOST: Env.schema.string({ format: 'host' }),
  DATABASE_PORT: Env.schema.number(),
  DATABASE_USER: Env.schema.string(),
  DATABASE_PASSWORD: Env.schema.string.optional(),
  DATABASE_NAME: Env.schema.string(),
  DATABASE_USE_SSL: Env.schema.boolean.optional(),
})
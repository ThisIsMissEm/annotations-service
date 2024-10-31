import type { ConnectionOptions } from 'node:tls'

import fs from 'node:fs'
import env from '#start/env'
import app from '@adonisjs/core/services/app'
import { defineConfig } from '@adonisjs/lucid'

// Type compatible with the `ssl` option from Adonis:
let sslOptions: boolean | ConnectionOptions | undefined = false

if (env.get('DATABASE_USE_SSL')) {
  sslOptions = {
    ca: fs.readFileSync(app.makePath('database', 'ca.pem'), 'ascii'),
  }
}

const dbConfig = defineConfig({
  connection: 'postgres',
  prettyPrintDebugQueries: app.inDev,

  connections: {
    postgres: {
      client: 'pg',
      connection: {
        host: env.get('DATABASE_HOST'),
        port: env.get('DATABASE_PORT'),
        user: env.get('DATABASE_USER'),
        password: env.get('DATABASE_PASSWORD', ''),
        database: env.get('DATABASE_NAME'),
        ssl: sslOptions,
      },
      migrations: {
        naturalSort: true,
        paths: ['database/migrations'],
      },
      debug: app.inDev,
    },
  },
})

export default dbConfig

import { defineConfig } from '@adonisjs/core/bodyparser'
import { ANNOTATION_TYPE } from '#utils/constants'

const bodyParserConfig = defineConfig({
  /**
   * The bodyparser middleware will parse the request body
   * for the following HTTP methods.
   */
  allowedMethods: ['POST', 'PUT', 'PATCH', 'DELETE'],

  /**
   * Config for the "application/x-www-form-urlencoded"
   * content-type parser
   */
  form: {
    convertEmptyStringsToNull: true,
    types: ['application/x-www-form-urlencoded'],
  },

  /**
   * Config for the JSON parser
   */
  json: {
    convertEmptyStringsToNull: true,
    types: [ANNOTATION_TYPE, 'application/ld+json', 'application/json', 'application/csp-report'],
  },

  /**
   * Config for the "multipart/form-data" content-type parser.
   * File uploads are handled by the multipart parser.
   */
  multipart: {
    autoProcess: false,
    maxFields: 0,
    fieldsLimit: 0,
    limit: 0,
    types: ['multipart/form-data'],
  },
})

export default bodyParserConfig

import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'annotations'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('gen_random_uuid()'))

      table.text('target_iri').notNullable()
      table.text('content').notNullable()

      table.uuid('creator_id').notNullable()
      table.specificType('collection_id', 'bytea').notNullable()

      table.foreign('creator_id').references('users.id')

      table.timestamp('created_at')
      table.timestamp('updated_at')

      table.index('creator_id')
      table.index('collection_id', 'index_annotations_on_collection_id', 'btree')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

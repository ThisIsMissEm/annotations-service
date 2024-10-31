import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { createHash } from 'node:crypto'
import { v7 as uuid } from 'uuid'
import { DateTime } from 'luxon'
import {
  BaseModel,
  beforeCreate,
  beforeSave,
  belongsTo,
  column,
  computed,
} from '@adonisjs/lucid/orm'
import User from './user.js'

export default class Annotation extends BaseModel {
  static getCollectionId(iri: string): string {
    return createHash('sha256').update(new URL(iri).href, 'utf-8').digest('hex')
  }

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare content: string

  @column()
  declare targetIri: string

  @column()
  declare collectionId: Buffer

  @column()
  declare creatorId: string

  @belongsTo(() => User)
  declare creator: BelongsTo<typeof User>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @beforeCreate()
  static setId(annotation: Annotation) {
    annotation.id = uuid()
  }

  @beforeSave()
  static setCollectionId(annotation: Annotation) {
    if (annotation.$dirty.targetIri) {
      annotation.collectionId = this.getCollectionId(annotation.targetIri)
    }
  }
}

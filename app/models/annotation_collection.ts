import db from '@adonisjs/lucid/services/db'
import Annotation from './annotation.js'
import { DateTime } from 'luxon'
import { ModelPaginatorContract } from '@adonisjs/lucid/types/model'

export interface PaginationArguments {
  page: number
  limit: number
}

export interface AnnotationCollectionInterface {
  id: string
  total: number
  modified: DateTime
  target: string
  items: ModelPaginatorContract<Annotation>
}

export default class AnnotationCollection {
  private static findItemsByHash(hash: string) {
    return Annotation.query().where(db.raw(`collection_id = decode(?, 'hex')`, hash))
  }

  static async findByTargetIri(iri: string) {
    return this.items(Annotation.getCollectionId(iri).toString('hex'))
  }

  static async items(hash: string, { page, limit }: PaginationArguments = { page: 1, limit: 20 }) {
    return this.findItemsByHash(hash).paginate(page, limit)
  }

  static async find(
    hash: string,
    pagination: PaginationArguments = { page: 1, limit: 20 }
  ): Promise<AnnotationCollectionInterface | null> {
    const latestRow = await this.findItemsByHash(hash).orderBy('updatedAt', 'desc').first()

    if (!latestRow) return null

    const items = await this.items(hash, pagination)

    return {
      id: latestRow?.collectionId.toString('hex'),
      total: items.total,
      modified: latestRow.updatedAt,
      target: latestRow.targetIri,
      items: items,
    }
  }
}

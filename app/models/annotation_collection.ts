import db from '@adonisjs/lucid/services/db'
import Annotation from './annotation.js'

export interface PaginationArguments {
  page: number
  limit: number
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

  static async find(hash: string, pagination: PaginationArguments = { page: 1, limit: 20 }) {
    const latestRow = await this.findItemsByHash(hash).orderBy('updatedAt', 'desc').first()
    const items = await this.items(hash, pagination)

    return latestRow
      ? {
          id: latestRow?.collectionId.toString('hex'),
          total: items.total,
          modified: latestRow.updatedAt.toFormat("yyyy-MM-dd'T'HH:mm:ss'Z'"),
          target: latestRow.targetIri,
          items: items,
        }
      : null
  }
}

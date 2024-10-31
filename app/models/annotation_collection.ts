import { ModelQueryBuilderContract } from '@adonisjs/lucid/types/model'
import Annotation from './annotation.js'
import { createHash } from 'node:crypto'

export interface PaginationArguments {
  page: number
  limit: number
}

export default class AnnotationCollection {
  private static findItemsByHash(hash: string) {
    return Annotation.query().where({ collection_id: hash })
  }

  static async findByTargetIri(iri: string) {
    return this.items(Annotation.getCollectionId(iri))
  }

  static async items(hash: string, { page, limit }: PaginationArguments = { page: 1, limit: 20 }) {
    return this.findItemsByHash(hash).paginate(page, limit)
  }
}

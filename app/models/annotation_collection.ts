import db from '@adonisjs/lucid/services/db'
import Annotation from './annotation.js'
import { DateTime } from 'luxon'
import {
  ModelAdapterOptions,
  ModelObject,
  ModelPaginatorContract,
} from '@adonisjs/lucid/types/model'
import logger from '@adonisjs/core/services/logger'
import { isObject } from '@adonisjs/lucid/utils'

export interface PaginationArguments {
  page: number
  limit: number
}

export interface AnnotationCollectionAttributes {
  id: string
  readonly total: number
  readonly created: DateTime
  readonly modified: DateTime
  readonly target: string
}

export interface AnnotationCollectionModelObject {
  $attributes: ModelObject
  items(options: PaginationArguments): Promise<ModelPaginatorContract<Annotation>>
}

export interface AnnotationCollectionModel {
  new (): AnnotationCollectionModelObject
}

function $findAnnotationsByHash(hash: string, options?: ModelAdapterOptions) {
  return Annotation.query(options).where(db.raw(`collection_id = decode(?, 'hex')`, hash))
}

function StaticImplements<T>() {
  return (_t: T) => {}
}

/**
 * Abstract class to define fully fledged data models
 */
@StaticImplements<AnnotationCollectionModel>()
export default class AnnotationCollection implements AnnotationCollectionModelObject {
  static async find(hash: string): Promise<AnnotationCollection & AnnotationCollectionAttributes> {
    const collection = await db.transaction<AnnotationCollectionAttributes>(async (tx) => {
      const query = $findAnnotationsByHash(hash, { client: tx })
      const metadata = await query
        .clone()
        .select(
          db.raw(`
            encode(collection_id, 'hex') as collection_id,
            count(collection_id) as total,
            target_iri
          `)
        )
        .pojo<{ collection_id: string; target_iri: string; total: string }>()
        .groupBy('collection_id', 'target_iri')
        .firstOrFail()

      const newest = await query
        .clone()
        .select('updated_at', 'id')
        .orderBy('id', 'desc')
        .pojo<{ updated_at: Date; id: string }>()
        .firstOrFail()

      const latest = await query
        .clone()
        .select('created_at', 'id')
        .orderBy('id', 'asc')
        .pojo<{ created_at: Date; id: string }>()
        .firstOrFail()

      return {
        id: metadata.collection_id,
        target: metadata.target_iri,
        total: Number.parseInt(metadata.total, 10),
        modified: DateTime.fromJSDate(newest.updated_at),
        created: DateTime.fromJSDate(latest.created_at),
      }
    })

    return this.$createFromResult(collection)
  }

  private static $createFromResult(adapterResult: ModelObject) {
    const instance = new this()
    if (isObject(adapterResult)) {
      Object.keys(adapterResult).forEach((key) => {
        instance.$attributes[key] = adapterResult[key]
      })
    }
    return instance as AnnotationCollection & AnnotationCollectionAttributes
  }

  $attributes: ModelObject = {}

  constructor() {
    return new Proxy(this, {
      get(target: any, key: any, receiver: any) {
        if (Object.hasOwnProperty.call(target.$attributes, key)) {
          const attributeValue = target.$attributes[key]
          if (attributeValue === undefined) {
            return Reflect.get(target, key, receiver)
          }

          return attributeValue
        }
        return Reflect.get(target, key, receiver)
      },
      set(target: any, key: any, value: any, receiver: any) {
        if (Object.hasOwnProperty.call(target.$attributes, key)) {
          target.$attributes[key] = value
        }
        return Reflect.set(target, key, value, receiver)
      },
      defineProperty(target: any, key: any, value: any) {
        return Reflect.defineProperty(target, key, value)
      },
    })
  }

  items(
    { page, limit }: PaginationArguments = { page: 1, limit: 20 }
  ): Promise<ModelPaginatorContract<Annotation>> {
    return $findAnnotationsByHash(this.$attributes.id).paginate(page, limit)
  }

  toObject() {
    return this.$attributes
  }

  toJSON() {
    return this.$attributes
  }
}

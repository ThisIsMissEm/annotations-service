import AnnotationCollection, {
  AnnotationCollectionAttributes,
  AnnotationCollectionInterface,
} from '#models/annotation_collection'
import { toXsdDate } from '#utils/dates'
import {
  getAnnotationId,
  getCollectionId,
  getCollectionNextPageUrl,
  getCollectionPageId,
  getCollectionPrevPageUrl,
  getCollectionStartIndex,
} from '#utils/links'
import annotationPresenter, { AnnotationRepresentation } from '#presenters/annotation_presenter'
import Annotation from '#models/annotation'
import { ModelPaginatorContract } from '@adonisjs/lucid/types/model'

export type AnnotationPageItems = string[] | AnnotationRepresentation[]

export type AnnotationPage = {
  type: 'AnnotationPage'
  id: string
  partOf: {
    id: string
    total: number
    modified: string
  }
  startIndex: number | undefined
  next: string | undefined
  prev: string | undefined
  items: AnnotationPageItems
}

export default function annotationPagePresenter(
  collection: AnnotationCollection & AnnotationCollectionAttributes,
  items: ModelPaginatorContract<Annotation>,
  baseUrl: string,
  prefersDescriptions: boolean
): AnnotationPage {
  const collectionId = getCollectionId(collection, baseUrl)

  let results: AnnotationPageItems = items
    .all()
    .map((annotation) => getAnnotationId(annotation, baseUrl))

  if (prefersDescriptions) {
    results = items.all().map((annotation) => annotationPresenter(annotation, baseUrl))
  }

  return {
    id: getCollectionPageId(collection, items, baseUrl, prefersDescriptions),
    type: 'AnnotationPage',
    partOf: {
      id: collectionId,
      total: items.total,
      modified: toXsdDate(collection.modified),
    },
    // If the currently requested page is empty, then return no startIndex, as there's no items:
    startIndex: getCollectionStartIndex(items),
    next: getCollectionNextPageUrl(collection, items, baseUrl, prefersDescriptions),
    prev: getCollectionPrevPageUrl(collection, items, baseUrl, prefersDescriptions),
    items: results,
  }
}

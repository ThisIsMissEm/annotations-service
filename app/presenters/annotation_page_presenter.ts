import { AnnotationCollectionInterface } from '#models/annotation_collection'
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
  collection: AnnotationCollectionInterface,
  baseUrl: string,
  prefersDescriptions: boolean
): AnnotationPage {
  const collectionId = getCollectionId(collection, baseUrl)

  let items: AnnotationPageItems = collection.items
    .all()
    .map((annotation) => getAnnotationId(annotation, baseUrl))

  if (prefersDescriptions) {
    items = collection.items.all().map((annotation) => annotationPresenter(annotation, baseUrl))
  }

  return {
    id: getCollectionPageId(collection, baseUrl, prefersDescriptions),
    type: 'AnnotationPage',
    partOf: {
      id: collectionId,
      total: collection.items.total,
      modified: toXsdDate(collection.modified),
    },
    // If the currently requested page is empty, then return no startIndex, as there's no items:
    startIndex: getCollectionStartIndex(collection),
    next: getCollectionNextPageUrl(collection, collectionId, prefersDescriptions),
    prev: getCollectionPrevPageUrl(collection, collectionId, prefersDescriptions),
    items: items,
  }
}

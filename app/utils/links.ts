import type Annotation from '#models/annotation'
import type { AnnotationCollectionInterface } from '#models/annotation_collection'

import router from '@adonisjs/core/services/router'

const prefersDescriptionsQueryParam = '&prefers=descriptions'

export function getAnnotationId(annotation: Annotation, baseUrl: string) {
  return new URL(
    router
      .builder()
      .params({ collectionId: annotation.collectionId.toString('hex'), id: annotation.id })
      .make('annotation.show'),
    baseUrl
  ).href
}

export function getCollectionId(
  collection: AnnotationCollectionInterface,
  baseUrl: string
): string {
  return new URL(router.builder().params({ id: collection.id }).make('annotations.show'), baseUrl)
    .href
}

export function getCollectionStartIndex(collection: AnnotationCollectionInterface) {
  // If the collection page is empty, don't return a startIndex
  if (collection.items.isEmpty) {
    return undefined
  }

  // Otherwise, return the start index of the items within the current page with a 0-based offset:
  return (collection.items.currentPage - 1) * collection.items.perPage
}

export function getCollectionPageId(
  collection: AnnotationCollectionInterface,
  baseUrl: string,
  prefersDescriptions: boolean
): string {
  return new URL(
    router
      .builder()
      .params({ id: collection.id })
      .qs({
        page: collection.items.currentPage,
        prefers: prefersDescriptions ? 'descriptions' : undefined,
      })
      .make('annotations.show'),
    baseUrl
  ).href
}

export function getCollectionPageUrl(
  collection: AnnotationCollectionInterface,
  page: number,
  collectionId: string,
  prefersDescriptions: boolean
): string | undefined {
  if (collection.items.isEmpty) {
    return undefined
  }
  if (prefersDescriptions) {
    return collection.items.baseUrl(collectionId).getUrl(page) + prefersDescriptionsQueryParam
  }

  return collection.items.baseUrl(collectionId).getUrl(page)
}

// If we don't have more pages, don't render a next property:
export function getCollectionNextPageUrl(
  collection: AnnotationCollectionInterface,
  collectionId: string,
  prefersDescriptions: boolean
): string | undefined {
  const nextPage = collection.items.baseUrl(collectionId).getNextPageUrl()

  if (collection.items.hasMorePages && typeof nextPage === 'string') {
    if (prefersDescriptions) {
      return nextPage + prefersDescriptionsQueryParam
    }
    return nextPage
  }

  return undefined
}

// If we don't have previous pages, don't render a prev property:
export function getCollectionPrevPageUrl(
  collection: AnnotationCollectionInterface,
  collectionId: string,
  prefersDescriptions: boolean
): string | undefined {
  const prevPage = collection.items.baseUrl(collectionId).getPreviousPageUrl()

  if (collection.items.currentPage > 1 && typeof prevPage === 'string') {
    if (prefersDescriptions) {
      return prevPage + prefersDescriptionsQueryParam
    }
    return prevPage
  }

  return undefined
}

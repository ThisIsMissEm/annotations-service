import type Annotation from '#models/annotation'
import type { AnnotationCollectionAttributes } from '#models/annotation_collection'
import AnnotationCollection from '#models/annotation_collection'

import router from '@adonisjs/core/services/router'
import { ModelPaginatorContract } from '@adonisjs/lucid/types/model'

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
  collection: AnnotationCollection & AnnotationCollectionAttributes,
  baseUrl: string
): string {
  return new URL(router.builder().params({ id: collection.id }).make('annotations.show'), baseUrl)
    .href
}

export function getCollectionStartIndex(items: ModelPaginatorContract<Annotation>) {
  // If the collection page is empty, don't return a startIndex
  if (items.isEmpty) {
    return undefined
  }

  // Otherwise, return the start index of the items within the current page with a 0-based offset:
  return (items.currentPage - 1) * items.perPage
}

export function getCollectionPageId(
  collection: AnnotationCollection & AnnotationCollectionAttributes,
  items: ModelPaginatorContract<Annotation>,
  baseUrl: string,
  prefersDescriptions: boolean
): string {
  return new URL(
    router
      .builder()
      .params({ id: collection.id })
      .qs({
        page: items.currentPage,
        prefers: prefersDescriptions ? 'descriptions' : undefined,
      })
      .make('annotations.show'),
    baseUrl
  ).href
}

export function getCollectionPageUrl(
  collection: AnnotationCollection & AnnotationCollectionAttributes,
  items: ModelPaginatorContract<Annotation>,
  baseUrl: string,
  page: number,
  prefersDescriptions: boolean
): string | undefined {
  if (items.isEmpty) {
    return undefined
  }
  if (prefersDescriptions) {
    return (
      items.baseUrl(getCollectionId(collection, baseUrl)).getUrl(page) +
      prefersDescriptionsQueryParam
    )
  }

  return items.baseUrl(getCollectionId(collection, baseUrl)).getUrl(page)
}

// If we don't have more pages, don't render a next property:
export function getCollectionNextPageUrl(
  collection: AnnotationCollection & AnnotationCollectionAttributes,
  items: ModelPaginatorContract<Annotation>,
  baseUrl: string,
  prefersDescriptions: boolean
): string | undefined {
  const nextPage = items.baseUrl(getCollectionId(collection, baseUrl)).getNextPageUrl()

  if (items.hasMorePages && typeof nextPage === 'string') {
    if (prefersDescriptions) {
      return nextPage + prefersDescriptionsQueryParam
    }
    return nextPage
  }

  return undefined
}

// If we don't have previous pages, don't render a prev property:
export function getCollectionPrevPageUrl(
  collection: AnnotationCollection & AnnotationCollectionAttributes,
  items: ModelPaginatorContract<Annotation>,
  baseUrl: string,
  prefersDescriptions: boolean
): string | undefined {
  const prevPage = items.baseUrl(getCollectionId(collection, baseUrl)).getPreviousPageUrl()

  if (items.currentPage > 1 && typeof prevPage === 'string') {
    if (prefersDescriptions) {
      return prevPage + prefersDescriptionsQueryParam
    }
    return prevPage
  }

  return undefined
}

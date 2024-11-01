import AnnotationCollection from '#models/annotation_collection'
import { getContentNegotiation } from '#utils/content_negotiation'
import type { HttpContext } from '@adonisjs/core/http'
import router from '@adonisjs/core/services/router'

export default class AnnotationsController {
  /**
   * Display a list of resource
   */
  async index({}: HttpContext) {}

  /**
   * Display form to create a new record
   */
  async create({}: HttpContext) {}

  /**
   * Handle form submission for the create action
   */
  async store({}: HttpContext) {}

  /**
   * Show individual record
   */
  async show(ctx: HttpContext) {
    const { params, request, response } = ctx
    const queryParams = request.qs()

    const pageRequested = Number.parseInt(queryParams.page ?? '-1', 10)
    if (queryParams.page && (Number.isNaN(pageRequested) || pageRequested <= 0)) {
      response.abort({ error: 'Bad Request, page query parameter malformed' }, 400)
      return
    }

    const collection = await AnnotationCollection.find(params.id, {
      page: pageRequested <= 0 ? 1 : pageRequested,
      limit: 2,
    })

    if (!collection || collection.id !== params.id) {
      response.abort({ error: 'Not Found' }, 404)
      return
    }

    const format = getContentNegotiation(ctx)
    if (format === 'text/html' || format === '*/*') {
      response.abort('Not Implement', 406)
      return
    }

    const baseUrl = new URL(`${request.protocol() ?? 'http'}://${request.host()}/`)

    response.header(
      'content-type',
      'application/ld+json; profile="http://www.w3.org/ns/anno.jsonld"'
    )

    // Only AnnotationCollection has these headers:
    if (pageRequested === 0) {
      response.header('Link', '<http://www.w3.org/ns/ldp#BasicContainer>; rel="type"')
      response.header(
        'Link',
        '<http://www.w3.org/TR/annotation-protocol/>; rel="http://www.w3.org/ns/ldp#constrainedBy"'
      )
    }

    // For the AnnotationCollection, when page is 0, allow adding entries.
    // But for AnnotationPage's, only allow reading:
    response.header('Vary', 'Allow')
    if (pageRequested === 0) {
      response.header('Allow', 'POST, GET, HEAD, OPTIONS')
    } else {
      response.header('Allow', 'GET, HEAD, OPTIONS')
    }

    const collectionId = new URL(
      router.builder().params({ id: collection.id }).make('annotations.show'),
      baseUrl
    ).href

    if (pageRequested === -1) {
      response.json({
        '@context': ['http://www.w3.org/ns/anno.jsonld', 'http://www.w3.org/ns/ldp.jsonld'],
        'id': collectionId,
        'type': ['BasicContainer', 'AnnotationCollection'],
        'total': collection.total,
        'modified': collection.modified,
        'label': `Web Annotations about ${collection.target}`,
        // If we the collection is empty, don't render a first property:
        'first': collection.items.isEmpty
          ? undefined
          : collection.items.baseUrl(collectionId).getUrl(1),
        // If we don't have more pages, don't render a last property:
        'last': collection.items.hasMorePages
          ? collection.items.baseUrl(collectionId).getUrl(collection.items.lastPage)
          : undefined,
      })
    } else {
      response.json({
        '@context': 'http://www.w3.org/ns/anno.jsonld',
        'id': new URL(
          router
            .builder()
            .params({ id: collection.id })
            .qs({ page: collection.items.currentPage })
            .make('annotations.show'),
          baseUrl
        ).href,
        'type': 'AnnotationPage',
        'partOf': {
          id: collectionId,
          total: collection.items.total,
          modified: collection.modified,
        },
        // If the currently requested page is empty, then return no startIndex, as there's no items:
        'startIndex': collection.items.isEmpty
          ? undefined
          : // Otherwise, return the start index of the items within the current page with a 0-based offset:
            (collection.items.currentPage - 1) * collection.items.perPage,
        // If we don't have more pages, don't render a next property:
        'next': collection.items.hasMorePages
          ? collection.items.baseUrl(collectionId).getNextPageUrl()
          : undefined,
        // If we don't have previous pages, don't render a prev property:
        'prev':
          collection.items.currentPage > 1
            ? collection.items.baseUrl(collectionId).getPreviousPageUrl()
            : undefined,
        'items': collection.items.all().map((item) => {
          return new URL(
            router
              .builder()
              .params({ id: item.id, collectionId: collection.id })
              .make('annotation.show'),
            baseUrl
          ).href
        }),
      })
    }
  }
}

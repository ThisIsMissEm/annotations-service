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

    const collection = await AnnotationCollection.find(params.id, {
      page: queryParams.page ?? 1,
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

    if (queryParams.page === undefined) {
      response.header('Link', '<http://www.w3.org/ns/ldp#BasicContainer>; rel="type"')
      response.header(
        'Link',
        '<http://www.w3.org/TR/annotation-protocol/>; rel="http://www.w3.org/ns/ldp#constrainedBy"'
      )
    }

    // POST, GET, OPTIONS, HEAD
    if (queryParams.page === undefined) {
      response.header('Allow', 'POST, GET, HEAD, OPTIONS')
    } else {
      response.header('Allow', 'GET, HEAD, OPTIONS')
    }

    const collectionId = new URL(
      router.builder().params({ id: collection.id }).make('annotations.show'),
      baseUrl
    ).href

    if (queryParams.page === undefined) {
      response.json({
        '@context': ['http://www.w3.org/ns/anno.jsonld', 'http://www.w3.org/ns/ldp.jsonld'],
        'id': collectionId,
        'type': ['BasicContainer', 'AnnotationCollection'],
        'total': collection.total,
        'modified': collection.modified,
        'label': `Web Annotations about ${collection.target}`,
        'first': collection.items.baseUrl(collectionId).getUrl(1),
        'last': collection.items.hasMorePages
          ? collection.items.baseUrl(collectionId).getUrl(collection.items.lastPage)
          : undefined,
      })
    } else {
      response.json({
        '@context': 'http://www.w3.org/ns/anno.jsonld',
        'id': 'http://example.org/annotations/?iris=1&page=0',
        'type': 'AnnotationPage',
        'partOf': {
          id: collectionId,
          total: collection.items.total,
          modified: collection.modified,
        },
        // TODO: figure out what this means
        // 'startIndex': 0,
        'next': collection.items.hasMorePages
          ? collection.items.baseUrl(collectionId).getNextPageUrl()
          : undefined,
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

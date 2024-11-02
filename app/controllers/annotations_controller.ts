import type { HttpContext } from '@adonisjs/core/http'
import AnnotationCollection from '#models/annotation_collection'
import {
  ANNOTATION_CONTEXT,
  ANNOTATION_TYPE,
  CONSTRAINED_BY,
  LDP_BASIC_CONTAINER,
  LDP_CONTEXT,
  PREFER_CONTAINED_DESCRIPTION,
  PREFER_CONTAINED_IRIS,
} from '#utils/constants'
import { getContentNegotiation, getContentType } from '#utils/content_negotiation'
import { toXsdDate } from '#utils/dates'
import { getCollectionId, getCollectionPageUrl } from '#utils/links'
import annotationPagePresenter, { AnnotationPage } from '#presenters/annotation_page_presenter'

type AnnotationCollectionFirstPage = undefined | string | AnnotationPage
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
  async store(ctx: HttpContext) {
    const contentType = getContentType(ctx)
    ctx.logger.info({ contentType })
  }

  /**
   * Show individual record
   */
  async show(ctx: HttpContext) {
    const { params, request, response, logger } = ctx
    const queryParams = request.qs()

    // TODO: Set completeUrl or `PUBLIC_URL` based on middleware:
    logger.info({ url: request.completeUrl() })

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

    const baseUrl = new URL(`${request.protocol() ?? 'http'}://${request.host()}/`).href
    const collectionId = getCollectionId(collection, baseUrl)

    response.header('content-type', ANNOTATION_TYPE)

    // Only AnnotationCollection has these headers:
    if (pageRequested === 0) {
      response.header('Link', LDP_BASIC_CONTAINER)
      response.header('Link', CONSTRAINED_BY)
    }

    // For the AnnotationCollection, when page is 0, allow adding entries.
    // But for AnnotationPage's, only allow reading:
    response.header('Vary', 'Allow')
    if (pageRequested === 0) {
      response.header('Allow', 'POST, GET, HEAD, OPTIONS')
    } else {
      response.header('Allow', 'GET, HEAD, OPTIONS')
    }

    const prefersRepresentation = request.prefersRepresentation()

    if (pageRequested === -1) {
      let firstPage: AnnotationCollectionFirstPage =
        prefersRepresentation.iris || prefersRepresentation.descriptions
          ? annotationPagePresenter(collection, baseUrl, prefersRepresentation.descriptions)
          : getCollectionPageUrl(collection, 1, collectionId, prefersRepresentation.descriptions)

      response.json({
        '@context': [ANNOTATION_CONTEXT, LDP_CONTEXT],
        'type': ['BasicContainer', 'AnnotationCollection'],
        'id': collectionId,
        'label': `Web Annotations about ${collection.target}`,
        'total': collection.total,
        'modified': toXsdDate(collection.modified),
        'first': firstPage,
        'last': getCollectionPageUrl(
          collection,
          collection.items.lastPage,
          collectionId,
          prefersRepresentation.descriptions
        ),
      })
    } else {
      response.json({
        '@context': ANNOTATION_CONTEXT,
        ...annotationPagePresenter(collection, baseUrl, queryParams.prefers === 'descriptions'),
      })
    }
  }
}

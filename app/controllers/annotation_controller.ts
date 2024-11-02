import type { HttpContext } from '@adonisjs/core/http'

import Annotation from '#models/annotation'
import { getContentNegotiation, getContentType } from '#utils/content_negotiation'
import { ANNOTATION_CONTEXT, ANNOTATION_TYPE } from '#utils/constants'
import annotationPresenter from '#presenters/annotation_presenter'

export default class AnnotationController {
  /**
   * Show individual record
   */
  async show(ctx: HttpContext) {
    const { params, request, response } = ctx

    const annotation = await Annotation.findBy({
      id: params.id,
    })

    if (!annotation) {
      response.abort({ error: 'Not Found' }, 404)
      return
    }

    if (annotation?.collectionId.toString('hex') !== params.collectionId) {
      response.abort({ error: 'Not Found' }, 404)
      return
    }

    const format = getContentNegotiation(ctx)
    if (format === 'text/html' || format === '*/*') {
      response.abort('Not Implement', 406)
      return
    }

    const baseUrl = new URL(`${request.protocol() ?? 'http'}://${request.host()}/`).href

    response.header('Content-Type', ANNOTATION_TYPE)

    response.header('Link', '<http://www.w3.org/ns/ldp#Resource>; rel="type"')
    response.header('Vary', 'Allow')
    response.header('Allow', 'GET')
    response.header('Cache-Control', 'public')

    response.json({
      '@context': ANNOTATION_CONTEXT,
      ...annotationPresenter(annotation, baseUrl),
    })
  }

  /**
   * Edit individual record
   */
  async edit({}: HttpContext) {}

  /**
   * Handle form submission for the edit action
   */
  async update(ctx: HttpContext) {
    const contentType = getContentType(ctx)
    ctx.logger.info({ contentType, body: ctx.request.body(), json: ctx.request.all() })
  }

  /**
   * Delete record
   */
  async destroy({}: HttpContext) {}
}

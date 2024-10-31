// import AnnotationCollection from '#models/annotation_collection'
import type { HttpContext } from '@adonisjs/core/http'
import router from '@adonisjs/core/services/router'

import Annotation from '#models/annotation'
import { getContentNegotiation } from '#utils/content_negotiation'

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

    const baseUrl = new URL(`${request.protocol() ?? 'http'}://${request.host()}/`)

    response.header(
      'Content-Type',
      'application/ld+json; profile="http://www.w3.org/ns/anno.jsonld"'
    )
    response.header('Link', '<http://www.w3.org/ns/ldp#Resource>; rel="type"')
    response.header('Allow', 'GET')
    response.header('Cache-Control', 'public')

    response.json({
      '@context': 'http://www.w3.org/ns/anno.jsonld',
      'type': 'Annotation',
      'id': new URL(
        router
          .builder()
          .params({ collectionId: annotation.collectionId, id: annotation.id })
          .make('annotation.show'),
        baseUrl
      ),
      'created': annotation.createdAt.toFormat("yyyy-MM-dd'T'HH:mm:ss'Z'"),
      'body': {
        type: 'TextualBody',
        value: annotation.content,
      },
      'target': annotation?.targetIri,
    })
  }

  /**
   * Edit individual record
   */
  async edit({}: HttpContext) {}

  /**
   * Handle form submission for the edit action
   */
  async update({}: HttpContext) {}

  /**
   * Delete record
   */
  async destroy({}: HttpContext) {}
}

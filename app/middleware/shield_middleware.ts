import BaseMiddleware from '@adonisjs/shield/shield_middleware'
import type { HttpContext } from '@adonisjs/http-server'
import type { NextFn } from '@adonisjs/core/types/http'

import { getContentNegotiation } from '#utils/content_negotiation'

export default class ShieldMiddleware extends BaseMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const format = getContentNegotiation(ctx)
    if (format !== '*/*' && format !== 'text/html') {
      return next()
    }

    return super.handle(ctx, next)
  }
}

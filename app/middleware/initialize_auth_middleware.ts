import BaseMiddleware from '@adonisjs/auth/initialize_auth_middleware'
import type { HttpContext } from '@adonisjs/http-server'
import type { NextFn } from '@adonisjs/core/types/http'

import { getContentNegotiation } from '#utils/content_negotiation'

export default class InitializeAuthMiddleware extends BaseMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const format = getContentNegotiation(ctx)
    if (format !== '*/*' && format !== 'text/html') {
      return next()
    }

    return super.handle(ctx, next)
  }
}

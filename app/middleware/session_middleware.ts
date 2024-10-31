import BaseMiddleware from '@adonisjs/session/session_middleware'
import type { HttpContext } from '@adonisjs/http-server'
import type { NextFn } from '@adonisjs/core/types/http'
import type { SessionStoreFactory } from '@adonisjs/session/types'

import { getContentNegotiation } from '#utils/content_negotiation'

export default class SessionMiddleware<
  KnownStores extends Record<string, SessionStoreFactory>,
> extends BaseMiddleware<KnownStores> {
  async handle(ctx: HttpContext, next: NextFn) {
    const format = getContentNegotiation(ctx)
    if (format !== '*/*' && format !== 'text/html') {
      return next()
    }

    return super.handle(ctx, next)
  }
}

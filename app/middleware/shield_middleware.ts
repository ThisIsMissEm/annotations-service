import type { NextFn } from '@adonisjs/core/types/http'
import type { HttpContext } from '@adonisjs/http-server'
import BaseMiddleware from '@adonisjs/shield/shield_middleware'

import shieldConfig from '#config/shield'
import encryption from '@adonisjs/core/services/encryption'
import { getContentNegotiation } from '#utils/content_negotiation'

export default class ShieldMiddleware extends BaseMiddleware {
  constructor() {
    super(shieldConfig, encryption)
  }

  async handle(ctx: HttpContext, next: NextFn) {
    const format = getContentNegotiation(ctx)
    if (format !== '*/*' && format !== 'text/html') {
      return next()
    }

    return super.handle(ctx, next)
  }
}

import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import type { Authenticators } from '@adonisjs/auth/types'
import { errors } from '@adonisjs/auth'

export const returnToKey = 'next'

/**
 * Auth middleware is used authenticate HTTP requests and deny
 * access to unauthenticated users.
 */
export default class RequireAuthMiddleware {
  /**
   * The URL to redirect to, when authentication fails
   */
  redirectTo = '/login'

  async handle(
    ctx: HttpContext,
    next: NextFn,
    options: {
      guards?: (keyof Authenticators)[]
    } = {}
  ) {
    try {
      await ctx.auth.authenticateUsing(options.guards, {
        loginRoute: this.redirectTo,
      })
    } catch (err) {
      if (err instanceof errors.E_UNAUTHORIZED_ACCESS) {
        ctx.session.put(returnToKey, ctx.request.url(true))
      }

      throw err
    }
    return next()
  }
}

import type { HttpContext } from '@adonisjs/core/http'

export function getContentNegotiation(ctx: HttpContext): string {
  const format = ctx.request.accepts([
    'application/ld+json; profile="http://www.w3.org/ns/anno.jsonld"',
    'application/ld+json',
    'application/json',
    'text/html',
    '*/*',
  ])

  return format ?? '*/*'
}

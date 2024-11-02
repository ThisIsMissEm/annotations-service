import type { HttpContext } from '@adonisjs/core/http'
import { ANNOTATION_TYPE } from './constants.js'

export function getContentNegotiation(ctx: HttpContext): string {
  const format = ctx.request.accepts([
    ANNOTATION_TYPE,
    'application/ld+json',
    'application/json',
    'text/html',
    '*/*',
  ])

  return format ?? '*/*'
}

export function getContentType(ctx: HttpContext): string {
  const format = ctx.request.is([
    ANNOTATION_TYPE,
    'application/ld+json',
    'application/json',
    'multipart/form-data',
  ])

  return format ?? 'multipart/form-data'
}

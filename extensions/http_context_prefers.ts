import { Request } from '@adonisjs/core/http'
import parsePreferHeader from 'parse-prefer-header'

declare module '@adonisjs/core/http' {
  interface Request {
    prefersRepresentation(): string[] | false
  }
}

Request.macro('prefersRepresentation', function (this: Request) {
  if (!this.header('prefer')) return []

  const prefers = parsePreferHeader(this.header('prefer'))

  if (
    !prefers.return ||
    prefers.return !== 'representation' ||
    typeof prefers.returnInclude !== 'string'
  )
    return false

  return prefers.returnInclude.split(/\s+/)
})

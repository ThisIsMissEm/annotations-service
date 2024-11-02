import {
  PREFER_CONTAINED_DESCRIPTION,
  PREFER_CONTAINED_IRIS,
  PREFER_MINIMAL_CONTAINER,
} from '#utils/constants'
import { Request } from '@adonisjs/core/http'
import parsePreferHeader from 'parse-prefer-header'

declare module '@adonisjs/core/http' {
  interface Request {
    prefersRepresentation(): {
      iris: boolean
      descriptions: boolean
      minimal: boolean
    }
  }
}

Request.macro('prefersRepresentation', function (this: Request) {
  if (!this.header('prefer')) {
    return {
      minimal: true,
      iris: false,
      descriptions: false,
    }
  }

  const prefers = parsePreferHeader(this.header('prefer'))

  if (
    !prefers.return ||
    prefers.return !== 'representation' ||
    typeof prefers.returnInclude !== 'string'
  ) {
    return {
      minimal: true,
      iris: false,
      descriptions: false,
    }
  }

  const returnInclude = prefers.returnInclude.split(/\s+/)

  const prefersMinimal = returnInclude.includes(PREFER_MINIMAL_CONTAINER)
  const prefersIris = returnInclude.includes(PREFER_CONTAINED_IRIS)
  const prefersDescriptions = returnInclude.includes(PREFER_CONTAINED_DESCRIPTION)

  return {
    minimal: prefersMinimal,
    iris: prefersIris,
    descriptions: prefersDescriptions,
  }
})

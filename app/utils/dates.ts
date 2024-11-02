import { DateTime } from 'luxon'

export function toXsdDate(date: DateTime): string {
  return date.toFormat("yyyy-MM-dd'T'HH:mm:ss'Z'")
}

import Annotation from '#models/annotation'
import { toXsdDate } from '#utils/dates'
import { getAnnotationId } from '#utils/links'

export interface AnnotationTextualBody {
  type: 'TextualBody'
  value: string
}

export interface AnnotationRepresentation {
  type: 'Annotation'
  id: string
  created: string
  modified: string
  body: AnnotationTextualBody
  target: string
}

export default function annotationPresenter(
  annotation: Annotation,
  baseUrl: string
): AnnotationRepresentation {
  return {
    type: 'Annotation',
    id: getAnnotationId(annotation, baseUrl),
    created: toXsdDate(annotation.createdAt),
    modified: toXsdDate(annotation.updatedAt),
    body: {
      type: 'TextualBody',
      value: annotation.content,
    },
    target: annotation.targetIri,
  }
}

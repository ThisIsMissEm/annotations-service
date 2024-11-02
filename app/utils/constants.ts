// Constants for various places
export const ANNOTATION_CONTEXT = 'http://www.w3.org/ns/anno.jsonld'
export const ANNOTATION_TYPE = 'application/ld+json; profile="http://www.w3.org/ns/anno.jsonld"'

export const LDP_CONTEXT = 'http://www.w3.org/ns/ldp.jsonld'
export const LDP_BASIC_CONTAINER = '<http://www.w3.org/ns/ldp#BasicContainer>; rel="type"'
export const CONSTRAINED_BY =
  '<http://www.w3.org/TR/annotation-protocol/>; rel="http://www.w3.org/ns/ldp#constrainedBy"'

export const PREFER_MINIMAL_CONTAINER = 'http://www.w3.org/ns/ldp#PreferMinimalContainer'
export const PREFER_CONTAINED_DESCRIPTION = 'http://www.w3.org/ns/ldp#PreferContainedDescriptions'
export const PREFER_CONTAINED_IRIS = 'http://www.w3.org/ns/ldp#PreferContainedIri'

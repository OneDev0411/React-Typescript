/**
 * returns normalized data
 * @param data - the response data
 * @param references - the reference list
 */
function deepReplace(data, references) {
  if (Array.isArray(data)) {
    return data.map(item => deepReplace(item, references))
  }

  if (hasReferenceProperty(data)) {
    data = replace(data, references)
  }

  Object.entries(data).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      data[key] = value.map(item => deepReplace(item, references))
    }

    if (hasReferenceProperty(value)) {
      data[key] = replace(value, references)
    }
  })

  return data
}

/**
 * replaces the object with reference data
 * @param object - the object
 * @param references - list of references
 */
function replace(object, references) {
  const { object_type, id } = object

  return references[object_type][id]
}

/**
 * checks whether object has reference type or not
 * @param object - the object
 */
function hasReferenceProperty(object: any): boolean {
  return object && typeof object === 'object' && object.type === 'reference'
}

export function compressResponse(response: ApiResponse<any>): void {
  const abc = deepReplace(response.body.data, response.body.references)

  console.log(abc[0].roles[0].users)
}

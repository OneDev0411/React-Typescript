/**
 * returns normalized data
 * @param data - the response data
 * @param references - the reference list
 */
function deepReplace(data: object, references: StringMap<StringMap<object>>) {
  if (Array.isArray(data)) {
    return data.map(item => deepReplace(item, references))
  }

  if (hasReferenceProperty(data)) {
    data = references[data.object_type][data.id]
  }

  Object.entries(data).forEach(([key, value]: any) => {
    if (Array.isArray(value)) {
      data[key] = value.map(item => deepReplace(item, references))
    }

    if (hasReferenceProperty(value)) {
      data[key] = deepReplace(value, references)
    }
  })

  return data
}

/**
 * checks whether object has reference type or not
 * @param object - the object
 */
function hasReferenceProperty(object: any): boolean {
  return object && typeof object === 'object' && object.type === 'reference'
}

export function useReferencedFormat(response: ApiResponse<any>): any {
  if (!response.body || !response.body.data) {
    return response
  }

  const normalized = deepReplace(response.body.data, response.body.references)

  response.body.data = normalized

  return normalized
}

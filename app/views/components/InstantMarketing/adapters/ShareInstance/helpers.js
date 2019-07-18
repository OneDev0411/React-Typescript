export function getMedium(instance) {
  if (instance) {
    if (typeof instance.template === 'string') {
      return instance.medium
    }

    return instance.template.medium
  }

  return null
}

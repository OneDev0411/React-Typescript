export function getMedium(instance) {
  if (!instance) {
    return null
  }

  if (typeof instance.template === 'string') {
    return instance.medium
  }

  return instance.template.medium
}
